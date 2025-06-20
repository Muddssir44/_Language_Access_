import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Animated,
    Platform,
    Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced theme for consistency
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

const DynamicHeader = ({
    type = 'back',
    title = 'Header',
    subtitle = null,
    scrollY = null,
    onBack,
    onBell,
    onProfile,
    onFavorite,
    onSearch,
    showFavorite = false,
    showBell = false,
    showProfile = false,
    showSearch = false,
    backgroundColor = theme.colors.surface,
    titleColor = theme.colors.text.primary,
    iconColor = theme.colors.text.primary,
    elevation = true,
    transparent = false,
    hideOnScroll = true,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const headerHeight = Platform.OS === 'ios' ? 88 : 56 + (StatusBar.currentHeight || 0);

    useEffect(() => {
        // Initial fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, []);

    useEffect(() => {
        if (!scrollY || !hideOnScroll) return;

        const listener = scrollY.addListener(({ value }) => {
            // Create scroll-based header animation
            const shouldHide = value > 50; // Hide after scrolling 50px

            Animated.timing(translateY, {
                toValue: shouldHide ? -headerHeight : 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });

        return () => {
            scrollY.removeListener(listener);
        };
    }, [scrollY, hideOnScroll, headerHeight]);

    const renderHeaderContent = () => {
        switch (type) {
            case 'home':
                return (
                    <>
                        <View style={styles.headerLeft}>
                            <Text style={[styles.headerTitle, { color: titleColor }]}>{title}</Text>
                            {subtitle && (
                                <Text style={[styles.headerSubtitle, { color: titleColor }]}>{subtitle}</Text>
                            )}
                        </View>
                        <View style={styles.headerActions}>
                            {showSearch && (
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={onSearch}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="search" size={24} color={iconColor} />
                                </TouchableOpacity>
                            )}
                            {showBell && (
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={onBell}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="bell" size={24} color={iconColor} />
                                    {/* Notification badge could be added here */}
                                </TouchableOpacity>
                            )}
                            {showProfile && (
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={onProfile}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="user" size={24} color={iconColor} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </>
                );
            case 'back':
                return (
                    <>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={onBack}
                                activeOpacity={0.7}
                            >
                                <Feather name="chevron-left" size={24} color={iconColor} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.centeredTitleContainer} pointerEvents="none">
                            <Text style={[styles.headerTitleSecondary, styles.centeredTitleText, { color: titleColor }]} numberOfLines={1}>
                                {title}
                            </Text>
                            {subtitle && (
                                <Text style={[styles.headerSubtitleSecondary, styles.centeredSubtitleText, { color: titleColor }]} numberOfLines={1}>
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                        <View style={styles.headerActions}>
                            {showSearch && (
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={onSearch}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="search" size={20} color={iconColor} />
                                </TouchableOpacity>
                            )}
                            {showFavorite && (
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={onFavorite}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="heart" size={20} color={iconColor} />
                                </TouchableOpacity>
                            )}
                            {showBell && (
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={onBell}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="bell" size={20} color={iconColor} />
                                </TouchableOpacity>
                            )}
                            {showProfile && (
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={onProfile}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="user" size={20} color={iconColor} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </>
                );
            case 'center':
                return (
                    <>
                        <View style={styles.centerTitleContainer}>
                            <Text style={[styles.headerTitleCenter, { color: titleColor }]} numberOfLines={1}>
                                {title}
                            </Text>
                            {subtitle && (
                                <Text style={[styles.headerSubtitleCenter, { color: titleColor }]} numberOfLines={1}>
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                        <View style={styles.headerActions}>
                            {showSearch && (
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={onSearch}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="search" size={20} color={iconColor} />
                                </TouchableOpacity>
                            )}
                            {showBell && (
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={onBell}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="bell" size={20} color={iconColor} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </>
                );
            default:
                return (
                    <Text style={[styles.headerTitleSecondary, { color: titleColor }]} numberOfLines={1}>
                        {title}
                    </Text>
                );
        }
    };

    const dynamicStyle = {
        backgroundColor: transparent ? 'transparent' : backgroundColor,
        elevation: elevation && !transparent ? 4 : 0,
        shadowOpacity: elevation && !transparent ? 0.1 : 0,
        opacity: fadeAnim,
        transform: [{ translateY }],
    };

    return (
        <Animated.View style={[styles.header, dynamicStyle]}>
            <StatusBar
                barStyle={backgroundColor === theme.colors.surface ? "dark-content" : "light-content"}
                backgroundColor={transparent ? 'transparent' : backgroundColor}
                translucent={transparent}
            />
            <View style={styles.headerContent}>
                {renderHeaderContent()}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: theme.colors.surface,
        paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        shadowColor: theme.colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 4,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        minHeight: 44,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        padding: theme.spacing.sm,
        marginRight: theme.spacing.xs,
        marginLeft: -theme.spacing.sm, // Align with screen edge
        borderRadius: theme.borderRadius.sm,
    },
    titleContainer: {
        flex: 1,
        marginLeft: theme.spacing.xs,
    },
    centerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        fontWeight: '700',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginTop: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleSecondary: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        fontWeight: '600',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerSubtitleSecondary: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginTop: 2,
    },
    headerTitleCenter: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        fontWeight: '600',
        textAlign: 'center',
    },
    headerSubtitleCenter: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        marginTop: 2,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    headerButton: {
        padding: theme.spacing.sm,
        marginLeft: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40,
        minHeight: 40,
    },
    centeredTitleContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
        paddingHorizontal: 56, // enough space for back and right actions
    },
    centeredTitleText: {
        textAlign: 'center',
        width: '100%',
    },
    centeredSubtitleText: {
        textAlign: 'center',
        width: '100%',
    },
});

export default DynamicHeader;
