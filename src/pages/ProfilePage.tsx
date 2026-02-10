import React from 'react';
import { useParams } from 'react-router-dom';
import NavigationSidebar from '../components/NavigationSidebar';
import { useUserProfile } from '../services/user.service';
import { Loader2, BadgeCheck, Mail, Cake, Heart, Camera, Settings, CopyPlus, UserPlus, Lock } from 'lucide-react';
import defaultAvatar from '../assets/defaultAvatar.jpg';
import backgroundGif from '../assets/background.gif';
import { format } from 'date-fns';

const ProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { data: userData, isLoading, isError } = useUserProfile(userId);

    const user = userData?.data;
    const isHost = user?.capacity === 'host';

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
                        <img src={backgroundGif} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" alt="Cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        {isHost && (
                            <button title="Change Cover" className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100">
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
                                        src={user.avatar_data?.url || defaultAvatar} 
                                        className="w-full h-full rounded-full object-cover border-4 border-black group-hover:scale-105 transition-transform duration-500" 
                                        alt={user.username} 
                                    />
                                    {isHost && (
                                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Basic Info & Stats */}
                            <div className="flex-1 flex flex-col md:flex-row items-end md:items-end justify-between mb-4 gap-4">
                                <div className="flex flex-col md:flex-row md:items-end gap-6 w-full md:w-auto">
                                    <div>
                                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                                            @{user.username} 
                                            <BadgeCheck className="w-6 h-6 text-blue-400 fill-current" />
                                        </h1>
                                        <p className="text-gray-400 font-medium">{user.name} {user.surname}</p>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6 py-1">
                                        <div className="text-center md:text-left">
                                            <span className="text-white font-bold mr-1.5">{user.friends_amount}</span>
                                            <span className="text-md text-gray-400 tracking-wider">friends</span>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <span className="text-white font-bold mr-1.5">{user.followers_amount}</span>
                                            <span className="text-md text-gray-400 tracking-wider">followers</span>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <span className="text-white font-bold mr-1.5">{user.following_amount}</span>
                                            <span className="text-md text-gray-400 tracking-wider">following</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 shrink-0">
                                    {isHost ? (
                                        <button title="Settings" className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/5">
                                            <Settings className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <>
                                            <button title="Add Friend" className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                                                <UserPlus className="w-5 h-5" />
                                            </button>
                                            <button title="Follow" className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/5">
                                                <CopyPlus className="w-5 h-5" />
                                            </button>
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
                                            user.relationship_status === 0 ? 'Single' : user.relationship_status
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
