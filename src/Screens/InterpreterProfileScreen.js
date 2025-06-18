import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    Alert,
    Platform,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Import reusable components from ClientProfileScreen
import {
    MyProfileScreen,
    ChangePasswordScreen,
    CardRegistrationScreen,
    CallHistoryScreen,
    PaymentHistoryScreen,
    LanguageCoverageScreen,
    AboutScreen,
    TermsScreen,
    PrivacyPolicyScreen,
    ContactUsScreen,
    VersionScreen,
    SignOutConfirmationScreen,
    DeleteAccountScreen,
    DynamicHeader,
    ProfileListItem,
    SectionHeader
} from './ClientProfileScreen';

// Import the 5 new interpreter-specific screens
import VerificationRequestScreen from './VerificationRequestScreen';
import CallRateScreen from './CallRateScreen';
import CashOutScreen from './CashOutScreen';
import EarningsScreen from './EarningsScreen';
import StripeConnectScreen from './StripeConnectScreen';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Reuse theme from ClientProfileScreen
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

// Main Interpreter Profile Screen
const InterpreterProfileScreen = ({ navigation }) => {
    const [currentScreen, setCurrentScreen] = useState('main');
    const [fadeAnim] = useState(new Animated.Value(1));

    const navigateToScreen = (screenName) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setCurrentScreen(screenName);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleBack = () => {
        if (currentScreen === 'main') {
            navigation.goBack();
        } else {
            navigateToScreen('main');
        }
    };

    const handleSignOut = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
        });
    };

    const handleDeleteAccount = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
        });
    };

    const renderScreen = () => {
        switch (currentScreen) {
            // Profile Settings Screens
            case 'myProfile':
                return <MyProfileScreen onBack={handleBack} />;
            case 'changePassword':
                return <ChangePasswordScreen onBack={handleBack} />;
            case 'verificationRequest':
                return <VerificationRequestScreen onBack={handleBack} />;
            case 'callRates':
                return <CallRateScreen onBack={handleBack} />;

            // Payment Settings Screens
            case 'cardRegistration':
                return <CardRegistrationScreen onBack={handleBack} />;
            case 'callHistory':
                return <CallHistoryScreen onBack={handleBack} />;
            case 'paymentHistory':
                return <PaymentHistoryScreen onBack={handleBack} />;
            case 'cashOut':
                return <CashOutScreen onBack={handleBack} />;
            case 'earningsHistory':
                return <EarningsScreen onBack={handleBack} />;
            case 'stripeConnect':
                return <StripeConnectScreen onBack={handleBack} />;

            // About LanguageAccess Screens
            case 'languageCoverage':
                return <LanguageCoverageScreen onBack={handleBack} />;
            case 'about':
                return <AboutScreen onBack={handleBack} />;
            case 'terms':
                return <TermsScreen onBack={handleBack} />;
            case 'privacy':
                return <PrivacyPolicyScreen onBack={handleBack} />;
            case 'contact':
                return <ContactUsScreen onBack={handleBack} />;
            case 'version':
                return <VersionScreen onBack={handleBack} />;

            // Account Settings Screens
            case 'signOut':
                return <SignOutConfirmationScreen onBack={handleBack} onSignOut={handleSignOut} />;
            case 'deleteAccount':
                return <DeleteAccountScreen onBack={handleBack} onDeleteAccount={handleDeleteAccount} />;

            default:
                return <MainInterpreterProfileScreen onNavigate={navigateToScreen} onBack={handleBack} />;
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {renderScreen()}
        </Animated.View>
    );
};

