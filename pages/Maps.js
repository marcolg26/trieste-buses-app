import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Button,
    View
} from 'react-native';

import * as Location from 'expo-location';
import MapView from "react-native-maps";
import { Marker } from 'react-native-maps';

const Maps = ({ navigation }) => {
    const [latitude, setLatitude] = useState("45.6515"); //45.6515
    const [longitude, setLongitude] = useState("13.7802"); //13.7802
    const [initiallatitude, setinitialLatitude] = useState("45.6215"); //45.6515
    const [initiallongitude, setinitialLongitude] = useState("13.7202"); //13.7802
    const mapRef = useRef(null);
    const [stops, setStops] = useState([]);
    const [init, setInit] = React.useState(true);

    /*const [region, setRegion] = useState({
        latitude: 51.5079145,
        longitude: -0.0899163,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });*/

    function makeMarker(data) {
        let code = data.code;
        let name = data.name;
        return (
            <Marker
                title={data.name}
                key={data.code}
                coordinate={{
                    latitude: parseFloat(data.latitude),
                    longitude: parseFloat(data.longitude),
                }}
                onPress={() => navigation.navigate('Informazioni fermata', { code, name })}
            />
        );
    }

    const getLocation = async () => {

        console.log("location")
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setLocationError('Location permission denied');
                return;
            }

            let location = await Location.getLastKnownPositionAsync({});
            console.log(location.coords.latitude + ', ' + location.coords.longitude);
            setinitialLatitude(location.coords.latitude);
            setinitialLongitude(location.coords.longitude);
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);


            const currentRegion = {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            if (init)
                mapRef.current.animateToRegion(currentRegion, 3 * 1000);
            setInit(false);
            //placeMarkers();

        } catch (error) {
            console.error('Error requesting location permission:', error);
        }
    };

    const placeMarkers = async () => {
        try {
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

            setStops(await response.json());
            console.log("ok " + latitude + " " + longitude);
        }
        catch {
            console.log('errore');
        }
    };

    useEffect(() => {

        getLocation();
        //placeMarkers();

        navigation.setOptions({
            headerRight: () => (
                <View>
                    <Button
                        onPress={() => navigation.navigate('Elenco fermate')}
                        title="Elenco"
                    />
                </View>
            ),
        });
    }, [navigation, initiallatitude, initiallongitude, init, setInit, mapRef, latitude, longitude]);

    //<ActionButton onPress={() => navigation.navigate('Elenco fermate')} icon={'🔠'} />

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>

            </View>
            <MapView
                ref={mapRef}
                style={styles.map}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onRegionChangeComplete={(region) => { setLatitude(region.latitude); setLongitude(region.longitude); placeMarkers(); }}
                initialRegion={{
                    latitude: parseFloat(initiallatitude),
                    longitude: parseFloat(initiallongitude),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }} >
                {stops.map(makeMarker, this)}
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
