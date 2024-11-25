import ItemList from '@/components/ItemList';
import { Text, FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import MapView, { LatLng, MapPressEvent, Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // reune todos os recursos dessa dependencia em 'Location'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Localization } from '../../components/types/Localization';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function MyLocationsList({ handleItemClicked } : any) {

    const [localizations, setLocalizations] = useState<Array<Localization>>([]);
    
    const itemClick = (item: any) => {
        router.push(`/?latitude=${item.posicao.latitude}&longitude=${item.posicao.longitude}`);
    }

    //Não consegui fazer funcionar o delete
    const deletIconClick = (item: any) => {
        (async () => {
            console.log(item);
            const localizationsStorage = await AsyncStorage.getItem('localizations');
            let localizationList: Array<Localization> = [];
            if (localizationsStorage) {
              localizationList = JSON.parse(localizationsStorage);
              const indexToRemove = localizationList.findIndex(itemArr => itemArr.id === item.id);
              console.log(indexToRemove)
              localizationList.splice(indexToRemove, 1)
              console.log(localizationList)
              setLocalizations(localizationList);
            }
        })(); 
    }

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
    
    const handleReturn = () => {
      router.push('/');
    };
    
    return (
        <View>
            <View style={styles.navbar}>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={handleReturn} style={styles.icon}>
                        <AntDesign name="banckward" size={32} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>Todas as localizações</Text>
            </View>
            <View style={styles.container}>
                <FlatList style={styles.locationsList}
                    data={localizations}
                    renderItem={({ item }) => <ItemList item={item} handleItemClick={itemClick} handleIconPress={deletIconClick} />}
                    keyExtractor={item => String(item.id)}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    header: {
        fontSize: 30,
    },
    locationsList:{
        margin: 15
    },
    locationMapView: {
        width: "100%",
        height: "100%",
    },
    navbar: {
        flexDirection: 'row',
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
        marginRight: 15,
    },
});