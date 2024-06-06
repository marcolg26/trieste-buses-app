import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Linking,
    View
} from 'react-native';

import * as Location from 'expo-location';
import MapView, { Polyline } from "react-native-maps";
import { Marker } from 'react-native-maps';

import Title from '../components/Title';

import { useRoute } from '@react-navigation/native';
import Images from '../assets/Images';

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

            let pointsJson = await response.json();

            var pointsTemp=[];
            var count=0;

            for(var i = 0; i<pointsJson.length; i++){
                for(var j = 0; j<pointsJson[i].length; j++){
                    pointsTemp[count]={};
                    pointsTemp[count]['latitude']=pointsJson[i][j][1];
                    pointsTemp[count]['longitude']=pointsJson[i][j][0];
                    count++;
                }
            }

            setPoints(pointsTemp);
        }
        catch(error) {
            console.log(error);
        }
    };


    useEffect(() => {
        setLine(route.params.line.Line);
        setRace(route.params.line.Race);
        setBusLongitude(route.params.line.Longitude);
        setbusLatitude(route.params.line.Latitude);
        getPolyline();
    }, [line, race]);

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
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
                image={Images.bus}
            
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
