import ItemList from '@/components/ItemList';
import { Text, FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Localization } from '../../components/types/Localization';
import AntDesign from '@expo/vector-icons/AntDesign';
import env from '@/constants/env';

export default function MyLocationsList({ handleItemClicked }: any) {

    const [localizations, setLocalizations] = useState<Array<Localization>>([]);
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // evento do click no ItemList - redireciona para o mapa
    const itemClick = (item: any) => {
        router.push(`/?latitude=${item.latitude}&longitude=${item.longitude}`);
    }

    // evento do botão editar na ItemList
    const editIconClick = (item: any) => {
        const corSemHash = item.cor.replace('#', '');
        console.log("Item.Nome: " + item.nome + " - Item.Cor: " + corSemHash);
        router.push(`/EditLocation?idParam=${item.id}&nomeParam=${item.nome}&latitudeParam=${item.latitude}&longitudeParam=${item.longitude}&corParam=${corSemHash}`);
    }

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
        // console.log("MyLocationsList - UseEffect 1");
        getLocalizationsApi();
    }, []);

    const deletIconClick = (item: any) => {
        setLoading(true);
        console.log("Localization to be deleted: " + item.id);
        try {
            const query = `mutation Mutation($deleteLocalizationId: String!) {
                        deleteLocalization(id: $deleteLocalizationId)
            }`;
            const variables = {
                "deleteLocalizationId": item.id,
            };
            (async () => {
                const apiGqlUrl = env.API_GQL_URL;
                const response = await fetch(apiGqlUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ query, variables }),
                });
                const { data } = await response.json();
                getLocalizationsApi();
            })();
        } catch (error) {
            console.log("deletIconClick - error");
            console.log(error);
            setMessage(error.message);
        } finally {
            // console.log("deletIconClick - finally");
            setLoading(false);
        }
    }

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
                    renderItem={({ item }) => <ItemList 
                        item={item} 
                        handleItemClick={itemClick} 
                        handleDeleteIconPress={deletIconClick} 
                        handleEditIconPress={editIconClick} 
                    />}
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
    locationsList: {
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