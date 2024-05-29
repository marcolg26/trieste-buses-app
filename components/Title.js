import { View, Text, Button, StyleSheet } from 'react-native';

const Title = ({ text }) => (
  <View style={styles.titleContainer}>
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  titleContainer: {
    padding: 6,
  },
});

export default Title;
