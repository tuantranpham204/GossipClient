import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import NavigationSidebar from '../components/NavigationSidebar';
import { Search, MoreHorizontal, Loader2 } from 'lucide-react';
import { useAcceptedRelations, usePendingRelations, acceptRelation, declineRelation } from '../services/user.service';
// @ts-ignore
import { USER_RELATION_TYPE } from '../utils/enum';
import defaultAvatar from '../assets/defaultAvatar.jpg';
import backgroundGif from '../assets/background.gif';

const UserRelationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isFriendsView = location.pathname.includes('/friends');
    
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Default per_page as per response
    const [processingRequests, setProcessingRequests] = useState<Record<string, 'accept' | 'decline'>>({});

    const { data: acceptedData, isLoading, isError } = useAcceptedRelations({
        relation_type: isFriendsView ? USER_RELATION_TYPE.FRIEND : USER_RELATION_TYPE.FOLLOW,
        page: currentPage,
        per_page: itemsPerPage
    });

    const { data: pendingData, isLoading: isPendingLoading } = usePendingRelations({
        relation_type: isFriendsView ? USER_RELATION_TYPE.FRIEND : USER_RELATION_TYPE.FOLLOW,
        page: 1,
        per_page: itemsPerPage
    });

    const title = isFriendsView ? 'Friends' : 'Follows';
    const searchPlaceholder = isFriendsView ? 'Search friends...' : 'Search following...';
    
    const pendingRequests = pendingData?.data || [];
    
    // Replace mock with active list from API
    const activeList = acceptedData?.data || [];
    const meta = acceptedData?.meta;
    const totalPages = meta?.total_pages || 0;

    const requestTitle = isFriendsView ? 'Friend Requests' : 'Follow Requests';
    const listTitle = isFriendsView ? 'All Friends' : 'Following';

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleRequestAction = async (action: 'accept' | 'decline', requesterId: string | number) => {
        try {
            setProcessingRequests(prev => ({ ...prev, [requesterId]: action }));
            const relationType = isFriendsView ? USER_RELATION_TYPE.FRIEND : USER_RELATION_TYPE.FOLLOW;
            
            if (action === 'accept') {
                await acceptRelation(relationType, requesterId);
            } else {
                await declineRelation(relationType, requesterId);
            }
            
            // Invalidate queries to trigger a refetch and update UI
            queryClient.invalidateQueries({ queryKey: ["pending-relations"] });
            queryClient.invalidateQueries({ queryKey: ["accepted-relations"] });
            
        } catch (error) {
            console.error(`Failed to ${action} request:`, error);
        } finally {
            setProcessingRequests(prev => {
                const newState = { ...prev };
                delete newState[requesterId];
                return newState;
            });
        }
    };

    return (
        <div className="bg-black h-screen w-screen overflow-hidden selection:bg-brand-500 selection:text-white text-white relative">
            {/* Background Image */}
             <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                style={{ backgroundImage: `url(${backgroundGif})` }}
            ></div>
    
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
    
            <main className="w-full h-full glass-panel flex relative z-10 border-none">
                
                <NavigationSidebar />
    
                {/* Main Content */}
                <section className="flex-1 flex flex-col relative overflow-hidden">
                    
                    {/* Header */}
                    <div className="p-6 md:p-10 pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-3xl font-bold">{title}</h1>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder={searchPlaceholder} 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-brand-500/50 transition-all shadow-lg text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
    
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-10">
                        
                        {/* Section: Requests */}
                        {pendingRequests.length > 0 && (
                            <div className="space-y-6 animate-fade-in-up">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold text-white">{requestTitle}</h2>
                                    <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg border border-red-500/20">
                                        {pendingRequests.length} Pending
                                    </span>
                                </div>
        
                                {isPendingLoading ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {pendingRequests.map((req: any) => (
                                            <div key={req.requester_id} className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:bg-white/10 transition-all group">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <img src={req.requester_avatar_url || defaultAvatar} className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-500/50" alt={req.requester_name} />
                                                    <div>
                                                        <h3 className="text-base font-bold text-white">
                                                            {req.requester_name && req.requester_surname ? `${req.requester_name} ${req.requester_surname}` : req.requester_name || req.requester_username}
                                                        </h3>
                                                        <p className="text-xs text-gray-400">
                                                            @{req.requester_username}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 rounded-lg text-sm font-medium transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                        onClick={() => handleRequestAction('accept', req.requester_id)}
                                                        disabled={!!processingRequests[req.requester_id]}
                                                    >
                                                        {processingRequests[req.requester_id] === 'accept' && <Loader2 className="w-4 h-4 animate-spin" />}
                                                        Confirm
                                                    </button>
                                                    <button 
                                                        className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                        onClick={() => handleRequestAction('decline', req.requester_id)}
                                                        disabled={!!processingRequests[req.requester_id]}
                                                    >
                                                        {processingRequests[req.requester_id] === 'decline' && <Loader2 className="w-4 h-4 animate-spin" />}
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
    
                        {/* Section: Active List (Friends / Following) */}
                        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-semibold text-white">{listTitle}</h2>
    
                            {/* Active List Grid */}
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                                </div>
                            ) : isError ? (
                                <div className="flex items-center justify-center py-12 text-red-500">
                                    Failed to load {listTitle.toLowerCase()}.
                                </div>
                            ) : activeList.length === 0 ? (
                                <div className="flex items-center justify-center py-12 text-gray-400">
                                    No {listTitle.toLowerCase()} found.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {activeList.map((user: any) => (
                                        <div key={user.user_id} className="bg-white/3 rounded-2xl p-6 border border-white/5 hover:bg-white/[0.07] transition-all flex flex-col items-center group relative cursor-pointer" onClick={() => navigate(`/profile/${user.user_id}`)}>
                                            <button className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10" title="More Options" onClick={(e) => { e.stopPropagation(); }}>
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                            <div className="relative mb-4">
                                                <img src={user.avatar_url || defaultAvatar} className="w-20 h-20 rounded-full object-cover ring-2 ring-transparent group-hover:ring-brand-500/50 transition-all" alt={user.name} />
                                                <div className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-black ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                            </div>
                                            <h3 className="text-lg font-bold text-white text-center">
                                                {user.name && user.surname ? `${user.name} ${user.surname}` : user.name || user.username}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-6 font-medium">@{user.username}</p>
                                            <button 
                                                className="w-full py-2 bg-white/5 hover:bg-brand-600 hover:text-white rounded-lg text-sm font-medium transition-colors text-brand-300 z-10"
                                                onClick={(e) => { e.stopPropagation(); navigate(`/messages?user=${user.user_id}`); }}
                                            >
                                                Message
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
    
                            {/* Pagination Logic */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-12 gap-2">
                                    <button 
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1 ? 'bg-white/5 opacity-50 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10'}`} 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button 
                                            key={page}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-brand-600 hover:bg-brand-700' : 'bg-white/5 hover:bg-white/10'}`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button 
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages ? 'bg-white/5 opacity-50 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10'}`}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
    
                        <div className="h-10"></div> {/* Spacer */}
    
                    </div>
    
                </section>
    
            </main>
        </div>
      );
};

export default UserRelationPage;
