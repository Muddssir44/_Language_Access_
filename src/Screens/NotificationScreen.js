import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    RefreshControl,
    Alert,
    PanGestureHandler,
    State,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Reuse the same theme for consistency
const theme = {
    colors: {
        primary: '#4F46E5',
        primaryLight: '#818CF8',
        secondary: '#06B6D4',
        accent: '#F59E0B',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        surfaceLight: '#F8FAFC',
        text: {
            primary: '#1F2937',
            secondary: '#6B7280',
            light: '#9CA3AF',
            white: '#FFFFFF',
        },
        border: '#E5E7EB',
        shadow: 'rgba(0, 0, 0, 0.1)',
        gradient: {
            primary: ['#4F46E5', '#7C3AED'],
            secondary: ['#06B6D4', '#0891B2'],
            accent: ['#F59E0B', '#D97706'],
        },
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
    },
    typography: {
        h1: { fontSize: 28, fontWeight: '700' },
        h2: { fontSize: 24, fontWeight: '600' },
        h3: { fontSize: 20, fontWeight: '600' },
        body: { fontSize: 16, fontWeight: '400' },
        bodyMedium: { fontSize: 16, fontWeight: '500' },
        caption: { fontSize: 14, fontWeight: '400' },
        small: { fontSize: 12, fontWeight: '400' },
    },
};

// Dynamic Header Component
const DynamicHeader = ({ userType = 'interpreter', onBack, onProfile, unreadCount = 0 }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
            <View style={styles.headerLeft}>
                <TouchableOpacity style={styles.headerButton} onPress={onBack} activeOpacity={0.7}>
                    <Feather name="chevron-left" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    {unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
            <TouchableOpacity style={styles.headerButton} onPress={onProfile} activeOpacity={0.7}>
                <Feather name="user" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
        </Animated.View>
    );
};

// Helper function to format timestamps
const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return notificationDate.toLocaleDateString();
};

// Get notification icon based on type
const getNotificationIcon = (type, subType) => {
    switch (type) {
        case 'job':
            switch (subType) {
                case 'new_application': return 'user-plus';
                case 'accepted': return 'check-circle';
                case 'completed': return 'award';
                case 'cancelled': return 'x-circle';
                default: return 'briefcase';
            }
        case 'message':
            return 'message-circle';
        case 'payment':
            switch (subType) {
                case 'received': return 'dollar-sign';
                case 'approved': return 'check';
                case 'failed': return 'alert-circle';
                default: return 'credit-card';
            }
        case 'system':
            switch (subType) {
                case 'verification': return 'shield-check';
                case 'profile': return 'user';
                case 'update': return 'info';
                default: return 'bell';
            }
        default:
            return 'bell';
    }
};

// Get notification color based on type
const getNotificationColor = (type, subType) => {
    switch (type) {
        case 'job':
            switch (subType) {
                case 'accepted': return theme.colors.success;
                case 'completed': return theme.colors.accent;
                case 'cancelled': return theme.colors.error;
                default: return theme.colors.primary;
            }
        case 'message':
            return theme.colors.secondary;
        case 'payment':
            switch (subType) {
                case 'received': return theme.colors.success;
                case 'failed': return theme.colors.error;
                default: return theme.colors.accent;
            }
        case 'system':
            return theme.colors.text.secondary;
        default:
            return theme.colors.primary;
    }
};

// Loading Skeleton Component
const LoadingSkeleton = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: false,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    const shimmerStyle = {
        opacity: shimmerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.7],
        }),
    };

    const SkeletonCard = ({ index }) => (
        <Animated.View style={[styles.skeletonCard, shimmerStyle]}>
            <View style={styles.skeletonRow}>
                <View style={styles.skeletonIcon} />
                <View style={styles.skeletonContent}>
                    <View style={styles.skeletonTitle} />
                    <View style={styles.skeletonText} />
                    <View style={styles.skeletonTimestamp} />
                </View>
                <View style={styles.skeletonDot} />
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.skeletonContainer}>
            {Array.from({ length: 6 }, (_, index) => (
                <SkeletonCard key={index} index={index} />
            ))}
        </View>
    );
};

