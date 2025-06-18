import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    StatusBar,
    StyleSheet,
    Animated,
    Dimensions,
    FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Theme (reused from InterpreterProfileScreen)
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

// Dynamic Header Component
const DynamicHeader = ({ title, onBack }) => {
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
            <View style={styles.headerLeft}>
                <TouchableOpacity style={styles.headerButton} onPress={onBack} activeOpacity={0.7}>
                    <Feather name="chevron-left" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
        </Animated.View>
    );
};

const CashOutScreen = ({ onBack }) => {
    const [currentBalance] = useState(1247.50);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [errors, setErrors] = useState({});

    const [cashOutHistory] = useState([
        {
            id: '1',
            amount: 500.00,
            date: '2024-06-15',
            status: 'approved',
            processedDate: '2024-06-16',
            bankAccount: '****1234',
            transactionId: 'PAYOUT-2024-001',
        },
        {
            id: '2',
            amount: 750.00,
            date: '2024-06-10',
            status: 'pending',
            bankAccount: '****1234',
            transactionId: 'PAYOUT-2024-002',
        },
        {
            id: '3',
            amount: 200.00,
            date: '2024-06-05',
            status: 'rejected',
            bankAccount: '****1234',
            transactionId: 'PAYOUT-2024-003',
            rejectionReason: 'Insufficient account verification'
        },
        {
            id: '4',
            amount: 850.00,
            date: '2024-05-28',
            status: 'approved',
            processedDate: '2024-05-29',
            bankAccount: '****1234',
            transactionId: 'PAYOUT-2024-004',
        },
    ]);

    const quickAmounts = [50, 100, 250, 500];

    const validateWithdrawal = () => {
        const newErrors = {};
        const amount = parseFloat(withdrawAmount);

        if (!withdrawAmount) {
            newErrors.amount = 'Please enter an amount';
        } else if (isNaN(amount) || amount <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        } else if (amount < 25) {
            newErrors.amount = 'Minimum withdrawal amount is $25';
        } else if (amount > currentBalance) {
            newErrors.amount = 'Amount exceeds available balance';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleWithdrawal = () => {
        if (validateWithdrawal()) {
            Alert.alert(
                'Confirm Withdrawal',
                `Are you sure you want to withdraw $${parseFloat(withdrawAmount).toFixed(2)}? This action cannot be undone.`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Confirm',
                        style: 'default',
                        onPress: () => {
                            // Simulate withdrawal request
                            Alert.alert(
                                'Withdrawal Requested',
                                'Your withdrawal request has been submitted. You will receive the funds within 1-3 business days.',
                                [{ text: 'OK', onPress: () => setWithdrawAmount('') }]
                            );
                        }
                    }
                ]
            );
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'approved':
                return {
                    color: theme.colors.success,
                    icon: 'check-circle',
                    text: 'Approved'
                };
            case 'pending':
                return {
                    color: theme.colors.warning,
                    icon: 'clock',
                    text: 'Pending'
                };
            case 'rejected':
                return {
                    color: theme.colors.error,
                    icon: 'x-circle',
                    text: 'Rejected'
                };
            default:
                return {
                    color: theme.colors.text.secondary,
                    icon: 'help-circle',
                    text: 'Unknown'
                };
        }
    };

    const renderCashOutItem = ({ item }) => {
        const statusConfig = getStatusConfig(item.status);

        return (
            <View style={styles.cashOutItem}>
                <View style={styles.cashOutItemHeader}>
                    <View style={styles.cashOutItemLeft}>
                        <Text style={styles.cashOutAmount}>-${item.amount.toFixed(2)}</Text>
                        <Text style={styles.cashOutDate}>{new Date(item.date).toLocaleDateString()}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
                        <Feather name={statusConfig.icon} size={12} color={theme.colors.text.white} />
                        <Text style={styles.statusText}>{statusConfig.text}</Text>
                    </View>
                </View>

                <View style={styles.cashOutItemDetails}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Bank Account:</Text>
                        <Text style={styles.detailValue}>{item.bankAccount}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Transaction ID:</Text>
                        <Text style={styles.detailValue}>{item.transactionId}</Text>
                    </View>
                    {item.processedDate && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Processed:</Text>
                            <Text style={styles.detailValue}>{new Date(item.processedDate).toLocaleDateString()}</Text>
                        </View>
                    )}
                    {item.rejectionReason && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Reason:</Text>
                            <Text style={[styles.detailValue, { color: theme.colors.error }]}>{item.rejectionReason}</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <DynamicHeader title="Cash Out" onBack={onBack} />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Balance Section */}
                <View style={styles.balanceSection}>
                    <View style={styles.balanceCard}>
                        <View style={styles.balanceHeader}>
                            <Feather name="dollar-sign" size={32} color={theme.colors.success} />
                            <View style={styles.balanceInfo}>
                                <Text style={styles.balanceLabel}>Available Balance</Text>
                                <Text style={styles.balanceAmount}>${currentBalance.toFixed(2)}</Text>
                            </View>
                        </View>
                        <Text style={styles.balanceNote}>
                            Earnings from completed calls. Minimum withdrawal: $25
                        </Text>
                    </View>
                </View>

                {/* Withdrawal Section */}
                <View style={styles.withdrawalSection}>
                    <Text style={styles.sectionTitle}>Withdraw Funds</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Withdrawal Amount</Text>
                        <View style={styles.amountInputContainer}>
                            <Text style={styles.currencySymbol}>$</Text>
                            <TextInput
                                style={[styles.amountInput, errors.amount && styles.inputError]}
                                value={withdrawAmount}
                                onChangeText={setWithdrawAmount}
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                placeholderTextColor={theme.colors.text.light}
                            />
                        </View>
                        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
                    </View>

                    <View style={styles.quickAmountsSection}>
                        <Text style={styles.quickAmountsLabel}>Quick amounts:</Text>
                        <View style={styles.quickAmountsContainer}>
                            {quickAmounts.map((amount) => (
                                <TouchableOpacity
                                    key={amount}
                                    style={[
                                        styles.quickAmountButton,
                                        withdrawAmount === amount.toString() && styles.quickAmountButtonActive
                                    ]}
                                    onPress={() => setWithdrawAmount(amount.toString())}
                                >
                                    <Text style={[
                                        styles.quickAmountText,
                                        withdrawAmount === amount.toString() && styles.quickAmountTextActive
                                    ]}>
                                        ${amount}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.withdrawButton,
                            (!withdrawAmount || parseFloat(withdrawAmount) <= 0) && styles.withdrawButtonDisabled
                        ]}
                        onPress={handleWithdrawal}
                        disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                    >
                        <Feather name="arrow-down-circle" size={20} color={theme.colors.text.white} />
                        <Text style={styles.withdrawButtonText}>Request Withdrawal</Text>
                    </TouchableOpacity>

                    <View style={styles.withdrawalInfo}>
                        <View style={styles.infoItem}>
                            <Feather name="clock" size={16} color={theme.colors.text.secondary} />
                            <Text style={styles.infoText}>Processing time: 1-3 business days</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Feather name="shield" size={16} color={theme.colors.text.secondary} />
                            <Text style={styles.infoText}>Bank-level security & encryption</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Feather name="credit-card" size={16} color={theme.colors.text.secondary} />
                            <Text style={styles.infoText}>Direct deposit to linked bank account</Text>
                        </View>
                    </View>
                </View>

                {/* Cash Out History */}
                <View style={styles.historySection}>
                    <Text style={styles.sectionTitle}>Cash Out History</Text>
                    <FlatList
                        data={cashOutHistory}
                        renderItem={renderCashOutItem}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyState}>
                                <Feather name="inbox" size={48} color={theme.colors.text.light} />
                                <Text style={styles.emptyStateText}>No cash out history yet</Text>
                                <Text style={styles.emptyStateSubtext}>Your withdrawal requests will appear here</Text>
                            </View>
                        )}
                    />
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>
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

    // Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
        paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.md,
    },
    headerButton: {
        padding: theme.spacing.sm,
    },

    // Balance Section
    balanceSection: {
        marginBottom: theme.spacing.md,
    },
    balanceCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.success,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    balanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    balanceInfo: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    balanceLabel: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },
    balanceAmount: {
        ...theme.typography.h1,
        color: theme.colors.success,
        fontWeight: '700',
    },
    balanceNote: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },

    // Withdrawal Section
    withdrawalSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.lg,
    },
    inputGroup: {
        marginBottom: theme.spacing.md,
    },
    inputLabel: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.md,
    },
    currencySymbol: {
        ...theme.typography.h3,
        color: theme.colors.text.secondary,
        marginRight: theme.spacing.xs,
    },
    amountInput: {
        flex: 1,
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        paddingVertical: theme.spacing.md,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    errorText: {
        ...theme.typography.caption,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
    },

    // Quick Amounts
    quickAmountsSection: {
        marginBottom: theme.spacing.lg,
    },
    quickAmountsLabel: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.sm,
    },
    quickAmountsContainer: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    quickAmountButton: {
        flex: 1,
        backgroundColor: theme.colors.surfaceLight,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
    },
    quickAmountButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    quickAmountText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
    },
    quickAmountTextActive: {
        color: theme.colors.text.white,
    },

    // Withdraw Button
    withdrawButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    withdrawButtonDisabled: {
        backgroundColor: theme.colors.text.light,
    },
    withdrawButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
        marginLeft: theme.spacing.sm,
        fontWeight: '600',
    },

    // Withdrawal Info
    withdrawalInfo: {
        gap: theme.spacing.sm,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        flex: 1,
    },

    // History Section
    historySection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },

    // Cash Out Item
    cashOutItem: {
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        backgroundColor: theme.colors.surfaceLight,
    },
    cashOutItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    cashOutItemLeft: {
        flex: 1,
    },
    cashOutAmount: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: 2,
    },
    cashOutDate: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        gap: theme.spacing.xs,
    },
    statusText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
    },
    cashOutItemDetails: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: theme.spacing.sm,
        gap: theme.spacing.xs,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    detailValue: {
        ...theme.typography.caption,
        color: theme.colors.text.primary,
        fontWeight: '500',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
    },
    emptyStateText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs,
    },
    emptyStateSubtext: {
        ...theme.typography.caption,
        color: theme.colors.text.light,
        textAlign: 'center',
    },

    // Bottom Spacing
    bottomSpacing: {
        height: theme.spacing.xl,
    },
});

export default CashOutScreen;