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
    Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DynamicHeader from '../Components/DynamicHeader';
import { theme, getHeaderHeight } from '../Components/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced Client Dashboard Section
const ClientDashboardSection = ({ userData, onViewBookings, onViewSpending }) => {
    const slideAnim = useRef(new Animated.Value(-50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
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

        // Pulse animation for active bookings
        if (userData.activeBookings > 0) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
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
    }, [userData.activeBookings]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    const getStatusMessage = () => {
        if (userData.activeBookings > 0) {
            return `🟢 You have ${userData.activeBookings} active booking${userData.activeBookings > 1 ? 's' : ''}`;
        }
        return "💡 Ready to book your next interpretation session?";
    };

    return (
        <Animated.View
            style={[
                styles.dashboardSection,
                {
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim,
                }
            ]}
        >
            <View style={styles.dashboardGradient}>
                <View style={styles.dashboardContent}>
                    <View style={styles.dashboardHeader}>
                        <View style={styles.userInfo}>
                            <Text style={styles.greeting}>{getGreeting()},</Text>
                            <Text style={styles.userName}>{userData.name}! 👋</Text>
                            <Text style={styles.statusMessage}>{getStatusMessage()}</Text>
                        </View>
                        <Animated.View
                            style={[
                                styles.avatarContainer,
                                { transform: [{ scale: pulseAnim }] }
                            ]}
                        >
                            <View style={styles.userAvatar}>
                                <Feather name="user" size={28} color={theme.colors.text.white} />
                            </View>
                            {userData.activeBookings > 0 && (
                                <View style={styles.activeDot} />
                            )}
                        </Animated.View>
                    </View>

                    <View style={styles.statsContainer}>
                        <TouchableOpacity style={styles.statCard} onPress={onViewBookings} activeOpacity={0.8}>
                            <Feather name="calendar" size={20} color={theme.colors.accent} />
                            <Text style={styles.statValue}>{userData.totalBookings}</Text>
                            <Text style={styles.statLabel}>Total Sessions</Text>
                        </TouchableOpacity>

                        <View style={styles.statDivider} />

                        <TouchableOpacity style={styles.statCard} onPress={onViewSpending} activeOpacity={0.8}>
                            <Feather name="dollar-sign" size={20} color={theme.colors.success} />
                            <Text style={styles.statValue}>${userData.totalSpent}</Text>
                            <Text style={styles.statLabel}>Total Spent</Text>
                        </TouchableOpacity>

                        <View style={styles.statDivider} />

                        <View style={styles.statCard}>
                            <Feather name="star" size={20} color={theme.colors.primary} />
                            <Text style={styles.statValue}>{userData.averageRating}</Text>
                            <Text style={styles.statLabel}>Avg Rating</Text>
                        </View>
                    </View>

                    <View style={styles.quickTip}>
                        <Feather name="lightbulb" size={16} color={theme.colors.accent} />
                        <Text style={styles.quickTipText}>
                            💡 Book 24 hours ahead for 15% better interpreter availability
                        </Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

// Enhanced Quick Action Card with Badge Support
const QuickActionCard = ({ icon, title, subtitle, color, badge, onPress, index, urgent = false }) => {
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
                styles.actionCard,
                urgent && styles.urgentActionCard,
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
                style={styles.actionCardButton}
            >
                <View style={[styles.actionCardIcon, { backgroundColor: color }]}>
                    <Feather name={icon} size={24} color={theme.colors.text.white} />
                    {badge && (
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.actionCardContent}>
                    <Text style={[styles.actionCardTitle, urgent && styles.urgentText]}>{title}</Text>
                    <Text style={styles.actionCardSubtitle}>{subtitle}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.colors.text.light} />
            </TouchableOpacity>
        </Animated.View>
    );
};

// Enhanced Quick Actions Grid
const QuickActionsSection = ({ onNavigate, actionData }) => {
    const actions = [
        {
            icon: 'zap',
            title: 'Urgent Booking',
            subtitle: 'Get interpreter in 15 minutes',
            color: theme.colors.error,
            action: 'urgent-booking',
            urgent: true,
        },
        {
            icon: 'send',
            title: 'Post a Job',
            subtitle: 'Find the perfect interpreter',
            color: theme.colors.primary,
            action: 'post-job',
        },
        {
            icon: 'users',
            title: 'Browse Interpreters',
            subtitle: 'View available professionals',
            color: theme.colors.secondary,
            action: 'find-interpreter',
        },
        {
            icon: 'message-square',
            title: 'Messages',
            subtitle: 'Chat with interpreters',
            color: theme.colors.accent,
            action: 'messages',
            badge: actionData.unreadMessages > 0 ? actionData.unreadMessages : null,
        },
        {
            icon: 'calendar',
            title: 'My Bookings',
            subtitle: 'Manage scheduled sessions',
            color: theme.colors.success,
            action: 'bookings',
            badge: actionData.upcomingBookings > 0 ? actionData.upcomingBookings : null,
        },
        {
            icon: 'globe',
            title: 'Service Categories',
            subtitle: 'Browse by specialty',
            color: theme.colors.primary,
            action: 'categories',
        },
    ];

    return (
        <View style={styles.quickActionsSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <TouchableOpacity style={styles.helpButton} activeOpacity={0.7}>
                    <Feather name="help-circle" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>
            <View style={styles.actionsGrid}>
                {actions.map((action, index) => (
                    <QuickActionCard
                        key={action.action}
                        icon={action.icon}
                        title={action.title}
                        subtitle={action.subtitle}
                        color={action.color}
                        badge={action.badge}
                        urgent={action.urgent}
                        index={index}
                        onPress={() => onNavigate(action.action)}
                    />
                ))}
            </View>
        </View>
    );
};

// Enhanced Interpreter Card with Availability and Trust Indicators
const InterpreterCard = ({ interpreter, onMessage, onCall, onInstantBook, index }) => {
    const slideAnim = useRef(new Animated.Value(100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

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

        // Pulse animation for online interpreters
        if (interpreter.available && interpreter.online) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.02,
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
    }, [interpreter.available, interpreter.online]);

    const getAvailabilityStatus = () => {
        if (interpreter.online && interpreter.available) {
            return { text: 'Available now', color: theme.colors.success, icon: 'circle' };
        } else if (interpreter.online && !interpreter.available) {
            return { text: 'Busy', color: theme.colors.warning, icon: 'clock' };
        } else {
            return { text: 'Offline', color: theme.colors.text.light, icon: 'circle' };
        }
    };

    const status = getAvailabilityStatus();

    return (
        <Animated.View
            style={[
                styles.interpreterCard,
                interpreter.online && interpreter.available && styles.availableCard,
                {
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }, { scale: pulseAnim }],
                }
            ]}
        >
            <View style={styles.interpreterHeader}>
                <View style={styles.interpreterAvatarContainer}>
                    <View style={styles.interpreterAvatar}>
                        <Feather name="user" size={24} color={theme.colors.text.white} />
                    </View>
                    <View style={[styles.statusIndicator, { backgroundColor: status.color }]}>
                        <Feather name={status.icon} size={8} color={theme.colors.text.white} />
                    </View>
                    {interpreter.verified && (
                        <View style={styles.verifiedBadge}>
                            <Feather name="check" size={10} color={theme.colors.text.white} />
                        </View>
                    )}
                </View>

                <View style={styles.interpreterInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.interpreterName}>{interpreter.name}</Text>
                        {interpreter.topRated && (
                            <View style={styles.topRatedBadge}>
                                <Feather name="award" size={12} color={theme.colors.accent} />
                            </View>
                        )}
                    </View>
                    <View style={styles.interpreterRating}>
                        <Feather name="star" size={14} color={theme.colors.accent} />
                        <Text style={styles.ratingText}>{interpreter.rating}</Text>
                        <Text style={styles.reviewCount}>({interpreter.reviews})</Text>
                        <View style={styles.statusChip}>
                            <Feather name={status.icon} size={10} color={status.color} />
                            <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.interpreterPrice}>
                    <Text style={styles.priceText}>${interpreter.price}</Text>
                    <Text style={styles.priceUnit}>/min</Text>
                    {interpreter.responseTime && (
                        <Text style={styles.responseTime}>~{interpreter.responseTime}min</Text>
                    )}
                </View>
            </View>

            <View style={styles.interpreterLanguages}>
                {interpreter.languages.slice(0, 3).map((lang, idx) => (
                    <View key={idx} style={styles.languageTag}>
                        <Text style={styles.languageText}>{lang}</Text>
                    </View>
                ))}
                {interpreter.languages.length > 3 && (
                    <View style={styles.moreLanguagesTag}>
                        <Text style={styles.moreLanguagesText}>+{interpreter.languages.length - 3}</Text>
                    </View>
                )}
            </View>

            <View style={styles.interpreterSpecialty}>
                <Feather name="briefcase" size={14} color={theme.colors.text.secondary} />
                <Text style={styles.specialtyText}>{interpreter.specialty}</Text>
                {interpreter.experience && (
                    <>
                        <Text style={styles.experienceDivider}>•</Text>
                        <Text style={styles.experienceText}>{interpreter.experience}y exp</Text>
                    </>
                )}
            </View>

            <View style={styles.interpreterActions}>
                {interpreter.available && interpreter.online ? (
                    <TouchableOpacity
                        style={styles.instantBookButton}
                        onPress={() => onInstantBook(interpreter)}
                        activeOpacity={0.8}
                    >
                        <Feather name="zap" size={16} color={theme.colors.text.white} />
                        <Text style={styles.instantBookText}>Book Now</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.messageButton}
                        onPress={() => onMessage(interpreter)}
                        activeOpacity={0.8}
                    >
                        <Feather name="message-circle" size={16} color={theme.colors.primary} />
                        <Text style={styles.messageButtonText}>Message</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.callButton, !interpreter.available && styles.disabledButton]}
                    onPress={() => onCall(interpreter)}
                    activeOpacity={interpreter.available ? 0.8 : 0.5}
                    disabled={!interpreter.available}
                >
                    <Feather name="phone" size={16} color={theme.colors.text.white} />
                    <Text style={styles.callButtonText}>
                        {interpreter.available ? 'Call' : 'Schedule'}
                    </Text>
                </TouchableOpacity>
            </View>

            {interpreter.lastBookedBy && (
                <View style={styles.trustIndicator}>
                    <Feather name="users" size={12} color={theme.colors.success} />
                    <Text style={styles.trustText}>
                        Last booked by you {interpreter.lastBookedBy}
                    </Text>
                </View>
            )}
        </Animated.View>
    );
};

