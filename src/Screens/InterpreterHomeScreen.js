import React, { useState, useEffect, useRef } from 'react';
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
    Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DynamicHeader from '../Components/DynamicHeader';
import { theme, getHeaderHeight } from '../Components/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Interpreter Profile Snapshot Section
const ProfileSnapshotSection = ({ interpreterData, isOnline, onToggleOnline, onManageProfile }) => {
    const slideAnim = useRef(new Animated.Value(-50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Welcome animation sequence
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: false,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: false,
            }),
        ]).start();

        // Pulse animation for online status
        if (isOnline) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 2000,
                        useNativeDriver: false,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        }
    }, [isOnline]);

    const getStatusMessage = () => {
        return isOnline
            ? "🟢 You're online and visible to clients"
            : "🔴 You're offline - toggle on to receive jobs";
    };

    return (
        <Animated.View
            style={[
                styles.profileSection,
                {
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim,
                }
            ]}
        >
            <View style={styles.profileGradient}>
                <View style={styles.profileContent}>
                    <View style={styles.profileHeader}>
                        <View style={styles.profileAvatarContainer}>
                            <Animated.View
                                style={[
                                    styles.profileAvatar,
                                    isOnline && styles.profileAvatarOnline,
                                    { transform: [{ scale: pulseAnim }] }
                                ]}
                            >
                                <Feather name="user" size={32} color={theme.colors.text.white} />
                            </Animated.View>
                            <View style={[styles.statusDot, isOnline ? styles.statusDotOnline : styles.statusDotOffline]} />
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{interpreterData.name}</Text>
                            <View style={styles.profileStats}>
                                <View style={styles.statItem}>
                                    <Feather name="star" size={14} color={theme.colors.accent} />
                                    <Text style={styles.statText}>{interpreterData.rating}</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Feather name="zap" size={14} color={theme.colors.success} />
                                    <Text style={styles.statText}>{interpreterData.responseRate}%</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Feather name="briefcase" size={14} color={theme.colors.secondary} />
                                    <Text style={styles.statText}>{interpreterData.completedJobs}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.onlineToggleContainer}>
                        <View style={styles.toggleInfo}>
                            <Text style={styles.toggleLabel}>Available for Jobs</Text>
                            <Text style={styles.toggleStatus}>{getStatusMessage()}</Text>
                        </View>
                        <Switch
                            value={isOnline}
                            onValueChange={onToggleOnline}
                            trackColor={{ false: '#767577', true: theme.colors.success }}
                            thumbColor={isOnline ? theme.colors.text.white : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.profileActions}>
                        <TouchableOpacity
                            style={styles.manageProfileButton}
                            onPress={onManageProfile}
                            activeOpacity={0.8}
                        >
                            <Feather name="edit-3" size={16} color={theme.colors.primary} />
                            <Text style={styles.manageProfileText}>Manage Profile</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.helperTip}>
                        <Feather name="info" size={14} color={theme.colors.accent} />
                        <Text style={styles.helperText}>
                            Response rate helps clients trust your availability. Keep it high by replying quickly.
                        </Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

// Quick Navigation Card Component
const NavigationCard = ({ icon, title, subtitle, color, badge, onPress, index }) => {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 600,
                delay: index * 150,
                useNativeDriver: false,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                delay: index * 150,
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

    return (
        <Animated.View
            style={[
                styles.navigationCard,
                {
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }],
                }
            ]}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={styles.navigationCardButton}
            >
                <View style={[styles.navigationCardIcon, { backgroundColor: color }]}>
                    <Feather name={icon} size={24} color={theme.colors.text.white} />
                    {badge && (
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.navigationCardContent}>
                    <Text style={styles.navigationCardTitle}>{title}</Text>
                    <Text style={styles.navigationCardSubtitle}>{subtitle}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.colors.text.light} />
            </TouchableOpacity>
        </Animated.View>
    );
};

