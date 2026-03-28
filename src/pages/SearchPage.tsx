import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import NavigationSidebar from '../components/NavigationSidebar';
import { Search, UserCheck, UserPlus, CopyPlus, CopyCheck, MessageSquare, Loader2, Eye } from 'lucide-react';
import defaultAvatar from '../assets/defaultAvatar.jpg';
import backgroundGif from '../assets/background.gif';
import { useSearchUsers, requestFriend, requestFollow } from '../services/user.service';
// @ts-ignore
import { USER_RELATION_STATUS } from '../utils/enum';

interface UserData {
  user_id: number;
  username: string;
  name: string;
  surname: string;
  avatar_url: string | null;
  status: string | null;
  friend_status?: string;
  follow_status?: string;
  initials?: string;
  friends_amount: number;
  followers_amount: number;
  following_amount: number;
}

const SearchPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20); // Default to 20 as per API response example
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const { data: searchData, isLoading, isError } = useSearchUsers({
        q: debouncedQuery,
        page: currentPage,
        per_page: itemsPerPage
    });

    const users = (searchData?.data as UserData[]) || [];
    const meta = searchData?.meta;
    const totalPages = meta?.total_pages || 0;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleFriendRequest = async (userId: number) => {
        try {
            await requestFriend(userId);
            queryClient.invalidateQueries({ queryKey: ['users'] });
        } catch (error) {
            // Error is handled by apiClient toast
        }
    };

    const handleFollowRequest = async (userId: number) => {
        try {
            await requestFollow(userId);
            queryClient.invalidateQueries({ queryKey: ['users'] });
        } catch (error) {
            // Error is handled by apiClient toast
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

            {/* Search Content */}
            <section className="flex-1 flex flex-col relative overflow-hidden">
                
                {/* Search Header */}
                <div className="p-6 md:p-10 pb-0">
                    <h1 className="text-3xl font-bold mb-6">{t('search.discover_people')}</h1>
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder={t('search.placeholder')} 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-brand-500/50 transition-all text-lg shadow-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Results Grid */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
                        </div>
                    ) : isError ? (
                        <div className="flex items-center justify-center h-64 text-red-400">
                            {t('search.failed_load')}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {users.map(user => (
                                    <div key={user.user_id} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition-all flex flex-col items-center group animate-fade-in-up">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.username} className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-transparent group-hover:ring-brand-500/50 transition-all" />
                                        ) : (
                                            <img src={defaultAvatar} alt={user.username} className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-transparent group-hover:ring-brand-500/50 transition-all" />
                                        )}
                                        <h3 className="text-lg font-bold text-white text-center">{user.name} {user.surname}</h3>
                                        <p className="text-sm text-gray-400 mb-2 text-center">@{user.username}</p>
                                        
                                        {/* Stats */}
                                        <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <span className="font-bold text-white">{user.friends_amount}</span>
                                                <span>{t('search.friends')}</span>
                                            </div>
                                            <div className="h-4 w-px bg-white/10"></div>
                                            <div className="flex flex-col items-center">
                                                <span className="font-bold text-white">{user.followers_amount}</span>
                                                <span>{t('search.followers')}</span>
                                            </div>
                                            <div className="h-4 w-px bg-white/10"></div>
                                            <div className="flex flex-col items-center">
                                                <span className="font-bold text-white">{user.following_amount}</span>
                                                <span>{t('search.following')}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 w-full justify-center mt-auto">
                                            <button 
                                                title={t('search.view_profile')} 
                                                onClick={() => navigate(`/profile/${user.user_id}`)}
                                                className="p-2.5 bg-white/5 hover:bg-blue-600 hover:text-white rounded-xl transition-all text-gray-400 hover:scale-110"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>

                                            {/* Friend Status Button */}
                                            {user.friend_status === USER_RELATION_STATUS.PENDING ? (
                                                <button title={t('search.friend_request_sent')} className="p-2.5 bg-yellow-600/20 text-yellow-500 rounded-xl transition-all hover:scale-110 relative group">
                                                    <UserCheck className="w-5 h-5" />
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></div>
                                                </button>
                                            ) : user.friend_status === USER_RELATION_STATUS.ACCEPTED ? (
                                                <button title={t('search.friends')} className="p-2.5 bg-green-600/20 text-green-500 rounded-xl transition-all hover:scale-110 relative group">
                                                    <UserCheck className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button 
                                                    title={t('search.add_friend')} 
                                                    onClick={() => handleFriendRequest(user.user_id)}
                                                    className="p-2.5 bg-white/5 hover:bg-brand-600 hover:text-white rounded-xl transition-all text-gray-400 hover:scale-110"
                                                >
                                                    <UserPlus className="w-5 h-5" />
                                                </button>
                                            )}

                                            {/* Follow Status Button */}
                                            {user.follow_status !== USER_RELATION_STATUS.NOT_FOLLOW && user.follow_status ? (
                                                <button title={t('search.following')} className="p-2.5 bg-green-600/20 text-green-500 rounded-xl transition-all hover:scale-110">
                                                    <CopyCheck className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button 
                                                    title={t('search.follow')} 
                                                    onClick={() => handleFollowRequest(user.user_id)}
                                                    className="p-2.5 bg-white/5 hover:bg-pink-600 hover:text-white rounded-xl transition-all text-gray-400 hover:scale-110"
                                                >
                                                    <CopyPlus className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button title={t('search.message')} className="p-2.5 bg-white/5 hover:bg-green-600 hover:text-white rounded-xl transition-all text-gray-400 hover:scale-110">
                                                <MessageSquare className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination & Controls */}
                            {users.length > 0 && (
                                <div className="flex flex-col md:flex-row items-center justify-center mt-8 gap-6">
                                    
                                    {/* Pagination Buttons */}
                                    <div className="flex gap-2">
                                        <button 
                                            className={`px-4 py-2 rounded-lg bg-white/5 text-sm font-medium transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}`}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            {t('common.previous')}
                                        </button>
                                        
                                        {/* Simple pagination: showing current, prev, next or just numbers if few. 
                                            For large total_pages, we might want a better logic. 
                                            For now, let's show a window around current page or all if small. 
                                        */}
                                        {(() => {
                                            const maxVisiblePages = 5;
                                            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                                            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                                            if (endPage - startPage + 1 < maxVisiblePages) {
                                                startPage = Math.max(1, endPage - maxVisiblePages + 1);
                                            }

                                            return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
                                                <button 
                                                    key={page}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === currentPage ? 'bg-brand-600 hover:bg-brand-700' : 'bg-white/5 hover:bg-white/10'}`}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            ));
                                        })()}

                                        <button 
                                            className={`px-4 py-2 rounded-lg bg-white/5 text-sm font-medium transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}`}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            {t('common.next')}
                                        </button>
                                    </div>

                                    {/* Records Per Page */}
                                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1 border border-white/5 hover:bg-white/10 transition-colors">
                                        <span className="text-xs text-gray-400">{t('search.show')}</span>
                                        <select 
                                            value={itemsPerPage} 
                                            onChange={handleLimitChange}
                                            className="bg-transparent text-sm text-white focus:outline-none cursor-pointer py-1 [&>option]:bg-gray-900"
                                            aria-label="Records per page"
                                        >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                        </select>
                                    </div>

                                </div>
                            )}
                        </>
                    )}
                    
                    <div className="h-10"></div> {/* Spacer */}

                </div>

            </section>

        </main>
    </div>
  );
};

export default SearchPage;
