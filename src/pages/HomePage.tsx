import React, { useState } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';
import { 
  Search, 
  CheckCircle2, 
  Archive, 
  XCircle, 
  Settings, 
  Plus, 
  Smile, 
  Send,
  FileImage
} from 'lucide-react';
import defaultAvatar from '../assets/defaultAvatar.jpg';
import backgroundGif from '../assets/background.gif';

const HomePage: React.FC = () => {
    // Basic state for the notification modal demo
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    // Listen for custom event from sidebar (or better, lift state up in real app)
    React.useEffect(() => {
        const handleToggle = () => setIsNotificationOpen(prev => !prev);
        window.addEventListener('toggleNotifications', handleToggle);
        return () => window.removeEventListener('toggleNotifications', handleToggle);
    }, []);

    const toggleNotificationModal = () => setIsNotificationOpen(!isNotificationOpen);

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
                    <h2 className="text-lg font-bold text-white hidden md:block">Whispers</h2>
                    <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                         <button className="p-1.5 rounded-md bg-white/10 text-white shadow-sm transition-all" title="Accepted">
                            <CheckCircle2 className="w-4 h-4" />
                         </button>
                         <button className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all" title="Archived">
                            <Archive className="w-4 h-4" />
                         </button>
                         <button className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all" title="Denied">
                            <XCircle className="w-4 h-4" />
                         </button>
                    </div>
                </div>

                {/* Search */}
                <div className="px-6 mb-4 hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input type="text" placeholder="Search whispers..." className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:bg-white/10 transition-colors" />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
                    
                    {/* Active Chat Item */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 cursor-pointer border border-white/5">
                        <div className="relative">
                            <img src={defaultAvatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500" alt="Sarah" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                        </div>
                        <div className="hidden md:block flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-sm font-semibold text-white truncate">Sarah Jensen</h3>
                                <span className="text-xs text-brand-400">Now</span>
                            </div>
                            <p className="text-xs text-gray-300 truncate">Did you see that new design? 😍</p>
                        </div>
                    </div>

                    {/* Chat Item */}
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm">M</div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-black"></div>
                        </div>
                        <div className="hidden md:block flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-sm font-medium text-gray-200 group-hover:text-white">Marcus Chen</h3>
                                <span className="text-xs text-gray-500">2h</span>
                            </div>
                            <p className="text-xs text-gray-500 truncate group-hover:text-gray-400">Meeting rescheduled to tomorrow.</p>
                        </div>
                    </div>

                     {/* Chat Item */}
                     <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                        <div className="relative">
                            <img src={defaultAvatar} className="w-10 h-10 rounded-full object-cover opacity-80" alt="Design Team" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                        </div>
                        <div className="hidden md:block flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-sm font-medium text-gray-200 group-hover:text-white">Design Team</h3>
                                <span className="text-xs text-gray-500">5h</span>
                            </div>
                            <p className="text-xs text-gray-500 truncate group-hover:text-gray-400">Alex: The assets are ready.</p>
                        </div>
                    </div>

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
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Active now
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4 text-gray-400">
                        <button className="hover:text-white transition-colors" title="Chat Settings" aria-label="Chat Settings"><Settings className="w-5 h-5" /></button>
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
                    <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Add attachment" aria-label="Add attachment">
                        <Plus className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                        <input type="text" placeholder="Type a message..." className="w-full bg-white/5 border border-white/5 rounded-full py-3 px-5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all" />
                        <button className="absolute right-2 top-1.5 p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-yellow-400" title="Add emoji" aria-label="Add emoji">
                            <Smile className="w-4 h-4" />
                        </button>
                    </div>
                     <button className="p-3 bg-brand-600 hover:bg-brand-500 rounded-full text-white shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105 active:scale-95" title="Send message" aria-label="Send message">
                        <Send className="w-5 h-5 ml-0.5" />
                    </button>
                </div>

            </section>

        </main>

        {/* Notification Modal */}
         <div className={`fixed inset-0 z-50 ${isNotificationOpen ? '' : 'hidden'}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleNotificationModal}></div>
            
            <div className={`absolute left-24 top-6 bottom-6 w-96 bg-black/80 glass-panel border border-white/10 rounded-2xl flex flex-col shadow-2xl transform transition-all duration-300 ${isNotificationOpen ? 'translate-x-0 opacity-100' : 'translate-x-[-20px] opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Notifications</h2>
                    <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Mark all as read</button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {/* Items */}
                    <div className="p-4 rounded-xl bg-white/20 border border-white/10 hover:bg-white/25 transition-colors cursor-pointer relative group">
                        <div className="absolute top-4 right-4 w-2 h-2 bg-brand-500 rounded-full"></div>
                        <div className="flex items-center gap-3 mb-2">
                            <img src={defaultAvatar} className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500" alt="Sarah" />
                            <p className="text-sm font-bold text-white">Sarah Jensen</p>
                        </div>
                        <p className="text-sm text-gray-100">Commented on your post: "This design is fire! 🔥"</p>
                        <span className="text-xs text-brand-300 mt-2 block font-medium">2 min ago</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
};

export default HomePage;
