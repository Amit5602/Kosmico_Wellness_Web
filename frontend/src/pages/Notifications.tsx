import { Container } from '../components/ui/Container';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../hooks/useNotifications';
import { Bell, Package, Tag, Star, Info, CheckCheck } from 'lucide-react';
import { useState } from 'react';

const getIcon = (type: string) => {
  switch (type) {
    case 'order_update': return <Package className="w-5 h-5 text-primary" />;
    case 'promo': return <Tag className="w-5 h-5 text-green-500" />;
    case 'review': return <Star className="w-5 h-5 text-yellow-500" />;
    default: return <Info className="w-5 h-5 text-blue-500" />;
  }
};

export function Notifications() {
  const [page, setPage] = useState(1);
  const { data: notificationsData, isLoading } = useNotifications(page, 20);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead.mutate(id);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead.mutate();
  };

  return (
    <Container className="py-12 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-primary flex items-center gap-3">
          <Bell className="w-8 h-8" />
          Notifications
        </h1>
        <button
          onClick={handleMarkAllRead}
          disabled={markAllAsRead.isPending || !notificationsData?.notifications?.some((n: any) => !n.isRead)}
          className="mt-4 sm:mt-0 flex items-center gap-2 text-primary hover:text-primary/80 font-medium disabled:opacity-50 transition-colors"
        >
          <CheckCheck className="w-5 h-5" />
          Mark all as read
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-surface animate-pulse rounded-xl border border-border"></div>
          ))}
        </div>
      ) : notificationsData?.notifications?.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-xl border border-border">
          <Bell className="w-16 h-16 mx-auto text-text-muted mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-text-main mb-2">No notifications yet</h2>
          <p className="text-text-muted">We'll let you know when something important happens.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notificationsData?.notifications?.map((notification: any) => (
            <div 
              key={notification._id} 
              onClick={() => handleMarkAsRead(notification._id, notification.isRead)}
              className={`p-4 sm:p-6 rounded-xl border transition-all cursor-pointer flex gap-4 ${
                notification.isRead 
                  ? 'bg-surface border-border opacity-70' 
                  : 'bg-white border-primary/20 shadow-sm'
              }`}
            >
              <div className="shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                  <h3 className={`font-bold ${notification.isRead ? 'text-text-main' : 'text-primary'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-text-muted whitespace-nowrap">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className={`text-sm ${notification.isRead ? 'text-text-muted' : 'text-text-main'}`}>
                  {notification.message}
                </p>
              </div>
              {!notification.isRead && (
                <div className="shrink-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                </div>
              )}
            </div>
          ))}

          {notificationsData?.meta?.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-text-muted">
                Page {page} of {notificationsData.meta.pages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= notificationsData.meta.pages}
                className="px-4 py-2 border border-border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
