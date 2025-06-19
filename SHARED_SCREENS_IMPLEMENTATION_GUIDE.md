# Shared Screens Implementation Guide

## Overview
This document outlines the implementation of role-aware shared screens that work independently for both **Client** and **Interpreter** user roles in the LanguageAccess application.

## Updated Screens

### Core Profile Screens
All these screens now accept `userRole` and `userId` props and work independently for both user types:

1. **My Profile** (`MyProfileScreen`)
2. **Change Password** (`ChangePasswordScreen`)
3. **Card Registration** (`CardRegistrationScreen`)
4. **Call History** (`CallHistoryScreen`)
5. **Payment History** (`PaymentHistoryScreen`)
6. **Language Coverage** (`LanguageCoverageScreen`)
7. **About** (`AboutScreen`)
8. **Terms of Use** (`TermsScreen`)
9. **Privacy Policy** (`PrivacyPolicyScreen`)
10. **Contact Us** (`ContactUsScreen`)
11. **App Version** (`VersionScreen`)
12. **Sign Out Confirmation** (`SignOutConfirmationScreen`)
13. **Delete Account** (`DeleteAccountScreen`)
14. **Messages Screen** (`MessagesScreen`)
15. **Notification Screen** (`NotificationScreen`)

## Key Implementation Changes

### 1. Role-Aware Props
All shared screens now accept:
```javascript
{
  userRole = 'client', // 'client' | 'interpreter'
  userId,              // unique user identifier
  onBack,             // navigation callback
  // ... other specific props
}
```

### 2. Backend Integration Ready
Each screen includes proper API endpoints based on user role:

#### Profile Management
```javascript
// Client endpoints
GET/PUT /api/client/profile/${userId}
GET /api/client/payment-methods/${userId}
GET /api/client/call-history/${userId}
GET /api/client/payment-history/${userId}

// Interpreter endpoints  
GET/PUT /api/interpreter/profile/${userId}
GET /api/interpreter/payment-methods/${userId}
GET /api/interpreter/call-history/${userId}
GET /api/interpreter/payment-history/${userId}
```

#### Authentication & Security
```javascript
// All requests include authentication
headers: {
  'Authorization': `Bearer ${getUserToken()}`,
  'Content-Type': 'application/json'
}
```

### 3. Role-Specific UI Elements

#### My Profile Screen
- **Client**: Shows company, job title, general fields
- **Interpreter**: Shows specialty, languages, experience, hourly rate, certifications

#### Call History Screen
- **Client**: Shows "Cost" and "Interpreter" columns
- **Interpreter**: Shows "Earnings" and "Client" columns

#### Payment History Screen  
- **Client**: Shows payments made and refunds received
- **Interpreter**: Shows earnings received and payouts

#### Language Coverage Screen
- **Client**: Shows available interpreters per language pair
- **Interpreter**: Shows market demand and average rates

#### Contact Us Screen
- **Client**: General support contact (support@languageaccess.com)
- **Interpreter**: Specialized interpreter support (interpreters@languageaccess.com)

#### Messages Screen
- **Client**: Shows conversations with interpreters
- **Interpreter**: Shows conversations with clients

#### Notifications Screen
- **Client**: Payment confirmations, session reminders, booking updates
- **Interpreter**: Earnings notifications, session requests, verification updates

### 4. Data Loading & State Management

Each screen implements proper loading states and error handling:

```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      const endpoint = `/api/${userRole}/data/${userId}`;
      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${getUserToken()}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    } catch (error) {
      console.error('Data load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userId) {
    loadData();
  }
}, [userId, userRole]);
```

### 5. Form Validations

Role-specific validations implemented:

#### Client Validations
- Basic contact information required
- Company and job title optional

#### Interpreter Validations  
- Specialty required
- At least one language required
- Valid hourly rate required
- Professional certifications validation

## File Structure Changes

### Updated Files
1. `src/Screens/ClientProfileScreen.js` - Made role-aware, added backend integration
2. `src/Screens/InterpreterProfileScreen.js` - Updated to pass role props to shared components
3. `src/Screens/MessagesScreen.js` - Made role-aware with proper conversation handling
4. `src/Screens/NotificationScreen.js` - Role-specific notification types and routing

### Key Functions Added
```javascript
// Authentication helper
const getUserToken = () => {
  return 'your-jwt-token-here'; // Replace with actual token logic
};

// Role-based API endpoints
const getEndpoint = (userRole, action, userId) => {
  return `/api/${userRole}/${action}/${userId}`;
};
```

## Backend Requirements

### Database Schema Considerations
The backend should distinguish between client and interpreter data:

```sql
-- Separate tables or role-based filtering
clients (id, firstName, lastName, email, company, jobTitle, ...)
interpreters (id, firstName, lastName, email, specialty, languages, hourlyRate, ...)

-- Or unified table with role field
users (id, role, firstName, lastName, email, ...)
client_profiles (userId, company, jobTitle, ...)
interpreter_profiles (userId, specialty, languages, hourlyRate, ...)
```

### API Endpoints Required

#### Authentication
- `POST /api/auth/signout` - Sign out user
- `DELETE /api/auth/delete-account` - Delete user account
- `PUT /api/auth/change-password` - Change password

#### Profile Management
- `GET/PUT /api/{client|interpreter}/profile/{userId}`
- `GET/POST/DELETE /api/{client|interpreter}/payment-methods/{userId}`

#### History & Data
- `GET /api/{client|interpreter}/call-history/{userId}`
- `GET /api/{client|interpreter}/payment-history/{userId}`
- `GET /api/{client|interpreter}/language-coverage`

#### Communication
- `GET /api/{client|interpreter}/conversations/{userId}`
- `GET/POST /api/{client|interpreter}/messages/{conversationId}`
- `GET /api/{client|interpreter}/notifications/{userId}`
- `PUT /api/{client|interpreter}/notifications/{notificationId}/mark-read`

#### Support
- `POST /api/support/contact` - Contact form submission

## Usage Examples

### In Client Profile
```javascript
<ClientProfileScreen 
  navigation={navigation}
  route={route}
  userRole="client"
  userId="client-123"
/>
```

### In Interpreter Profile  
```javascript
<InterpreterProfileScreen
  navigation={navigation}
  userId="interpreter-456"
/>
```

### Direct Screen Usage
```javascript
<MessagesScreen 
  userRole="interpreter"
  userId="interpreter-456"
/>
```

## Benefits Achieved

1. **Single Codebase**: Shared screens work for both user types
2. **Maintainability**: Changes apply to both client and interpreter experiences
3. **Backend Ready**: Clear API contracts and data flow
4. **Type Safety**: Role-based validation and UI elements
5. **Scalability**: Easy to add new user roles or modify existing ones
6. **Consistency**: Uniform behavior across all shared functionality

## Testing Considerations

### Unit Tests
- Test role-specific UI rendering
- Test API endpoint generation
- Test form validations per role

### Integration Tests  
- Test navigation between screens
- Test data loading for different roles
- Test error handling scenarios

### E2E Tests
- Test complete user flows for both roles
- Test shared screen functionality from both perspectives

## Future Enhancements

1. **Role Permissions**: Add fine-grained permission system
2. **Dynamic Roles**: Support for custom user roles
3. **Theming**: Role-specific UI themes and branding
4. **Analytics**: Role-based usage tracking and metrics
5. **Internationalization**: Role-specific translations and content

---

This implementation ensures that all shared screens work independently for both client and interpreter users while maintaining a single, maintainable codebase that's ready for backend integration.