import React, { useState, useEffect } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';

import Title from '../components/Title';

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
  const [lines, setLines] = useState([]);

  const loadLines = async () => {

    const response = await fetch(
      'https://marcolg.altervista.org/api/linesjson.php',
      {
        method: 'GET',
        headers: {},
      }
    );

    setLines(await response.json());
  };

  const renderItem = ({ item }) => {
    const backgroundColor = '#008995';
    const color = 'white';

    return (
      <Item
        key={item.key}
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
    loadLines();
  }, []);

  return (
    <ScrollView>
      <Title text={'Linee presenti nel territorio'}></Title>
      <FlatList
        data={lines}
        renderItem={renderItem}
        keyExtractor={(item) => item.line}
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
