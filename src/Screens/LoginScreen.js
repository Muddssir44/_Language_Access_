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
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../Components/theme';
import InputField from '../Components/InputField';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LoginScreen = ({ navigation, route }) => {
    const userRole = route?.params?.userRole || 'client';

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    // Animation values
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const headerSlide = useRef(new Animated.Value(-30)).current;
    const formOpacity = useRef(new Animated.Value(0)).current;
    const formSlide = useRef(new Animated.Value(30)).current;
    const buttonScale = useRef(new Animated.Value(0.9)).current;
    const loadingRotation = useRef(new Animated.Value(0)).current;
    const forgotPasswordSlide = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        startEntranceAnimation();
    }, []);

    useEffect(() => {
        if (isLoading) {
            startLoadingAnimation();
        } else {
            stopLoadingAnimation();
        }
    }, [isLoading]);

    const startEntranceAnimation = () => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(headerOpacity, {
                    toValue: 1,
                    duration: theme.animations.slow,
                    useNativeDriver: false,
                }),
                Animated.spring(headerSlide, {
                    toValue: 0,
                    ...theme.animations.spring,
                    useNativeDriver: false,
                }),
            ]),
            Animated.parallel([
                Animated.timing(formOpacity, {
                    toValue: 1,
                    duration: theme.animations.normal,
                    useNativeDriver: false,
                }),
                Animated.spring(formSlide, {
                    toValue: 0,
                    ...theme.animations.spring,
                    useNativeDriver: false,
                }),
                Animated.spring(buttonScale, {
                    toValue: 1,
                    ...theme.animations.spring,
                    useNativeDriver: false,
                }),
            ]),
        ]).start();
    };

    const startLoadingAnimation = () => {
        Animated.loop(
            Animated.timing(loadingRotation, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false,
            })
        ).start();
    };

    const stopLoadingAnimation = () => {
        loadingRotation.stopAnimation();
        loadingRotation.setValue(0);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleInputBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleLogin = async () => {
        setTouched({ email: true, password: true });

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Simulate login API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Navigate to appropriate home screen based on role
            if (userRole === 'client') {
                navigation.navigate('ClientHome');
            } else {
                navigation.navigate('InterpreterHome');
            }
        } catch (error) {
            Alert.alert('Login Failed', 'Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        setShowForgotPassword(!showForgotPassword);

        Animated.spring(forgotPasswordSlide, {
            toValue: showForgotPassword ? 100 : 0,
            ...theme.animations.spring,
            useNativeDriver: false,
        }).start();
    };

    const resetPassword = () => {
        Alert.alert(
            'Reset Password',
            `A password reset link has been sent to ${formData.email}`,
            [{ text: 'OK', onPress: () => setShowForgotPassword(false) }]
        );
    };

    const navigateToRegister = () => {
        navigation.navigate('Register', { userRole });
    };

    const changeRole = () => {
        navigation.navigate('RoleSelection');
    };

    const roleConfig = {
        client: {
            title: 'Welcome back!',
            subtitle: 'Sign in to continue booking interpreters',
            gradient: theme.colors.client.gradient,
            icon: 'users',
            color: theme.colors.client.primary,
        },
        interpreter: {
            title: 'Welcome back!',
            subtitle: 'Sign in to manage your interpretation services',
            gradient: theme.colors.interpreter.gradient,
            icon: 'globe',
            color: theme.colors.interpreter.primary,
        },
    };

    const config = roleConfig[userRole];

    const loadingRotationInterpolate = loadingRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

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
                <TouchableOpacity style={styles.backButton} onPress={changeRole} activeOpacity={0.7}>
                    <Feather name="arrow-left" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>

                <View style={styles.headerContent}>
                    <LinearGradient
                        colors={config.gradient}
                        style={styles.roleIcon}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Feather name={config.icon} size={24} color={theme.colors.text.white} />
                    </LinearGradient>

                    <View style={styles.roleBadge}>
                        <Text style={[styles.roleText, { color: config.color }]}>
                            {userRole === 'client' ? 'Client Portal' : 'Interpreter Portal'}
                        </Text>
                    </View>
                </View>
            </Animated.View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Welcome Section */}
                <Animated.View
                    style={[
                        styles.welcomeSection,
                        {
                            opacity: formOpacity,
                            transform: [{ translateY: formSlide }],
                        },
                    ]}
                >
                    <Text style={styles.welcomeTitle}>{config.title}</Text>
                    <Text style={styles.welcomeSubtitle}>{config.subtitle}</Text>
                </Animated.View>

                {/* Login Form */}
                <Animated.View
                    style={[
                        styles.formContainer,
                        {
                            opacity: formOpacity,
                            transform: [{ translateY: formSlide }],
                        },
                    ]}
                >
                    <InputField
                        placeholder="Enter your email"
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        onBlur={() => handleInputBlur('email')}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        icon="mail"
                        error={errors.email}
                        touched={touched.email}
                    />

                    <InputField
                        placeholder="Enter your password"
                        value={formData.password}
                        onChangeText={(value) => handleInputChange('password', value)}
                        onBlur={() => handleInputBlur('password')}
                        secureTextEntry
                        icon="lock"
                        showPasswordToggle
                        error={errors.password}
                        touched={touched.password}
                    />

                    {/* Forgot Password Link */}
                    <TouchableOpacity
                        style={styles.forgotPasswordButton}
                        onPress={handleForgotPassword}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.forgotPasswordText, { color: config.color }]}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    {/* Forgot Password Section */}
                    {showForgotPassword && (
                        <Animated.View
                            style={[
                                styles.forgotPasswordSection,
                                {
                                    transform: [{ translateY: forgotPasswordSlide }],
                                },
                            ]}
                        >
                            <View style={styles.forgotPasswordCard}>
                                <Feather name="mail" size={24} color={config.color} />
                                <Text style={styles.forgotPasswordTitle}>Reset Password</Text>
                                <Text style={styles.forgotPasswordDescription}>
                                    We'll send a reset link to your email address
                                </Text>
                                <TouchableOpacity
                                    style={[styles.resetButton, { backgroundColor: config.color }]}
                                    onPress={resetPassword}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.resetButtonText}>Send Reset Link</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    )}

                    {/* Login Button */}
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity
                            style={[styles.loginButton, isLoading && styles.loginButtonLoading]}
                            onPress={handleLogin}
                            disabled={isLoading}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={config.gradient}
                                style={styles.loginButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {isLoading ? (
                                    <Animated.View
                                        style={[
                                            styles.loadingIcon,
                                            {
                                                transform: [{ rotate: loadingRotationInterpolate }],
                                            },
                                        ]}
                                    >
                                        <Feather name="loader" size={20} color={theme.colors.text.white} />
                                    </Animated.View>
                                ) : (
                                    <>
                                        <Text style={styles.loginButtonText}>Sign In</Text>
                                        <Feather name="arrow-right" size={20} color={theme.colors.text.white} />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>

                {/* Register Section */}
                <View style={styles.registerSection}>
                    <Text style={styles.registerPrompt}>Don't have an account?</Text>
                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={navigateToRegister}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.registerButtonText, { color: config.color }]}>
                            Create Account
                        </Text>
                        <Feather name="user-plus" size={16} color={config.color} />
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight || theme.spacing.xl,
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        ...theme.shadows.sm,
    },
    backButton: {
        padding: theme.spacing.sm,
        marginRight: theme.spacing.md,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    roleIcon: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    roleBadge: {
        backgroundColor: theme.colors.surfaceLight,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
    },
    roleText: {
        ...theme.typography.captionMedium,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.xl,
    },
    welcomeSection: {
        marginBottom: theme.spacing.xxxl,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    welcomeTitle: {
        ...theme.typography.h1,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    formContainer: {
        marginBottom: theme.spacing.xl,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        paddingVertical: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    forgotPasswordText: {
        ...theme.typography.captionMedium,
        fontWeight: '600',
    },
    forgotPasswordSection: {
        marginBottom: theme.spacing.lg,
    },
    forgotPasswordCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        alignItems: 'center',
        ...theme.shadows.sm,
    },
    forgotPasswordTitle: {
        ...theme.typography.h4,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    forgotPasswordDescription: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    resetButton: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    resetButtonText: {
        ...theme.typography.captionMedium,
        color: theme.colors.text.white,
        fontWeight: '600',
    },
    loginButton: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    loginButtonLoading: {
        opacity: 0.8,
    },
    loginButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
    },
    loginButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        marginRight: theme.spacing.sm,
        fontWeight: '600',
    },
    loadingIcon: {
        // Loading icon styles handled by animation
    },
    registerSection: {
        alignItems: 'center',
        marginTop: theme.spacing.xxxl,
        marginBottom: theme.spacing.xl,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    registerPrompt: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.md,
    },
    registerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
    },
    registerButtonText: {
        ...theme.typography.bodyMedium,
        fontWeight: '600',
        marginRight: theme.spacing.sm,
    },
    footer: {
        alignItems: 'center',
        paddingTop: theme.spacing.xl,
        borderTopWidth: 1,
        borderTopColor: theme.colors.borderLight,
    },
    footerText: {
        ...theme.typography.small,
        color: theme.colors.text.light,
        textAlign: 'center',
        lineHeight: 18,
    },
});

export default LoginScreen;