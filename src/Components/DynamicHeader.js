
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const DynamicHeader = ({ screenName, showNotifications = false, showProfile = false, showBack = false, showFavorites = false, onBack, onNotifications, onProfile, onFavorites }) => {
    return (
        <View style={styles.header}>
            <StatusBar backgroundColor={theme.primary} barStyle="light-content" />
            <View style={styles.headerContent}>
                {showBack ? (
                    <TouchableOpacity onPress={onBack} style={styles.headerButton}>
                        <ChevronRight size={24} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.headerButton} />
                )}

                <Text style={styles.headerTitle}>
                    {screenName || 'InterpretConnect'}
                </Text>

                <View style={styles.headerActions}>
                    {showFavorites && (
                        <TouchableOpacity onPress={onFavorites} style={styles.headerButton}>
                            <Feather size={24} color="#fff" />
                        </TouchableOpacity>
                    )}
                    {showNotifications && (
                        <TouchableOpacity onPress={onNotifications} style={styles.headerButton}>
                            <Ionicons size={24} color="#fff" />
                            <View style={styles.notificationBadge} />
                        </TouchableOpacity>
                    )}
                    {showProfile && (
                        <TouchableOpacity onPress={onProfile} style={styles.headerButton}>
                            <Feather size={24} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};
export default DynamicHeader;

const styles = StyleSheet.create({
    header: {
        backgroundColor: theme.primary,
        paddingTop: StatusBar.currentHeight || 0,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.warning,
    },

});
