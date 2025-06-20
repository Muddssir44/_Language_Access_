// Shared theme configuration for all screens
export const theme = {
    colors: {
        primary: '#4F46E5',
        primaryLight: '#818CF8',
        primaryDark: '#3730A3',
        secondary: '#06B6D4',
        secondaryLight: '#22D3EE',
        accent: '#F59E0B',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        surfaceLight: '#F8FAFC',
        surfaceDark: '#F1F5F9',
        text: {
            primary: '#1F2937',
            secondary: '#6B7280',
            light: '#9CA3AF',
            white: '#FFFFFF',
            placeholder: '#A1A1AA',
        },
        border: '#E5E7EB',
        borderLight: '#F3F4F6',
        shadow: 'rgba(0, 0, 0, 0.1)',
        shadowDark: 'rgba(0, 0, 0, 0.2)',
        overlay: 'rgba(0, 0, 0, 0.5)',
        gradient: {
            primary: ['#4F46E5', '#7C3AED'],
            secondary: ['#06B6D4', '#0891B2'],
            accent: ['#F59E0B', '#D97706'],
            success: ['#10B981', '#059669'],
            brand: ['#667EEA', '#764BA2'],
            sunset: ['#FF6B6B', '#4ECDC4'],
        },
        client: {
            primary: '#4F46E5',
            gradient: ['#4F46E5', '#7C3AED'],
            light: '#EEF2FF',
        },
        interpreter: {
            primary: '#059669',
            gradient: ['#059669', '#047857'],
            light: '#ECFDF5',
        },
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
        xxxl: 64,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
    },
    typography: {
        h1: { fontSize: 28, fontWeight: '700' },
        h2: { fontSize: 24, fontWeight: '600' },
        h3: { fontSize: 20, fontWeight: '600' },
        h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
        body: { fontSize: 16, fontWeight: '400' },
        bodyLarge: { fontSize: 18, fontWeight: '400', lineHeight: 28 },
        bodyMedium: { fontSize: 16, fontWeight: '500' },
        caption: { fontSize: 14, fontWeight: '400' },
        captionMedium: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
        small: { fontSize: 12, fontWeight: '400' },
        smallMedium: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 5,
        },
        xl: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 24,
            elevation: 8,
        },
    },
    animations: {
        fast: 200,
        normal: 300,
        slow: 500,
        bounce: {
            tension: 100,
            friction: 8,
        },
        spring: {
            tension: 150,
            friction: 7,
        },
    },
};

// Calculate header height for proper padding
export const getHeaderHeight = () => {
    const { Platform, StatusBar } = require('react-native');
    return Platform.OS === 'ios' ? 88 + 44 : 56 + (StatusBar.currentHeight || 0) + 16;
};

export default theme;
