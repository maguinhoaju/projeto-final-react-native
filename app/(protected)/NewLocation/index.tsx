import { Alert, Button, FlatList, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Localization } from '../../../components/types/Localization';
import 'react-native-get-random-values';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import env from '@/constants/env';

export default function NewLocation() {
    const [nome, setNome] = useState('');
    const [cor, setCor] = useState('');
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [localizations, setLocalizations] = useState<Localization[]>([]);
    const coresDisponiveis = ['#FF5733', '#33FF57', '#5733FF', '#FFD700', '#FF69B4'];
    const { latitudeParam, longitudeParam } = useLocalSearchParams();
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        setNome('');
        setLatitude(Number(latitudeParam));
        setLongitude(Number(longitudeParam));
        setCor('');    
    }, []);

    const handleSalvar = () => {
        if (!nome || !cor) {
            Alert.alert('Erro', 'Todos os campos devem ser preenchidos!');
            return;
        }
        setLoading(true);
        //console.log("Localization Adding");
        try {
            const query = `mutation($newLocalization: addLocalizationInput) {
              addLocalization(newLocalization: $newLocalization) {
                id, nome, latitude, longitude, cor
              }
            }`;
            const variables = {
                newLocalization: {nome, latitude, longitude, cor},
            };
            //console.log("NewLocation - Localization: " + variables);
            
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
                const { addedLocalization } = data;
                Alert.alert(`Localization salva. Id: ${addedLocalization.id + " - Nome: " + addedLocalization.nome}`);
                //console.log("NewLocation - Localization adicionada: " + addedLocalization);
            })();
        } catch (error) {
            //console.log("handleSalvar - error");
            console.log(error);
            setMessage(error.message);
        } finally {
            //console.log("handleSalvar - finally");
            setLoading(false);
            router.push(`/(protected)?latitude=${latitude}&longitude=${longitude}`);
        }
    };

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
                <Text variant="headlineLarge" style={styles.title}>Nova localização</Text>
            </View>

            <View style={styles.container}>
                <Text variant="displayMedium" style={styles.subTitle}>Cadastrar Item</Text>
        
                <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
                />
                <TextInput
                style={styles.input}
                placeholder="Latitude"
                keyboardType="numeric"
                value={latitude.toString()}
                editable={false}
                />
                <TextInput
                style={styles.input}
                placeholder="Longitude"
                keyboardType="numeric"
                value={longitude.toString()}
                editable={false}
                />
        
                <Text style={styles.label}>Escolha uma cor:</Text>
                <FlatList
                data={coresDisponiveis}
                horizontal
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    style={[
                        styles.colorOption,
                        { backgroundColor: item, borderWidth: cor === item ? 3 : 1 },
                    ]}
                    onPress={() => setCor(item)}
                    />
                )}
                />
        
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSalvar}>
                        <Text style={styles.buttonText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subTitle: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
    },    
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      backgroundColor: 'white',
    },
    label: {
      fontSize: 16,
      marginBottom: 10,
    },
    colorOption: {
      width: 40,
      height: 40,
      marginHorizontal: 5,
      borderRadius: 20,
      borderColor: '#ccc',
    },
    item: {
      padding: 15,
      marginVertical: 8,
      borderRadius: 8,
    },
    itemText: {
      color: 'white',
      fontSize: 16,
    },
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6200ee',
        paddingVertical: 10,
        paddingHorizontal: 15,
        elevation: 4,
    },
    iconsContainer: {
        flexDirection: 'row',
      },
      icon: {
        marginRight: 15,
    },   
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      button: {
        backgroundColor: '#6200ee',  
        paddingVertical: 5,          
        paddingHorizontal: 50,       
        borderRadius: 25,            
        alignItems: 'center',        
        justifyContent: 'center',    
        elevation: 3,                
        shadowRadius: 3.5,           
        marginTop: 200,
        height: 60
      },
      buttonText: {
        color: 'white',              
        fontSize: 26,                
        fontWeight: 'bold',          
      }, 
});

  