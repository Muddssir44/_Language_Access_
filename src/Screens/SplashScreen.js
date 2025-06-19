import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Animated,
    StyleSheet,
    Dimensions,
    StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../Components/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    // Animation values
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const titleSlide = useRef(new Animated.Value(50)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const subtitleSlide = useRef(new Animated.Value(30)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const dotsAnimation = useRef(new Animated.Value(0)).current;
    const backgroundGradient = useRef(new Animated.Value(0)).current;
    const pulseAnimation = useRef(new Animated.Value(1)).current;
    const rotateAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        startAnimationSequence();
    }, []);

    const startAnimationSequence = () => {
        // Background gradient animation
        Animated.timing(backgroundGradient, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
        }).start();

        // Logo entrance with bounce effect
        Animated.sequence([
            Animated.delay(300),
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: false,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: false,
                }),
            ]),
        ]).start();

        // Title typewriter effect
        Animated.sequence([
            Animated.delay(800),
            Animated.parallel([
                Animated.spring(titleSlide, {
                    toValue: 0,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: false,
                }),
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false,
                }),
            ]),
        ]).start();

        // Subtitle entrance
        Animated.sequence([
            Animated.delay(1200),
            Animated.parallel([
                Animated.spring(subtitleSlide, {
                    toValue: 0,
                    tension: 80,
                    friction: 7,
                    useNativeDriver: false,
                }),
                Animated.timing(subtitleOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: false,
                }),
            ]),
        ]).start();

        // Loading dots animation
        Animated.sequence([
            Animated.delay(1500),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(dotsAnimation, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: false,
                    }),
                    Animated.timing(dotsAnimation, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: false,
                    }),
                ])
            ),
        ]).start();

        // Pulse animation for logo
        Animated.sequence([
            Animated.delay(1000),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnimation, {
                        toValue: 1.1,
                        duration: 1500,
                        useNativeDriver: false,
                    }),
                    Animated.timing(pulseAnimation, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: false,
                    }),
                ])
            ),
        ]).start();

        // Rotation animation for accent
        Animated.loop(
            Animated.timing(rotateAnimation, {
                toValue: 1,
                duration: 8000,
                useNativeDriver: false,
            })
        ).start();

        // Navigate to role selection after animation
        setTimeout(() => {
            navigation.replace('RoleSelection');
        }, 3500);
    };

    const rotateInterpolate = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Animated Background */}
            <Animated.View style={styles.backgroundContainer}>
                <LinearGradient
                    colors={[
                        backgroundGradient.interpolate({
                            inputRange: [0, 1],
                            outputRange: [theme.colors.primary, theme.colors.gradient.brand[0]],
                        }),
                        backgroundGradient.interpolate({
                            inputRange: [0, 1],
                            outputRange: [theme.colors.primaryLight, theme.colors.gradient.brand[1]],
                        }),
                    ]}
                    style={styles.background}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            </Animated.View>

            {/* Floating Elements */}
            <Animated.View
                style={[
                    styles.floatingElement,
                    styles.element1,
                    {
                        transform: [{ rotate: rotateInterpolate }],
                    },
                ]}
            >
                <View style={styles.floatingCircle} />
            </Animated.View>

            <Animated.View
                style={[
                    styles.floatingElement,
                    styles.element2,
                    {
                        transform: [{
                            rotate: rotateAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '-360deg'],
                            }),
                        }],
                    },
                ]}
            >
                <View style={styles.floatingSquare} />
            </Animated.View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Logo Section */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: logoOpacity,
                            transform: [
                                { scale: logoScale },
                                { scale: pulseAnimation },
                            ],
                        },
                    ]}
                >
                    <View style={styles.logoBackground}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                            style={styles.logoGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Feather name="globe" size={48} color={theme.colors.text.white} />
                        </LinearGradient>
                    </View>

                    {/* Accent Ring */}
                    <Animated.View
                        style={[
                            styles.accentRing,
                            {
                                transform: [{ rotate: rotateInterpolate }],
                            },
                        ]}
                    >
                        <View style={styles.accentDot} />
                    </Animated.View>
                </Animated.View>

                {/* Title Section */}
                <Animated.View
                    style={[
                        styles.titleContainer,
                        {
                            opacity: titleOpacity,
                            transform: [{ translateY: titleSlide }],
                        },
                    ]}
                >
                    <Text style={styles.title}>LanguageAccess</Text>
                    <View style={styles.titleUnderline} />
                </Animated.View>

                {/* Subtitle */}
                <Animated.View
                    style={[
                        styles.subtitleContainer,
                        {
                            opacity: subtitleOpacity,
                            transform: [{ translateY: subtitleSlide }],
                        },
                    ]}
                >
                    <Text style={styles.subtitle}>
                        Professional Interpretation Services
                    </Text>
                    <Text style={styles.tagline}>
                        Breaking barriers, building connections
                    </Text>
                </Animated.View>

                {/* Loading Animation */}
                <Animated.View
                    style={[
                        styles.loadingContainer,
                        {
                            opacity: dotsAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 1],
                            }),
                        },
                    ]}
                >
                    <View style={styles.dotsContainer}>
                        {[0, 1, 2].map((index) => (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.dot,
                                    {
                                        opacity: dotsAnimation.interpolate({
                                            inputRange: [0, 0.3, 0.6, 1],
                                            outputRange: index === 0 ? [0.3, 1, 0.3, 0.3] :
                                                index === 1 ? [0.3, 0.3, 1, 0.3] :
                                                    [0.3, 0.3, 0.3, 1],
                                        }),
                                        transform: [{
                                            scale: dotsAnimation.interpolate({
                                                inputRange: [0, 0.3, 0.6, 1],
                                                outputRange: index === 0 ? [0.8, 1.2, 0.8, 0.8] :
                                                    index === 1 ? [0.8, 0.8, 1.2, 0.8] :
                                                        [0.8, 0.8, 0.8, 1.2],
                                            }),
                                        }],
                                    },
                                ]}
                            />
                        ))}
                    </View>
                    <Text style={styles.loadingText}>Initializing...</Text>
                </Animated.View>
            </View>

            {/* Footer Brand */}
            <Animated.View
                style={[
                    styles.footer,
                    {
                        opacity: subtitleOpacity,
                    },
                ]}
            >
                <Text style={styles.footerText}>Enterprise-Grade Solutions</Text>
                <View style={styles.footerDivider} />
                <Text style={styles.versionText}>Version 1.0</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    background: {
        flex: 1,
    },
    floatingElement: {
        position: 'absolute',
        opacity: 0.1,
    },
    element1: {
        top: screenHeight * 0.15,
        right: screenWidth * 0.1,
    },
    element2: {
        bottom: screenHeight * 0.2,
        left: screenWidth * 0.1,
    },
    floatingCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.text.white,
    },
    floatingSquare: {
        width: 60,
        height: 60,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.text.white,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxxl,
        position: 'relative',
    },
    logoBackground: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        ...theme.shadows.xl,
    },
    logoGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    accentRing: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderStyle: 'dashed',
    },
    accentDot: {
        position: 'absolute',
        top: -4,
        left: '50%',
        marginLeft: -4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.accent,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        ...theme.typography.h1,
        fontSize: 32,
        fontWeight: '700',
        color: theme.colors.text.white,
        textAlign: 'center',
        letterSpacing: 1,
    },
    titleUnderline: {
        width: 60,
        height: 3,
        backgroundColor: theme.colors.accent,
        marginTop: theme.spacing.sm,
        borderRadius: 2,
    },
    subtitleContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxxl,
    },
    subtitle: {
        ...theme.typography.bodyLarge,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: theme.spacing.xs,
        fontWeight: '500',
    },
    tagline: {
        ...theme.typography.caption,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    loadingContainer: {
        alignItems: 'center',
        position: 'absolute',
        bottom: screenHeight * 0.25,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.text.white,
        marginHorizontal: theme.spacing.xs,
    },
    loadingText: {
        ...theme.typography.caption,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: theme.spacing.xl,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    footerText: {
        ...theme.typography.small,
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    footerDivider: {
        width: 20,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginVertical: theme.spacing.xs,
    },
    versionText: {
        ...theme.typography.small,
        color: 'rgba(255, 255, 255, 0.4)',
    },
});

export default SplashScreen;