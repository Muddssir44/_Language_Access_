import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Animated,
    FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DynamicHeader from '../Components/DynamicHeader';
import { theme, getHeaderHeight } from '../Components/theme';

// Enhanced Notification Item Component
const NotificationItem = ({ notification, onPress, index }) => {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: false,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                delay: index * 100,
                useNativeDriver: false,
            }),
        ]).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: false,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: false,
        }).start();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'message':
                return { name: 'message-circle', color: theme.colors.primary };
            case 'session':
                return { name: 'calendar', color: theme.colors.success };
            case 'payment':
                return { name: 'dollar-sign', color: theme.colors.accent };
            case 'booking':
                return { name: 'clock', color: theme.colors.secondary };
            case 'system':
                return { name: 'bell', color: theme.colors.warning };
            default:
                return { name: 'bell', color: theme.colors.primary };
        }
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const icon = getNotificationIcon(notification.type);

    return (
        <Animated.View
            style={[
                styles.notificationCard,
                notification.unread && styles.unreadNotification,
                {
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }],
                }
            ]}
        >
            <TouchableOpacity
                onPress={() => onPress(notification)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={styles.notificationTouchable}
            >
                <View style={[styles.notificationIcon, { backgroundColor: icon.color + '15' }]}>
                    <Feather name={icon.name} size={20} color={icon.color} />
                </View>
                <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                        <Text style={[styles.notificationTitle, notification.unread && styles.unreadTitle]}>
                            {notification.title}
                        </Text>
                        <Text style={styles.notificationTime}>
                            {getTimeAgo(notification.timestamp)}
                        </Text>
                    </View>
                    <Text style={styles.notificationDescription}>
                        {notification.description}
                    </Text>
                    {notification.action && (
                        <View style={styles.actionContainer}>
                            <Text style={styles.actionText}>{notification.action}</Text>
                            <Feather name="chevron-right" size={14} color={theme.colors.primary} />
                        </View>
                    )}
                </View>
                {notification.unread && <View style={styles.unreadDot} />}
            </TouchableOpacity>
        </Animated.View>
    );
};

// Empty State Component
const EmptyState = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.emptyState, { opacity: fadeAnim }]}>
            <View style={styles.emptyStateIcon}>
                <Feather name="bell-off" size={48} color={theme.colors.text.light} />
            </View>
            <Text style={styles.emptyStateTitle}>No notifications yet</Text>
            <Text style={styles.emptyStateSubtitle}>
                You'll see important updates and reminders here
            </Text>
        </Animated.View>
    );
};

const NotificationScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState([
        {
            id: '1',
            type: 'message',
            title: 'New Message from Maria',
            description: 'Maria Rodriguez sent you a message about your upcoming legal interpretation session.',
            timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
            unread: true,
            action: 'Reply now',
        },
        {
            id: '2',
            type: 'session',
            title: 'Session Reminder',
            description: 'Your interpretation session with Dr. Ahmad starts in 30 minutes.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            unread: true,
            action: 'Join session',
        },
        {
            id: '3',
            type: 'payment',
            title: 'Payment Received',
            description: 'Payment of $120 has been credited to your account for the medical consultation.',
            timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
            unread: false,
            action: 'View details',
        },
        {
            id: '4',
            type: 'booking',
            title: 'Booking Confirmed',
            description: 'Your booking with Jean-Pierre for French interpretation has been confirmed.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            unread: false,
            action: 'View booking',
        },
        {
            id: '5',
            type: 'system',
            title: 'App Update Available',
            description: 'A new version of LanguageAccess is available with improved features.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            unread: false,
            action: 'Update now',
        },
    ]);

    const [refreshing, setRefreshing] = useState(false);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleNotificationPress = (notification) => {
        // Mark as read
        setNotifications(notifications.map(notif =>
            notif.id === notification.id
                ? { ...notif, unread: false }
                : notif
        ));

        // Handle different notification types
        switch (notification.type) {
            case 'message':
                navigation.navigate('Messages', { interpreterId: notification.id });
                break;
            case 'session':
                // Navigate to session screen
                console.log('Navigate to session');
                break;
            case 'payment':
                navigation.navigate('ClientProfile', { screen: 'paymentHistory' });
                break;
            case 'booking':
                navigation.navigate('ClientProfile', { screen: 'callHistory' });
                break;
            default:
                console.log('Handle notification:', notification.title);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const renderNotificationItem = ({ item, index }) => (
        <NotificationItem
            notification={item}
            onPress={handleNotificationPress}
            index={index}
        />
    );

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="Notifications"
                onBack={handleBack}
                showSearch={false}
            />

            {notifications.length === 0 ? (
                <EmptyState />
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.content, { paddingTop: getHeaderHeight() }]}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
    },
    notificationCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.sm,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    unreadNotification: {
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '05',
    },
    notificationTouchable: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        alignItems: 'flex-start',
    },
    notificationIcon: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.xs,
    },
    notificationTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        fontWeight: '600',
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    unreadTitle: {
        fontWeight: '700',
    },
    notificationTime: {
        ...theme.typography.small,
        color: theme.colors.text.light,
    },
    notificationDescription: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        lineHeight: 20,
        marginBottom: theme.spacing.sm,
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surfaceLight,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    actionText: {
        ...theme.typography.small,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    unreadDot: {
        position: 'absolute',
        top: theme.spacing.md,
        right: theme.spacing.md,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary,
    },
    separator: {
        height: theme.spacing.sm,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
        paddingTop: getHeaderHeight(),
    },
    emptyStateIcon: {
        marginBottom: theme.spacing.lg,
    },
    emptyStateTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    emptyStateSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default NotificationScreen;