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
    Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DynamicHeader from '../Components/DynamicHeader';
import { theme, getHeaderHeight } from '../Components/theme';

// Import the interpreter-specific screens
import VerificationRequestScreen from './VerificationRequestScreen';
import CallRateScreen from './CallRateScreen';
import CashOutScreen from './CashOutScreen';
import EarningsScreen from './EarningsScreen';
import StripeConnectScreen from './StripeConnectScreen';

// Import shared components from ClientProfileScreen
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
    ProfileListItem,
    SectionHeader
} from './ClientProfileScreen';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
            routes: [{ name: 'Login' }],
        });
    };

    const handleDeleteAccount = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
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
    const scrollY = useRef(new Animated.Value(0)).current;

    // Dynamic interpreter data state - this would typically come from your backend/API
    const [interpreterData, setInterpreterData] = useState({
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: 'maria.rodriguez@languageaccess.com',
        specialty: 'Certified Spanish Interpreter',
        languages: ['Spanish', 'English'],
        rating: 4.9,
        totalReviews: 127,
        totalCalls: 156,
        totalEarnings: 1247.50,
        memberSince: '2022',
        isVerified: true,
        isProfessional: true,
        status: 'active', // active, busy, offline
        lastActive: 'Now',
        avatar: null, // Could be an image URL from backend
        profileCompletion: 92,
        averageCallDuration: '18 min',
        responseRate: 98,
        languagesSupported: 3
    });

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
        }).start();

        // Simulate fetching interpreter data from backend
        // In real app, you'd call your API here
        // fetchInterpreterProfile().then(setInterpreterData);
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return theme.colors.success;
            case 'busy': return theme.colors.warning;
            case 'offline': return theme.colors.text.light;
            default: return theme.colors.text.light;
        }
    };

    const getCompletionColor = (percentage) => {
        if (percentage >= 80) return theme.colors.success;
        if (percentage >= 60) return theme.colors.warning;
        return theme.colors.error;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <DynamicHeader
                type="back"
                title="Interpreter Profile"
                onBack={onBack}
                scrollY={scrollY}
                hideOnScroll={true}
            />

            <Animated.ScrollView
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                {/* Enhanced Interpreter Profile Header */}
                <View style={styles.enhancedProfileHeader}>
                    {/* Background Gradient Effect */}
                    <View style={styles.profileHeaderBackground} />

                    <View style={styles.profileHeaderContent}>
                        {/* Left Section - Avatar and Basic Info */}
                        <View style={styles.profileHeaderLeft}>
                            <View style={styles.compactAvatarContainer}>
                                <View style={styles.compactAvatar}>
                                    {interpreterData.avatar ? (
                                        <Image source={{ uri: interpreterData.avatar }} style={styles.avatarImage} />
                                    ) : (
                                        <Feather name="mic" size={28} color={theme.colors.text.white} />
                                    )}
                                </View>

                                {/* Status Indicator */}
                                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(interpreterData.status) }]} />

                                {/* Verification Badge */}
                                {interpreterData.isVerified && (
                                    <View style={styles.verificationBadge}>
                                        <Feather name="shield-check" size={12} color={theme.colors.text.white} />
                                    </View>
                                )}

                                {/* Edit Avatar Button */}
                                <TouchableOpacity style={styles.compactEditAvatarButton}>
                                    <Feather name="camera" size={12} color={theme.colors.text.white} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.profileBasicInfo}>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.compactProfileName}>
                                        {interpreterData.firstName} {interpreterData.lastName}
                                    </Text>
                                    {interpreterData.isProfessional && (
                                        <Feather name="award" size={16} color={theme.colors.accent} style={styles.professionalIcon} />
                                    )}
                                </View>
                                <Text style={styles.compactProfileSpecialty} numberOfLines={1}>
                                    {interpreterData.specialty}
                                </Text>
                                <Text style={styles.compactProfileEmail} numberOfLines={1}>
                                    {interpreterData.email}
                                </Text>

                                {/* Rating Display */}
                                <View style={styles.compactRatingContainer}>
                                    <Feather name="star" size={12} color={theme.colors.accent} />
                                    <Text style={styles.compactRating}>{interpreterData.rating}</Text>
                                    <Text style={styles.compactRatingCount}>({interpreterData.totalReviews})</Text>
                                </View>
                            </View>
                        </View>

                        {/* Right Section - Stats and Actions */}
                        <View style={styles.profileHeaderRight}>
                            {/* Profile Completion */}
                            <View style={styles.profileCompletionContainer}>
                                <View style={styles.profileCompletionHeader}>
                                    <Text style={styles.completionLabel}>Profile</Text>
                                    <Text style={[styles.completionPercentage, { color: getCompletionColor(interpreterData.profileCompletion) }]}>
                                        {interpreterData.profileCompletion}%
                                    </Text>
                                </View>
                                <View style={styles.progressBarContainer}>
                                    <View style={styles.progressBarBackground} />
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            {
                                                width: `${interpreterData.profileCompletion}%`,
                                                backgroundColor: getCompletionColor(interpreterData.profileCompletion)
                                            }
                                        ]}
                                    />
                                </View>
                            </View>

                            {/* Earnings Display */}
                            <View style={styles.earningsContainer}>
                                <Text style={styles.earningsLabel}>Available</Text>
                                <Text style={styles.earningsAmount}>{formatCurrency(interpreterData.totalEarnings)}</Text>
                            </View>

                            {/* Quick Stats */}
                            <View style={styles.quickStats}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{interpreterData.totalCalls}</Text>
                                    <Text style={styles.statLabel}>Calls</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{interpreterData.responseRate}%</Text>
                                    <Text style={styles.statLabel}>Response</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{interpreterData.languagesSupported}</Text>
                                    <Text style={styles.statLabel}>Languages</Text>
                                </View>
                            </View>

                            {/* Quick Actions */}
                            <View style={styles.quickActions}>
                                <TouchableOpacity
                                    style={styles.quickActionButton}
                                    onPress={() => onNavigate('myProfile')}
                                >
                                    <Feather name="edit-3" size={14} color={theme.colors.text.white} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.quickActionButton}
                                    onPress={() => onNavigate('cashOut')}
                                >
                                    <Feather name="trending-up" size={14} color={theme.colors.text.white} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.quickActionButton}
                                    onPress={() => onNavigate('earningsHistory')}
                                >
                                    <Feather name="bar-chart-2" size={14} color={theme.colors.text.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Last Active Status */}
                    <View style={styles.lastActiveContainer}>
                        <View style={styles.lastActiveContent}>
                            <Feather name="clock" size={12} color={theme.colors.text.light} />
                            <Text style={styles.lastActiveText}>
                                Last active: {interpreterData.lastActive}
                            </Text>
                        </View>
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
                                <Text style={styles.balanceText}>{formatCurrency(interpreterData.totalEarnings)}</Text>
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
            </Animated.ScrollView>
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

    // Enhanced Profile Header Styles
    enhancedProfileHeader: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileHeaderBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '75%',
        backgroundColor: theme.colors.primary,
        borderTopLeftRadius: theme.borderRadius.lg,
        borderTopRightRadius: theme.borderRadius.lg,
    },
    profileHeaderContent: {
        flexDirection: 'row',
        padding: theme.spacing.lg,
        alignItems: 'flex-start',
        minHeight: 140,
    },
    profileHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    compactAvatarContainer: {
        position: 'relative',
        marginRight: theme.spacing.md,
    },
    compactAvatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: theme.colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: theme.colors.surface,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    verificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.success,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    compactEditAvatarButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    profileBasicInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    compactProfileName: {
        ...theme.typography.h3,
        color: theme.colors.text.white,
        fontWeight: '700',
    },
    professionalIcon: {
        marginLeft: theme.spacing.xs,
    },
    compactProfileSpecialty: {
        ...theme.typography.caption,
        color: theme.colors.text.white,
        opacity: 0.9,
        marginBottom: 2,
    },
    compactProfileEmail: {
        ...theme.typography.caption,
        color: theme.colors.text.white,
        opacity: 0.8,
        marginBottom: theme.spacing.xs,
    },
    compactRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    compactRating: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
        marginLeft: theme.spacing.xs,
        marginRight: theme.spacing.xs,
    },
    compactRatingCount: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        opacity: 0.8,
    },
    profileHeaderRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        minHeight: 70,
        flexDirection: 'column',
        width: 120,
    },
    profileCompletionContainer: {
        alignItems: 'flex-end',
        marginBottom: theme.spacing.xs,
        minWidth: 80,
    },
    profileCompletionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    completionLabel: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        opacity: 0.9,
        marginRight: theme.spacing.xs,
    },
    completionPercentage: {
        ...theme.typography.bodyMedium,
        fontWeight: '700',
        color: theme.colors.text.white,
    },
    progressBarContainer: {
        width: 60,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
    },
    progressBarBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    earningsContainer: {
        alignItems: 'flex-end',
        marginBottom: theme.spacing.xs,
        minWidth: 80,
    },
    earningsLabel: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        opacity: 0.9,
        marginBottom: 2,
    },
    earningsAmount: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        fontWeight: '700',
    },
    quickStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    statItem: {
        alignItems: 'center',
        minWidth: 30,
    },
    statValue: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
        fontSize: 12,
    },
    statLabel: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        opacity: 0.8,
        fontSize: 9,
    },
    statDivider: {
        width: 1,
        height: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: theme.spacing.xs,
    },
    quickActions: {
        flexDirection: 'row',
        gap: theme.spacing.xs,
    },
    quickActionButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    lastActiveContainer: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        paddingTop: theme.spacing.xs,
    },
    lastActiveContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lastActiveText: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },

    // Profile List Item Styles
    profileListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    profileListIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    profileListContent: {
        flex: 1,
    },
    profileListTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: 2,
    },
    profileListSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },

    // Section Header Styles
    sectionHeader: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.surfaceLight,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    sectionHeaderTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
        fontWeight: '600',
        textTransform: 'uppercase',
        fontSize: 12,
        letterSpacing: 0.5,
    },
});

export default InterpreterProfileScreen;
