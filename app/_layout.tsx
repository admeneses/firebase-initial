import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { FIAP_COLORS } from '../config/colors';

export default function RootLayout() {
	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
	const router = useRouter();
	const segments = useSegments();

	const handleAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
		console.log('onAuthStateChanged', user);
		setUser(user);
		if (initializing) setInitializing(false);
	};

	useEffect(() => {
		const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    	return subscriber;
	}, []);

	useEffect(() => {
		if (initializing) return;

		const inAuthGroup = segments[0] === '(auth)';

		if (user && !inAuthGroup) {
			router.replace('/(auth)/home');
		} else if (!user && inAuthGroup) {
			router.replace('/');
		}
	}, [user, initializing]);

	if (initializing)
		return (
			<View style={styles.loadingContainer}>
				<View style={styles.loadingContent}>
					<Text style={styles.loadingLogo}>FIAP</Text>
					<ActivityIndicator size="large" color={FIAP_COLORS.PRIMARY_GREEN} style={styles.spinner} />
					<Text style={styles.loadingText}>Carregando...</Text>
				</View>
			</View>
		);

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: FIAP_COLORS.PRIMARY_GREEN,
				},
				headerTintColor: FIAP_COLORS.TEXT_WHITE,
				headerTitleStyle: {
					fontWeight: 'bold',
				},
			}}
		>
			<Stack.Screen 
				name="index" 
				options={{ 
					title: 'Login',
					headerShown: false
				}} 
			/>
			<Stack.Screen 
				name="(auth)" 
				options={{ 
					headerShown: false 
				}} 
			/>
		</Stack>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		backgroundColor: FIAP_COLORS.BACKGROUND_LIGHT,
		alignItems: 'center',
		justifyContent: 'center'
	},
	loadingContent: {
		alignItems: 'center'
	},
	loadingLogo: {
		fontSize: 48,
		fontWeight: 'bold',
		color: FIAP_COLORS.PRIMARY_GREEN,
		letterSpacing: 2,
		marginBottom: 40
	},
	spinner: {
		marginBottom: 20
	},
	loadingText: {
		fontSize: 16,
		color: FIAP_COLORS.TEXT_SECONDARY,
		fontWeight: '500'
	}
});
