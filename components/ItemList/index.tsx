import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'; 

export default function ItemList({ item, handleItemClick, handleIconPress } : any) {
    return (
        <TouchableOpacity style={styles.button} onPress={() => handleItemClick(item)}>
            <View style={[styles.item, { backgroundColor: item.cor }]}>
                <Text style={styles.text}>Nome: {item.nome}</Text>
                <Text style={styles.text}>Latitude: {item.posicao.latitude}</Text>
                <Text style={styles.text}>Longitude: {item.posicao.longitude}</Text>
            </View>

            <TouchableOpacity onPress={() => handleIconPress(item)} style={styles.iconButton}>
                <MaterialIcons name="delete" size={30} color="white" />
            </TouchableOpacity>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',           // Exibe o texto e o ícone lado a lado
        alignItems: 'center',           // Alinha verticalmente
        backgroundColor: '#6200ee',     // Cor de fundo do botão
        paddingVertical: 12,            // Espaço vertical
        paddingHorizontal: 16,          // Espaço horizontal
        borderRadius: 25,               // Bordas arredondadas
        margin: 10,                     // Margem do botão
      },
  item: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  iconButton: {
    padding: 10,                     // Espaçamento ao redor do ícone
  },
});