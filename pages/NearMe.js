import React, { useState, useEffect } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  Alert,
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
  const [json1, setjson] = useState([]);

  function makeButton(data) {
    return (
      <StopButton navigation={navigation} code={data.code} name={data.name} />
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
      //generateText();
    } catch (error) {
      console.error('Error requesting location permission:', error);
    } finally {
      generateText();
    }
  };

  const generateText = async () => {
    //getLocation();
    console.log('generate text ' + latitude);

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

    setjson(await response.json());
    console.log('OK');
  };

  useEffect(() => {
    getLocation();
    generateText();
  }, []);

  return (
    <ScrollView>
      <Title text="Fermate nelle vicinanze" />
      {!isLocated && (
        <TouchableOpacity color="#808080">
          <Text>Carimento posizione...</Text>
        </TouchableOpacity>
      )}
      {isLocated && <ActionButton onPress={() => generateText()} icon={'🔍'} />}
      {json1.map(makeButton, this)}
      <ActionButton onPress={() => navigation.goBack()} icon={'⬅️'} />
    </ScrollView>
  );
};

export default NearMe;