// Quick Navigation Section
const QuickNavigationSection = ({ onNavigate, jobsData }) => {
    const actions = [
        {
            icon: 'search',
            title: 'View Job Listings',
            subtitle: `${jobsData.availableJobs} new jobs available`,
            color: theme.colors.primary,
            action: 'InterpreterJobListing',
            badge: jobsData.availableJobs > 0 ? jobsData.availableJobs : null,
        },
        {
            icon: 'dollar-sign',
            title: 'Cash Out Earnings',
            subtitle: `$${jobsData.availableEarnings} ready to withdraw`,
            color: theme.colors.success,
            action: 'CashOut',
        },
        {
            icon: 'trending-up',
            title: 'Earnings History',
            subtitle: `$${jobsData.totalEarnings} earned this month`,
            color: theme.colors.accent,
            action: 'Earnings',
        },
        {
            icon: 'settings',
            title: 'Call Rates',
            subtitle: 'Manage your hourly rates',
            color: theme.colors.secondary,
            action: 'CallRate',
        },
    ];

    return (
        <View style={styles.quickNavigationSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.navigationGrid}>
                {actions.map((action, index) => (
                    <NavigationCard
                        key={action.action}
                        icon={action.icon}
                        title={action.title}
                        subtitle={action.subtitle}
                        color={action.color}
                        badge={action.badge}
                        index={index}
                        onPress={() => onNavigate(action.action)}
                    />
                ))}
            </View>
        </View>
    );
};

// Blog/Tips Card Component
const TipCard = ({ tip, onPress, index }) => {
    const slideAnim = useRef(new Animated.Value(100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                delay: index * 100,
                useNativeDriver: false,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: false,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.tipCard,
                {
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }],
                }
            ]}
        >
            <TouchableOpacity
                onPress={() => onPress(tip)}
                activeOpacity={0.8}
                style={styles.tipCardContent}
            >
                <View style={styles.tipHeader}>
                    <View style={[styles.tipCategoryBadge, { backgroundColor: tip.categoryColor }]}>
                        <Feather name={tip.icon} size={16} color={theme.colors.text.white} />
                    </View>
                    <Text style={styles.tipCategory}>{tip.category}</Text>
                    <Text style={styles.tipReadTime}>{tip.readTime} min read</Text>
                </View>

                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipPreview}>{tip.preview}</Text>

                <View style={styles.tipFooter}>
                    <Text style={styles.tipDate}>{tip.date}</Text>
                    <Feather name="arrow-right" size={16} color={theme.colors.primary} />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Tips/Blog Section
const TipsSection = ({ onTipPress }) => {
    const tips = [
        {
            id: '1',
            title: 'How to increase your earnings on LanguageAccess',
            preview: 'Learn proven strategies to boost your hourly rate and attract premium clients...',
            category: 'Earnings',
            categoryColor: theme.colors.success,
            icon: 'trending-up',
            readTime: 5,
            date: '2 days ago',
        },
        {
            id: '2',
            title: 'What makes a great interpretation experience for clients',
            preview: 'Master the art of professional interpretation with these essential tips...',
            category: 'Best Practices',
            categoryColor: theme.colors.primary,
            icon: 'award',
            readTime: 7,
            date: '1 week ago',
        },
        {
            id: '3',
            title: 'Technical setup guide for video interpretations',
            preview: 'Ensure crystal-clear communication with the right equipment and setup...',
            category: 'Technology',
            categoryColor: theme.colors.secondary,
            icon: 'video',
            readTime: 4,
            date: '2 weeks ago',
        },
        {
            id: '4',
            title: 'Building long-term client relationships',
            preview: 'Turn one-time jobs into recurring business with these relationship strategies...',
            category: 'Client Relations',
            categoryColor: theme.colors.accent,
            icon: 'users',
            readTime: 6,
            date: '3 weeks ago',
        },
    ];

    const renderTip = ({ item, index }) => (
        <TipCard
            tip={item}
            onPress={onTipPress}
            index={index}
        />
    );

    return (
        <View style={styles.tipsSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Professional Tips & Resources</Text>
                <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <Feather name="arrow-right" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={tips}
                renderItem={renderTip}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tipsList}
                snapToInterval={screenWidth * 0.85 + theme.spacing.md}
                decelerationRate="fast"
            />
        </View>
    );
};

