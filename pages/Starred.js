import React, { useEffect, useState } from 'react';
import { Text, ScrollView } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import StopButton from '../components/StopButton';
import ActionButton from '../components/ActionButton';

const Starred = ({ navigation }) => {
  const [stops, setStops] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  function makeStopButton(data) {
    return <StopButton navigation={navigation} code={data[0]} name={data[1]} key={data[0]} />;
  }

  const getData = () => {
    //AsyncStorage.clear();
    //stops = JSON.parse(await AsyncStorage.getItem('stop'));
    AsyncStorage.getItem('stop').then((stops1) => {
      const stops2 = JSON.parse(stops1);
      if(stops2 === null) stops2=[];
      setStops(stops2);
      //console.log(JSON.stringify(stops));
    });
  };

  return (
    <ScrollView>
      <Text></Text>
      {stops.map(makeStopButton, this)}

    </ScrollView>
  );
};

export default Starred;
