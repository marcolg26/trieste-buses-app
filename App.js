import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';


import HomeScreen from './pages/HomeScreen';
import NearMe from './pages/NearMe';
import Stop from './pages/Stop';
import Starred from './pages/Starred';
import Timetables from './pages/Timetables';
import Maps from './pages/Maps';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={() => ({ unmountOnBlur: true })}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Mappa" component={Maps} />
        <Drawer.Screen name="Elenco fermate" component={NearMe} />
        <Drawer.Screen
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
        <Drawer.Screen
          name="Fermate preferite"
          component={Starred}
          options={{ unmountOnBlur: true }}
        />
        <Drawer.Screen name="Linee e orari" component={Timetables} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
