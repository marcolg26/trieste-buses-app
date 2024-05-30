import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import StopButton from '../components/StopButton';
import ActionButton from '../components/ActionButton';

const Starred = ({ navigation }) => {
  const [stops, setStops] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  function makeButton(data) {
    //console.log(data);
    return <StopButton navigation={navigation} code={data[0]} name={data[1]} key={data[0]} />;
  }

  const getData = () => {
    //AsyncStorage.clear();
    //stops = JSON.parse(await AsyncStorage.getItem('stop'));
    AsyncStorage.getItem('stop').then((stops1) => {
      const stops2 = JSON.parse(stops1);
      stops2.shift();
      stops2.shift();
      //console.log(stops2);
      setStops(stops2);
    });
  };

  return (
    <ScrollView>
      <Text></Text>
      {stops.map(makeButton, this)}
      <ActionButton onPress={() => navigation.goBack()} icon={'⬅️'} />
    </ScrollView>
  );
};

export default Starred;