// Main Interpreter Home Screen Component
const InterpreterHomeScreen = ({ navigation }) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [isOnline, setIsOnline] = useState(true);

    // Mock interpreter data
    const interpreterData = {
        name: 'Maria Rodriguez',
        rating: '4.9',
        responseRate: 98,
        completedJobs: 247,
        avatar: null, // Would be image URL in real app
    };

    // Mock jobs/earnings data
    const jobsData = {
        availableJobs: 12,
        availableEarnings: 1247.50,
        completedJobs: 247,
        totalEarnings: 3892.75,
    };

    const handleNavigation = (screenName) => {
        console.log(`Navigate to: ${screenName}`);
        navigation.navigate(screenName);
    };

    const handleToggleOnline = (value) => {
        setIsOnline(value);
        // Add API call to update online status
        console.log(`Online status changed to: ${value}`);
    };

    const handleManageProfile = () => {
        console.log('Navigate to profile management');
        navigation.navigate('InterpreterProfile');
    };

    const handleTipPress = (tip) => {
        console.log(`Open tip: ${tip.title}`);
        // Navigate to tip detail or open in web view
    };

    const handleNotification = () => {
        console.log('Open notifications');
        navigation.navigate('Notifications');
    };

    const handleProfile = () => {
        console.log('Open profile menu');
        navigation.navigate('InterpreterProfile');
    };

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="home"
                title="LanguageAccess Pro"
                showBell={true}
                showProfile={true}
                onBell={handleNotification}
                onProfile={handleProfile}
            />

            <Animated.ScrollView
                style={[styles.scrollView, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <ProfileSnapshotSection
                    interpreterData={interpreterData}
                    isOnline={isOnline}
                    onToggleOnline={handleToggleOnline}
                    onManageProfile={handleManageProfile}
                />
                <QuickNavigationSection
                    onNavigate={handleNavigation}
                    jobsData={jobsData}
                />
                <TipsSection onTipPress={handleTipPress} />
            </Animated.ScrollView>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    // Header Styles (reused from ClientHomeScreen)
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
    headerTitle: {
        ...theme.typography.h3,
        color: theme.colors.primary,
        fontWeight: '700',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: theme.spacing.sm,
        marginLeft: theme.spacing.sm,
    },

    // Scroll View
    scrollView: {
        flex: 1,
    },

    // Profile Snapshot Section Styles
    profileSection: {
        margin: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    profileGradient: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    profileContent: {
        padding: theme.spacing.lg,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    profileAvatarContainer: {
        position: 'relative',
        marginRight: theme.spacing.md,
    },
    profileAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileAvatarOnline: {
        borderWidth: 3,
        borderColor: theme.colors.success,
    },
    statusDot: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    statusDotOnline: {
        backgroundColor: theme.colors.success,
    },
    statusDotOffline: {
        backgroundColor: theme.colors.text.light,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    profileStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        ...theme.typography.caption,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.xs,
        fontWeight: '600',
    },
    statDivider: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.text.light,
        marginHorizontal: theme.spacing.sm,
    },
    onlineToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surfaceLight,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
    },
    toggleInfo: {
        flex: 1,
    },
    toggleLabel: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    toggleStatus: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    profileActions: {
        marginBottom: theme.spacing.md,
    },
    manageProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceLight,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    manageProfileText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.primary,
        marginLeft: theme.spacing.sm,
        fontWeight: '600',
    },
    helperTip: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: theme.colors.accent + '10',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.accent,
    },
    helperText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        flex: 1,
        lineHeight: 20,
    },

    // Quick Navigation Section
    quickNavigationSection: {
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    navigationGrid: {
        gap: theme.spacing.md,
    },
    navigationCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    navigationCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    navigationCardIcon: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
        position: 'relative',
    },
    badgeContainer: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: theme.colors.error,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    badgeText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
        fontSize: 10,
    },
    navigationCardContent: {
        flex: 1,
    },
    navigationCardTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    navigationCardSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },

    // Tips Section
    tipsSection: {
        marginBottom: theme.spacing.xxl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        marginRight: theme.spacing.xs,
    },
    tipsList: {
        paddingHorizontal: theme.spacing.md,
    },
    tipCard: {
        width: screenWidth * 0.85,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        marginRight: theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    tipCardContent: {
        padding: theme.spacing.md,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    tipCategoryBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.sm,
    },
    tipCategory: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        fontWeight: '600',
        flex: 1,
    },
    tipReadTime: {
        ...theme.typography.small,
        color: theme.colors.text.light,
    },
    tipTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
        lineHeight: 22,
    },
    tipPreview: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        lineHeight: 20,
        marginBottom: theme.spacing.md,
    },
    tipFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tipDate: {
        ...theme.typography.small,
        color: theme.colors.text.light,
    },
});

export default InterpreterHomeScreen;