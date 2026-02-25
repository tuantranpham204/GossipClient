import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationSidebar from '../components/NavigationSidebar';
import { useUserProfile, updateProfileImage, useProfileImage, updateUserProfile, requestFriend, requestFollow } from '../services/user.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, BadgeCheck, Mail, Cake, Heart, Camera, Settings, CopyPlus, UserPlus, Lock, UserCheck, CopyCheck, MessageSquare, Clock, Ban } from 'lucide-react';
import ImageUploadModal from '../components/modals/ImageUploadModal';
import UpdateProfileModal from '../components/modals/UpdateProfileModal';
import defaultAvatar from '../assets/defaultAvatar.jpg';
import backgroundGif from '../assets/background.gif';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { requestPrivateRoom } from '../services/room.service';
// @ts-ignore
import { USER_RELATION_STATUS, ROOM_TYPE } from '../utils/enum';

const ProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { data: userData, isLoading, isError } = useUserProfile(userId);
    const { data: avatarData } = useProfileImage('avatar', userId);
    const { data: bgData } = useProfileImage('bg_img', userId);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const user = userData?.data;
    const isHost = user?.capacity === 'host';

    const [updatingImage, setUpdatingImage] = React.useState<'avatar' | 'bg_img' | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isUpdateProfileOpen, setIsUpdateProfileOpen] = React.useState(false);
    const [roomType, setRoomType] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (user && 'room_type' in user) {
            setRoomType((user as any).room_type);
        }
    }, [user]);
    
    // Import the new modal (assumed auto-import or manual if needed)
    // I need to add the import at the top first, but I can't do two ranges in one replace_file_content.
    // I will replace the state and handlers first.

    const updateImageMutation = useMutation({
        mutationFn: ({ type, file }: { type: 'avatar' | 'bg_img', file: File }) => 
            updateProfileImage(type, file),
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ['user', userId] });
             setIsModalOpen(false);
             setUpdatingImage(null);
             window.location.reload();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data: any) => updateUserProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
            setIsUpdateProfileOpen(false);
            window.location.reload();
        }
    });

    const handleUpload = (file: File) => {
        if (updatingImage) {
            updateImageMutation.mutate({ type: updatingImage, file });
        }
    };

    const openModal = (type: 'avatar' | 'bg_img') => {
        setUpdatingImage(type);
        setIsModalOpen(true);
    };

    const handleFriendRequest = async () => {
        if (!user?.user_id) return;
        try {
            await requestFriend(user.user_id);
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
        } catch (error) {
            // Error is handled by apiClient toast
        }
    };

    const handleFollowRequest = async () => {
        if (!user?.user_id) return;
        try {
            await requestFollow(user.user_id);
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
        } catch (error) {
            // Error is handled by apiClient toast
        }
    };

    const handleMessageClick = async () => {
        if (!user?.user_id) return;
        
        if (roomType === ROOM_TYPE.PRIVATE_STRANGERS || roomType === ROOM_TYPE.PRIVATE_FRIENDS) {
            navigate(`/messages?user=${user.user_id}`);
            return;
        }

        try {
            const res = await requestPrivateRoom(user.user_id);
            if (res?.data?.room_type) {
                setRoomType(res.data.room_type);
                if (res.data.room_type === ROOM_TYPE.PRIVATE_STRANGERS || res.data.room_type === ROOM_TYPE.PRIVATE_FRIENDS) {
                    setTimeout(() => navigate(`/messages?user=${user.user_id}`), 500);
                }
            }
        } catch (error) {
            // Error is handled by apiClient toast
        }
    };

    if (isLoading) {
        return (
            <div className="bg-black h-screen w-screen flex items-center justify-center text-white">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="bg-black h-screen w-screen flex items-center justify-center text-white">
                <p>User not found or failed to load.</p>
            </div>
        );
    }

    // Helper to format Date
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not Provided';
        try {
            return format(new Date(dateString), 'MMMM d, yyyy');
        } catch (e) {
            return dateString;
        }
    };

    const renderPrivacyField = (
        isPublic: boolean | undefined, 
        value: string | null | undefined
    ) => {
        if (isHost || isPublic) {
            return <p className="text-lg text-white font-medium">{value || "Not Provided"}</p>;
        }
        return (
            <div className="flex items-center gap-2 text-gray-500">
                <Lock className="w-4 h-4" />
                <span className="text-lg font-medium">Private</span>
            </div>
        );
    };

    return (
        <div className="bg-black h-screen w-screen overflow-hidden selection:bg-indigo-500 selection:text-white text-white relative">
            <ImageUploadModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpload={handleUpload}
                type={updatingImage === 'avatar' ? 'avatar' : 'bg_img'}
                isUploading={updateImageMutation.isPending}
            />

            <UpdateProfileModal 
                isOpen={isUpdateProfileOpen}
                onClose={() => setIsUpdateProfileOpen(false)}
                onUpdate={(data) => updateProfileMutation.mutate(data)}
                isUpdating={updateProfileMutation.isPending}
                initialData={user}
            />

            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                style={{ backgroundImage: `url(${backgroundGif})` }}
            ></div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

            <main className="w-full h-full glass-panel flex relative z-10 border-none">
                
                <NavigationSidebar />

                {/* Profile Content */}
                <section className="flex-1 overflow-y-auto custom-scrollbar relative">
                    
                    {/* Cover Image */}
                    <div className="h-64 md:h-80 w-full relative overflow-hidden group">
                        <img 
                             src={bgData?.data?.bg_img_url || user.background_image_data?.url || backgroundGif} 
                             className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" 
                             alt="Cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        {isHost && (
                            <button 
                                onClick={() => openModal('bg_img')}
                                title="Change Cover" 
                                className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Profile Info Container */}
                    <div className="max-w-4xl mx-auto px-6 pb-20 relative">
                        
                        {/* Avatar & Header Info */}
                        <div className="relative -mt-20 mb-6 flex items-end gap-6">
                            
                            {/* Avatar */}
                            <div className="relative group shrink-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 bg-black ring-1 ring-white/10 relative overflow-hidden">
                                    <img 
                                        src={avatarData?.data?.avatar_url || user.avatar_data?.url || defaultAvatar} 
                                        className="w-full h-full rounded-full object-cover border-4 border-black group-hover:scale-105 transition-transform duration-500" 
                                        alt={user.username} 
                                    />
                                </div>
                                {isHost && (
                                    <button
                                        onClick={() => openModal('avatar')}
                                        className="absolute bottom-1 right-1 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all shadow-lg border-2 border-black z-20 hover:scale-110"
                                        title="Change Avatar"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                        {/* Basic Info & Stats */}
                        <div className="flex-1 flex flex-col md:flex-row items-end justify-between mb-4 gap-4">
                            <div className="flex flex-col gap-1 w-full md:w-auto">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                                        @{user.username} 
                                        <BadgeCheck className="w-6 h-6 text-blue-400 fill-current" />
                                    </h1>
                                    
                                    {/* Stats - moved here */}
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                            <span className="text-white font-bold">{user.friends_amount}</span>
                                            <span className="text-sm text-gray-400">friends</span>
                                        </div>
                                        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                            <span className="text-white font-bold">{user.followers_amount}</span>
                                            <span className="text-sm text-gray-400">followers</span>
                                        </div>
                                        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                            <span className="text-white font-bold">{user.following_amount}</span>
                                            <span className="text-sm text-gray-400">following</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-400 font-medium">{user.name} {user.surname}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 shrink-0">
                                {isHost ? (
                                    <button 
                                        onClick={() => setIsUpdateProfileOpen(true)}
                                        title="Settings" 
                                        className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/5"
                                    >
                                        <Settings className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <>
                                        {/* Friend Status Button */}
                                        {user.friend_status === USER_RELATION_STATUS.PENDING ? (
                                            <button title="Friend Request Sent" className="p-2.5 bg-yellow-600/20 text-yellow-500 rounded-xl transition-colors relative group">
                                                <UserCheck className="w-5 h-5" />
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></div>
                                            </button>
                                        ) : user.friend_status === USER_RELATION_STATUS.ACCEPTED ? (
                                            <button title="Friends" className="p-2.5 bg-green-600/20 text-green-500 rounded-xl transition-colors relative group">
                                                <UserCheck className="w-5 h-5" />
                                            </button>
                                        ) : (
                                            <button 
                                                title="Add Friend" 
                                                onClick={handleFriendRequest}
                                                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                                            >
                                                <UserPlus className="w-5 h-5" />
                                            </button>
                                        )}

                                        {/* Follow Status Button */}
                                        {user.follow_status !== USER_RELATION_STATUS.NOT_FOLLOW && user.follow_status ? (
                                            <button title="Following" className="p-2.5 bg-green-600/20 text-green-500 rounded-xl transition-colors">
                                                <CopyCheck className="w-5 h-5" />
                                            </button>
                                        ) : (
                                            <button 
                                                title="Follow" 
                                                onClick={handleFollowRequest}
                                                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/5"
                                            >
                                                <CopyPlus className="w-5 h-5" />
                                            </button>
                                        )}

                                        {/* Message Button */}
                                        {(() => {
                                            if (roomType === ROOM_TYPE.PRIVATE_STRANGERS_PENDING) {
                                                return (
                                                    <button title="Request Pending" onClick={handleMessageClick} className="p-2.5 bg-yellow-600/20 text-yellow-500 rounded-xl transition-all hover:scale-110 group relative">
                                                        <Clock className="w-5 h-5" />
                                                    </button>
                                                );
                                            }
                                            if (roomType === ROOM_TYPE.PRIVATE_STRANGERS_DECLINED) {
                                                return (
                                                    <button title="Request Declined" onClick={handleMessageClick} className="p-2.5 bg-red-600/20 text-red-500 rounded-xl transition-all hover:scale-110 group relative">
                                                        <Ban className="w-5 h-5" />
                                                    </button>
                                                );
                                            }
                                            if (roomType === ROOM_TYPE.PRIVATE_STRANGERS || roomType === ROOM_TYPE.PRIVATE_FRIENDS) {
                                                return (
                                                    <button title="Message" onClick={handleMessageClick} className="p-2.5 bg-green-600/20 text-green-500 rounded-xl transition-all hover:scale-110 group relative">
                                                        <MessageSquare className="w-5 h-5" />
                                                    </button>
                                                );
                                            }
                                            return (
                                                <button title="Message" onClick={handleMessageClick} className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/5 group relative">
                                                    <MessageSquare className="w-5 h-5" />
                                                </button>
                                            );
                                        })()}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                        {/* Bio (Brief) */}
                        <div className="mb-10 text-center md:text-left">
                            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                                {user.bio || "No bio yet."}
                            </p>
                        </div>


                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Email */}
                            <div className="p-6 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                                        {renderPrivacyField(user.is_email_public, user.email)}
                                    </div>
                                </div>
                            </div>

                            {/* Date of Birth */}
                             {/* Note: API structure has 'dob' but privacy field is not strictly defined in example guest response except implied logic.
                                 The guest response shows "dob": null. Host response shows "dob": "2026-02-03".
                                 We will assume null means private or not set.
                             */}
                            <div className="p-6 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
                                        <Cake className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                                         {renderPrivacyField(user.dob !== null || isHost, user.dob ? formatDate(user.dob) : null)}
                                    </div>
                                </div>
                            </div>

                            {/* Relationship Status */}
                            <div className="p-6 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                                        <Heart className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Relationship Status</h3>
                                        {/* Mapping enums would be ideal here if valid values provided. Assuming raw or simple text for now */}
                                        {renderPrivacyField(user.is_rel_status_public, 
                                            user.relationship_status === 0 ? 'Single' : String(user.relationship_status)
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
