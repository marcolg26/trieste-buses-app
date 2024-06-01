import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ActionButton = ({ icon, text, onPress }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{icon}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    marginTop: 0,
    alignSelf: 'flex-start',
    padding: 6
  },
  buttonText: {
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderColor: '#008995',
    borderRadius: 10,
    padding: 10,
    marginTop: 0,
  },
});

export default ActionButton;
