import React, { useState, useEffect } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Button,
  View,
  Alert,
  RefreshControl
} from 'react-native';
import { DataTable } from 'react-native-paper';

import { useRoute } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Title from '../components/Title';
import ActionButton from '../components/ActionButton';

const Stop = ({ navigation }) => {
  const route = useRoute();

  const [starred, setStar] = useState(false);
  const [runs, setRuns] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    loadData();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const loadData = async () => {

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

    for (var i = 0; i < json.length; i++) {
      json[i].Line = json[i].Line.slice(1);
    }
    setRuns(json);
  };

  const checkStar = async () => {
    var stops1 = [0];

    try {
      const stopsDB1 = await AsyncStorage.getItem('stop');
      stops1 = JSON.parse(stopsDB1);

      for (var i = 0; i < stops1.length; i++) {
        if (stops1[i][0] === route.params.code) {
          setStar(true);
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

      if (stops === null) {
        console.log('nessuna fermata inserita');
        stops = [];
      }

      let isSet = 0;

      for (var i = 0; i < stops.length; i++) {
        if (stops[i][0] === code) isSet = 1;
      }

      if (isSet === 0) {
        let stop = [];
        stop.push(code);
        stop.push(name);
        stops.push(stop);
        console.log('inserimento fermata');
      } else console.log('fermata già selezionata');

      await AsyncStorage.setItem('stop', JSON.stringify(stops));
      setStar(true);
      Alert.alert('Fermata aggiunta', 'Fermata aggiunta ai preferiti');
    } catch (error) {
      //await AsyncStorage.setItem('stop', '["0","1"]');
      //await AsyncStorage.setItem('stop', JSON.stringify(stops));
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

      await AsyncStorage.setItem('stop', JSON.stringify(stopsDeleted));
      setStar(false);
      Alert.alert('Fermata rimossa', 'Fermata rimossa dai preferiti');
    } catch (error) {
      console.log('Errore nella rimozione dei dati:', error);
    }
  };

  useEffect(() => {
    loadData();
    checkStar();
    navigation.setOptions({
      headerRight: () => (
        <View>
          {!starred && (
            <Button
              onPress={() => save(route.params.code, route.params.name)}
              title="Salva"
            />
          )}
          {starred && (
            <Button
              onPress={() => remove(route.params.code)}
              title="Rimuovi"
            />
          )}
        </View>
      ),
    });
  }, [navigation, starred, setStar, route]);

  return (
    <ScrollView
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>

     
      <Title text={route.params.name}></Title>
      <View style={styles.buttonContainer}>

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
        {runs.map((line) => {
          return (
            <DataTable.Row key={line.Line + line.Race} onPress={() => navigation.navigate('Dettagli corsa', { line })}>
              <DataTable.Cell>{line.Line}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>
                {line.Destination}
              </DataTable.Cell>
              <DataTable.Cell>{line.ArrivalTime}</DataTable.Cell>
            </DataTable.Row>
          );
        })}
      </DataTable>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
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
