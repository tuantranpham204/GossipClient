import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useNotifications, useReadAllNotifications, useReadNotification } from '../services/notification.service';
import defaultAvatar from '../assets/defaultAvatar.jpg';
// @ts-ignore
import { NOTIFICATION_STATUS, NOTIFICATION_TYPE } from '../utils/enum';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NotificationItem {
    id: number;
    user_id: number;
    actor_id: number;
    actor_username: string;
    actor_avatar_url: string | null;
    status: string;
    notification_type: string;
    content: Record<string, any>;
    updated_at: string;
    created_at: string;
}

const ITEMS_PER_PAGE = 10;  

/**
 * Format a timestamp string into a relative time string.
 */
const formatRelativeTime = (dateString: string, t: (key: string, opts?: any) => string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return t('notifications.time_ago_min', { count: 1 });
    if (diffMinutes < 60) return t('notifications.time_ago_min', { count: diffMinutes });
    if (diffHours < 24) return t('notifications.time_ago_hour', { count: diffHours });
    if (diffDays === 1) return t('notifications.time_ago_day', { count: 1 });
    return t('notifications.time_ago_days', { count: diffDays });
};

/**
 * Render the notification message from the content object.
 * The API returns a `content` object — we display its `message` field if available,
 * or fall back to a JSON string representation.
 */
