import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../Components/theme';
import RoleCard from '../Components/RoleCard';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RoleSelectionScreen = ({ navigation }) => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [showContinueButton, setShowContinueButton] = useState(false);

    // Animation values
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const headerSlide = useRef(new Animated.Value(-30)).current;
    const continueButtonScale = useRef(new Animated.Value(0)).current;
    const continueButtonOpacity = useRef(new Animated.Value(0)).current;
    const backgroundColorAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Header entrance animation
        Animated.parallel([
            Animated.timing(headerOpacity, {
                toValue: 1,
                duration: theme.animations.slow,
                delay: 200,
                useNativeDriver: false,
            }),
            Animated.spring(headerSlide, {
                toValue: 0,
                ...theme.animations.spring,
                delay: 200,
                useNativeDriver: false,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        if (selectedRole) {
            setShowContinueButton(true);

            // Background color animation based on role
            Animated.timing(backgroundColorAnim, {
                toValue: selectedRole === 'client' ? 0 : 1,
                duration: theme.animations.slow,
                useNativeDriver: false,
            }).start();

            // Continue button animation
            Animated.parallel([
                Animated.spring(continueButtonScale, {
                    toValue: 1,
                    ...theme.animations.spring,
                    useNativeDriver: false,
                }),
                Animated.timing(continueButtonOpacity, {
                    toValue: 1,
                    duration: theme.animations.normal,
                    useNativeDriver: false,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(continueButtonScale, {
                    toValue: 0,
                    duration: theme.animations.fast,
                    useNativeDriver: false,
                }),
                Animated.timing(continueButtonOpacity, {
                    toValue: 0,
                    duration: theme.animations.fast,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                setShowContinueButton(false);
            });
        }
    }, [selectedRole]);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const handleContinue = () => {
        // Store the selected role and navigate to login
        navigation.navigate('Login', { userRole: selectedRole });
    };

    const roleData = [
        {
            id: 'client',
            icon: 'users',
            title: 'I need an Interpreter',
            subtitle: 'Client Portal',
            description: 'Connect with professional interpreters for your business meetings, medical appointments, legal consultations, and more.',
            gradient: theme.colors.client.gradient,
            features: [
                'Post interpretation requests instantly',
                'Browse certified interpreters by specialty',
                'Schedule sessions in advance',
                'Video, audio & in-person options',
                'Secure payment processing',
            ],
        },
        {
            id: 'interpreter',
            icon: 'globe',
            title: 'I am an Interpreter',
            subtitle: 'Interpreter Portal',
            description: 'Join our network of professional interpreters and connect with clients who need your language expertise.',
            gradient: theme.colors.interpreter.gradient,
            features: [
                'Flexible scheduling and availability',
                'Competitive rates and instant payments',
                'Work with enterprise clients',
                'Support in 50+ language pairs',
                'Professional development resources',
            ],
        },
    ];

    const backgroundColorInterpolation = backgroundColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.background, theme.colors.background],
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            {/* Animated Background */}
            <Animated.View
                style={[
                    styles.backgroundOverlay,
                    { backgroundColor: backgroundColorInterpolation }
                ]}
            />

            {/* Header */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: headerOpacity,
                        transform: [{ translateY: headerSlide }],
                    },
                ]}
            >
                <View style={styles.headerContent}>
                    <View style={styles.logoContainer}>
                        <LinearGradient
                            colors={theme.colors.gradient.brand}
                            style={styles.logoBackground}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Feather name="globe" size={24} color={theme.colors.text.white} />
                        </LinearGradient>
                        <Text style={styles.logoText}>LanguageAccess</Text>
                    </View>

                    <View style={styles.welcomeSection}>
                        <Text style={styles.welcomeTitle}>Welcome! 👋</Text>
                        <Text style={styles.welcomeSubtitle}>
                            Choose your role to get started with professional interpretation services
                        </Text>
                    </View>
                </View>
            </Animated.View>

            {/* Role Cards */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {roleData.map((role, index) => (
                    <RoleCard
                        key={role.id}
                        icon={role.icon}
                        title={role.title}
                        subtitle={role.subtitle}
                        description={role.description}
                        gradient={role.gradient}
                        features={role.features}
                        isSelected={selectedRole === role.id}
                        onPress={() => handleRoleSelect(role.id)}
                        index={index}
                    />
                ))}

                {/* Additional Info Section */}
                <View style={styles.infoSection}>
                    <View style={styles.securityBadge}>
                        <Feather name="shield" size={20} color={theme.colors.success} />
                        <Text style={styles.securityText}>Enterprise-grade security & compliance</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>10k+</Text>
                            <Text style={styles.statLabel}>Active Users</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>50+</Text>
                            <Text style={styles.statLabel}>Languages</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>24/7</Text>
                            <Text style={styles.statLabel}>Support</Text>
                        </View>
                    </View>
                </View>

                {/* Continue Button Space */}
                <View style={styles.buttonSpace} />
            </ScrollView>

            {/* Continue Button */}
            {showContinueButton && (
                <Animated.View
                    style={[
                        styles.continueButtonContainer,
                        {
                            opacity: continueButtonOpacity,
                            transform: [{ scale: continueButtonScale }],
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinue}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={selectedRole === 'client'
                                ? theme.colors.client.gradient
                                : theme.colors.interpreter.gradient
                            }
                            style={styles.continueButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.continueButtonText}>
                                Continue as {selectedRole === 'client' ? 'Client' : 'Interpreter'}
                            </Text>
                            <Feather name="arrow-right" size={20} color={theme.colors.text.white} />
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Helper Text */}
                    <Text style={styles.helperText}>
                        You can change this selection later in your profile settings
                    </Text>
                </Animated.View>
            )}

            {/* Skip for Now */}
            <TouchableOpacity
                style={styles.skipButton}
                onPress={() => navigation.navigate('Login', { userRole: 'client' })}
                activeOpacity={0.7}
            >
                <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    backgroundOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    header: {
        paddingTop: StatusBar.currentHeight || theme.spacing.xl,
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        ...theme.shadows.sm,
    },
    headerContent: {
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    logoBackground: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    logoText: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        fontWeight: '700',
    },
    welcomeSection: {
        alignItems: 'center',
    },
    welcomeTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: screenWidth - theme.spacing.xxxl,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
    },
    infoSection: {
        marginVertical: theme.spacing.xxxl,
        alignItems: 'center',
    },
    securityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.success + '15',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
        marginBottom: theme.spacing.xl,
    },
    securityText: {
        ...theme.typography.captionMedium,
        color: theme.colors.success,
        marginLeft: theme.spacing.sm,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.sm,
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        ...theme.typography.h3,
        color: theme.colors.primary,
        fontWeight: '700',
        marginBottom: theme.spacing.xs,
    },
    statLabel: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: theme.colors.border,
        marginHorizontal: theme.spacing.lg,
    },
    buttonSpace: {
        height: 120,
    },
    continueButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    continueButton: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    continueButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
    },
    continueButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        marginRight: theme.spacing.sm,
        fontWeight: '600',
    },
    helperText: {
        ...theme.typography.small,
        color: theme.colors.text.light,
        textAlign: 'center',
        marginTop: theme.spacing.md,
    },
    skipButton: {
        position: 'absolute',
        bottom: theme.spacing.lg,
        alignSelf: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
    },
    skipText: {
        ...theme.typography.caption,
        color: theme.colors.text.light,
        textAlign: 'center',
    },
});

export default RoleSelectionScreen;