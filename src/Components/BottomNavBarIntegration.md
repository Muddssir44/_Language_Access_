# BottomNavBar Integration Guide

## Overview
The `BottomNavBar` component is a dynamic, role-aware navigation component that adapts to both Client and Interpreter portals automatically.

## Features
- 🔄 **Role-Aware**: Automatically adapts tabs based on user role
- 🎯 **Smart Navigation**: Handles navigation with fallback error handling
- 📱 **Responsive**: Safe area aware with platform-specific styling
- ✨ **Animated**: Smooth transitions and interactive feedback
- 🔔 **Badge Support**: Shows notification badges for Messages and Jobs
- ♿ **Accessible**: Full accessibility support

## Basic Usage

### In Home Screens
```jsx
import BottomNavBar from '../Components/BottomNavBar';

const ClientHomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Your screen content */}
            
            <BottomNavBar 
                navigation={navigation} 
                activeTab="Home"
                userRole="client"
            />
        </View>
    );
};
```

### In Other Screens
```jsx
import BottomNavBar from '../Components/BottomNavBar';

const MessagesScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Your screen content */}
            
            <BottomNavBar 
                navigation={navigation} 
                activeTab="Messages"
                userRole="client" // or "interpreter"
            />
        </View>
    );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `navigation` | object | required | React Navigation navigation object |
| `activeTab` | string | `'Home'` | Currently active tab identifier |
| `userRole` | string | `'client'` | User role: `'client'` or `'interpreter'` |
| `onTabPress` | function | `null` | Custom tab press handler (optional) |

## Tab Configurations

### Client Portal Tabs
- **Home**: Navigate to ClientHome
- **Messages**: Navigate to Messages (with badge)
- **Find**: Navigate to FindInterpreter  
- **Post Job**: Navigate to PostJob

### Interpreter Portal Tabs
- **Home**: Navigate to InterpreterHome
- **Messages**: Navigate to Messages (with badge)
- **Browse**: Navigate to FindInterpreter
- **Jobs**: Navigate to InterpreterJobListing (with badge)

## Custom Tab Press Handling

```jsx
const handleCustomTabPress = (tab) => {
    console.log('Tab pressed:', tab);
    
    // Custom logic here
    if (tab.id === 'Messages') {
        // Mark messages as read before navigation
        markMessagesAsRead();
    }
    
    // Then navigate
    navigation.navigate(tab.screen);
};

<BottomNavBar 
    navigation={navigation}
    activeTab="Home"
    userRole="client"
    onTabPress={handleCustomTabPress}
/>
```

## Content Padding

Always add bottom padding to your ScrollView or main content to prevent overlap:

```jsx
const styles = StyleSheet.create({
    scrollViewContent: {
        paddingBottom: 100, // Space for bottom navigation
    },
    // or for regular Views
    container: {
        flex: 1,
        paddingBottom: 80, // Adjust based on your needs
    },
});
```

## Badge System

The component automatically shows badges for:
- **Messages**: Unread message count
- **Jobs** (Interpreter): New job posting count

To customize badge counts, modify the `getBadgeCount` function in the component.

## Styling Customization

The component uses the shared theme system. To customize:

1. **Colors**: Modify `theme.colors` in your theme file
2. **Role-specific colors**: Update the `activeColor` logic
3. **Animation timing**: Adjust the animation parameters in the component

## Error Handling

The component includes built-in error handling:
- Safe navigation with try-catch blocks
- Fallback for missing screens
- Console warnings for debugging
- Graceful degradation if navigation fails

## Accessibility

The component is fully accessible with:
- Proper `accessibilityRole` and `accessibilityLabel`
- `accessibilityState` for active states
- Screen reader support
- Keyboard navigation support

## Best Practices

1. **Always pass the correct `activeTab`** matching your current screen
2. **Set the appropriate `userRole`** based on authenticated user
3. **Add bottom padding** to prevent content overlap
4. **Test navigation** on both platforms
5. **Handle edge cases** in custom tab press handlers

## Examples in Different Screens

### FindInterpreterScreen
```jsx
<BottomNavBar 
    navigation={navigation}
    activeTab="FindInterpreter"
    userRole="client"
/>
```

### InterpreterJobListingScreen
```jsx
<BottomNavBar 
    navigation={navigation}
    activeTab="JobListings"
    userRole="interpreter"
/>
```

### PostJobScreen
```jsx
<BottomNavBar 
    navigation={navigation}
    activeTab="PostJob"
    userRole="client"
/>
```

## Troubleshooting

### Navigation Not Working
- Ensure screen names match your navigation stack
- Check that `navigation` prop is passed correctly
- Verify screen is registered in your navigator

### Styling Issues
- Check if you've added proper bottom padding
- Verify theme imports are correct
- Test on different screen sizes

### Badge Not Showing
- Check the `getBadgeCount` function
- Ensure badge property is set to `true` in tab config
- Verify the tab ID matches in the badge logic

## Future Enhancements

- Dynamic badge counts from app state
- Custom tab configurations
- Theme switching support
- Haptic feedback integration
- Deep linking support