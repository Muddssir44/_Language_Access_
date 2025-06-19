import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Entry Flow Screens
import SplashScreen from './src/Screens/SplashScreen';
import RoleSelectionScreen from './src/Screens/RoleSelectionScreen';
import LoginScreen from './src/Screens/LoginScreen';
import RegisterScreen from './src/Screens/RegisterScreen';

// Existing Screens
import ClientHomeScreen from './src/Screens/ClientHomeScreen';
import PostJobScreen from './src/Screens/PostJobScreen';
import FindInterpreterScreen from './src/Screens/FindInterpreterScreen';
import MessagesScreen from './src/Screens/MessagesScreen';
import ClientProfileScreen from './src/Screens/ClientProfileScreen';
import InterpreterProfileScreen from './src/Screens/InterpreterProfileScreen';
import CallRateScreen from './src/Screens/CallRateScreen';
import VerificationRequestScreen from './src/Screens/VerificationRequestScreen';
import CashOutScreen from './src/Screens/CashOutScreen';
import StripeConnectScreen from './src/Screens/StripeConnectScreen';
import EarningsScreen from './src/Screens/EarningsScreen';
import InterpreterHomeScreen from './src/Screens/InterpreterHomeScreen';
import InterpreterJobListingScreen from './src/Screens/InterpreterJobListingScreen';
import NotificationScreen from './src/Screens/NotificationScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        {/* Entry Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Client Screens */}
        <Stack.Screen name="ClientHome" component={ClientHomeScreen} />
        <Stack.Screen name="PostJob" component={PostJobScreen} />
        <Stack.Screen name="FindInterpreter" component={FindInterpreterScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="ClientProfile" component={ClientProfileScreen} />

        {/* Interpreter Screens */}
        <Stack.Screen name="InterpreterHome" component={InterpreterHomeScreen} />
        <Stack.Screen name="InterpreterProfile" component={InterpreterProfileScreen} />
        <Stack.Screen name="InterpreterJobListing" component={InterpreterJobListingScreen} />
        <Stack.Screen name="CallRate" component={CallRateScreen} />
        <Stack.Screen name="VerificationRequest" component={VerificationRequestScreen} />
        <Stack.Screen name="CashOut" component={CashOutScreen} />
        <Stack.Screen name="StripeConnect" component={StripeConnectScreen} />
        <Stack.Screen name="Earnings" component={EarningsScreen} />

        {/* Shared Screens */}
        <Stack.Screen name="Notifications" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
