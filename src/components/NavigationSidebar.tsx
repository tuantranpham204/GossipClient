import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSignOutMutation } from '../services/auth.service';
import { useProfileImage } from '../services/user.service';
import { 
  Search, 
  MessageCircle, 
  LayoutGrid, 
  Users, 
  UserCheck, 
  UserPlus, 
  Bell, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';
import logo from '../assets/logo.png';
import defaultAvatar from '../assets/defaultAvatar.jpg';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/useAuthStore';

const NavigationSidebar: React.FC = () => {
    const { t } = useTranslation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: signOut } = useSignOutMutation();
  const user = useAuthStore((state: any) => state.user);
  const { data: avatarData } = useProfileImage('avatar', user?.userId);

  const isActive = (path: string) => location.pathname === path;

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    
    // Dispatch custom event for other components to listen if needed, 
    // though in React state management (Context/Zustand) is better.
    // For now we'll stick to the provided template's visual logic.
    const event = new CustomEvent('toggleNotifications');
    window.dispatchEvent(event);
  };

  return (
    <nav className="w-20 h-full border-r border-white/5 flex flex-col items-center justify-between py-6 bg-black/40 backdrop-blur-xl z-20">
      
      {/* Logo */}
      <div className="mb-8">
        <Link to="/home">
          <img src={logo} alt="Gossip" className="w-10 h-10 object-contain hover:scale-110 transition-transform cursor-pointer" />
        </Link>
      </div>

      {/* Menu Items */}
      <div className="flex-1 flex flex-col gap-6 w-full px-4">
        
        {/* Search */}
        <Link to="/search" className={`relative group flex items-center justify-center p-3 rounded-xl transition-all ${isActive('/search') ? 'bg-brand-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
          <Search className="w-6 h-6" />
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">{t('sidebar.search')}</span>
        </Link>

        {/* Messages */}
        <Link to="/home" className={`relative group flex items-center justify-center p-3 rounded-xl transition-all ${isActive('/home') || isActive('/messages') ? 'bg-brand-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-black">4</div>
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">{t('sidebar.messages')}</span>
        </Link>

        {/* Posts */}
        <button className="relative group flex items-center justify-center p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          <LayoutGrid className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-black">9</div>
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">{t('sidebar.posts')}</span>
        </button>

        {/* Friends */}
        <Link to="/friends" className="relative group flex items-center justify-center p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          <Users className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-black">2</div>
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">{t('sidebar.friends')}</span>
        </Link>

        {/* Follows */}
        <Link to="/follows" className="relative group flex items-center justify-center p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          <UserCheck className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-black">5</div>
           <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">{t('sidebar.follows')}</span>
        </Link>

        {/* Requests */}
        <button className="relative group flex items-center justify-center p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          <UserPlus className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-black">1</div>
           <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">{t('sidebar.requests')}</span>
        </button>

        {/* Notifications */}
        <button onClick={toggleNotifications} className="relative group flex items-center justify-center p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          <Bell className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-black">12</div>
           <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">{t('sidebar.notifications')}</span>
        </button>

      </div>

      {/* User Avatar & Menu */}
      <div className="relative group w-full flex justify-center pb-2">
        <div className="relative cursor-pointer">
          <img src={avatarData?.data?.avatar_url || defaultAvatar} className="w-12 h-12 rounded-full border-2 border-white/10 hover:border-brand-500 transition-colors object-cover ring-2 ring-transparent group-hover:ring-brand-500/30" alt="Profile" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black"></div>
        </div>

        {/* Drop-right Menu */}
        <div className="absolute left-16 bottom-0 w-48 bg-black/90 glass-panel border border-white/10 rounded-2xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0 origin-bottom-left z-50">
          <div className="px-3 py-2 border-b border-white/5 mb-1">
            <p className="text-sm font-bold text-white">{useAuthStore.getState().user?.name}</p>
            <p className="text-xs text-gray-500">@{useAuthStore.getState().user?.username}</p>
          </div>
          <Link to={`/profile/${useAuthStore.getState().user?.userId}`} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
            <User className="w-4 h-4" /> {t('sidebar.profile')}
          </Link>
           <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
            <Settings className="w-4 h-4" /> {t('sidebar.settings')}
          </a>
          <div className="px-3 py-2">
            <LanguageSwitcher className="w-full justify-start" />
          </div>
          <div className="h-px bg-white/5 my-1"></div>
          <button 
            onClick={() => {
              signOut(undefined, {
                onSuccess: () => {
                  navigate('/');
                }
              });
            }}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> {t('sidebar.sign_out')}
          </button>
        </div>
      </div>

    </nav>
  );
};

export default NavigationSidebar;