// Empty State Component
const EmptyState = ({ userType }) => {
    const bounceAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0.95,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    const getEmptyStateContent = () => {
        return {
            icon: 'bell-off',
            title: "You're all caught up!",
            subtitle: userType === 'client'
                ? "No new notifications right now. When you post jobs or receive messages, they'll appear here."
                : "No new notifications right now. When you receive job opportunities or client messages, they'll appear here.",
        };
    };

    const content = getEmptyStateContent();

    return (
        <View style={styles.emptyState}>
            <Animated.View
                style={[
                    styles.emptyStateIcon,
                    { transform: [{ scale: bounceAnim }] }
                ]}
            >
                <Feather name={content.icon} size={64} color={theme.colors.text.light} />
            </Animated.View>
            <Text style={styles.emptyStateTitle}>{content.title}</Text>
            <Text style={styles.emptyStateSubtitle}>{content.subtitle}</Text>
        </View>
    );
};

// Swipe Action Buttons Component
const SwipeActions = ({ onMarkAsRead, onDelete, isRead }) => (
    <View style={styles.swipeActions}>
        <TouchableOpacity
            style={[styles.swipeButton, styles.markReadButton]}
            onPress={onMarkAsRead}
            activeOpacity={0.8}
        >
            <Feather
                name={isRead ? "eye-off" : "eye"}
                size={20}
                color={theme.colors.text.white}
            />
            <Text style={styles.swipeButtonText}>
                {isRead ? "Unread" : "Read"}
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.swipeButton, styles.deleteButton]}
            onPress={onDelete}
            activeOpacity={0.8}
        >
            <Feather name="trash-2" size={20} color={theme.colors.text.white} />
            <Text style={styles.swipeButtonText}>Delete</Text>
        </TouchableOpacity>
    </View>
);

