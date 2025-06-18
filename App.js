import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientHomeScreen from './src/Screens/ClientHomeScreen';
import PostJobScreen from './src/Screens/PostJobScreen';
import FindInterpreterScreen from './src/Screens/FindInterpreterScreen';
import MessagesScreen from './src/Screens/MessagesScreen';
import  ClientProfileScreen  from './src/Screens/ClientProfileScreen';





const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>



        {/* <Stack.Screen name="ClientHomeScreen" component={ClientHomeScreen} /> */}
        {/* <Stack.Screen name="FindInterpreterScreen" component={FindInterpreterScreen} /> */}
        {/* <Stack.Screen name="PostJobScreen" component={PostJobScreen} /> */}
        {/* <Stack.Screen name="MessagesScreen" component={MessagesScreen} /> */}
        <Stack.Screen name="ClientProfileScreen" component={ClientProfileScreen} />




      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
