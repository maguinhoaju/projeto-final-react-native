import { Alert, Button, FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Localization } from '../../components/types/Localization';
import { v4 as uuid } from 'uuid';
import 'react-native-get-random-values';
import { useEffect, useState } from 'react';
import { LatLng } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';


export default function NewLocation() {
    const [nome, setNome] = useState('');
    const [cor, setCor] = useState('');
    const [localizations, setLocalizations] = useState<Localization[]>([]);
    const coresDisponiveis = ['#FF5733', '#33FF57', '#5733FF', '#FFD700', '#FF69B4'];
    const { latitude, longitude } = useLocalSearchParams();
    const [posicao, setPosicao] = useState<LatLng>({ latitude: 0, longitude: 0 });

    useEffect(() => {
        setNome('');
        const novaPosicao: LatLng = {
          latitude: Number(latitude),
          longitude: Number(longitude)
        }
        setPosicao(novaPosicao),
        setCor('');    
    }, []);

    const handleSalvar = () => {
        if (!nome || !cor) {
            Alert.alert('Erro', 'Todos os campos devem ser preenchidos!');
            return;
        }
        const novoItem: Localization = {
            id: uuid(),
            nome,
            posicao,
            cor,
        };
        console.log(JSON.stringify(novoItem));
        (async () => {
            const localizationsStorage = await AsyncStorage.getItem('localizations');
                let localizationList: Array<Localization> = [];
                if (localizationsStorage) {
                localizationList = JSON.parse(localizationsStorage);
                setLocalizations(localizationList);
                }
                localizationList.push(novoItem);
                AsyncStorage.setItem('localizations', JSON.stringify(localizationList));
                setLocalizations(localizationList);
                router.push('/');
        })();
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
                <Text style={styles.title}>Nova localização</Text>
            </View>

            <View style={styles.container}>
                <Text style={styles.title}>Cadastrar Item</Text>
        
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
    subTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
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
        backgroundColor: '#6200ee',  // Cor do botão
        paddingVertical: 5,          // Espaçamento interno (vertical)
        paddingHorizontal: 50,        // Espaçamento interno (horizontal)
        borderRadius: 25,             // Bordas arredondadas
        alignItems: 'center',         // Alinhar o texto ao centro
        justifyContent: 'center',     // Alinhar o conteúdo ao centro
        elevation: 3,                 // Sombra para Android
        shadowRadius: 3.5,            // Raio da sombra para iOS
        marginTop: 200,
        height: 60
      },
      buttonText: {
        color: 'white',                // Cor do texto (branco)
        fontSize: 26,                 // Tamanho da fonte
        fontWeight: 'bold',           // Peso da fonte (negrito)
      }, 
});

  