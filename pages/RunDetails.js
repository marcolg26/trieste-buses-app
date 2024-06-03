import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Linking,
    View
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import * as Location from 'expo-location';
import MapView, { Polyline } from "react-native-maps";
import { Marker } from 'react-native-maps';

import Title from '../components/Title';
import ActionButton from '../components/ActionButton';

import { useRoute } from '@react-navigation/native';

const RunDetails = ({ navigation }) => {
    const [latitude, setLatitude] = useState("45.6515");
    const [longitude, setLongitude] = useState("13.7802");
    const mapRef = useRef(null);
    const [stops, setStops] = useState([]);
    const route = useRoute();

    const [line, setLine] = useState();
    const [race, setRace] = useState();
    const [busLatitude, setbusLatitude] = useState("45.6515");
    const [buslongitude, setBusLongitude] = useState("13.7802");

    const [points, setPoints] = useState([]);

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
    };

    const getPolyline = async () => {

        try {
            const response = await fetch(
                'https://realtime.tplfvg.it/API/v1.0/polemonitor/linegeotrack?line=T' +
                line +
                '&race=' +
                race,
                {
                    method: 'GET',
                    headers: {},
                }
            );

            let json = await response.json();

            var xx=[];

            //console.log(json);
            console.log(json.length)

            var c=0;
            for(var i = 0; i<json.length; i++){
                for(var j = 0; j<json[i].length; j++){
                    xx[c]={};
                    xx[c]['latitude']=json[i][j][1];
                    xx[c]['longitude']=json[i][j][0];
                    c++;
                }
                console.log("***");
            }

            setPoints(xx);
            //console.log(xx);
        }
        catch(error) {
            console.log(error);
        }
    };


    useEffect(() => {
        console.log(route.params.line.Line + " " + route.params.line.Race);
        setLine(route.params.line.Line);
        setRace(route.params.line.Race);
        setBusLongitude(route.params.line.Longitude);
        setbusLatitude(route.params.line.Latitude);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <ActionButton onPress={() => navigation.goBack()} icon={'⬅️'} />
                <ActionButton onPress={() => getPolyline()} icon={'📍'} />
            </View>
            <MapView
                ref={mapRef}
                style={styles.map}
                showsUserLocation={true}
                showsMyLocationButton={true}
                initialRegion={{
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }} >
                {stops.map(makeMarker, this)}
                <Polyline
                    coordinates={points}
                    strokeColor="#008995"

                    strokeWidth={3}
                />
                <Marker
                coordinate={{
                    latitude: parseFloat(busLatitude),
                    longitude: parseFloat(buslongitude),
                }}
            />
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

export default RunDetails;