// Main Interpreter Profile Screen Component
const MainInterpreterProfileScreen = ({ onNavigate, onBack }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, []);

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: () => onNavigate('signOut') }
            ]
        );
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <DynamicHeader
                type="back"
                title="Interpreter Profile"
                onBack={onBack}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Interpreter Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, { backgroundColor: theme.colors.secondary }]}>
                            <Feather name="mic" size={40} color={theme.colors.text.white} />
                        </View>
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Feather name="camera" size={16} color={theme.colors.text.white} />
                        </TouchableOpacity>
                        <View style={styles.verificationBadge}>
                            <Feather name="shield-check" size={16} color={theme.colors.text.white} />
                        </View>
                    </View>
                    <Text style={styles.profileName}>Maria Rodriguez</Text>
                    <Text style={styles.profileEmail}>maria.rodriguez@languageaccess.com</Text>
                    <Text style={styles.interpreterSpecialty}>Certified Spanish Interpreter</Text>
                    <View style={styles.ratingContainer}>
                        <Feather name="star" size={16} color={theme.colors.accent} />
                        <Text style={styles.rating}>4.9</Text>
                        <Text style={styles.ratingCount}>(127 reviews)</Text>
                    </View>
                </View>

                {/* Profile Settings Section */}
                <SectionHeader title="Profile Settings" />
                <View style={styles.section}>
                    <ProfileListItem
                        icon="user"
                        title="My Profile"
                        subtitle="Edit personal information"
                        onPress={() => onNavigate('myProfile')}
                        iconColor={theme.colors.primary}
                    />
                    <ProfileListItem
                        icon="lock"
                        title="Change Password"
                        subtitle="Update your password"
                        onPress={() => onNavigate('changePassword')}
                        iconColor={theme.colors.secondary}
                    />
                    <ProfileListItem
                        icon="shield-check"
                        title="Get Verified as Professional"
                        subtitle="Enhance credibility & earn more"
                        onPress={() => onNavigate('verificationRequest')}
                        iconColor={theme.colors.success}
                    />
                    <ProfileListItem
                        icon="dollar-sign"
                        title="Manage Call Rates"
                        subtitle="Set rates for different call types"
                        onPress={() => onNavigate('callRates')}
                        iconColor={theme.colors.accent}
                    />
                </View>

                {/* Payment Settings Section */}
                <SectionHeader title="Payment Settings" />
                <View style={styles.section}>
                    <ProfileListItem
                        icon="credit-card"
                        title="Card Registration"
                        subtitle="Manage payment methods"
                        onPress={() => onNavigate('cardRegistration')}
                        iconColor={theme.colors.success}
                    />
                    <ProfileListItem
                        icon="phone"
                        title="Call History"
                        subtitle="View past interpretation calls"
                        onPress={() => onNavigate('callHistory')}
                        iconColor={theme.colors.accent}
                    />
                    <ProfileListItem
                        icon="file-text"
                        title="Payment History"
                        subtitle="View billing and transactions"
                        onPress={() => onNavigate('paymentHistory')}
                        iconColor={theme.colors.warning}
                    />
                    <ProfileListItem
                        icon="trending-up"
                        title="Cash Out"
                        subtitle="Withdraw your earnings"
                        onPress={() => onNavigate('cashOut')}
                        iconColor={theme.colors.primary}
                        rightComponent={
                            <View style={styles.balanceIndicator}>
                                <Text style={styles.balanceText}>$1,247.50</Text>
                            </View>
                        }
                    />
                    <ProfileListItem
                        icon="bar-chart-2"
                        title="Earnings History"
                        subtitle="Track your income & performance"
                        onPress={() => onNavigate('earningsHistory')}
                        iconColor={theme.colors.secondary}
                    />
                    <ProfileListItem
                        icon="external-link"
                        title="Connect Stripe Account"
                        subtitle="Link your Stripe for payments"
                        onPress={() => onNavigate('stripeConnect')}
                        iconColor={theme.colors.accent}
                    />
                </View>

                {/* About LanguageAccess Section */}
                <SectionHeader title="About LanguageAccess" />
                <View style={styles.section}>
                    <ProfileListItem
                        icon="globe"
                        title="Language Coverage"
                        subtitle="Available language pairs"
                        onPress={() => onNavigate('languageCoverage')}
                        iconColor={theme.colors.secondary}
                    />
                    <ProfileListItem
                        icon="info"
                        title="About"
                        subtitle="Learn more about our platform"
                        onPress={() => onNavigate('about')}
                        iconColor={theme.colors.primary}
                    />
                    <ProfileListItem
                        icon="file-text"
                        title="Terms of Use"
                        subtitle="Read our terms and conditions"
                        onPress={() => onNavigate('terms')}
                        iconColor={theme.colors.accent}
                    />
                    <ProfileListItem
                        icon="shield"
                        title="Privacy Policy"
                        subtitle="How we protect your data"
                        onPress={() => onNavigate('privacy')}
                        iconColor={theme.colors.success}
                    />
                    <ProfileListItem
                        icon="mail"
                        title="Contact Us"
                        subtitle="Get help and support"
                        onPress={() => onNavigate('contact')}
                        iconColor={theme.colors.warning}
                    />
                    <ProfileListItem
                        icon="smartphone"
                        title="App Version"
                        subtitle="Version 1.2.3"
                        onPress={() => onNavigate('version')}
                        iconColor={theme.colors.secondary}
                    />
                </View>

                {/* Account Settings Section */}
                <SectionHeader title="Account Settings" />
                <View style={styles.section}>
                    <ProfileListItem
                        icon="log-out"
                        title="Sign Out"
                        subtitle="Sign out of your account"
                        onPress={handleSignOut}
                        showChevron={false}
                        iconColor={theme.colors.warning}
                    />
                    <ProfileListItem
                        icon="trash-2"
                        title="Delete Account"
                        subtitle="Permanently delete your account"
                        onPress={() => onNavigate('deleteAccount')}
                        showChevron={false}
                        iconColor={theme.colors.error}
                    />
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </Animated.View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.md,
    },

    // Profile Header Styles
    profileHeader: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
        backgroundColor: theme.colors.surface,
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        position: 'relative',
    },
    avatarContainer: {
        width: 100,
        height: 100,
        marginBottom: theme.spacing.md,
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: theme.colors.surface,
    },
    verificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.success,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: theme.colors.surface,
    },
    profileName: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    profileEmail: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },
    interpreterSpecialty: {
        ...theme.typography.bodyMedium,
        color: theme.colors.secondary,
        marginBottom: theme.spacing.sm,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.xs,
        marginRight: theme.spacing.xs,
    },
    ratingCount: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },

    // Section Styles
    section: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
    },

    // Balance Indicator
    balanceIndicator: {
        backgroundColor: theme.colors.success,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
        marginRight: theme.spacing.sm,
    },
    balanceText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
    },

    // Bottom Spacing
    bottomSpacing: {
        height: theme.spacing.xl,
    },
});

export default InterpreterProfileScreen;
