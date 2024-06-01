import React, { useState, useEffect } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
} from 'react-native';

import StopButton from '../components/StopButton';
import Title from '../components/Title';
import ActionButton from '../components/ActionButton';

import * as Location from 'expo-location';

const NearMe = ({ navigation }) => {
  const [isLocated, setLocated] = useState(false);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [stops, setStops] = useState([]);

  function makeButton(data) {
    return (
      <StopButton navigation={navigation} code={data.code} name={data.name} key={data.code} />
    );
  }

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationError('Location permission denied');
        return;
      }

      //let location = await Location.getCurrentPositionAsync({});
      let location = await Location.getLastKnownPositionAsync({});
      console.log(location.coords.latitude + ', ' + location.coords.longitude);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setLocated(true);

    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const loadStops = async () => {
    getLocation();
    console.log('generate text ' + latitude);

    try {
      const response = await fetch(
        'https://marcolg.altervista.org/api/nearestjson.php?latitude=' +
        latitude +
        '&longitude=' +
        longitude,
        {
          method: 'GET',
          headers: {},
        }
      );

      setStops(await response.json());
      console.log('OK');
    }
    catch {
      console.log('error');
    }
  };

  useEffect(() => {
    //getLocation();
    loadStops();
  }, []);

  return (
    <ScrollView>
      <Title text="Fermate nelle vicinanze" />
      <View style={styles.buttonContainer}>
        <ActionButton onPress={() => navigation.goBack()} icon={'⬅️'} />
        {!isLocated && (
          <TouchableOpacity color="#808080">
            <Text>Carimento posizione...</Text>
          </TouchableOpacity>
        )}
        {isLocated && <ActionButton onPress={() => loadStops()} icon={'🔍'} />}

      </View>
      {stops.map(makeButton, this)}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  }
});

export default NearMe;
