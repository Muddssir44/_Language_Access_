import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
    StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from './theme';

const InputField = ({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType = 'default',
    autoCapitalize = 'none',
    icon,
    rightIcon,
    onRightIconPress,
    error,
    touched,
    style,
    inputStyle,
    multiline = false,
    numberOfLines = 1,
    editable = true,
    showPasswordToggle = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const animatedFocus = useRef(new Animated.Value(value ? 1 : 0)).current;
    const animatedError = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedFocus, {
            toValue: isFocused || value ? 1 : 0,
            duration: theme.animations.fast,
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);

    useEffect(() => {
        if (error && touched) {
            Animated.sequence([
                Animated.timing(animatedError, {
                    toValue: 1,
                    duration: theme.animations.fast,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedError, {
                    toValue: 0,
                    duration: theme.animations.fast,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedError, {
                    toValue: 1,
                    duration: theme.animations.fast,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [error, touched]);

    const labelStyle = {
        position: 'absolute',
        left: icon ? 48 : theme.spacing.md,
        top: animatedFocus.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 8],
        }),
        fontSize: animatedFocus.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: animatedFocus.interpolate({
            inputRange: [0, 1],
            outputRange: [theme.colors.text.placeholder, error && touched ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.text.secondary],
        }),
    };

    const borderColor = error && touched
        ? theme.colors.error
        : isFocused
            ? theme.colors.primary
            : theme.colors.border;

    const handleTogglePassword = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const actualSecureTextEntry = secureTextEntry && !isPasswordVisible;

    return (
        <View style={[styles.container, style]}>
            <Animated.View
                style={[
                    styles.inputContainer,
                    {
                        borderColor,
                        transform: [{
                            translateX: animatedError.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 5],
                            }),
                        }],
                    },
                ]}
            >
                {icon && (
                    <View style={styles.leftIconContainer}>
                        <Feather
                            name={icon}
                            size={20}
                            color={isFocused ? theme.colors.primary : theme.colors.text.secondary}
                        />
                    </View>
                )}

                <View style={styles.inputWrapper}>
                    <Animated.Text style={labelStyle}>
                        {label}
                    </Animated.Text>
                    <TextInput
                        style={[
                            styles.input,
                            inputStyle,
                            {
                                paddingLeft: icon ? 0 : 0,
                                paddingTop: label ? 24 : theme.spacing.md,
                            },
                        ]}
                        placeholder={!isFocused && !value ? placeholder : ''}
                        placeholderTextColor={theme.colors.text.placeholder}
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={actualSecureTextEntry}
                        keyboardType={keyboardType}
                        autoCapitalize={autoCapitalize}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        multiline={multiline}
                        numberOfLines={numberOfLines}
                        editable={editable}
                    />
                </View>

                {(rightIcon || (secureTextEntry && showPasswordToggle)) && (
                    <TouchableOpacity
                        style={styles.rightIconContainer}
                        onPress={secureTextEntry && showPasswordToggle ? handleTogglePassword : onRightIconPress}
                        activeOpacity={0.7}
                    >
                        <Feather
                            name={
                                secureTextEntry && showPasswordToggle
                                    ? isPasswordVisible
                                        ? 'eye-off'
                                        : 'eye'
                                    : rightIcon
                            }
                            size={20}
                            color={theme.colors.text.secondary}
                        />
                    </TouchableOpacity>
                )}
            </Animated.View>

            {error && touched && (
                <Animated.View style={[styles.errorContainer, { opacity: animatedError }]}>
                    <Feather name="alert-circle" size={14} color={theme.colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.surface,
        minHeight: 56,
        paddingHorizontal: theme.spacing.md,
    },
    leftIconContainer: {
        marginRight: theme.spacing.md,
    },
    inputWrapper: {
        flex: 1,
        position: 'relative',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text.primary,
        paddingVertical: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
    },
    rightIconContainer: {
        marginLeft: theme.spacing.md,
        padding: theme.spacing.xs,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
    },
    errorText: {
        marginLeft: theme.spacing.xs,
        fontSize: 12,
        color: theme.colors.error,
        flex: 1,
    },
});

export default InputField;