import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

const StackLayout = () => {
    const { authState } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';
        console.log('Auth changed: ', authState, inAuthGroup)
        if (!authState?.authenticated && inAuthGroup) {
            //console.log('If 1');
            router.replace('/');
        } else if (authState?.authenticated === true) {
            //console.log('If 2');
            router.replace('/(auth)');
        }
    }, [authState]);

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
    );
};

const RootLayoutNav = () => {
    return (
        <AuthProvider>
            <SafeAreaView style={styles.container}>
                <StackLayout />
            </SafeAreaView>
        </AuthProvider>
    );    
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
})


export default RootLayoutNav;