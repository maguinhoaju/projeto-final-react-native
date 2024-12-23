import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // reune todos os recursos dessa dependencia em 'Location'
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import env from '@/constants/env';

import { Localization } from '../components/types/Localization';

export default function HomeScreen() {

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();
  const isPortrait = width < height; //TODO - final da aula de 11/11 fala disso
  const [isLoading, setLoading] = useState(false);
  const [localizations, setLocalizations] = useState<Array<Localization>>([]);
  const { latitude, longitude } = useLocalSearchParams();
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });
  const getLocalizationsApi = async () => {
//    console.log("getLocalizationsApi - begin");
    setLoading(true);
    try {
        const apiGqlUrl = env.API_GQL_URL;
        const response = await fetch(apiGqlUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `query {
                    localizations {
                      id
                      nome
                      latitude
                      longitude
                      cor
                    }
                  }`,
            })
        }); // POST
        const { data } = await response.json();
        console.log(data.localizations);
        setLocalizations(data.localizations);
    } catch (error) {
      console.log("getLocalizationsApi - error");
      console.log(error);
      setMessage(error.message);
    } finally {
//      console.log("getLocalizationsApi - finally");
      setLoading(false);
    }
}

useEffect(() => {
//  console.log("UseEffect 1");
  getLocalizationsApi();
}, []);

  //Obtém permissão de obter a localização do dispositivo
  useEffect(() => {
    (async () => {
      let locationPermission = await Location.requestForegroundPermissionsAsync();
      if (locationPermission.status !== 'granted') {
        let message = 'A permissão foi negada.'
        setMessage(message);
      }
    })();
  }, []);

  // useEffect para atualizar a região com base em latitude e longitude
  useEffect(() => {
    (async () => {
      let location = await Location.getLastKnownPositionAsync();
      setLocation(location);
      const stringLatitude = Array.isArray(latitude) ? latitude[0] : latitude;
      const stringLongitude = Array.isArray(longitude) ? longitude[0] : longitude;
      const validatedLatitude = isValidCoordinate(stringLatitude) ? parseFloat(stringLatitude) : location?.coords?.latitude ?? 0;
      const validatedLongitude = isValidCoordinate(stringLongitude) ? parseFloat(stringLongitude) : location?.coords?.longitude ?? 0;
      setRegion({ 
        latitude: validatedLatitude,
        longitude: validatedLongitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      });
    })();
  }, [latitude, longitude]);

  // Função para validar se a coordenada é válida
  function isValidCoordinate(stringValue: any) {
    return stringValue !== null && stringValue !== undefined && stringValue.trim() !== '' && !isNaN(parseFloat(stringValue));
  }

  //Evento do click do botão Adicionar
  const handleAddPress = async () => {
    console.log('Adicionar');
    let location = await Location.getCurrentPositionAsync();
    router.push(`/NewLocation?latitudeParam=${location.coords.latitude}&longitudeParam=${location.coords.longitude}`);
  };

  //Evento do click do botão Listar
  const handleListPress = () => {
    console.log('Listar');
    router.push('/MyLocationsList');
  };


  return (
    <View>
      <View style={styles.navbar}>
        <Text variant="headlineLarge" style={styles.title}>My Locations App</Text>
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
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        showsUserLocation
        showsPointsOfInterest
        onPress={async (mapPress: MapPressEvent) => {
          const { coordinate } = mapPress.nativeEvent;
          router.push(`/NewLocation?latitudeParam=${coordinate.latitude}&longitudeParam=${coordinate.longitude}`);
        }}
      >
        {localizations.map(localization => (<Marker
          key={localization.id}
          id={localization.id}
          title={localization.nome}
          pinColor={localization.cor}
          coordinate={{
            latitude: localization.latitude,
            longitude: localization.longitude
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
