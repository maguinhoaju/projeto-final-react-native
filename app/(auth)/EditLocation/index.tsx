import { Alert, Button, FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Localization } from '../../../components/types/Localization';
import 'react-native-get-random-values';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import env from '@/constants/env';

export default function editLocation() {
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [cor, setCor] = useState('');
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const coresDisponiveis = ['#FF5733', '#33FF57', '#5733FF', '#FFD700', '#FF69B4'];
    const { idParam, nomeParam, latitudeParam, longitudeParam, corParam } = useLocalSearchParams();
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<number>();

    useEffect(() => {
        setId(idParam.toString());
        setNome(nomeParam.toString());
        setLatitude(Number(latitudeParam));
        setLongitude(Number(longitudeParam));
        const corCompleta = "#" + corParam.toString();
        setCor(corCompleta);
        //console.log("Id: " + idParam.toString() + " Cor: " + corCompleta);
        const corSelecionada = getSelectedColor(corCompleta);
        setSelectedId(corSelecionada);
        //console.log("SelectedId: " + selectedId);
    }, []);

      // Função retornar o índice da cor no array coresDisponiveis
    function getSelectedColor(color: string) {
        const indice = coresDisponiveis.indexOf(color);
        //console.log("getSelectedColor - indice da cor selecionada: " + indice);
        return indice >= 0 ? indice : 0;
    }
    const handleAtualizar = () => {
        if (!nome || !cor) {
            Alert.alert('Erro', 'Todos os campos devem ser preenchidos!');
            return;
        }
        setLoading(true);
        console.log("Localization Editing");
        try {
            const query = `mutation($localization: updateLocalizationInput) {
              updateLocalization(localization: $localization) {
                id, nome, latitude, longitude, cor
              }
            }`;
            const variables = {
                updateLocalization: {id, nome, latitude, longitude, cor},
            };
            //console.log("UpdateLocalization - Localization: " + variables);
            
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
                const { updatedLocalization } = data;
                Alert.alert(`Localization atualizada. Id: ${updatedLocalization.id + " - Nome: " + updatedLocalization.nome}`);
                //console.log("UpdateLocalization - Localization adicionada: " + updatedLocalization);
            })();
        } catch (error) {
            //console.log("handleSalvar - error");
            console.log(error);
            setMessage(error.message);
        } finally {
            //console.log("handleSalvar - finally");
            setLoading(false);
            router.push(`/(auth)?latitude=${latitude}&longitude=${longitude}`);
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
                <Text style={styles.title}>Editar localização</Text>
            </View>

            <View style={styles.container}>
                <Text style={styles.subTitle}>Editar Item</Text>
        
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
                extraData={selectedId}
                />
        
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleAtualizar}>
                        <Text style={styles.buttonText}>Atualizar</Text>
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

  