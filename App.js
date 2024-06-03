import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';


import HomeScreen from './pages/HomeScreen';
import NearMe from './pages/NearMe';
import Stop from './pages/Stop';
import Starred from './pages/Starred';
import Timetables from './pages/Timetables';
import Maps from './pages/Maps';
import RunDetails from './pages/RunDetails';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator backBehavior="history" screenOptions={() => ({ unmountOnBlur: true })} >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Mappa" component={Maps}/>
        <Stack.Screen name="Elenco fermate" component={NearMe} />
        <Stack.Screen
          name="Informazioni fermata"
          component={Stop}
          options={
            ({ unmountOnBlur: true },
            {
              drawerItemStyle: {
                display: 'none',
              },
            })
          }
        />
        <Stack.Screen
          name="Dettagli corsa"
          component={RunDetails}
          options={
            ({ unmountOnBlur: true },
            {
              drawerItemStyle: {
                display: 'none',
              },
            })
          }
        />
        <Stack.Screen
          name="Fermate preferite"
          component={Starred}
          options={{ unmountOnBlur: true }}
        />
        <Stack.Screen name="Linee e orari" component={Timetables} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
