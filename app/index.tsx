import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import MapView, { LatLng, MapPressEvent, Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // reune todos os recursos dessa dependencia em 'Location'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { Localization } from '../components/types/Localization';

export default function HomeScreen() {

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();
  const isPortrait = width < height; //TODO - final da aula de 11/11 fala disso
  const [localizations, setLocalizations] = useState<Array<Localization>>([]);
  const { latitude, longitude } = useLocalSearchParams();
  const [region, setRegion] = useState({
    latitude: Number(latitude) ?? location?.coords.latitude,
    longitude: Number(longitude) ?? location?.coords.longitude,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });

  useEffect(() => {
    (async () => {
      let locationPermission = await Location.requestForegroundPermissionsAsync();
      if (locationPermission.status !== 'granted') {
        let message = 'A permissão foi negada.'
        setMessage(message);
      } else {
        let location = await Location.getCurrentPositionAsync(); 
        setLocation(location);
      }
    })(); 
  }, []);

  useEffect(() => {
    (async () => {
      const localizationsStorage = await AsyncStorage.getItem('localizations');
      let localizationList: Array<Localization> = [];
      if (localizationsStorage) {
        localizationList = JSON.parse(localizationsStorage);
        setLocalizations(localizationList);
      }
    })(); 
  }, []);

  const handleAddPress = async () => {
    console.log('Adicionar');
    let location = await Location.getCurrentPositionAsync();
    router.push(`/NewLocation?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`);
  };

  const handleListPress = () => {
    console.log('Listar');
    router.push('/MyLocationsList');
  };


  return (
    <View>
      <View style={styles.navbar}>
        <Text style={styles.title}>My Locations App</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={handleAddPress} style={styles.icon}>
            <Ionicons name="add-circle" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleListPress} style={styles.icon}>
            <Ionicons name="list-circle" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <MapView 
        style={styles.locationMapView}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsPointsOfInterest
        onPress={ async (mapPress: MapPressEvent) => {
            const { coordinate } = mapPress.nativeEvent;
            router.push(`/NewLocation?latitude=${coordinate.latitude}&longitude=${coordinate.longitude}`);
        }}
      >
        {localizations.map(localization => ( <Marker 
            id={localization.id}
            title={localization.nome}
            pinColor={localization.cor}
            coordinate={{
              latitude: localization.posicao.latitude,
              longitude: localization.posicao.longitude
            }}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  locationMapView: {
    width: "100%",
    height: "100%",
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 4,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
});
