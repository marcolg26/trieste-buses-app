import React, { useState, useEffect } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { DataTable } from 'react-native-paper';

import { useRoute } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Title from '../components/Title';
import ActionButton from '../components/ActionButton';

const Stop = ({ navigation }, route2) => {
  const route = useRoute();

  const [starred, setStar] = useState(false);
  const [json1, setjson1] = useState([]);

  const generateText = async () => {
    //console.log(route.params);

    const response = await fetch(
      'https://realtime.tplfvg.it/API/v1.0/polemonitor/mrcruns?StopCode=' +
        route.params.code +
        '&IsUrban=false',
      {
        method: 'GET',
        headers: {},
      }
    );

    var json = [];
    json = await response.json();
    //setjson1(json);
    //setGeneratedText(json[1].Line);

    for (var i = 0; i < json.length; i++) {
      json[i].Line = json[i].Line.slice(1);
    }
    setjson1(json);
  };

  const checkStar = async () => {
    var stops1 = [0];

    try {
      const stopsDB1 = await AsyncStorage.getItem('stop');
      stops1 = JSON.parse(stopsDB1);
      //console.log('<- ' + stops1);

      //console.log('check star ' + route.params.code);

      for (var i = 0; i < stops1.length; i++) {
        if (stops1[i][0] === route.params.code) {
          setStar(true);
          //console.log('is starred!');
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const save = async (code, name) => {
    console.log(code);
    var stops = [0];
    try {
      //await AsyncStorage.setItem(code, "x");
      const stopsDB = await AsyncStorage.getItem('stop');
      stops = JSON.parse(stopsDB);
      console.log('<- ' + stops);

      let isSet = 0;

      for (var i = 0; i < stops.length; i++) {
        //console.log(stops[i][0]);
        if (stops[i][0] === code) isSet = 1;
      }

      if (isSet === 0) {
        let stop = [];
        stop.push(code);
        stop.push(name);
        stops.push(stop);
        console.log('inserimento fermata');
      } else console.log('fermata già selezionata');

      //console.log('stopsDB');
      //console.log(stops);

      await AsyncStorage.setItem('stop', JSON.stringify(stops));
      setStar(true);
      alert('Fermata aggiunta ai preferiti');
    } catch (error) {
      await AsyncStorage.setItem('stop', '["0","1"]');
      console.log('Errore nel salvataggio dei dati:', error);
    }
  };

  const remove = async (code) => {
    var stops = [0];
    try {
      //await AsyncStorage.setItem(code, "x");
      const stopsDB = await AsyncStorage.getItem('stop');
      stops = JSON.parse(stopsDB);

      var stopsDeleted = stops.filter(function (item) {
        return item[0] != code;
      });
      //console.log(stopsDeleted);

      await AsyncStorage.setItem('stop', JSON.stringify(stopsDeleted));
      setStar(false);
      Alert.alert('Fermata rimossa', 'Fermata rimossa dai preferiti');
    } catch (error) {
      //await AsyncStorage.setItem('stop', '["0","1"]');
      console.log('Errore nella rimozione dei dati:', error);
    }
  };

  useEffect(() => {
    generateText();
    checkStar();
  }, []);

  /*
        {!starred && (
          <TouchableOpacity
            onPress={() => save(route.params.code, route.params.name)}>
            <Text>⭐ Aggiungi ai preferiti</Text>
          </TouchableOpacity>
        )}*/

  return (
    <ScrollView>
      <View>
        <Title text={route.params.name}></Title>
        {!starred && (
          <ActionButton
            onPress={() => save(route.params.code, route.params.name)}
            icon={'⭐'}
          />
        )}
        {starred && (
          <ActionButton
            onPress={() => remove(route.params.code)}
            icon={'✖️'}
          />
        )}
      </View>
      <DataTable style={styles.container}>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title>
            <Text style={styles.headerText}>Linea</Text>
          </DataTable.Title>
          <DataTable.Title style={styles.cell}>
            <Text style={styles.headerText}>Destinazione</Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={styles.headerText}>Orario</Text>
          </DataTable.Title>
        </DataTable.Header>
        {json1.map((line) => {
          return (
            <DataTable.Row key={line.Line + line.Race}>
              <DataTable.Cell>{line.Line}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>
                {line.Destination}
              </DataTable.Cell>
              <DataTable.Cell>{line.ArrivalTime}</DataTable.Cell>
            </DataTable.Row>
          );
        })}
      </DataTable>

      <ActionButton
        onPress={() => navigation.goBack()}
        icon={'⬅️'}
      />
    </ScrollView>
  );
};

/*<TouchableOpacity onPress={() => generateText}>
        <Text>Aggiorna</Text>
      </TouchableOpacity>
*/

const styles = StyleSheet.create({
  container: {
    padding: 6,
  },
  tableHeader: {
    backgroundColor: '#008995',
  },
  cell: {
    flex: 3,
  },
  headerText: {
    color: 'white',
    textTransform: 'uppercase',
    alignSelf: 'center',
  }
});

export default Stop;
