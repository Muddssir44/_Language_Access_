import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from './theme';

const { width: screenWidth } = Dimensions.get('window');

const RoleCard = ({
    icon,
    title,
    subtitle,
    description,
    gradient,
    isSelected,
    onPress,
    index,
    features,
}) => {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const selectedAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Initial animation
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: theme.animations.slow,
                delay: index * 200,
                useNativeDriver: false,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                ...theme.animations.spring,
                delay: index * 200,
                useNativeDriver: false,
            }),
        ]).start();

        // Glow effect loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    useEffect(() => {
        Animated.spring(selectedAnim, {
            toValue: isSelected ? 1 : 0,
            ...theme.animations.spring,
            useNativeDriver: false,
        }).start();
    }, [isSelected]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: false,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: false,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={styles.touchable}
            >
                <Animated.View
                    style={[
                        styles.card,
                        {
                            borderWidth: selectedAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 3],
                            }),
                            borderColor: selectedAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [theme.colors.border, gradient[0]],
                            }),
                            shadowOpacity: selectedAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.1, 0.3],
                            }),
                            shadowRadius: selectedAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [8, 16],
                            }),
                        },
                    ]}
                >
                    {/* Glow effect */}
                    {isSelected && (
                        <Animated.View
                            style={[
                                styles.glowOverlay,
                                {
                                    opacity: glowAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.1, 0.3],
                                    }),
                                },
                            ]}
                        >
                            <LinearGradient
                                colors={[...gradient, 'transparent']}
                                style={styles.glow}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            />
                        </Animated.View>
                    )}

                    {/* Header */}
                    <View style={styles.header}>
                        <LinearGradient
                            colors={gradient}
                            style={styles.iconContainer}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Feather name={icon} size={32} color={theme.colors.text.white} />
                        </LinearGradient>

                        {isSelected && (
                            <Animated.View
                                style={[
                                    styles.checkmark,
                                    {
                                        opacity: selectedAnim,
                                        transform: [{
                                            scale: selectedAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.3, 1],
                                            }),
                                        }],
                                    },
                                ]}
                            >
                                <LinearGradient
                                    colors={gradient}
                                    style={styles.checkmarkBg}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Feather name="check" size={16} color={theme.colors.text.white} />
                                </LinearGradient>
                            </Animated.View>
                        )}
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                        <Text style={styles.description}>{description}</Text>

                        {/* Features */}
                        {features && (
                            <View style={styles.features}>
                                {features.map((feature, idx) => (
                                    <View key={idx} style={styles.feature}>
                                        <View style={[styles.featureDot, { backgroundColor: gradient[0] }]} />
                                        <Text style={styles.featureText}>{feature}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Footer CTA */}
                    <Animated.View
                        style={[
                            styles.footer,
                            {
                                backgroundColor: selectedAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [theme.colors.surfaceLight, gradient[0] + '20'],
                                }),
                            },
                        ]}
                    >
                        <Text style={[
                            styles.ctaText,
                            {
                                color: isSelected ? gradient[0] : theme.colors.text.secondary,
                                fontWeight: isSelected ? '600' : '500',
                            },
                        ]}>
                            {isSelected ? 'Selected' : 'Tap to Select'}
                        </Text>
                        <Feather
                            name={isSelected ? "check-circle" : "arrow-right"}
                            size={16}
                            color={isSelected ? gradient[0] : theme.colors.text.secondary}
                        />
                    </Animated.View>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: screenWidth - theme.spacing.xl,
        marginHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    touchable: {
        flex: 1,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        ...theme.shadows.lg,
        overflow: 'hidden',
        position: 'relative',
    },
    glowOverlay: {
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: theme.borderRadius.xl,
        zIndex: -1,
    },
    glow: {
        flex: 1,
        borderRadius: theme.borderRadius.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: theme.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.md,
    },
    checkmark: {
        position: 'absolute',
        top: -8,
        right: -8,
    },
    checkmarkBg: {
        width: 32,
        height: 32,
        borderRadius: theme.borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.md,
    },
    content: {
        marginBottom: theme.spacing.lg,
    },
    title: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        ...theme.typography.bodyMedium,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.md,
    },
    description: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        lineHeight: 20,
        marginBottom: theme.spacing.md,
    },
    features: {
        marginTop: theme.spacing.sm,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    featureDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: theme.spacing.sm,
    },
    featureText: {
        ...theme.typography.small,
        color: theme.colors.text.secondary,
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        marginHorizontal: -theme.spacing.xl,
        marginBottom: -theme.spacing.xl,
        borderBottomLeftRadius: theme.borderRadius.xl,
        borderBottomRightRadius: theme.borderRadius.xl,
    },
    ctaText: {
        ...theme.typography.captionMedium,
    },
});

export default RoleCard;