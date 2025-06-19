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
    Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../Components/theme';
import InputField from '../Components/InputField';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RegisterScreen = ({ navigation, route }) => {
    const userRole = route?.params?.userRole || 'client';

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        // Interpreter specific fields
        languages: [],
        specialties: [],
        experience: '',
        certifications: '',
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);

    // Animation values
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const headerSlide = useRef(new Animated.Value(-30)).current;
    const formOpacity = useRef(new Animated.Value(0)).current;
    const formSlide = useRef(new Animated.Value(30)).current;
    const buttonScale = useRef(new Animated.Value(0.9)).current;
    const loadingRotation = useRef(new Animated.Value(0)).current;
    const modalScale = useRef(new Animated.Value(0.8)).current;
    const modalOpacity = useRef(new Animated.Value(0)).current;

    // Available options for interpreters
    const availableLanguages = [
        'Spanish', 'French', 'German', 'Chinese (Mandarin)', 'Chinese (Cantonese)',
        'Japanese', 'Korean', 'Arabic', 'Portuguese', 'Italian', 'Russian',
        'Hindi', 'Bengali', 'Vietnamese', 'Turkish', 'Polish', 'Dutch',
        'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Greek', 'Hebrew',
        'Thai', 'Indonesian', 'Malay', 'Tagalog', 'Urdu', 'Farsi',
    ];

    const availableSpecialties = [
        'Medical & Healthcare', 'Legal & Court', 'Business & Corporate',
        'Education & Academic', 'Government & Public Services', 'Conference & Events',
        'Technical & IT', 'Financial Services', 'Immigration & Visa',
        'Mental Health & Counseling', 'Social Services', 'Emergency Services',
    ];

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

    useEffect(() => {
        if (showLanguageModal || showSpecialtyModal) {
            Animated.parallel([
                Animated.spring(modalScale, {
                    toValue: 1,
                    ...theme.animations.spring,
                    useNativeDriver: false,
                }),
                Animated.timing(modalOpacity, {
                    toValue: 1,
                    duration: theme.animations.normal,
                    useNativeDriver: false,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(modalScale, {
                    toValue: 0.8,
                    duration: theme.animations.fast,
                    useNativeDriver: false,
                }),
                Animated.timing(modalOpacity, {
                    toValue: 0,
                    duration: theme.animations.fast,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [showLanguageModal, showSpecialtyModal]);

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

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Interpreter specific validation
        if (userRole === 'interpreter') {
            if (formData.languages.length === 0) {
                newErrors.languages = 'Please select at least one language pair';
            }
            if (formData.specialties.length === 0) {
                newErrors.specialties = 'Please select at least one specialty';
            }
            if (!formData.experience.trim()) {
                newErrors.experience = 'Experience information is required';
            }
        }

        if (!acceptedTerms) {
            newErrors.terms = 'You must accept the Terms of Service';
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

    const handleLanguageSelect = (language) => {
        const updatedLanguages = formData.languages.includes(language)
            ? formData.languages.filter(l => l !== language)
            : [...formData.languages, language];

        handleInputChange('languages', updatedLanguages);
    };

    const handleSpecialtySelect = (specialty) => {
        const updatedSpecialties = formData.specialties.includes(specialty)
            ? formData.specialties.filter(s => s !== specialty)
            : [...formData.specialties, specialty];

        handleInputChange('specialties', updatedSpecialties);
    };

    const handleRegister = async () => {
        setTouched({
            fullName: true,
            email: true,
            phone: true,
            password: true,
            confirmPassword: true,
            languages: true,
            specialties: true,
            experience: true,
        });

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Simulate registration API call
            await new Promise(resolve => setTimeout(resolve, 2500));

            Alert.alert(
                'Registration Successful!',
                `Welcome to LanguageAccess! Your ${userRole} account has been created successfully.`,
                [
                    {
                        text: 'Get Started',
                        onPress: () => {
                            if (userRole === 'client') {
                                navigation.navigate('ClientHome');
                            } else {
                                navigation.navigate('InterpreterHome');
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Registration Failed', 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToLogin = () => {
        navigation.navigate('Login', { userRole });
    };

    const changeRole = () => {
        navigation.navigate('RoleSelection');
    };

    const roleConfig = {
        client: {
            title: 'Create Client Account',
            subtitle: 'Join thousands of users connecting with professional interpreters',
            gradient: theme.colors.client.gradient,
            icon: 'users',
            color: theme.colors.client.primary,
        },
        interpreter: {
            title: 'Join as Interpreter',
            subtitle: 'Connect with clients and grow your interpretation business',
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

    const renderSelectionModal = (title, items, selectedItems, onSelect, visible, onClose) => (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            opacity: modalOpacity,
                            transform: [{ scale: modalScale }],
                        },
                    ]}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                            <Feather name="x" size={24} color={theme.colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                        {items.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.modalItem,
                                    selectedItems.includes(item) && styles.modalItemSelected,
                                ]}
                                onPress={() => onSelect(item)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        selectedItems.includes(item) && styles.modalItemTextSelected,
                                    ]}
                                >
                                    {item}
                                </Text>
                                {selectedItems.includes(item) && (
                                    <Feather name="check" size={20} color={config.color} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <Text style={styles.modalFooterText}>
                            Selected: {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
                        </Text>
                        <TouchableOpacity
                            style={[styles.modalDoneButton, { backgroundColor: config.color }]}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.modalDoneText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );

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
                            {userRole === 'client' ? 'Client Registration' : 'Interpreter Registration'}
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

                {/* Registration Form */}
                <Animated.View
                    style={[
                        styles.formContainer,
                        {
                            opacity: formOpacity,
                            transform: [{ translateY: formSlide }],
                        },
                    ]}
                >
                    {/* Basic Information */}
                    <View style={styles.sectionHeader}>
                        <Feather name="user" size={20} color={config.color} />
                        <Text style={[styles.sectionTitle, { color: config.color }]}>Basic Information</Text>
                    </View>

                    <InputField
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChangeText={(value) => handleInputChange('fullName', value)}
                        onBlur={() => handleInputBlur('fullName')}
                        icon="user"
                        error={errors.fullName}
                        touched={touched.fullName}
                    />

                    <InputField
                        label="Email Address"
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
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        onBlur={() => handleInputBlur('phone')}
                        keyboardType="phone-pad"
                        icon="phone"
                        error={errors.phone}
                        touched={touched.phone}
                    />

                    {/* Security Section */}
                    <View style={styles.sectionHeader}>
                        <Feather name="lock" size={20} color={config.color} />
                        <Text style={[styles.sectionTitle, { color: config.color }]}>Security</Text>
                    </View>

                    <InputField
                        label="Password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChangeText={(value) => handleInputChange('password', value)}
                        onBlur={() => handleInputBlur('password')}
                        secureTextEntry
                        icon="lock"
                        showPasswordToggle
                        error={errors.password}
                        touched={touched.password}
                    />

                    <InputField
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChangeText={(value) => handleInputChange('confirmPassword', value)}
                        onBlur={() => handleInputBlur('confirmPassword')}
                        secureTextEntry
                        icon="shield"
                        showPasswordToggle
                        error={errors.confirmPassword}
                        touched={touched.confirmPassword}
                    />

                    {/* Interpreter Specific Fields */}
                    {userRole === 'interpreter' && (
                        <>
                            <View style={styles.sectionHeader}>
                                <Feather name="globe" size={20} color={config.color} />
                                <Text style={[styles.sectionTitle, { color: config.color }]}>Professional Information</Text>
                            </View>

                            {/* Languages */}
                            <TouchableOpacity
                                style={[
                                    styles.selectionField,
                                    errors.languages && touched.languages && styles.selectionFieldError,
                                ]}
                                onPress={() => setShowLanguageModal(true)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.selectionFieldContent}>
                                    <Feather name="globe" size={20} color={theme.colors.text.secondary} />
                                    <View style={styles.selectionFieldText}>
                                        <Text style={styles.selectionFieldLabel}>Language Pairs</Text>
                                        <Text style={styles.selectionFieldValue}>
                                            {formData.languages.length > 0
                                                ? `${formData.languages.length} language${formData.languages.length !== 1 ? 's' : ''} selected`
                                                : 'Select your language pairs'
                                            }
                                        </Text>
                                    </View>
                                    <Feather name="chevron-right" size={20} color={theme.colors.text.light} />
                                </View>
                                {formData.languages.length > 0 && (
                                    <View style={styles.selectedTags}>
                                        {formData.languages.slice(0, 3).map((lang, index) => (
                                            <View key={index} style={styles.tag}>
                                                <Text style={styles.tagText}>{lang}</Text>
                                            </View>
                                        ))}
                                        {formData.languages.length > 3 && (
                                            <View style={styles.tag}>
                                                <Text style={styles.tagText}>+{formData.languages.length - 3} more</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </TouchableOpacity>
                            {errors.languages && touched.languages && (
                                <View style={styles.errorContainer}>
                                    <Feather name="alert-circle" size={14} color={theme.colors.error} />
                                    <Text style={styles.errorText}>{errors.languages}</Text>
                                </View>
                            )}

                            {/* Specialties */}
                            <TouchableOpacity
                                style={[
                                    styles.selectionField,
                                    errors.specialties && touched.specialties && styles.selectionFieldError,
                                ]}
                                onPress={() => setShowSpecialtyModal(true)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.selectionFieldContent}>
                                    <Feather name="award" size={20} color={theme.colors.text.secondary} />
                                    <View style={styles.selectionFieldText}>
                                        <Text style={styles.selectionFieldLabel}>Specialties</Text>
                                        <Text style={styles.selectionFieldValue}>
                                            {formData.specialties.length > 0
                                                ? `${formData.specialties.length} specialty${formData.specialties.length !== 1 ? 's' : ''} selected`
                                                : 'Select your specialties'
                                            }
                                        </Text>
                                    </View>
                                    <Feather name="chevron-right" size={20} color={theme.colors.text.light} />
                                </View>
                                {formData.specialties.length > 0 && (
                                    <View style={styles.selectedTags}>
                                        {formData.specialties.slice(0, 2).map((specialty, index) => (
                                            <View key={index} style={styles.tag}>
                                                <Text style={styles.tagText}>{specialty}</Text>
                                            </View>
                                        ))}
                                        {formData.specialties.length > 2 && (
                                            <View style={styles.tag}>
                                                <Text style={styles.tagText}>+{formData.specialties.length - 2} more</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </TouchableOpacity>
                            {errors.specialties && touched.specialties && (
                                <View style={styles.errorContainer}>
                                    <Feather name="alert-circle" size={14} color={theme.colors.error} />
                                    <Text style={styles.errorText}>{errors.specialties}</Text>
                                </View>
                            )}

                            <InputField
                                label="Experience"
                                placeholder="Describe your interpretation experience"
                                value={formData.experience}
                                onChangeText={(value) => handleInputChange('experience', value)}
                                onBlur={() => handleInputBlur('experience')}
                                multiline
                                numberOfLines={3}
                                icon="briefcase"
                                error={errors.experience}
                                touched={touched.experience}
                            />

                            <InputField
                                label="Certifications (Optional)"
                                placeholder="List any relevant certifications"
                                value={formData.certifications}
                                onChangeText={(value) => handleInputChange('certifications', value)}
                                multiline
                                numberOfLines={2}
                                icon="award"
                            />
                        </>
                    )}

                    {/* Terms & Conditions */}
                    <TouchableOpacity
                        style={styles.termsContainer}
                        onPress={() => setAcceptedTerms(!acceptedTerms)}
                        activeOpacity={0.7}
                    >
                        <View style={[
                            styles.checkbox,
                            acceptedTerms && { backgroundColor: config.color, borderColor: config.color },
                        ]}>
                            {acceptedTerms && (
                                <Feather name="check" size={16} color={theme.colors.text.white} />
                            )}
                        </View>
                        <Text style={styles.termsText}>
                            I agree to the{' '}
                            <Text style={[styles.termsLink, { color: config.color }]}>Terms of Service</Text>
                            {' '}and{' '}
                            <Text style={[styles.termsLink, { color: config.color }]}>Privacy Policy</Text>
                        </Text>
                    </TouchableOpacity>
                    {errors.terms && (
                        <View style={styles.errorContainer}>
                            <Feather name="alert-circle" size={14} color={theme.colors.error} />
                            <Text style={styles.errorText}>{errors.terms}</Text>
                        </View>
                    )}

                    {/* Register Button */}
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity
                            style={[styles.registerButton, isLoading && styles.registerButtonLoading]}
                            onPress={handleRegister}
                            disabled={isLoading}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={config.gradient}
                                style={styles.registerButtonGradient}
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
                                        <Text style={styles.registerButtonText}>Create Account</Text>
                                        <Feather name="user-plus" size={20} color={theme.colors.text.white} />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>

                {/* Login Section */}
                <View style={styles.loginSection}>
                    <Text style={styles.loginPrompt}>Already have an account?</Text>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={navigateToLogin}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.loginButtonText, { color: config.color }]}>
                            Sign In
                        </Text>
                        <Feather name="log-in" size={16} color={config.color} />
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Protected by enterprise-grade security. Your data is encrypted and secure.
                    </Text>
                </View>
            </ScrollView>

            {/* Language Selection Modal */}
            {renderSelectionModal(
                'Select Language Pairs',
                availableLanguages,
                formData.languages,
                handleLanguageSelect,
                showLanguageModal,
                () => setShowLanguageModal(false)
            )}

            {/* Specialty Selection Modal */}
            {renderSelectionModal(
                'Select Specialties',
                availableSpecialties,
                formData.specialties,
                handleSpecialtySelect,
                showSpecialtyModal,
                () => setShowSpecialtyModal(false)
            )}
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
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
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
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h4,
        marginLeft: theme.spacing.sm,
        fontWeight: '600',
    },
    selectionField: {
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    selectionFieldError: {
        borderColor: theme.colors.error,
    },
    selectionFieldContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectionFieldText: {
        flex: 1,
        marginLeft: theme.spacing.md,
    },
    selectionFieldLabel: {
        ...theme.typography.captionMedium,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },
    selectionFieldValue: {
        ...theme.typography.body,
        color: theme.colors.text.primary,
    },
    selectedTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: theme.spacing.md,
        marginLeft: 32,
    },
    tag: {
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: theme.borderRadius.full,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        marginRight: theme.spacing.sm,
        marginBottom: theme.spacing.xs,
    },
    tagText: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
        fontWeight: '500',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.sm,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
        marginTop: 2,
    },
    termsText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        flex: 1,
        lineHeight: 20,
    },
    termsLink: {
        fontWeight: '600',
    },
    registerButton: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        marginTop: theme.spacing.lg,
        ...theme.shadows.md,
    },
    registerButtonLoading: {
        opacity: 0.8,
    },
    registerButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
    },
    registerButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        marginRight: theme.spacing.sm,
        fontWeight: '600',
    },
    loadingIcon: {
        // Loading icon styles handled by animation
    },
    loginSection: {
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
    },
    loginPrompt: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.md,
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
    },
    loginButtonText: {
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
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -theme.spacing.sm,
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
    },
    errorText: {
        marginLeft: theme.spacing.xs,
        fontSize: 12,
        color: theme.colors.error,
        flex: 1,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: theme.colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    modalContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        maxHeight: screenHeight * 0.8,
        width: '100%',
        ...theme.shadows.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    modalTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
    },
    modalCloseButton: {
        padding: theme.spacing.sm,
    },
    modalContent: {
        maxHeight: screenHeight * 0.5,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    modalItemSelected: {
        backgroundColor: theme.colors.surfaceLight,
    },
    modalItemText: {
        ...theme.typography.body,
        color: theme.colors.text.primary,
        flex: 1,
    },
    modalItemTextSelected: {
        fontWeight: '600',
    },
    modalFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.xl,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    modalFooterText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    modalDoneButton: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
    },
    modalDoneText: {
        ...theme.typography.captionMedium,
        color: theme.colors.text.white,
        fontWeight: '600',
    },
});

export default RegisterScreen;