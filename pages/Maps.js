import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    ScrollView,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Linking,
    View
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import * as Location from 'expo-location';
import MapView from "react-native-maps";
import { Marker } from 'react-native-maps';

import Title from '../components/Title';
import ActionButton from '../components/ActionButton';



const Maps = ({ navigation }) => {
    const [latitude, setLatitude] = useState("45.6515");
    const [longitude, setLongitude] = useState("13.7802");
    const mapRef = useRef(null);
    const [json1, setjson] = useState([]);

    const [region, setRegion] = useState({
        latitude: 51.5079145,
        longitude: -0.0899163,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    function makeMarker(data) {
        let code = data.code;
        let name = data.name;
        return (
            <Marker
                title={data.name}
                coordinate={{
                    latitude: data.latitude,
                    longitude: data.longitude,
                }}
                onPress={() => navigation.navigate('Informazioni fermata', { code, name })}
            />
        );
    }

    const getLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setLocationError('Location permission denied');
                return;
            }

            let location = await Location.getLastKnownPositionAsync({});
            console.log(location.coords.latitude + ', ' + location.coords.longitude);
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);

            const tokyoRegion = {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            mapRef.current.animateToRegion(tokyoRegion, 3 * 1000);
            //placeMarkers();

        } catch (error) {
            console.error('Error requesting location permission:', error);
        }
    };

    const placeMarkers = async (location) => {
        if (location) getLocation();
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

        setjson(await response.json());
        console.log('OK');
    };

    useEffect(() => {
        placeMarkers();
      }, []);

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <ActionButton onPress={() => navigation.navigate('Home')} icon={'🏠'} />
                <ActionButton onPress={() => placeMarkers(true)} icon={'📍'} />
                <ActionButton onPress={() => navigation.navigate('Elenco fermate')} icon={'🔠'} />
            </View>
            <MapView
                ref={mapRef}
                style={styles.map}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onRegionChangeComplete={(region) => { setLatitude(region.latitude); setLongitude(region.longitude); placeMarkers(false) }}
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }} >
                {json1.map(makeMarker, this)}
            </MapView>
        </View>

    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

export default Maps;
