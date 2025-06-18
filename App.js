import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ClientHomeScreen" component={ClientHomeScreen} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>



        {/* <Stack.Screen name="ClientHomeScreen" component={ClientHomeScreen} /> */}
        {/* <Stack.Screen name="FindInterpreterScreen" component={FindInterpreterScreen} /> */}
        {/* <Stack.Screen name="PostJobScreen" component={PostJobScreen} /> */}
        {/* <Stack.Screen name="MessagesScreen" component={MessagesScreen} /> */}
        <Stack.Screen name="InterpreterProfileScreen" component={InterpreterProfileScreen} />
        <Stack.Screen name="CallRateScreen" component={CallRateScreen} />
        <Stack.Screen name="VerificationRequestScreen" component={VerificationRequestScreen} />
        <Stack.Screen name="CashOutScreen" component={CashOutScreen} />
        <Stack.Screen name="StripeConnectScreen" component={StripeConnectScreen} />
        <Stack.Screen name="EarningsScreen" component={EarningsScreen} />
        <Stack.Screen name="ClientProfileScreen" component={ClientProfileScreen} />



      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