// Enhanced Featured Interpreters Section
const FeaturedInterpretersSection = ({ onMessage, onCall, onInstantBook, onViewAll }) => {
    const interpreters = [
        {
            id: '1',
            name: 'Maria Rodriguez',
            rating: '4.9',
            reviews: '127',
            price: '2.50',
            languages: ['English', 'Spanish', 'Portuguese'],
            specialty: 'Legal & Medical',
            available: true,
            online: true,
            verified: true,
            topRated: true,
            responseTime: 2,
            experience: 8,
            lastBookedBy: '2 weeks ago',
        },
        {
            id: '2',
            name: 'David Chen',
            rating: '4.8',
            reviews: '89',
            price: '3.00',
            languages: ['English', 'Mandarin', 'Cantonese'],
            specialty: 'Business & Tech',
            available: false,
            online: true,
            verified: true,
            topRated: false,
            responseTime: 5,
            experience: 6,
        },
        {
            id: '3',
            name: 'Fatima Al-Zahra',
            rating: '5.0',
            reviews: '156',
            price: '2.80',
            languages: ['English', 'Arabic', 'French'],
            specialty: 'Medical & Academic',
            available: true,
            online: true,
            verified: true,
            topRated: true,
            responseTime: 1,
            experience: 12,
        },
    ];

    const renderInterpreter = ({ item, index }) => (
        <InterpreterCard
            interpreter={item}
            onMessage={onMessage}
            onCall={onCall}
            onInstantBook={onInstantBook}
            index={index}
        />
    );

    const availableCount = interpreters.filter(i => i.available && i.online).length;

    return (
        <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>Top Interpreters</Text>
                    <View style={styles.availabilityIndicator}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.availabilityText}>{availableCount} available now</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll} activeOpacity={0.7}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <Feather name="arrow-right" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={interpreters}
                renderItem={renderInterpreter}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.interpretersList}
                snapToInterval={screenWidth * 0.85 + theme.spacing.md}
                decelerationRate="fast"
            />
        </View>
    );
};

