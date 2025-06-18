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
    ImageBackground,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

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

// Dynamic Header Component (reused from reference)
const DynamicHeader = ({ type = 'home', onBell, onProfile }) => {
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
            <Text style={styles.headerTitle}>LanguageAccess</Text>
            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerButton} onPress={onBell} activeOpacity={0.7}>
                    <Feather name="bell" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton} onPress={onProfile} activeOpacity={0.7}>
                    <Feather name="user" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

// Dynamic Welcome Section with Gradient and Animations
const WelcomeSection = ({ userName = "Sarah" }) => {
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

        // Pulse animation for the icon
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
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    const getLanguageTip = () => {
        const tips = [
            "💡 Tip: Professional interpreters improve communication by 85%",
            "🌟 Pro tip: Book interpreters 24 hours ahead for best availability",
            "🎯 Quick fact: Medical interpretation requires specialized certification",
            "💬 Did you know? Video calls improve accuracy by 30% over audio-only",
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    };

    return (
        <Animated.View
            style={[
                styles.welcomeSection,
                {
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim,
                }
            ]}
        >
            <View style={styles.welcomeGradient}>
                <View style={styles.welcomeContent}>
                    <View style={styles.welcomeHeader}>
                        <View style={styles.welcomeTextContainer}>
                            <Text style={styles.welcomeGreeting}>{getGreeting()},</Text>
                            <Text style={styles.welcomeName}>{userName}! 👋</Text>
                        </View>
                        <Animated.View
                            style={[
                                styles.welcomeIcon,
                                { transform: [{ scale: pulseAnim }] }
                            ]}
                        >
                            <Feather name="globe" size={32} color={theme.colors.text.white} />
                        </Animated.View>
                    </View>

                    <Text style={styles.welcomeSubtitle}>
                        Ready to connect with professional interpreters?
                    </Text>

                    <View style={styles.tipContainer}>
                        <Feather name="lightbulb" size={16} color={theme.colors.accent} />
                        <Text style={styles.tipText}>{getLanguageTip()}</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

// Quick Action Cards with Enhanced Animations
const QuickActionCard = ({ icon, title, subtitle, color, onPress, index }) => {
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
                </View>
                <View style={styles.actionCardContent}>
                    <Text style={styles.actionCardTitle}>{title}</Text>
                    <Text style={styles.actionCardSubtitle}>{subtitle}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.colors.text.light} />
            </TouchableOpacity>
        </Animated.View>
    );
};

// Quick Actions Grid
const QuickActionsSection = ({ onNavigate }) => {
    const actions = [
        {
            icon: 'send',
            title: 'Post a Job',
            subtitle: 'Find the perfect interpreter',
            color: theme.colors.primary,
            action: 'post-job',
        },
        {
            icon: 'users',
            title: 'Find Interpreter',
            subtitle: 'Browse available professionals',
            color: theme.colors.secondary,
            action: 'find-interpreter',
        },
        {
            icon: 'message-square',
            title: 'Messages',
            subtitle: 'Chat with interpreters',
            color: theme.colors.accent,
            action: 'messages',
        },
        {
            icon: 'calendar',
            title: 'My Bookings',
            subtitle: 'Manage scheduled sessions',
            color: theme.colors.success,
            action: 'bookings',
        },
    ];

    return (
        <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
                {actions.map((action, index) => (
                    <QuickActionCard
                        key={action.action}
                        icon={action.icon}
                        title={action.title}
                        subtitle={action.subtitle}
                        color={action.color}
                        index={index}
                        onPress={() => onNavigate(action.action)}
                    />
                ))}
            </View>
        </View>
    );
};

// Featured Interpreters Carousel
const InterpreterCard = ({ interpreter, onMessage, onCall, index }) => {
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
                styles.interpreterCard,
                {
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }],
                }
            ]}
        >
            <View style={styles.interpreterHeader}>
                <View style={styles.interpreterAvatar}>
                    <Feather name="user" size={24} color={theme.colors.text.white} />
                </View>
                <View style={styles.interpreterInfo}>
                    <Text style={styles.interpreterName}>{interpreter.name}</Text>
                    <View style={styles.interpreterRating}>
                        <Feather name="star" size={14} color={theme.colors.accent} />
                        <Text style={styles.ratingText}>{interpreter.rating}</Text>
                        <Text style={styles.reviewCount}>({interpreter.reviews})</Text>
                    </View>
                </View>
                <View style={styles.interpreterPrice}>
                    <Text style={styles.priceText}>${interpreter.price}</Text>
                    <Text style={styles.priceUnit}>/min</Text>
                </View>
            </View>

            <View style={styles.interpreterLanguages}>
                {interpreter.languages.map((lang, idx) => (
                    <View key={idx} style={styles.languageTag}>
                        <Text style={styles.languageText}>{lang}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.interpreterSpecialty}>
                <Feather name="award" size={14} color={theme.colors.text.secondary} />
                <Text style={styles.specialtyText}>{interpreter.specialty}</Text>
            </View>

            <View style={styles.interpreterActions}>
                <TouchableOpacity
                    style={styles.messageButton}
                    onPress={() => onMessage(interpreter)}
                    activeOpacity={0.8}
                >
                    <Feather name="message-circle" size={16} color={theme.colors.primary} />
                    <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => onCall(interpreter)}
                    activeOpacity={0.8}
                >
                    <Feather name="phone" size={16} color={theme.colors.text.white} />
                    <Text style={styles.callButtonText}>Call Now</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

// Featured Interpreters Section
const FeaturedInterpretersSection = ({ onMessage, onCall }) => {
    const interpreters = [
        {
            id: '1',
            name: 'Maria Rodriguez',
            rating: '4.9',
            reviews: '127',
            price: '2.50',
            languages: ['English', 'Spanish'],
            specialty: 'Legal & Medical',
            available: true,
        },
        {
            id: '2',
            name: 'David Chen',
            rating: '4.8',
            reviews: '89',
            price: '3.00',
            languages: ['English', 'Mandarin'],
            specialty: 'Business & Tech',
            available: true,
        },
        {
            id: '3',
            name: 'Fatima Al-Zahra',
            rating: '5.0',
            reviews: '156',
            price: '2.80',
            languages: ['English', 'Arabic'],
            specialty: 'Medical & Academic',
            available: false,
        },
    ];

    const renderInterpreter = ({ item, index }) => (
        <InterpreterCard
            interpreter={item}
            onMessage={onMessage}
            onCall={onCall}
            index={index}
        />
    );

    return (
        <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Interpreters</Text>
                <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7}>
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
                snapToInterval={screenWidth * 0.8 + theme.spacing.md}
                decelerationRate="fast"
            />
        </View>
    );
};

