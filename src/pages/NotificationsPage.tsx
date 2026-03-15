import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, History, ArrowLeft, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

type NotificationRow = Tables<"notifications">;

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // Fetch initial notifications
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data) setNotifications(data);
      setLoading(false);
    };

    fetchNotifications();

    // Subscribe to new notifications
    const subscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setNotifications(prev => [payload.new as NotificationRow, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setNotifications(prev => prev.map(n => n.id === payload.new.id ? payload.new as NotificationRow : n));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    if (!user) return;
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    
    // Optimistic update
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    
    await supabase.from('notifications')
      .update({ read: true })
      .in('id', unreadIds);
  };

  const markAsRead = async (id: string, link: string | null) => {
    if (!user) return;
    
    const notif = notifications.find(n => n.id === id);
    if (notif && !notif.read) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    }
    
    if (link) {
      navigate(link);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'match': return <Star className="w-5 h-5 text-accent" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <History className="w-5 h-5 text-warning" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <div className="px-5 pt-12 pb-32 max-w-2xl mx-auto min-h-screen bg-background">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full border border-border/50 bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-black tracking-tight text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground font-medium">
              You have {unreadCount} unread message{unreadCount !== 1 && 's'}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-primary hover:text-primary/80 hover:bg-primary/10 rounded-full">
            Mark all read
          </Button>
        )}
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">You don't have any new notifications right now.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <motion.div 
              key={notification.id}
              variants={itemVariants}
              onClick={() => markAsRead(notification.id, notification.link)}
              className={`p-5 rounded-3xl border transition-all duration-300 ${notification.link ? 'cursor-pointer hover:bg-muted/50' : ''} ${
                notification.read 
                  ? 'bg-card border-border shadow-sm' 
                  : 'bg-primary/5 border-primary/20 shadow-md shadow-primary/5 ring-1 ring-primary/10'
              }`}
            >
              <div className="flex gap-4">
                <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${notification.read ? 'bg-muted' : 'bg-primary/10'}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`text-base font-bold truncate ${notification.read ? 'text-foreground/80' : 'text-foreground'}`}>
                      {notification.title}
                    </h4>
                    {!notification.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug mb-3">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    {new Date(notification.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default NotificationsPage;