// Enhanced Client Tips Section with Categories
const ClientTipsSection = ({ onTipPress }) => {
    const [currentCategory, setCurrentCategory] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const tipCategories = [
        {
            title: "Getting Started",
            icon: "play-circle",
            tips: [
                {
                    title: "How to book your first interpretation session",
                    content: "Step-by-step guide to finding and booking the perfect interpreter for your needs.",
                    readTime: 3,
                },
                {
                    title: "Understanding pricing and payment",
                    content: "Learn about our transparent pricing model and flexible payment options.",
                    readTime: 4,
                },
            ]
        },
        {
            title: "Best Practices",
            icon: "award",
            tips: [
                {
                    title: "Preparing for your interpretation session",
                    content: "Tips to ensure smooth communication and maximum value from your session.",
                    readTime: 5,
                },
                {
                    title: "Working effectively with interpreters",
                    content: "Best practices for building productive relationships with professional interpreters.",
                    readTime: 6,
                },
            ]
        },
        {
            title: "Technology",
            icon: "smartphone",
            tips: [
                {
                    title: "Optimizing your setup for video calls",
                    content: "Technical recommendations for crystal-clear interpretation sessions.",
                    readTime: 4,
                },
                {
                    title: "Using our mobile app features",
                    content: "Discover powerful features that enhance your interpretation experience.",
                    readTime: 3,
                },
            ]
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0.7,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start();

            setCurrentCategory((prev) => (prev + 1) % tipCategories.length);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    const currentTips = tipCategories[currentCategory];

    return (
        <View style={styles.tipsSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Client Resources</Text>
                <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <Feather name="arrow-right" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.categoryTabs}>
                {tipCategories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.categoryTab,
                            currentCategory === index && styles.activeCategoryTab
                        ]}
                        onPress={() => setCurrentCategory(index)}
                        activeOpacity={0.7}
                    >
                        <Feather
                            name={category.icon}
                            size={16}
                            color={currentCategory === index ? theme.colors.primary : theme.colors.text.secondary}
                        />
                        <Text style={[
                            styles.categoryTabText,
                            currentCategory === index && styles.activeCategoryTabText
                        ]}>
                            {category.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Animated.View style={[styles.tipsContainer, { opacity: fadeAnim }]}>
                {currentTips.tips.map((tip, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.tipCard}
                        onPress={() => onTipPress(tip)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.tipHeader}>
                            <Feather name="book-open" size={16} color={theme.colors.primary} />
                            <Text style={styles.tipReadTime}>{tip.readTime} min read</Text>
                        </View>
                        <Text style={styles.tipTitle}>{tip.title}</Text>
                        <Text style={styles.tipContent}>{tip.content}</Text>
                        <View style={styles.tipFooter}>
                            <Text style={styles.learnMoreText}>Learn more</Text>
                            <Feather name="arrow-right" size={14} color={theme.colors.primary} />
                        </View>
                    </TouchableOpacity>
                ))}
            </Animated.View>

            <View style={styles.categoryIndicators}>
                {tipCategories.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.categoryIndicator,
                            currentCategory === index && styles.activeCategoryIndicator
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

// Comprehensive Enhanced Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    // Scroll View
    scrollView: {
        flex: 1,
    },

    // Client Dashboard Section
    dashboardSection: {
        margin: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    dashboardGradient: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    dashboardContent: {
        padding: theme.spacing.lg,
    },
    dashboardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.lg,
    },
    userInfo: {
        flex: 1,
    },
    greeting: {
        ...theme.typography.body,
        color: theme.colors.text.white,
        opacity: 0.9,
    },
    userName: {
        ...theme.typography.h2,
        color: theme.colors.text.white,
        fontWeight: '700',
        marginBottom: theme.spacing.xs,
    },
    statusMessage: {
        ...theme.typography.caption,
        color: theme.colors.text.white,
        opacity: 0.9,
    },
    avatarContainer: {
        position: 'relative',
    },
    userAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeDot: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: theme.colors.success,
        borderWidth: 3,
        borderColor: theme.colors.primary,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        ...theme.typography.h3,
        color: theme.colors.text.white,
        fontWeight: '700',
        marginTop: theme.spacing.xs,
    },
    statLabel: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        opacity: 0.8,
        marginTop: theme.spacing.xs,
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: theme.spacing.sm,
    },
    quickTip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    quickTipText: {
        ...theme.typography.caption,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.sm,
        flex: 1,
        lineHeight: 20,
    },

    // Section Headers
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    sectionTitleContainer: {
        flex: 1,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    availabilityIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.success,
        marginRight: theme.spacing.xs,
    },
    availabilityText: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        marginRight: theme.spacing.xs,
        fontWeight: '600',
    },
    helpButton: {
        padding: theme.spacing.xs,
    },

    // Quick Actions Section
    quickActionsSection: {
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    actionsGrid: {
        gap: theme.spacing.md,
    },
    actionCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    urgentActionCard: {
        borderWidth: 2,
        borderColor: theme.colors.error,
        shadowColor: theme.colors.error,
        shadowOpacity: 0.2,
    },
    actionCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    actionCardIcon: {
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
    actionCardContent: {
        flex: 1,
    },
    actionCardTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    urgentText: {
        color: theme.colors.error,
        fontWeight: '600',
    },
    actionCardSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },

    // Featured Interpreters Section
    featuredSection: {
        marginBottom: theme.spacing.lg,
    },
    interpretersList: {
        paddingHorizontal: theme.spacing.md,
    },
    interpreterCard: {
        width: screenWidth * 0.85,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginRight: theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    availableCard: {
        borderWidth: 1,
        borderColor: theme.colors.success,
        shadowColor: theme.colors.success,
        shadowOpacity: 0.15,
    },
    interpreterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    interpreterAvatarContainer: {
        position: 'relative',
        marginRight: theme.spacing.md,
    },
    interpreterAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusIndicator: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    verifiedBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.success,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    interpreterInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    interpreterName: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        flex: 1,
    },
    topRatedBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.xs,
    },
    interpreterRating: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    ratingText: {
        ...theme.typography.caption,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.xs,
        fontWeight: '600',
    },
    reviewCount: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
        marginRight: theme.spacing.sm,
    },
    statusChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceLight,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.sm,
    },
    statusText: {
        ...theme.typography.small,
        marginLeft: theme.spacing.xs,
        fontWeight: '600',
    },
    interpreterPrice: {
        alignItems: 'flex-end',
    },
    priceText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.primary,
        fontWeight: '700',
    },
    priceUnit: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
    },
    responseTime: {
        ...theme.typography.small,
        color: theme.colors.success,
        fontWeight: '600',
    },
    interpreterLanguages: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: theme.spacing.md,
    },
    languageTag: {
        backgroundColor: theme.colors.surfaceLight,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        marginRight: theme.spacing.sm,
        marginBottom: theme.spacing.xs,
    },
    languageText: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
    },
    moreLanguagesTag: {
        backgroundColor: theme.colors.primary + '20',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        marginRight: theme.spacing.sm,
        marginBottom: theme.spacing.xs,
    },
    moreLanguagesText: {
        ...theme.typography.small,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    interpreterSpecialty: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    specialtyText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },
    experienceDivider: {
        ...theme.typography.caption,
        color: theme.colors.text.light,
        marginHorizontal: theme.spacing.xs,
    },
    experienceText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        fontWeight: '600',
    },
    interpreterActions: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
    },
    instantBookButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.success,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
    },
    instantBookText: {
        ...theme.typography.caption,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.xs,
        fontWeight: '600',
    },
    messageButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceLight,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    messageButtonText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        marginLeft: theme.spacing.xs,
        fontWeight: '600',
    },
    callButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
    },
    disabledButton: {
        backgroundColor: theme.colors.text.light,
    },
    callButtonText: {
        ...theme.typography.caption,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.xs,
        fontWeight: '600',
    },
    trustIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.success + '10',
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
    },
    trustText: {
        ...theme.typography.small,
        color: theme.colors.success,
        marginLeft: theme.spacing.xs,
        fontWeight: '600',
    },

    // Tips Section
    tipsSection: {
        paddingHorizontal: theme.spacing.md,
        marginBottom: 170,
    },
    categoryTabs: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xs,
    },
    categoryTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xs,
        borderRadius: theme.borderRadius.md,
    },
    activeCategoryTab: {
        backgroundColor: theme.colors.surface,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryTabText: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
        fontWeight: '600',
    },
    activeCategoryTabText: {
        color: theme.colors.primary,
    },
    tipsContainer: {
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    tipCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    tipReadTime: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
    },
    tipTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
        lineHeight: 22,
    },
    tipContent: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        lineHeight: 20,
        marginBottom: theme.spacing.md,
    },
    tipFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    learnMoreText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    categoryIndicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    categoryIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.border,
    },
    activeCategoryIndicator: {
        backgroundColor: theme.colors.primary,
        width: 24,
    },
});

