import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    StyleSheet,
    Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from './theme';

const { width: screenWidth } = Dimensions.get('window');

// Safe area inset fallback
const getSafeAreaInsets = () => {
    return {
        bottom: Platform.OS === 'ios' ? 20 : 0, // Fallback for iPhone home indicator
        top: Platform.OS === 'ios' ? 44 : 24, // Status bar height
    };
};

const BottomNavBar = ({
    navigation,
    activeTab = 'Home',
    userRole = 'client',
    onTabPress = null
}) => {
    const insets = getSafeAreaInsets();
    const [pressedTab, setPressedTab] = useState(null);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnims = useRef({}).current;

    // Tab configurations for different user roles
    const tabConfigs = {
        client: [
            {
                id: 'Home',
                label: 'Home',
                icon: 'home',
                screen: 'ClientHome',
                color: theme.colors.primary,
            },
            {
                id: 'Messages',
                label: 'Messages',
                icon: 'message-circle',
                screen: 'Messages',
                color: theme.colors.secondary,
                badge: true, // For unread messages
            },
            {
                id: 'FindInterpreter',
                label: 'Find',
                icon: 'search',
                screen: 'FindInterpreter',
                color: theme.colors.accent,
            },
            {
                id: 'PostJob',
                label: 'Post Job',
                icon: 'plus-circle',
                screen: 'PostJob',
                color: theme.colors.success,
            },
        ],
        interpreter: [
            {
                id: 'Home',
                label: 'Home',
                icon: 'home',
                screen: 'InterpreterHome',
                color: theme.colors.primary,
            },
            {
                id: 'Messages',
                label: 'Messages',
                icon: 'message-circle',
                screen: 'Messages',
                color: theme.colors.secondary,
                badge: true,
            },
            {
                id: 'FindInterpreter',
                label: 'Browse',
                icon: 'users',
                screen: 'FindInterpreter',
                color: theme.colors.accent,
            },
            {
                id: 'JobListings',
                label: 'Jobs',
                icon: 'briefcase',
                screen: 'InterpreterJobListing',
                color: theme.colors.success,
                badge: true, // For new job postings
            },
        ],
    };

    const tabs = tabConfigs[userRole] || tabConfigs.client;

    // Initialize scale animations for each tab
    useEffect(() => {
        tabs.forEach((tab) => {
            if (!scaleAnims[tab.id]) {
                scaleAnims[tab.id] = new Animated.Value(activeTab === tab.id ? 1.1 : 1);
            }
        });
    }, [tabs, activeTab]);

    // Entrance animation
    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: false,
        }).start();
    }, []);

    // Active tab animation
    useEffect(() => {
        tabs.forEach((tab) => {
            if (scaleAnims[tab.id]) {
                Animated.spring(scaleAnims[tab.id], {
                    toValue: activeTab === tab.id ? 1.1 : 1,
                    tension: 150,
                    friction: 8,
                    useNativeDriver: false,
                }).start();
            }
        });
    }, [activeTab, tabs]);

    const handleTabPress = (tab) => {
        // Prevent double-tap on active tab
        if (activeTab === tab.id) return;

        // Custom tab press handler if provided
        if (onTabPress) {
            onTabPress(tab);
            return;
        }

        // Default navigation
        try {
            if (tab.screen) {
                navigation.navigate(tab.screen);
            }
        } catch (error) {
            console.warn(`Navigation failed for ${tab.screen}:`, error);
        }
    };

    const handleTabPressIn = (tabId) => {
        setPressedTab(tabId);
        if (scaleAnims[tabId]) {
            Animated.spring(scaleAnims[tabId], {
                toValue: 0.95,
                tension: 300,
                friction: 8,
                useNativeDriver: false,
            }).start();
        }
    };

    const handleTabPressOut = (tabId) => {
        setPressedTab(null);
        if (scaleAnims[tabId]) {
            Animated.spring(scaleAnims[tabId], {
                toValue: activeTab === tabId ? 1.1 : 1,
                tension: 150,
                friction: 8,
                useNativeDriver: false,
            }).start();
        }
    };

    const getBadgeCount = (tabId) => {
        // In a real app, this would come from state/context
        // For now, return mock data for demonstration
        switch (tabId) {
            case 'Messages':
                return 3; // Unread messages
            case 'JobListings':
                return 5; // New job postings
            default:
                return 0;
        }
    };

    const renderTab = (tab, index) => {
        const isActive = activeTab === tab.id;
        const isPressed = pressedTab === tab.id;
        const badgeCount = getBadgeCount(tab.id);
        const showBadge = tab.badge && badgeCount > 0;

        // Role-specific active color
        const activeColor = userRole === 'client'
            ? theme.colors.primary
            : theme.colors.secondary;

        return (
            <Animated.View
                key={tab.id}
                style={[
                    styles.tabContainer,
                    {
                        transform: [
                            { scale: scaleAnims[tab.id] || 1 }
                        ]
                    }
                ]}
            >
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        isActive && styles.tabButtonActive,
                        isPressed && styles.tabButtonPressed,
                    ]}
                    onPress={() => handleTabPress(tab)}
                    onPressIn={() => handleTabPressIn(tab.id)}
                    onPressOut={() => handleTabPressOut(tab.id)}
                    activeOpacity={0.9}
                    accessibilityLabel={`${tab.label} tab`}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: isActive }}
                >
                    {/* Tab Icon */}
                    <View style={styles.tabIconContainer}>
                        <Feather
                            name={tab.icon}
                            size={isActive ? 24 : 22}
                            color={isActive ? activeColor : theme.colors.text.secondary}
                            style={[
                                styles.tabIcon,
                                isActive && { transform: [{ translateY: -1 }] }
                            ]}
                        />

                        {/* Badge */}
                        {showBadge && (
                            <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                                <Text style={styles.badgeText}>
                                    {badgeCount > 99 ? '99+' : badgeCount}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Tab Label */}
                    <Text
                        style={[
                            styles.tabLabel,
                            isActive && styles.tabLabelActive,
                            { color: isActive ? activeColor : theme.colors.text.secondary }
                        ]}
                        numberOfLines={1}
                    >
                        {tab.label}
                    </Text>

                    {/* Active Indicator */}
                    {isActive && (
                        <View style={[styles.activeIndicator, { backgroundColor: activeColor }]} />
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    paddingBottom: Math.max(insets.bottom, theme.spacing.sm),
                    transform: [{
                        translateY: slideAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [100, 0],
                        })
                    }],
                }
            ]}
        >
            {/* Background Blur Effect */}
            <View style={styles.backgroundBlur} />

            {/* Navigation Tabs */}
            <View style={styles.tabsContainer}>
                {tabs.map((tab, index) => renderTab(tab, index))}
            </View>

            {/* Role Indicator */}
            <View style={styles.roleIndicator}>
                <View style={[
                    styles.roleIndicatorDot,
                    { backgroundColor: userRole === 'client' ? theme.colors.primary : theme.colors.secondary }
                ]} />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        ...Platform.select({
            ios: {
                shadowColor: theme.colors.shadow,
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 16,
            },
        }),
    },
    backgroundBlur: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.surface,
        opacity: 0.98,
    },
    tabsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xs,
        minHeight: 65,
    },
    tabContainer: {
        flex: 1,
        alignItems: 'center',
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xs,
        borderRadius: theme.borderRadius.md,
        minHeight: 50,
        position: 'relative',
        minWidth: 60,
    },
    tabButtonActive: {
        backgroundColor: theme.colors.surfaceLight,
    },
    tabButtonPressed: {
        backgroundColor: theme.colors.border,
    },
    tabIconContainer: {
        position: 'relative',
        marginBottom: theme.spacing.xs,
    },
    tabIcon: {
        // Icon styles handled by Feather component
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -6,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    badgeText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontSize: 10,
        fontWeight: '600',
        lineHeight: 12,
    },
    tabLabel: {
        ...theme.typography.small,
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 2,
    },
    tabLabelActive: {
        fontWeight: '600',
        fontSize: 12,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        marginLeft: -12,
        width: 24,
        height: 3,
        borderRadius: 2,
    },
    roleIndicator: {
        position: 'absolute',
        top: 4,
        right: theme.spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    roleIndicatorDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        opacity: 0.6,
    },
});

export default BottomNavBar;