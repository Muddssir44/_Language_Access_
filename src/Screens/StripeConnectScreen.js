import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
    StatusBar,
    StyleSheet,
    Animated,
    Dimensions,
    Modal,
    WebView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DynamicHeader from '../Components/DynamicHeader';
import { theme, getHeaderHeight } from '../Components/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const StripeConnectScreen = ({ navigation, onBack }) => {
    const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, connecting, connected, error
    const [showWebView, setShowWebView] = useState(false);
    const [accountDetails, setAccountDetails] = useState({
        accountId: 'acct_1234567890',
        email: 'maria.rodriguez@email.com',
        country: 'US',
        currency: 'USD',
        connectedDate: '2024-06-15',
    });

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (navigation) {
            navigation.goBack();
        }
    };

    const handleConnectStripe = () => {
        setConnectionStatus('connecting');
        setShowWebView(true);

        // Simulate Stripe Connect flow
        setTimeout(() => {
            setShowWebView(false);
            setConnectionStatus('connected');
            Alert.alert(
                'Stripe Account Connected!',
                'Your Stripe account has been successfully connected. You can now receive payments directly to your bank account.',
                [{ text: 'Great!', style: 'default' }]
            );
        }, 3000);
    };

    const handleDisconnectStripe = () => {
        Alert.alert(
            'Disconnect Stripe Account',
            'Are you sure you want to disconnect your Stripe account? This will prevent you from receiving payments until you reconnect.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Disconnect',
                    style: 'destructive',
                    onPress: () => {
                        setConnectionStatus('disconnected');
                        Alert.alert('Disconnected', 'Your Stripe account has been disconnected.');
                    }
                }
            ]
        );
    };

    const handleTestConnection = () => {
        Alert.alert(
            'Testing Connection...',
            'Connection test successful! Your Stripe account is properly configured and ready to receive payments.',
            [{ text: 'OK', style: 'default' }]
        );
    };

    const renderConnectionStatus = () => {
        switch (connectionStatus) {
            case 'connected':
                return (
                    <View style={[styles.statusCard, { borderColor: theme.colors.success }]}>
                        <View style={styles.statusHeader}>
                            <View style={[styles.statusIcon, { backgroundColor: theme.colors.success }]}>
                                <Feather name="check-circle" size={24} color={theme.colors.text.white} />
                            </View>
                            <View style={styles.statusInfo}>
                                <Text style={styles.statusTitle}>Account Connected</Text>
                                <Text style={styles.statusSubtitle}>Ready to receive payments</Text>
                            </View>
                        </View>

                        <View style={styles.accountDetails}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Account ID:</Text>
                                <Text style={styles.detailValue}>{accountDetails.accountId}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Email:</Text>
                                <Text style={styles.detailValue}>{accountDetails.email}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Country:</Text>
                                <Text style={styles.detailValue}>{accountDetails.country}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Currency:</Text>
                                <Text style={styles.detailValue}>{accountDetails.currency}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Connected:</Text>
                                <Text style={styles.detailValue}>
                                    {new Date(accountDetails.connectedDate).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.connectedActions}>
                            <TouchableOpacity style={styles.testButton} onPress={handleTestConnection}>
                                <Feather name="activity" size={16} color={theme.colors.secondary} />
                                <Text style={styles.testButtonText}>Test Connection</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnectStripe}>
                                <Feather name="unlink" size={16} color={theme.colors.error} />
                                <Text style={styles.disconnectButtonText}>Disconnect</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );

            case 'connecting':
                return (
                    <View style={[styles.statusCard, { borderColor: theme.colors.warning }]}>
                        <View style={styles.statusHeader}>
                            <View style={[styles.statusIcon, { backgroundColor: theme.colors.warning }]}>
                                <Feather name="clock" size={24} color={theme.colors.text.white} />
                            </View>
                            <View style={styles.statusInfo}>
                                <Text style={styles.statusTitle}>Connecting...</Text>
                                <Text style={styles.statusSubtitle}>Setting up your Stripe account</Text>
                            </View>
                        </View>
                    </View>
                );

            case 'error':
                return (
                    <View style={[styles.statusCard, { borderColor: theme.colors.error }]}>
                        <View style={styles.statusHeader}>
                            <View style={[styles.statusIcon, { backgroundColor: theme.colors.error }]}>
                                <Feather name="alert-circle" size={24} color={theme.colors.text.white} />
                            </View>
                            <View style={styles.statusInfo}>
                                <Text style={styles.statusTitle}>Connection Failed</Text>
                                <Text style={styles.statusSubtitle}>Unable to connect to Stripe</Text>
                            </View>
                        </View>
                    </View>
                );

            default:
                return (
                    <View style={[styles.statusCard, { borderColor: theme.colors.border }]}>
                        <View style={styles.statusHeader}>
                            <View style={[styles.statusIcon, { backgroundColor: theme.colors.text.light }]}>
                                <Feather name="link" size={24} color={theme.colors.text.white} />
                            </View>
                            <View style={styles.statusInfo}>
                                <Text style={styles.statusTitle}>Not Connected</Text>
                                <Text style={styles.statusSubtitle}>Connect your Stripe account to receive payments</Text>
                            </View>
                        </View>
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="Connect Stripe Account"
                onBack={handleBack}
            />

            <ScrollView
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Stripe Branding */}
                <View style={styles.brandingSection}>
                    <View style={styles.stripeLogo}>
                        <Text style={styles.stripeText}>stripe</Text>
                    </View>
                    <Text style={styles.brandingTitle}>Secure Payment Processing</Text>
                    <Text style={styles.brandingSubtitle}>
                        Connect your Stripe account to receive payments directly to your bank account
                    </Text>
                </View>

                {/* Connection Status */}
                {renderConnectionStatus()}

                {connectionStatus === 'disconnected' && (
                    <>
                        {/* Benefits Section */}
                        <View style={styles.benefitsSection}>
                            <Text style={styles.sectionTitle}>Why Connect Stripe?</Text>
                            <View style={styles.benefitsList}>
                                <View style={styles.benefitItem}>
                                    <Feather name="zap" size={20} color={theme.colors.accent} />
                                    <View style={styles.benefitContent}>
                                        <Text style={styles.benefitTitle}>Fast Payments</Text>
                                        <Text style={styles.benefitText}>Receive payments within 1-2 business days</Text>
                                    </View>
                                </View>
                                <View style={styles.benefitItem}>
                                    <Feather name="shield" size={20} color={theme.colors.success} />
                                    <View style={styles.benefitContent}>
                                        <Text style={styles.benefitTitle}>Bank-Level Security</Text>
                                        <Text style={styles.benefitText}>Your data is encrypted and secure</Text>
                                    </View>
                                </View>
                                <View style={styles.benefitItem}>
                                    <Feather name="globe" size={20} color={theme.colors.secondary} />
                                    <View style={styles.benefitContent}>
                                        <Text style={styles.benefitTitle}>Global Support</Text>
                                        <Text style={styles.benefitText}>Available in 40+ countries worldwide</Text>
                                    </View>
                                </View>
                                <View style={styles.benefitItem}>
                                    <Feather name="percent" size={20} color={theme.colors.primary} />
                                    <View style={styles.benefitContent}>
                                        <Text style={styles.benefitTitle}>Transparent Fees</Text>
                                        <Text style={styles.benefitText}>2.9% + 30¢ per successful transaction</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Requirements Section */}
                        <View style={styles.requirementsSection}>
                            <Text style={styles.sectionTitle}>Requirements</Text>
                            <View style={styles.requirementsList}>
                                <View style={styles.requirementItem}>
                                    <Feather name="check" size={16} color={theme.colors.success} />
                                    <Text style={styles.requirementText}>Valid government-issued ID</Text>
                                </View>
                                <View style={styles.requirementItem}>
                                    <Feather name="check" size={16} color={theme.colors.success} />
                                    <Text style={styles.requirementText}>Bank account or debit card</Text>
                                </View>
                                <View style={styles.requirementItem}>
                                    <Feather name="check" size={16} color={theme.colors.success} />
                                    <Text style={styles.requirementText}>Valid address verification</Text>
                                </View>
                                <View style={styles.requirementItem}>
                                    <Feather name="check" size={16} color={theme.colors.success} />
                                    <Text style={styles.requirementText}>Business or personal information</Text>
                                </View>
                            </View>
                        </View>

                        {/* Connect Button */}
                        <TouchableOpacity
                            style={styles.connectButton}
                            onPress={handleConnectStripe}
                            disabled={connectionStatus === 'connecting'}
                        >
                            <Feather name="external-link" size={20} color={theme.colors.text.white} />
                            <Text style={styles.connectButtonText}>Connect with Stripe</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* Security Notice */}
                <View style={styles.securityNotice}>
                    <Feather name="lock" size={20} color={theme.colors.text.secondary} />
                    <View style={styles.securityContent}>
                        <Text style={styles.securityTitle}>Your data is secure</Text>
                        <Text style={styles.securityText}>
                            We use industry-standard encryption to protect your information.
                            LanguageAccess never stores your banking details.
                        </Text>
                    </View>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Simulated WebView Modal */}
            <Modal
                visible={showWebView}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={styles.webViewModal}>
                    <View style={styles.webViewHeader}>
                        <TouchableOpacity onPress={() => setShowWebView(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.webViewTitle}>Connect with Stripe</Text>
                        <View style={styles.placeholder} />
                    </View>

                    <View style={styles.webViewContent}>
                        <View style={styles.loadingContainer}>
                            <View style={styles.stripeLogo}>
                                <Text style={styles.stripeText}>stripe</Text>
                            </View>
                            <Text style={styles.loadingTitle}>Setting up your account...</Text>
                            <Text style={styles.loadingText}>
                                This usually takes just a few moments. Please don't close this window.
                            </Text>

                            <View style={styles.progressSteps}>
                                <View style={styles.stepItem}>
                                    <View style={[styles.stepIcon, { backgroundColor: theme.colors.success }]}>
                                        <Feather name="check" size={16} color={theme.colors.text.white} />
                                    </View>
                                    <Text style={styles.stepText}>Verifying identity</Text>
                                </View>
                                <View style={styles.stepItem}>
                                    <View style={[styles.stepIcon, { backgroundColor: theme.colors.success }]}>
                                        <Feather name="check" size={16} color={theme.colors.text.white} />
                                    </View>
                                    <Text style={styles.stepText}>Setting up payments</Text>
                                </View>
                                <View style={styles.stepItem}>
                                    <View style={[styles.stepIcon, { backgroundColor: theme.colors.warning }]}>
                                        <Feather name="clock" size={16} color={theme.colors.text.white} />
                                    </View>
                                    <Text style={styles.stepText}>Finalizing connection</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.md,
    },

    // Branding Section
    brandingSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xl,
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    stripeLogo: {
        backgroundColor: '#635BFF',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.md,
    },
    stripeText: {
        ...theme.typography.h2,
        color: theme.colors.text.white,
        fontWeight: '600',
        letterSpacing: -1,
    },
    brandingTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    brandingSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },

    // Status Card
    statusCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        borderWidth: 2,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    statusIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    statusInfo: {
        flex: 1,
    },
    statusTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    statusSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
    },

    // Account Details
    accountDetails: {
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
    },
    detailLabel: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
    },
    detailValue: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        fontWeight: '500',
    },

    // Connected Actions
    connectedActions: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    testButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceLight,
        borderWidth: 1,
        borderColor: theme.colors.secondary,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: theme.spacing.sm,
    },
    testButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.secondary,
        marginLeft: theme.spacing.xs,
    },
    disconnectButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceLight,
        borderWidth: 1,
        borderColor: theme.colors.error,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: theme.spacing.sm,
    },
    disconnectButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.error,
        marginLeft: theme.spacing.xs,
    },

    // Benefits Section
    benefitsSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    benefitsList: {
        gap: theme.spacing.md,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    benefitContent: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    benefitTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    benefitText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        lineHeight: 20,
    },

    // Requirements Section
    requirementsSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    requirementsList: {
        gap: theme.spacing.sm,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    requirementText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        flex: 1,
    },

    // Connect Button
    connectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#635BFF',
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    connectButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.sm,
        fontWeight: '600',
    },

    // Security Notice
    securityNotice: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    securityContent: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    securityTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    securityText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        lineHeight: 18,
    },

    // WebView Modal
    webViewModal: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    webViewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingTop: Platform.OS === 'ios' ? 50 : theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    cancelText: {
        ...theme.typography.body,
        color: theme.colors.primary,
    },
    webViewTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
    },
    placeholder: {
        width: 60,
    },
    webViewContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
    },
    loadingContainer: {
        alignItems: 'center',
        maxWidth: 300,
    },
    loadingTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    loadingText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: theme.spacing.xl,
    },

    // Progress Steps
    progressSteps: {
        alignSelf: 'stretch',
        gap: theme.spacing.md,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    stepText: {
        ...theme.typography.body,
        color: theme.colors.text.primary,
    },

    // Bottom Spacing
    bottomSpacing: {
        height: 100,
    },
});

export default StripeConnectScreen;