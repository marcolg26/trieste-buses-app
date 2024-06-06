import React, { useState, useEffect } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';

import StopButton from '../components/StopButton';
import Title from '../components/Title';

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
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setLocated(true);

    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const loadStops = async () => {
    getLocation();

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
    }
    catch {
      console.log('error');
    }
  };

  useEffect(() => {
    loadStops();
    navigation.setOptions({
      headerRight: () => (
        <View>
          <Button
            onPress={() => navigation.navigate('Mappa')}
            title="Mappa"
          />
          </View>
      ),
    });
  }, [latitude, longitude, navigation]);

  //{isLocated && <ActionButton onPress={() => loadStops()} icon={'🔍'} />}
  return (
    <ScrollView>
      <Title text="Fermate nelle vicinanze" />
      <View style={styles.buttonContainer}>
        {!isLocated && (
          <TouchableOpacity color="#808080">
            <Text>Carimento posizione...</Text>
          </TouchableOpacity>
        )}

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