const getNotificationMessage = (notification: NotificationItem, t: (key: string, opts?: any) => string): string => {
    const { content, notification_type } = notification;
    if (content?.message) return content.message;
    if (content?.body) return content.body;
    if (content?.text) return content.text;
    
    if (notification_type) {
        return t(`notifications.types.${notification_type}`);
    }

    // Fallback: stringify non-empty content
    const str = JSON.stringify(content);
    return str !== '{}' ? str : 'New notification';
};

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const contentRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Read all mutation
    const { mutate: readAll, isPending: isReadingAll } = useReadAllNotifications();

    // Read single mutation
    const { mutate: readSingleNotification } = useReadNotification();

    // Fetch notifications from API (only when panel is open)
    const { data: notifData, isLoading, isFetching } = useNotifications({
        page: currentPage,
        per_page: ITEMS_PER_PAGE,
    });

    const notifications: NotificationItem[] = (notifData?.data as NotificationItem[]) || [];
    const meta = notifData?.meta;
    const totalPages = meta?.total_pages || 0;
    const totalCount = meta?.total_count || 0;

    // Accumulated notifications across pages for seamless scrolling
    const [allNotifications, setAllNotifications] = useState<NotificationItem[]>([]);

    // Reset pagination when panel opens
    useEffect(() => {
        if (isOpen && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [isOpen, currentPage]);

    // Sync or Append new page data
    useEffect(() => {
        if (notifications.length > 0) {
            if (currentPage === 1) {
                setAllNotifications(notifications);
            } else {
                setAllNotifications(prev => {
                    // Avoid duplicates using the unique id
                    const existingIds = new Set(prev.map(n => n.id));
                    const newItems = notifications.filter(n => !existingIds.has(n.id));
                    return [...prev, ...newItems];
                });
            }
        } else if (currentPage === 1) {
            setAllNotifications([]);
        }
    }, [notifications, currentPage]);

    // Open/close animation
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => {
                setIsAnimating(true);
            });
        } else {
            setIsAnimating(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const loadMore = useCallback(() => {
        if (currentPage < totalPages && !isFetching) {
            setCurrentPage(prev => prev + 1);
        }
    }, [currentPage, totalPages, isFetching]);

    // Infinite scroll: load more when user scrolls near bottom
    const handleScroll = useCallback(() => {
        const el = listRef.current;
        if (!el) return;
        const { scrollTop, scrollHeight, clientHeight } = el;
        if (scrollHeight - scrollTop - clientHeight < 100) {
            loadMore();
        }
    }, [loadMore]);

    if (!isOpen) return null;

    const isUnread = (status: string) => status === NOTIFICATION_STATUS.UNREAD;

    const handleNotificationClick = (notification: NotificationItem) => {
        if (isUnread(notification.status)) {
            readSingleNotification(notification.id, {
                onSuccess: () => {
                    setAllNotifications(prev => prev.map(n => 
                        n.id === notification.id ? { ...n, status: NOTIFICATION_STATUS.READ } : n
                    ));
                }
            });
        }

        if (notification.notification_type === NOTIFICATION_TYPE.FRIEND_REQUEST) {
            navigate('/friends');
            onClose();
        } else if (notification.notification_type === NOTIFICATION_TYPE.FOLLOW_REQUEST) {
            navigate('/follows');
            onClose();
        } else if (
            notification.notification_type === NOTIFICATION_TYPE.PRIVATE_STRANGERS_ROOM_REQUEST || 
            notification.notification_type === NOTIFICATION_TYPE.UNREAD_MESSAGE
        ) {
            navigate('/messages');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div
                ref={contentRef}
                className={`absolute left-24 top-6 bottom-6 w-96 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] transform transition-all duration-300 ${
                    isAnimating
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-[-20px] opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white">
                            {t('notifications.title')}
                        </h2>
                        {totalCount > 0 && (
                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                                {totalCount}
                            </span>
                        )}
                    </div>
                    <button
                        className="text-xs text-brand-400 hover:text-brand-300 transition-colors disabled:opacity-50"
                        disabled={isReadingAll}
                        onClick={() => {
                            readAll(undefined, {
                                onSuccess: () => {
                                    setAllNotifications(prev => prev.map(n => ({ ...n, status: NOTIFICATION_STATUS.READ })));
                                },
                            });
                        }}
                    >
                        {isReadingAll ? t('common.loading') : t('notifications.mark_all_read')}
                    </button>
                </div>

                {/* Notification List */}
                <div
                    ref={listRef}
                    className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3"
                    onScroll={handleScroll}
                >
                    {/* Initial loading state */}
                    {isLoading && currentPage === 1 ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                        </div>
                    ) : allNotifications.length === 0 ? (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                            <p className="text-sm">{t('notifications.empty')}</p>
                        </div>
                    ) : (
                        <>
                            {allNotifications.map((notification, index) =>
                                isUnread(notification.status) ? (
                                    /* Unread Item (Brighter/Heavier) */
                                    <div
                                        key={`${notification.actor_id}-${notification.created_at}-${index}`}
                                        onClick={() => handleNotificationClick(notification)}
                                        className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(255,255,255,0.1)] transition-all duration-300 cursor-pointer relative group shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                                    >
                                        {/* Unread dot */}
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-brand-500 rounded-full" />
                                        <div className="flex items-center gap-3 mb-2">
                                            <img
                                                src={notification.actor_avatar_url || defaultAvatar}
                                                className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500"
                                                alt={notification.actor_username}
                                            />
                                            <p className="text-sm font-bold text-white">
                                                {notification.actor_username}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-100">
                                            {getNotificationMessage(notification, t)}
                                        </p>
                                        <span className="text-xs text-brand-300 mt-2 block font-medium">
                                            {formatRelativeTime(notification.created_at, t)}
                                        </span>
                                    </div>
                                ) : (
                                    /* Read Item (Dimmer/Lighter) */
                                    <div
                                        key={`${notification.actor_id}-${notification.created_at}-${index}`}
                                        onClick={() => handleNotificationClick(notification)}
                                        className="p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-300 cursor-pointer group opacity-60 hover:opacity-100"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <img
                                                src={notification.actor_avatar_url || defaultAvatar}
                                                className="w-8 h-8 rounded-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                                                alt={notification.actor_username}
                                            />
                                            <p className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                                                {notification.actor_username}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                                            {getNotificationMessage(notification, t)}
                                        </p>
                                        <span className="text-xs text-gray-600 mt-2 block">
                                            {formatRelativeTime(notification.created_at, t)}
                                        </span>
                                    </div>
                                )
                            )}

                            {/* Load more spinner */}
                            {isFetching && currentPage > 1 && (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
                                </div>
                            )}

                            {/* End of list indicator */}
                            {currentPage >= totalPages && allNotifications.length > 0 && !isFetching && (
                                <p className="text-center text-xs text-gray-600 py-2">
                                    {t('notifications.end_of_list')}
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationCenter;
