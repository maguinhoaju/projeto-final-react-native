import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';


export default function ItemList({ item, handleItemClick, handleDeleteIconPress, handleEditIconPress }: any) {
  return (
    //        <TouchableOpacity style={[styles.button, { backgroundColor: item.cor }]} onPress={() => handleItemClick(item)}>
    <TouchableOpacity style={styles.button} onPress={() => handleItemClick(item)}>
      <View>
        <MaterialIcons name="location-pin" size={30} color={item.cor} />
      </View>
      <View style={styles.item}>
        <Text style={styles.text}>Nome: {item.nome}</Text>
        <Text style={styles.text}>Lat: {item.latitude}</Text>
        <Text style={styles.text}>Long: {item.longitude}</Text>
      </View>

      <View>
        <TouchableOpacity onPress={() => handleDeleteIconPress(item)} style={styles.iconButton}>
          <MaterialIcons name="delete" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEditIconPress(item)} style={styles.iconButton}>
          <MaterialIcons name="edit" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',           // Exibe o pin o texto e a lixeira lado a lado
    alignItems: 'center',           // Alinha verticalmente
    backgroundColor: '#6200ee',     // Cor de fundo do botão
    paddingVertical: 5,            // Espaço vertical
    paddingHorizontal: 15,          // Espaço horizontal
    borderRadius: 20,               // Bordas arredondadas
    margin: 5,                     // Margem do botão
  },
  item: {
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  iconButton: {
    padding: 5,
    right: 0,
  },
});