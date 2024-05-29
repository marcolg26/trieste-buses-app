import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const StopButton = ({ name, code, navigation }) => (
  <View style={styles.header}>
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('Informazioni fermata', { code, name })}>
      <Text style={styles.buttonText}>{name}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#008995',
    borderRadius: 10,
    padding: 10,
    marginTop: 3,
  },
});

export default StopButton;
