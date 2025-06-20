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
    Slider,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DynamicHeader from '../Components/DynamicHeader';
import { theme, getHeaderHeight } from '../Components/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CallRateScreen = ({ navigation, onBack }) => {
    const [rates, setRates] = useState({
        audio: 2.50,
        video: 3.00,
        zoom: 3.25,
        onsite: 5.00,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [tempRates, setTempRates] = useState({ ...rates });

    const callTypes = [
        {
            key: 'audio',
            title: 'Audio Call',
            description: 'Standard phone interpretation',
            icon: 'phone',
            color: theme.colors.primary,
            minRate: 1.50,
            maxRate: 8.00,
            recommendedMin: 2.00,
            recommendedMax: 4.00,
        },
        {
            key: 'video',
            title: 'Video Call',
            description: 'Video interpretation via app',
            icon: 'video',
            color: theme.colors.secondary,
            minRate: 2.00,
            maxRate: 10.00,
            recommendedMin: 2.50,
            recommendedMax: 5.00,
        },
        {
            key: 'zoom',
            title: 'Zoom/Teams Call',
            description: 'Third-party platform calls',
            icon: 'monitor',
            color: theme.colors.accent,
            minRate: 2.50,
            maxRate: 12.00,
            recommendedMin: 3.00,
            recommendedMax: 6.00,
        },
        {
            key: 'onsite',
            title: 'On-site Interpretation',
            description: 'In-person interpretation',
            icon: 'map-pin',
            color: theme.colors.success,
            minRate: 3.00,
            maxRate: 15.00,
            recommendedMin: 4.00,
            recommendedMax: 8.00,
        },
    ];

    const handleRateChange = (callType, value) => {
        setTempRates({ ...tempRates, [callType]: value });
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (navigation) {
            navigation.goBack();
        }
    };

    const handleSave = () => {
        setRates({ ...tempRates });
        setIsEditing(false);
        Alert.alert('Success', 'Your call rates have been updated successfully!');
    };

    const handleCancel = () => {
        setTempRates({ ...rates });
        setIsEditing(false);
    };

    const getEstimatedEarnings = (rate) => {
        // Calculate estimated monthly earnings based on average calls
        const avgCallsPerMonth = 40;
        const avgCallDuration = 25; // minutes
        const monthlyEarnings = (rate * (avgCallDuration / 60) * avgCallsPerMonth);
        return monthlyEarnings;
    };

    const getRateStatus = (rate, callType) => {
        const config = callTypes.find(type => type.key === callType);
        if (rate < config.recommendedMin) return 'low';
        if (rate > config.recommendedMax) return 'high';
        return 'optimal';
    };

    const renderRateCard = (callType) => {
        const config = callTypes.find(type => type.key === callType.key);
        const currentRate = isEditing ? tempRates[callType.key] : rates[callType.key];
        const rateStatus = getRateStatus(currentRate, callType.key);
        const estimatedEarnings = getEstimatedEarnings(currentRate);

        const statusConfig = {
            low: { color: theme.colors.error, text: 'Below recommended' },
            optimal: { color: theme.colors.success, text: 'Optimal range' },
            high: { color: theme.colors.warning, text: 'Above market rate' },
        };

        return (
            <View key={callType.key} style={styles.rateCard}>
                <View style={styles.rateCardHeader}>
                    <View style={styles.rateCardLeft}>
                        <View style={[styles.rateCardIcon, { backgroundColor: callType.color }]}>
                            <Feather name={callType.icon} size={20} color={theme.colors.text.white} />
                        </View>
                        <View style={styles.rateCardInfo}>
                            <Text style={styles.rateCardTitle}>{callType.title}</Text>
                            <Text style={styles.rateCardDescription}>{callType.description}</Text>
                        </View>
                    </View>
                    <View style={styles.rateCardRight}>
                        <Text style={styles.rateCardValue}>${currentRate.toFixed(2)}</Text>
                        <Text style={styles.rateCardUnit}>per minute</Text>
                    </View>
                </View>

                {isEditing && (
                    <View style={styles.sliderContainer}>
                        <View style={styles.sliderHeader}>
                            <Text style={styles.sliderMin}>${callType.minRate}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: statusConfig[rateStatus].color }]}>
                                <Text style={styles.statusText}>{statusConfig[rateStatus].text}</Text>
                            </View>
                            <Text style={styles.sliderMax}>${callType.maxRate}</Text>
                        </View>
                        <Slider
                            style={styles.slider}
                            minimumValue={callType.minRate}
                            maximumValue={callType.maxRate}
                            value={currentRate}
                            onValueChange={(value) => handleRateChange(callType.key, parseFloat(value.toFixed(2)))}
                            step={0.25}
                            minimumTrackTintColor={callType.color}
                            maximumTrackTintColor={theme.colors.border}
                            thumbStyle={{ backgroundColor: callType.color }}
                        />
                        <View style={styles.recommendedRange}>
                            <Text style={styles.recommendedText}>
                                Recommended: ${callType.recommendedMin} - ${callType.recommendedMax}
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.rateCardFooter}>
                    <View style={styles.earningsEstimate}>
                        <Text style={styles.earningsLabel}>Est. monthly earnings:</Text>
                        <Text style={styles.earningsValue}>${estimatedEarnings.toFixed(0)}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <DynamicHeader
                type="back"
                title="Manage Call Rates"
                onBack={handleBack}
            />

            <ScrollView
                style={[styles.content, { paddingTop: getHeaderHeight() }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.infoSection}>
                    <Feather name="dollar-sign" size={48} color={theme.colors.accent} />
                    <Text style={styles.infoTitle}>Set Your Call Rates</Text>
                    <Text style={styles.infoText}>
                        Optimize your rates to maximize earnings while staying competitive in the market.
                    </Text>
                </View>

                <View style={styles.statsSection}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>$3.19</Text>
                        <Text style={styles.statLabel}>Market Average</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>4.9★</Text>
                        <Text style={styles.statLabel}>Your Rating</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>127</Text>
                        <Text style={styles.statLabel}>Total Calls</Text>
                    </View>
                </View>

                <View style={styles.ratesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Call Type Rates</Text>
                        {!isEditing ? (
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => setIsEditing(true)}
                            >
                                <Feather name="edit-2" size={16} color={theme.colors.primary} />
                                <Text style={styles.editButtonText}>Edit Rates</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.editActions}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.cancelButton]}
                                    onPress={handleCancel}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.saveButton]}
                                    onPress={handleSave}
                                >
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {callTypes.map(renderRateCard)}
                </View>

                {!isEditing && (
                    <View style={styles.tipsSection}>
                        <Text style={styles.tipsTitle}>Rate Optimization Tips</Text>
                        <View style={styles.tipsList}>
                            <View style={styles.tipItem}>
                                <Feather name="trending-up" size={16} color={theme.colors.success} />
                                <Text style={styles.tipText}>Higher ratings allow for premium rates</Text>
                            </View>
                            <View style={styles.tipItem}>
                                <Feather name="clock" size={16} color={theme.colors.accent} />
                                <Text style={styles.tipText}>Peak hours (business hours) command higher rates</Text>
                            </View>
                            <View style={styles.tipItem}>
                                <Feather name="award" size={16} color={theme.colors.primary} />
                                <Text style={styles.tipText}>Specialized skills can justify premium pricing</Text>
                            </View>
                            <View style={styles.tipItem}>
                                <Feather name="users" size={16} color={theme.colors.secondary} />
                                <Text style={styles.tipText}>Long-term clients often accept higher rates</Text>
                            </View>
                        </View>
                    </View>
                )}

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
        paddingHorizontal: theme.spacing.lg,
    },

    // Info Section
    infoSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xl,
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    infoTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    infoText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },

    // Stats Section
    statsSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    statLabel: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },

    // Rates Section
    ratesSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceLight,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    editButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.primary,
        marginLeft: theme.spacing.xs,
    },
    editActions: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    actionButton: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
    },
    cancelButton: {
        backgroundColor: theme.colors.surfaceLight,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cancelButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
    },
    saveButton: {
        backgroundColor: theme.colors.success,
    },
    saveButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.white,
    },

    // Rate Card Styles
    rateCard: {
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surfaceLight,
    },
    rateCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    rateCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rateCardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    rateCardInfo: {
        flex: 1,
    },
    rateCardTitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.primary,
        marginBottom: 2,
    },
    rateCardDescription: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    rateCardRight: {
        alignItems: 'flex-end',
    },
    rateCardValue: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
    },
    rateCardUnit: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },

    // Slider Styles
    sliderContainer: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    sliderMin: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    sliderMax: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
    },
    statusText: {
        ...theme.typography.small,
        color: theme.colors.text.white,
        fontWeight: '600',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    recommendedRange: {
        alignItems: 'center',
        marginTop: theme.spacing.xs,
    },
    recommendedText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        fontStyle: 'italic',
    },

    // Rate Card Footer
    rateCardFooter: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: theme.spacing.sm,
        marginTop: theme.spacing.sm,
    },
    earningsEstimate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    earningsLabel: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },
    earningsValue: {
        ...theme.typography.bodyMedium,
        color: theme.colors.success,
        fontWeight: '600',
    },

    // Tips Section
    tipsSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    tipsTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    tipsList: {
        gap: theme.spacing.sm,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tipText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.sm,
        flex: 1,
    },

    // Bottom Spacing
    bottomSpacing: {
        height: 150,
    },
});

export default CallRateScreen;