// Language Tips Section
const LanguageTipsSection = () => {
    const [currentTip, setCurrentTip] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const tips = [
        {
            title: "Pre-Session Preparation",
            content: "Share context and documents with your interpreter 24 hours before your session for optimal results.",
            icon: "file-text",
        },
        {
            title: "Cultural Awareness",
            content: "Professional interpreters bridge cultural gaps, not just language barriers. Trust their expertise.",
            icon: "globe",
        },
        {
            title: "Technical Quality",
            content: "Use high-quality headphones and ensure stable internet for the best interpretation experience.",
            icon: "headphones",
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0.3,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start();

            setCurrentTip((prev) => (prev + 1) % tips.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>Pro Tips</Text>
            <Animated.View style={[styles.tipCard, { opacity: fadeAnim }]}>
                <View style={styles.tipIcon}>
                    <Feather name={tips[currentTip].icon} size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.tipContent}>
                    <Text style={styles.tipTitle}>{tips[currentTip].title}</Text>
                    <Text style={styles.tipDescription}>{tips[currentTip].content}</Text>
                </View>
            </Animated.View>
            <View style={styles.tipIndicators}>
                {tips.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.tipIndicator,
                            currentTip === index && styles.tipIndicatorActive
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

// Main Client Home Screen Component
const ClientHomeScreen = () => {
    const scrollY = useRef(new Animated.Value(0)).current;

    const handleNavigation = (action) => {
        console.log(`Navigate to: ${action}`);
        // Add navigation logic here
    };

    const handleInterpreterMessage = (interpreter) => {
        console.log(`Message interpreter: ${interpreter.name}`);
        // Add messaging logic here
    };

    const handleInterpreterCall = (interpreter) => {
        console.log(`Call interpreter: ${interpreter.name}`);
        // Add calling logic here
    };

    const handleNotification = () => {
        console.log('Open notifications');
    };

    const handleProfile = () => {
        console.log('Open profile');
    };

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="home"
                onBell={handleNotification}
                onProfile={handleProfile}
            />

            <Animated.ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <WelcomeSection userName="Sarah" />
                <QuickActionsSection onNavigate={handleNavigation} />
                <FeaturedInterpretersSection
                    onMessage={handleInterpreterMessage}
                    onCall={handleInterpreterCall}
                />
                <LanguageTipsSection />
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

    // Header Styles (reused from reference)
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

    // Welcome Section Styles
    welcomeSection: {
        margin: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    welcomeGradient: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    welcomeContent: {
        padding: theme.spacing.lg,
    },
    welcomeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    welcomeTextContainer: {
        flex: 1,
    },
    welcomeGreeting: {
        ...theme.typography.body,
        color: theme.colors.text.white,
        opacity: 0.9,
    },
    welcomeName: {
        ...theme.typography.h2,
        color: theme.colors.text.white,
        fontWeight: '700',
    },
    welcomeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.white,
        opacity: 0.9,
        marginBottom: theme.spacing.md,
        lineHeight: 24,
    },
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    tipText: {
        ...theme.typography.caption,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.sm,
        flex: 1,
        lineHeight: 20,
    },

    // Quick Actions Section
    quickActionsSection: {
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
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
    },
    actionCardContent: {
        flex: 1,
    },
    actionCardTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    actionCardSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },

    // Featured Interpreters Section
    featuredSection: {
        marginBottom: theme.spacing.lg,
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
    interpretersList: {
        paddingHorizontal: theme.spacing.md,
    },
    interpreterCard: {
        width: screenWidth * 0.8,
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
    interpreterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    interpreterAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    interpreterInfo: {
        flex: 1,
    },
    interpreterName: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    interpreterRating: {
        flexDirection: 'row',
        alignItems: 'center',
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
    interpreterActions: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
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
    callButtonText: {
        ...theme.typography.caption,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.xs,
        fontWeight: '600',
    },

    // Language Tips Section
    tipsSection: {
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.xxl,
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: theme.spacing.md,
    },
    tipIcon: {
        width: 48,
        height: 48,
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    tipDescription: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        lineHeight: 20,
    },
    tipIndicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.border,
        marginHorizontal: 4,
    },
    tipIndicatorActive: {
        backgroundColor: theme.colors.primary,
        width: 24,
    },
});

export default ClientHomeScreen;