// Main Enhanced Client Home Screen Component
const ClientHomeScreen = ({ navigation }) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [refreshing, setRefreshing] = useState(false);

    // Mock user data
    const userData = {
        name: 'Sarah',
        activeBookings: 1,
        totalBookings: 47,
        totalSpent: 1247.50,
        averageRating: 4.8,
    };

    // Mock action data
    const actionData = {
        unreadMessages: 3,
        upcomingBookings: 2,
    };

    const handleNavigation = (action) => {
        console.log(`Navigate to: ${action}`);
        switch (action) {
            case 'urgent-booking':
                // Navigate to urgent booking flow
                navigation.navigate('PostJob', { urgent: true });
                break;
            case 'post-job':
                navigation.navigate('PostJob');
                break;
            case 'find-interpreter':
                navigation.navigate('FindInterpreter');
                break;
            case 'messages':
                navigation.navigate('Messages');
                break;
            case 'bookings':
                // Navigate to bookings management
                navigation.navigate('ClientProfile', { screen: 'callHistory' });
                break;
            case 'categories':
                // Navigate to service categories
                navigation.navigate('FindInterpreter', { showCategories: true });
                break;
            default:
                break;
        }
    };

    const handleViewBookings = () => {
        console.log('View bookings');
        navigation.navigate('ClientProfile', { screen: 'callHistory' });
    };

    const handleViewSpending = () => {
        console.log('View spending history');
        navigation.navigate('ClientProfile', { screen: 'paymentHistory' });
    };

    const handleInterpreterMessage = (interpreter) => {
        console.log(`Message interpreter: ${interpreter.name}`);
        navigation.navigate('Messages', { interpreterId: interpreter.id });
    };

    const handleInterpreterCall = (interpreter) => {
        console.log(`Call interpreter: ${interpreter.name}`);
        // Navigate to call screen or booking flow
        navigation.navigate('PostJob', { interpreterId: interpreter.id });
    };

    const handleInstantBook = (interpreter) => {
        console.log(`Instant book: ${interpreter.name}`);
        navigation.navigate('PostJob', {
            interpreterId: interpreter.id,
            instantBook: true
        });
    };

    const handleViewAllInterpreters = () => {
        console.log('View all interpreters');
        navigation.navigate('FindInterpreter');
    };

    const handleTipPress = (tip) => {
        console.log(`Open tip: ${tip.title}`);
        // Navigate to tip detail or web view
        // Could navigate to a help/tips screen
    };

    const handleNotification = () => {
        console.log('Open notifications');
        navigation.navigate('Notifications');
    };

    const handleProfile = () => {
        console.log('Open profile');
        navigation.navigate('ClientProfile');
    };

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="home"
                title="LanguageAccess"
                onBell={handleNotification}
                onProfile={handleProfile}
                showBell={true}
                showProfile={true}
            />

            <Animated.ScrollView
                style={[styles.scrollView, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                refreshing={refreshing}
                onRefresh={onRefresh}
            >
                <ClientDashboardSection
                    userData={userData}
                    onViewBookings={handleViewBookings}
                    onViewSpending={handleViewSpending}
                />
                <QuickActionsSection
                    onNavigate={handleNavigation}
                    actionData={actionData}
                />
                <FeaturedInterpretersSection
                    onMessage={handleInterpreterMessage}
                    onCall={handleInterpreterCall}
                    onInstantBook={handleInstantBook}
                    onViewAll={handleViewAllInterpreters}
                />
                <ClientTipsSection onTipPress={handleTipPress} />
            </Animated.ScrollView>
        </View>
    );
};

export default ClientHomeScreen;