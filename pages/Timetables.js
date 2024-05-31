import React, { useState, useEffect } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Title from '../components/Title';
import ActionButton from '../components/ActionButton';

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity
    onPress={() => onPress(item.Url)}
    style={[styles.item, { backgroundColor }]}
    key={item.Line}>
    <Text style={[styles.title, { color: textColor }]}>
      {item.Line + ' | ' + item.Route}
    </Text>

  </TouchableOpacity>
);

const Timetables = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState();
  const [json1, setjson1] = useState([]);

  const generateText = async () => {

    const response = await fetch(
      'https://marcolg.altervista.org/api/linesjson.php',
      {
        method: 'GET',
        headers: {},
      }
    );

    var json = [];
    json = await response.json();
    setjson1(json);
  };

  const renderItem = ({ item }) => {
    const backgroundColor = '#008995';
    const color = 'white';

    return (
      <Item
        item={item}
        onPress={(url) => {
          Linking.openURL(url);
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  useEffect(() => {
    generateText();
  }, []);

  return (
    <ScrollView>
      <Title text={'Linee presenti nel territorio'}></Title>
      <ActionButton onPress={() => navigation.goBack()} icon={'⬅️'} />
      <FlatList
        data={json1}
        renderItem={renderItem}
        keyExtractor={(item) => item.line}
        extraData={selectedId}
        key={(item) => item.line}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 14,
  },
});

export default Timetables;
