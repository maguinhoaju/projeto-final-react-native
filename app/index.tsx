import React, { useState } from 'react';
import { Text, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

const Page = () => {
	const [username, setUsername] = useState('user');
	const [password, setPassword] = useState('user');
	const { onLogin } = useAuth();

	const onSignInPress = async () => {
		onLogin!(username, password);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}
		>
			<Text style={styles.header}>My Localizations App</Text>
			<TextInput
				autoCapitalize="none"
				placeholder="username"
				value={username}
				onChangeText={setUsername}
				style={styles.inputField}
			/>
			<TextInput
				placeholder="password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={styles.inputField}
			/>

			<TouchableOpacity onPress={onSignInPress} style={styles.button}>
				<Text style={styles.buttonText}>Login</Text>
			</TouchableOpacity>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		paddingHorizontal: '20%',
		justifyContent: 'center'
	},
	header: {
		fontSize: 32,
    color: '#6200ee',
		textAlign: 'center',
		marginBottom: 60,
    fontWeight: 'bold'
	},
	inputField: {
		marginVertical: 4,
		height: 50,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4,
		padding: 10
	},
  button: {
    backgroundColor: '#6200ee',  // Cor do botão
    paddingVertical: 5,          // Espaçamento interno (vertical)
    paddingHorizontal: 50,        // Espaçamento interno (horizontal)
    borderRadius: 4,             // Bordas arredondadas
    alignItems: 'center',         // Alinhar o texto ao centro
    justifyContent: 'center',     // Alinhar o conteúdo ao centro
    elevation: 3,                 // Sombra para Android
    shadowRadius: 3.5,            // Raio da sombra para iOS
    marginTop: 15,
    height: 60
  },
  buttonText: {
    color: 'white',                // Cor do texto (branco)
    fontSize: 20,                 // Tamanho da fonte
    fontWeight: 'bold',           // Peso da fonte (negrito)
  }, 
});
export default Page;