import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import { Ionicons, Feather, FontAwesome, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
export const newsItems = [
    {
        id: 1,
        title: 'New Medical Interpretation Standards Released',
        summary: 'Latest guidelines for healthcare interpretation services...',
        category: 'Medical',
        readTime: '3 min read',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop'
    },
    {
        id: 2,
        title: 'Legal Interpretation Best Practices',
        summary: 'Essential tips for courtroom interpretation...',
        category: 'Legal',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=200&fit=crop'
    }
];


const NewsCard = ({ item }) => (
    <TouchableOpacity style={styles.newsCard}>
        <Image source={{ uri: item.image }} style={styles.newsImage} />
        <View style={styles.newsContent}>
            <View style={styles.newsHeader}>
                <Text style={styles.newsCategory}>{item.category}</Text>
                <Text style={styles.newsReadTime}>{item.readTime}</Text>
            </View>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsSummary}>{item.summary}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({


    newsSection: {
        paddingVertical: 20,
    },
    newsContainer: {
        paddingHorizontal: 20,
    },
    newsCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 16,
        width: width * 0.75,
        ...theme.shadow,
    },
    newsImage: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        backgroundColor: theme.border,
    },
    newsContent: {
        padding: 16,
    },
    newsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    newsCategory: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.primary,
        textTransform: 'uppercase',
    },
    newsReadTime: {
        fontSize: 12,
        color: theme.text.light,
    },
    newsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.text.primary,
        marginBottom: 8,
    },
    newsSummary: {
        fontSize: 14,
        color: theme.text.secondary,
        lineHeight: 20,
    },
});
export default NewsCard;