// Notification Card Component
const NotificationCard = ({ notification, onPress, onMarkAsRead, onDelete, index }) => {
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const swipeableRef = useRef(null);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 400,
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

    const handleMarkAsRead = () => {
        onMarkAsRead(notification.id);
        swipeableRef.current?.close();
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Notification',
            'Are you sure you want to delete this notification?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        onDelete(notification.id);
                        swipeableRef.current?.close();
                    }
                },
            ]
        );
    };

    const renderRightActions = () => (
        <SwipeActions
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            isRead={notification.isRead}
        />
    );

    return (
        <Animated.View
            style={[
                styles.notificationCardContainer,
                {
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}
        >
            <Swipeable
                ref={swipeableRef}
                renderRightActions={renderRightActions}
                rightThreshold={40}
            >
                <TouchableOpacity
                    style={[
                        styles.notificationCard,
                        !notification.isRead && styles.notificationCardUnread
                    ]}
                    onPress={() => onPress(notification)}
                    activeOpacity={0.8}
                >
                    <View style={styles.notificationCardContent}>
                        <View style={[
                            styles.notificationIcon,
                            { backgroundColor: getNotificationColor(notification.type, notification.subType) }
                        ]}>
                            <Feather
                                name={getNotificationIcon(notification.type, notification.subType)}
                                size={20}
                                color={theme.colors.text.white}
                            />
                        </View>

                        <View style={styles.notificationContent}>
                            <View style={styles.notificationHeader}>
                                <Text
                                    style={[
                                        styles.notificationTitle,
                                        !notification.isRead && styles.notificationTitleUnread
                                    ]}
                                    numberOfLines={2}
                                >
                                    {notification.title}
                                </Text>
                                <Text style={styles.notificationTimestamp}>
                                    {formatTimestamp(notification.timestamp)}
                                </Text>
                            </View>

                            <Text
                                style={styles.notificationDescription}
                                numberOfLines={2}
                            >
                                {notification.description}
                            </Text>

                            {notification.actionText && (
                                <Text style={styles.notificationAction}>
                                    {notification.actionText}
                                </Text>
                            )}
                        </View>

                        {!notification.isRead && (
                            <View style={styles.unreadIndicator} />
                        )}
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </Animated.View>
    );
};

// Filter and Sort Component
const FilterSort = ({ activeFilter, onFilterChange, onClearAll, hasNotifications }) => {
    const filters = [
        { id: 'all', label: 'All', icon: 'bell' },
        { id: 'unread', label: 'Unread', icon: 'eye' },
        { id: 'job', label: 'Jobs', icon: 'briefcase' },
        { id: 'message', label: 'Messages', icon: 'message-circle' },
        { id: 'payment', label: 'Payments', icon: 'dollar-sign' },
    ];

    return (
        <View style={styles.filterContainer}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}
            >
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter.id}
                        style={[
                            styles.filterButton,
                            activeFilter === filter.id && styles.filterButtonActive
                        ]}
                        onPress={() => onFilterChange(filter.id)}
                        activeOpacity={0.8}
                    >
                        <Feather
                            name={filter.icon}
                            size={16}
                            color={activeFilter === filter.id ? theme.colors.text.white : theme.colors.text.secondary}
                        />
                        <Text style={[
                            styles.filterButtonText,
                            activeFilter === filter.id && styles.filterButtonTextActive
                        ]}>
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {hasNotifications && (
                <TouchableOpacity
                    style={styles.clearAllButton}
                    onPress={onClearAll}
                    activeOpacity={0.8}
                >
                    <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// Helper Text Component
const HelperText = ({ text, icon = 'info' }) => (
    <View style={styles.helperContainer}>
        <Feather name={icon} size={16} color={theme.colors.primary} />
        <Text style={styles.helperText}>{text}</Text>
    </View>
);

// Main NotificationScreen Component
const NotificationScreen = ({ userType = 'interpreter' }) => {
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Mock notification data
    const mockNotifications = [
        {
            id: '1',
            type: 'job',
            subType: 'new_application',
            title: 'New job application received',
            description: 'Sarah Johnson applied for your English-Spanish legal interpretation job.',
            timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
            isRead: false,
            actionText: 'View application',
            linkTo: 'job-details',
        },
        {
            id: '2',
            type: 'message',
            subType: 'new_message',
            title: 'New message from client',
            description: 'David Chen: "Thank you for the excellent interpretation service yesterday!"',
            timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
            isRead: false,
            actionText: 'Reply to message',
            linkTo: 'messages',
        },
        {
            id: '3',
            type: 'payment',
            subType: 'received',
            title: 'Payment received',
            description: 'You received $125.00 for legal interpretation services.',
            timestamp: new Date(Date.now() - 6 * 60 * 60000), // 6 hours ago
            isRead: true,
            actionText: 'View earnings',
            linkTo: 'earnings',
        },
        {
            id: '4',
            type: 'job',
            subType: 'accepted',
            title: 'Job application accepted',
            description: 'Your application for medical interpretation has been accepted by GlobalMed Corp.',
            timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
            isRead: true,
            actionText: 'View job details',
            linkTo: 'job-details',
        },
        {
            id: '5',
            type: 'system',
            subType: 'verification',
            title: 'Profile verification approved',
            description: 'Your interpreter certification has been verified and approved.',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000), // 3 days ago
            isRead: true,
            actionText: 'View profile',
            linkTo: 'profile',
        },
        {
            id: '6',
            type: 'job',
            subType: 'completed',
            title: 'Job completed successfully',
            description: 'Business meeting interpretation completed. Client rating: 5 stars.',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60000), // 5 days ago
            isRead: true,
            actionText: 'View feedback',
            linkTo: 'job-history',
        },
    ];

    // Initialize data
    useEffect(() => {
        setTimeout(() => {
            setNotifications(mockNotifications);
            setIsLoading(false);
        }, 1500);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, []);

    // Filter notifications based on active filter
    useEffect(() => {
        let filtered = [...notifications];

        switch (activeFilter) {
            case 'unread':
                filtered = notifications.filter(n => !n.isRead);
                break;
            case 'job':
                filtered = notifications.filter(n => n.type === 'job');
                break;
            case 'message':
                filtered = notifications.filter(n => n.type === 'message');
                break;
            case 'payment':
                filtered = notifications.filter(n => n.type === 'payment');
                break;
            default:
                // 'all' - no filtering
                break;
        }

        // Sort by timestamp (newest first)
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setFilteredNotifications(filtered);
    }, [notifications, activeFilter]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => {
            // Simulate API call
            setIsRefreshing(false);
        }, 1000);
    }, []);

    const handleNotificationPress = (notification) => {
        // Mark as read when pressed
        if (!notification.isRead) {
            handleMarkAsRead(notification.id);
        }

        // Navigate to appropriate screen
        console.log(`Navigate to: ${notification.linkTo}`);
        // Add navigation logic here based on notification.linkTo
    };

    const handleMarkAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, isRead: !notification.isRead }
                    : notification
            )
        );
    };

    const handleDeleteNotification = (notificationId) => {
        setNotifications(prev =>
            prev.filter(notification => notification.id !== notificationId)
        );
    };

    const handleClearAll = () => {
        Alert.alert(
            'Clear All Notifications',
            'Are you sure you want to clear all notifications? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: () => {
                        setNotifications([]);
                    }
                },
            ]
        );
    };

    const getHelperText = () => {
        switch (activeFilter) {
            case 'unread':
                return 'Showing only unread notifications. Swipe right on any notification to mark as read or delete.';
            case 'job':
                return 'Job-related notifications including applications, acceptances, and completions.';
            case 'message':
                return 'New messages and communication from clients or support.';
            case 'payment':
                return 'Payment confirmations, cash-out approvals, and financial updates.';
            default:
                return 'Swipe right on notifications to mark as read or delete. Pull down to refresh.';
        }
    };

    const renderNotificationItem = ({ item, index }) => (
        <NotificationCard
            notification={item}
            onPress={handleNotificationPress}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
            index={index}
        />
    );

    return (
        <GestureHandlerRootView style={styles.container}>
            <DynamicHeader
                userType={userType}
                onBack={() => console.log('Navigate back')}
                onProfile={() => console.log('Open profile')}
                unreadCount={unreadCount}
            />

            <FilterSort
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                onClearAll={handleClearAll}
                hasNotifications={notifications.length > 0}
            />

            <HelperText text={getHelperText()} />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {isLoading ? (
                    <LoadingSkeleton />
                ) : filteredNotifications.length > 0 ? (
                    <FlatList
                        data={filteredNotifications}
                        renderItem={renderNotificationItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.notificationsList}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={handleRefresh}
                                colors={[theme.colors.primary]}
                                tintColor={theme.colors.primary}
                            />
                        }
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                    />
                ) : (
                    <EmptyState userType={userType} />
                )}
            </Animated.View>
        </GestureHandlerRootView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    // Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: theme.spacing.sm,
    },
    headerTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
    },
    headerButton: {
        padding: theme.spacing.sm,
    },
    unreadBadge: {
        backgroundColor: theme.colors.error,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.sm,
    },
    unreadBadgeText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
        fontSize: 10,
    },

    // Filter Styles
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    filterScroll: {
        paddingHorizontal: theme.spacing.md,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        marginRight: theme.spacing.sm,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: theme.colors.surfaceLight,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    filterButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterButtonText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },
    filterButtonTextActive: {
        color: theme.colors.text.white,
        fontWeight: '600',
    },
    clearAllButton: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    clearAllText: {
        ...theme.typography.caption,
        color: theme.colors.error,
        fontWeight: '600',
    },

    // Helper Text Styles
    helperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceLight,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    helperText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        flex: 1,
    },

    // Content Styles
    content: {
        flex: 1,
    },
    notificationsList: {
        padding: theme.spacing.md,
    },

    // Notification Card Styles
    notificationCardContainer: {
        marginBottom: theme.spacing.md,
    },
    notificationCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    notificationCardUnread: {
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
    },
    notificationCardContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: theme.spacing.md,
    },
    notificationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    notificationTitleUnread: {
        fontWeight: '600',
    },
    notificationTimestamp: {
        ...theme.typography.small,
        color: theme.colors.text.light,
    },
    notificationDescription: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        lineHeight: 20,
        marginBottom: theme.spacing.sm,
    },
    notificationAction: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    unreadIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary,
        marginLeft: theme.spacing.sm,
        marginTop: theme.spacing.xs,
    },

    // Swipe Actions Styles
    swipeActions: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    swipeButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingHorizontal: theme.spacing.md,
    },
    markReadButton: {
        backgroundColor: theme.colors.secondary,
    },
    deleteButton: {
        backgroundColor: theme.colors.error,
    },
    swipeButtonText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
        marginTop: theme.spacing.xs,
    },

    // Loading Skeleton Styles
    skeletonContainer: {
        padding: theme.spacing.md,
    },
    skeletonCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    skeletonRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    skeletonIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.surfaceLight,
        marginRight: theme.spacing.md,
    },
    skeletonContent: {
        flex: 1,
    },
    skeletonTitle: {
        height: 16,
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: 4,
        marginBottom: theme.spacing.sm,
        width: '80%',
    },
    skeletonText: {
        height: 14,
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: 4,
        marginBottom: theme.spacing.sm,
        width: '60%',
    },
    skeletonTimestamp: {
        height: 12,
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: 4,
        width: '30%',
    },
    skeletonDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.surfaceLight,
        marginLeft: theme.spacing.sm,
    },

    // Empty State Styles
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
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