import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';


import images from '../assets/Images';

import * as Location from 'expo-location';

const HomeScreen = ({ navigation }) => {
  const styles = StyleSheet.create({
    logoContainer: {
      paddingTop: 50,
      alignItems: 'center',
    },
    tinyLogo: {
      width: 160,
      height: 93.5,
    },
    text: {
      paddingTop: 10,
      fontSize: 25,
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#008995',
      borderRadius: 10,
      padding: 10,
      marginTop: 15,
    },
    buttonContainer: {
      flex: 1,
      marginHorizontal: 50,
      paddingTop: 20,
    },
    buttonText: {
      color: 'white',
      textTransform: 'uppercase',
      alignSelf: 'center',
    },
  });

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationError('Location permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image style={styles.tinyLogo} source={images.logo} />
          <Text style={styles.text}>Benvenuto</Text>
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Mappa')}>
            <Text style={styles.buttonText}>Fermate nelle vicinanze</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Fermate preferite')}>
            <Text style={styles.buttonText}>Fermate preferite</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Linee e orari')}>
            <Text style={styles.buttonText}>Linee e orari</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
