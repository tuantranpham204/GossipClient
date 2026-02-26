import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';
import { 
  Search, 
  CheckCircle2, 
  Clock,
  XCircle, 
  Settings, 
  Plus, 
  Smile, 
  Send,
  FileImage,
  Users
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import defaultAvatar from '../assets/defaultAvatar.jpg';
import backgroundGif from '../assets/background.gif';
import { usePrivateRooms } from '../services/room.service';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'accepted' | 'pending' | 'declined' | 'group'>('accepted');
  const [page, setPage] = useState(1);
  const [privateRooms, setPrivateRooms] = useState<any[]>([]);

  // Calculate the status to fetch based on activeTab
  const statusToFetch = 
    activeTab === 'accepted' ? 'accepted' : 
    activeTab === 'declined' ? 'declined' : 
    activeTab === 'pending' ? 'pending' : '';

  const { data: resData, isLoading, isFetching } = usePrivateRooms(statusToFetch, page, 10);

  const rooms = (resData?.data as any[]) || [];
  const meta = resData?.meta;
  const totalPages = meta?.total_pages || 0;

  // Update rooms array when query data changes (for pagination appending)
  useEffect(() => {
    if (rooms.length > 0) {
        if (page === 1) {
            setPrivateRooms(rooms);
        } else {
            setPrivateRooms(prev => {
                const existingIds = new Set(prev.map(r => r.id));
                const newItems = rooms.filter(r => !existingIds.has(r.id));
                return [...prev, ...newItems];
            });
        }
    } else if (page === 1 && !isFetching) {
        setPrivateRooms([]);
    }
  }, [rooms, page, isFetching]);

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
    setPrivateRooms([]);
  }, [activeTab]);

  const hasMore = page < totalPages;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50 && !isFetching && hasMore) {
      setPage(prev => prev + 1);
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

        {/* Main Dashboard Container */}
        <main className="w-full h-full glass-panel flex relative z-10 border-none">
            
            <NavigationSidebar />

            {/* Sidebar (Whispers) */}
            <aside className="w-20 md:w-80 border-r border-white/5 flex flex-col bg-black/20 backdrop-blur-md transition-all duration-300">
                
                {/* Filters */}
                <div className="px-6 pt-6 pb-2 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white hidden md:block">{t('home.title')}</h2>
                    <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                         <button className={`p-1.5 rounded-md transition-all ${activeTab === 'accepted' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`} title={t('home.filter_accepted')} onClick={() => setActiveTab('accepted')}>
                            <CheckCircle2 className="w-4 h-4" />
                         </button>
                         <button className={`p-1.5 rounded-md transition-all ${activeTab === 'pending' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`} title={t('home.filter_pending')} onClick={() => setActiveTab('pending')}>
                            <Clock className="w-4 h-4" />
                         </button>
                         <button className={`p-1.5 rounded-md transition-all ${activeTab === 'declined' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`} title={t('home.filter_declined')} onClick={() => setActiveTab('declined')}>
                            <XCircle className="w-4 h-4" />
                         </button>
                         <button className={`p-1.5 rounded-md transition-all ${activeTab === 'group' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`} title={t('home.filter_group')} onClick={() => setActiveTab('group')}>
                            <Users className="w-4 h-4" />
                         </button>
                    </div>
                </div>

                {/* Search */}
                <div className="px-6 mb-4 hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input type="text" placeholder={t('home.search_placeholder')} className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:bg-white/10 transition-colors" />
                    </div>
                </div>

                {/* Chat List */}
                <div 
                    className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar"
                    onScroll={handleScroll}
                >
                    {privateRooms.length > 0 ? (
                        <>
                            {privateRooms.map((room) => (
                                <div key={room.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                                    <div className="relative shrink-0">
                                        <img src={room.opponent?.avatar || defaultAvatar} className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10" alt={room.opponent?.name || room.opponent?.username || 'User'} />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                                    </div>
                                    <div className="hidden md:block flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-sm font-medium text-gray-200 group-hover:text-white truncate">
                                                {room.opponent?.name && room.opponent?.surname 
                                                    ? `${room.opponent.name} ${room.opponent.surname}` 
                                                    : room.opponent?.username || 'Unknown User'}
                                            </h3>
                                            <span className="text-xs text-gray-500 shrink-0 ml-2">
                                                {new Date(room.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-brand-400 ">
                                            {
                                                room.room_type === 'private_strangers_pending' ? t("notifications.types.private_strangers_room_request") : room.room_type?.replace(/_/g, ' ')
                                            }
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {isFetching && page > 1 && (
                                <div className="p-4 flex justify-center">
                                    <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </>
                    ) : isLoading ? (
                        <div className="p-4 flex justify-center mt-4">
                            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm mt-4">
                            {activeTab === 'group' ? t('home.group_coming_soon') : t('home.no_whispers')}
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <section className="flex-1 flex flex-col bg-transparent relative">
                
                {/* Minimal Chat Header */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02] backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <img src={defaultAvatar} className="w-9 h-9 rounded-full object-cover" alt="Sarah" />
                        <div>
                            <h2 className="text-sm font-bold text-white">Sarah Jensen</h2>
                            <span className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {t('home.active_now')}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4 text-gray-400">
                        <button className="hover:text-white transition-colors" title={t('home.chat_settings')} aria-label={t('home.chat_settings')}><Settings className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col-reverse">
                    
                    {/* Received Message */}
                    <div className="flex items-end gap-3 max-w-[80%]">
                        <img src={defaultAvatar} className="w-8 h-8 rounded-full object-cover mb-1" alt="Sarah" />
                        <div className="space-y-1">
                            <div className="bg-white/10 backdrop-blur-md text-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-sm border border-white/5">
                                <p className="text-sm leading-relaxed">Hey! Did you check out the new liquid animation? It looks insane! 🔥</p>
                            </div>
                            <span className="text-[10px] text-gray-500 ml-2">10:42 AM</span>
                        </div>
                    </div>

                    {/* Sent Message */}
                    <div className="flex items-end gap-3 max-w-[80%] self-end flex-row-reverse">
                        <div className="space-y-1">
                            <div className="bg-brand-600/80 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl rounded-br-sm shadow-lg shadow-indigo-500/20">
                                <p className="text-sm leading-relaxed">Yeah I just saw it. The glassmorphism is perfect. 💎</p>
                            </div>
                             <div className="bg-brand-600/80 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 mt-1">
                                <p className="text-sm leading-relaxed">We should implement this for the dashboard too.</p>
                            </div>
                            <span className="text-[10px] text-gray-500 text-right mr-2 block">10:44 AM</span>
                        </div>
                    </div>

                     {/* Received Message */}
                     <div className="flex items-end gap-3 max-w-[80%]">
                        <img src={defaultAvatar} className="w-8 h-8 rounded-full object-cover mb-1" alt="Sarah" />
                        <div className="space-y-1">
                            <div className="bg-white/10 backdrop-blur-md text-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-sm border border-white/5">
                                 <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                        <FileImage className="w-4 h-4 text-brand-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-white truncate">preview_v2.png</p>
                                        <p className="text-[10px] text-gray-400">2.4 MB</p>
                                    </div>
                                 </div>
                                <p className="text-sm leading-relaxed">Here's the latest mockup.</p>
                            </div>
                            <span className="text-[10px] text-gray-500 ml-2">10:45 AM</span>
                        </div>
                    </div>

                </div>

                {/* Message Input */}
                <div className="h-20 px-6 py-4 flex items-center gap-4 border-t border-white/5 bg-white/[0.02] backdrop-blur-md">
                    <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title={t('home.add_attachment')} aria-label={t('home.add_attachment')}>
                        <Plus className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                        <input type="text" placeholder={t('home.type_message')} className="w-full bg-white/5 border border-white/5 rounded-full py-3 px-5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all" />
                        <button className="absolute right-2 top-1.5 p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-yellow-400" title={t('home.add_emoji')} aria-label={t('home.add_emoji')}>
                            <Smile className="w-4 h-4" />
                        </button>
                    </div>
                     <button className="p-3 bg-brand-600 hover:bg-brand-500 rounded-full text-white shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105 active:scale-95" title={t('home.send_message')} aria-label={t('home.send_message')}>
                        <Send className="w-5 h-5 ml-0.5" />
                    </button>
                </div>

            </section>

        </main>

    </div>
  );
};

export default HomePage;
