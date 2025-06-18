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

const EarningsScreen = ({ onBack }) => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('current');

    const [earningsData] = useState([
        {
            id: '1',
            date: '2024-06-15',
            time: '14:30',
            clientName: 'TechCorp Industries',
            jobTitle: 'Spanish Medical Interpretation',
            callType: 'video',
            duration: 45, // minutes
            rate: 3.00,
            grossEarnings: 225.00,
            commission: 33.75, // 15%
            netEarnings: 191.25,
            status: 'completed',
            language: 'Spanish',
            specialty: 'Medical'
        },
        {
            id: '2',
            date: '2024-06-14',
            time: '09:15',
            clientName: 'Global Solutions LLC',
            jobTitle: 'Mandarin Business Meeting',
            callType: 'zoom',
            duration: 90,
            rate: 3.25,
            grossEarnings: 487.50,
            commission: 73.13,
            netEarnings: 414.37,
            status: 'completed',
            language: 'Mandarin',
            specialty: 'Business'
        },
        {
            id: '3',
            date: '2024-06-12',
            time: '16:45',
            clientName: 'Healthcare Partners',
            jobTitle: 'Arabic Patient Consultation',
            callType: 'audio',
            duration: 30,
            rate: 2.75,
            grossEarnings: 137.50,
            commission: 20.63,
            netEarnings: 116.87,
            status: 'completed',
            language: 'Arabic',
            specialty: 'Medical'
        },
        {
            id: '4',
            date: '2024-06-10',
            time: '11:20',
            clientName: 'Legal Associates',
            jobTitle: 'French Legal Deposition',
            callType: 'onsite',
            duration: 120,
            rate: 5.00,
            grossEarnings: 1000.00,
            commission: 150.00,
            netEarnings: 850.00,
            status: 'completed',
            language: 'French',
            specialty: 'Legal'
        },
        {
            id: '5',
            date: '2024-06-08',
            time: '08:00',
            clientName: 'City Hospital',
            jobTitle: 'Spanish Emergency Interpretation',
            callType: 'audio',
            duration: 25,
            rate: 2.50,
            grossEarnings: 104.17,
            commission: 15.63,
            netEarnings: 88.54,
            status: 'completed',
            language: 'Spanish',
            specialty: 'Medical'
        }
    ]);

    const filters = [
        { key: 'all', label: 'All Jobs', icon: 'list' },
        { key: 'medical', label: 'Medical', icon: 'heart' },
        { key: 'legal', label: 'Legal', icon: 'briefcase' },
        { key: 'business', label: 'Business', icon: 'users' },
    ];

    const months = [
        { key: 'current', label: 'This Month' },
        { key: 'last', label: 'Last Month' },
        { key: 'three', label: 'Last 3 Months' },
        { key: 'all', label: 'All Time' },
    ];

    const getFilteredData = () => {
        let filtered = earningsData;

        if (selectedFilter !== 'all') {
            filtered = filtered.filter(item =>
                item.specialty.toLowerCase() === selectedFilter.toLowerCase()
            );
        }

        // Month filtering would be implemented with actual date logic
        return filtered;
    };

    const getTotalEarnings = () => {
        const filtered = getFilteredData();
        return {
            gross: filtered.reduce((sum, item) => sum + item.grossEarnings, 0),
            commission: filtered.reduce((sum, item) => sum + item.commission, 0),
            net: filtered.reduce((sum, item) => sum + item.netEarnings, 0),
            jobs: filtered.length,
            hours: filtered.reduce((sum, item) => sum + (item.duration / 60), 0)
        };
    };

    const getCallTypeIcon = (callType) => {
        switch (callType) {
            case 'audio': return 'phone';
            case 'video': return 'video';
            case 'zoom': return 'monitor';
            case 'onsite': return 'map-pin';
            default: return 'phone';
        }
    };

    const getCallTypeColor = (callType) => {
        switch (callType) {
            case 'audio': return theme.colors.primary;
            case 'video': return theme.colors.secondary;
            case 'zoom': return theme.colors.accent;
            case 'onsite': return theme.colors.success;
            default: return theme.colors.primary;
        }
    };

    const getSpecialtyColor = (specialty) => {
        switch (specialty.toLowerCase()) {
            case 'medical': return theme.colors.error;
            case 'legal': return theme.colors.primary;
            case 'business': return theme.colors.secondary;
            default: return theme.colors.text.secondary;
        }
    };

    const renderEarningsItem = ({ item }) => (
        <TouchableOpacity style={styles.earningsItem} activeOpacity={0.7}>
            <View style={styles.earningsItemHeader}>
                <View style={styles.earningsItemLeft}>
                    <View style={[styles.callTypeIcon, { backgroundColor: getCallTypeColor(item.callType) }]}>
                        <Feather name={getCallTypeIcon(item.callType)} size={16} color={theme.colors.text.white} />
                    </View>
                    <View style={styles.earningsItemInfo}>
                        <Text style={styles.earningsItemTitle}>{item.jobTitle}</Text>
                        <Text style={styles.earningsItemClient}>{item.clientName}</Text>
                        <View style={styles.earningsItemMeta}>
                            <Text style={styles.earningsItemDate}>
                                {new Date(item.date).toLocaleDateString()} • {item.time}
                            </Text>
                            <View style={[styles.specialtyTag, { backgroundColor: getSpecialtyColor(item.specialty) }]}>
                                <Text style={styles.specialtyTagText}>{item.specialty}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.earningsItemRight}>
                    <Text style={styles.earningsItemAmount}>+${item.netEarnings.toFixed(2)}</Text>
                    <Text style={styles.earningsItemDuration}>{item.duration} min</Text>
                </View>
            </View>

            <View style={styles.earningsItemDetails}>
                <View style={styles.earningsBreakdown}>
                    <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Gross</Text>
                        <Text style={styles.breakdownValue}>${item.grossEarnings.toFixed(2)}</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Commission (15%)</Text>
                        <Text style={[styles.breakdownValue, { color: theme.colors.error }]}>-${item.commission.toFixed(2)}</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Net Earnings</Text>
                        <Text style={[styles.breakdownValue, { color: theme.colors.success, fontWeight: '600' }]}>
                            ${item.netEarnings.toFixed(2)}
                        </Text>
                    </View>
                </View>
                <View style={styles.rateInfo}>
                    <Text style={styles.rateText}>${item.rate.toFixed(2)}/min • {item.language}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const totals = getTotalEarnings();

    return (
        <View style={styles.container}>
            <DynamicHeader title="Earnings History" onBack={onBack} />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Summary Cards */}
                <View style={styles.summarySection}>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryCardContent}>
                            <Text style={styles.summaryLabel}>Net Earnings</Text>
                            <Text style={styles.summaryValue}>${totals.net.toFixed(2)}</Text>
                        </View>
                        <Feather name="trending-up" size={24} color={theme.colors.success} />
                    </View>

                    <View style={styles.summaryRow}>
                        <View style={[styles.summaryCard, styles.summaryCardSmall]}>
                            <Text style={styles.summaryLabel}>Jobs</Text>
                            <Text style={styles.summaryValueSmall}>{totals.jobs}</Text>
                        </View>
                        <View style={[styles.summaryCard, styles.summaryCardSmall]}>
                            <Text style={styles.summaryLabel}>Hours</Text>
                            <Text style={styles.summaryValueSmall}>{totals.hours.toFixed(1)}</Text>
                        </View>
                    </View>
                </View>

                {/* Commission Breakdown */}
                <View style={styles.commissionSection}>
                    <Text style={styles.sectionTitle}>Commission Breakdown</Text>
                    <View style={styles.commissionCard}>
                        <View style={styles.commissionItem}>
                            <Text style={styles.commissionLabel}>Gross Earnings</Text>
                            <Text style={styles.commissionValue}>${totals.gross.toFixed(2)}</Text>
                        </View>
                        <View style={styles.commissionItem}>
                            <Text style={styles.commissionLabel}>Platform Commission (15%)</Text>
                            <Text style={[styles.commissionValue, { color: theme.colors.error }]}>
                                -${totals.commission.toFixed(2)}
                            </Text>
                        </View>
                        <View style={[styles.commissionItem, styles.commissionItemTotal]}>
                            <Text style={styles.commissionLabelTotal}>Your Net Earnings</Text>
                            <Text style={styles.commissionValueTotal}>${totals.net.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Filters */}
                <View style={styles.filtersSection}>
                    <View style={styles.filterGroup}>
                        <Text style={styles.filterLabel}>Filter by Type:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                            {filters.map((filter) => (
                                <TouchableOpacity
                                    key={filter.key}
                                    style={[
                                        styles.filterButton,
                                        selectedFilter === filter.key && styles.filterButtonActive
                                    ]}
                                    onPress={() => setSelectedFilter(filter.key)}
                                >
                                    <Feather
                                        name={filter.icon}
                                        size={16}
                                        color={selectedFilter === filter.key ? theme.colors.text.white : theme.colors.text.secondary}
                                    />
                                    <Text style={[
                                        styles.filterButtonText,
                                        selectedFilter === filter.key && styles.filterButtonTextActive
                                    ]}>
                                        {filter.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.filterGroup}>
                        <Text style={styles.filterLabel}>Time Period:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                            {months.map((month) => (
                                <TouchableOpacity
                                    key={month.key}
                                    style={[
                                        styles.monthButton,
                                        selectedMonth === month.key && styles.monthButtonActive
                                    ]}
                                    onPress={() => setSelectedMonth(month.key)}
                                >
                                    <Text style={[
                                        styles.monthButtonText,
                                        selectedMonth === month.key && styles.monthButtonTextActive
                                    ]}>
                                        {month.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>

                {/* Earnings List */}
                <View style={styles.earningsSection}>
                    <Text style={styles.sectionTitle}>Earnings History</Text>
                    <FlatList
                        data={getFilteredData()}
                        renderItem={renderEarningsItem}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyState}>
                                <Feather name="dollar-sign" size={48} color={theme.colors.text.light} />
                                <Text style={styles.emptyStateText}>No earnings found</Text>
                                <Text style={styles.emptyStateSubtext}>
                                    {selectedFilter !== 'all'
                                        ? `No ${selectedFilter} jobs found for the selected period`
                                        : 'Complete your first interpretation to see earnings here'
                                    }
                                </Text>
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

    // Summary Section
    summarySection: {
        marginBottom: theme.spacing.md,
    },
    summaryCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryCardSmall: {
        flex: 1,
        marginRight: theme.spacing.sm,
        padding: theme.spacing.md,
    },
    summaryCardContent: {
        flex: 1,
    },
    summaryRow: {
        flexDirection: 'row',
    },
    summaryLabel: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },
    summaryValue: {
        ...theme.typography.h1,
        color: theme.colors.success,
        fontWeight: '700',
    },
    summaryValueSmall: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        fontWeight: '600',
    },

    // Commission Section
    commissionSection: {
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
    commissionCard: {
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.md,
    },
    commissionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
    },
    commissionItemTotal: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        marginTop: theme.spacing.sm,
        paddingTop: theme.spacing.md,
    },
    commissionLabel: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
    },
    commissionValue: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
    },
    commissionLabelTotal: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        fontWeight: '600',
    },
    commissionValueTotal: {
        ...theme.typography.h3,
        color: theme.colors.success,
        fontWeight: '700',
    },

    // Filters Section
    filtersSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    filterGroup: {
        marginBottom: theme.spacing.md,
    },
    filterLabel: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    filterContainer: {
        flexDirection: 'row',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceLight,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        marginRight: theme.spacing.sm,
    },
    filterButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },
    filterButtonTextActive: {
        color: theme.colors.text.white,
    },
    monthButton: {
        backgroundColor: theme.colors.surfaceLight,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        marginRight: theme.spacing.sm,
    },
    monthButtonActive: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondary,
    },
    monthButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
    },
    monthButtonTextActive: {
        color: theme.colors.text.white,
    },

    // Earnings Section
    earningsSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },

    // Earnings Item
    earningsItem: {
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        backgroundColor: theme.colors.surfaceLight,
    },
    earningsItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
    },
    earningsItemLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
        marginRight: theme.spacing.md,
    },
    callTypeIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.sm,
    },
    earningsItemInfo: {
        flex: 1,
    },
    earningsItemTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: 2,
    },
    earningsItemClient: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },
    earningsItemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    earningsItemDate: {
        ...theme.typography.small,
        color: theme.colors.text.light,
        marginRight: theme.spacing.sm,
    },
    specialtyTag: {
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.sm,
    },
    specialtyTagText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
    },
    earningsItemRight: {
        alignItems: 'flex-end',
    },
    earningsItemAmount: {
        ...theme.typography.h3,
        color: theme.colors.success,
        fontWeight: '600',
        marginBottom: 2,
    },
    earningsItemDuration: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },

    // Earnings Details
    earningsItemDetails: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: theme.spacing.sm,
    },
    earningsBreakdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xs,
    },
    breakdownItem: {
        alignItems: 'center',
    },
    breakdownLabel: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
        marginBottom: 2,
    },
    breakdownValue: {
        ...theme.typography.caption,
        color: theme.colors.text.primary,
        fontWeight: '500',
    },
    rateInfo: {
        alignItems: 'center',
        marginTop: theme.spacing.xs,
    },
    rateText: {
        ...theme.typography.small,
        color: theme.colors.text.light,
        fontStyle: 'italic',
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

export default EarningsScreen;