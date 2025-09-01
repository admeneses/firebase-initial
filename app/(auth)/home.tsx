import { getAuth, signOut } from '@react-native-firebase/auth';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FIAP_COLORS, SHADOW_STYLES } from '../../config/colors';
import { SUCCESS_MESSAGES } from '../../config/errors';
import { showLoginAlert } from '../../config/utils';

const Page = () => {
	const user = getAuth().currentUser;

	const handleSignOut = async () => {
		try {
			await signOut(getAuth());
			showLoginAlert(SUCCESS_MESSAGES.SIGNOUT_SUCCESS, 'success');
		} catch (error) {
			console.log('Erro no logout:', error);
			showLoginAlert('Erro ao fazer logout. Tente novamente.', 'error');
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.header}>
					<Text style={styles.logoText}>FIAP</Text>
					<Text style={styles.welcomeText}>Bem-vindo!</Text>
				</View>

				<View style={styles.userInfoContainer}>
					<View style={styles.userCard}>
						<Text style={styles.userLabel}>Usuário Logado:</Text>
						<Text style={styles.userEmail}>{user?.email}</Text>
					</View>
				</View>

				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
						<Text style={styles.signOutButtonText}>Sair</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: FIAP_COLORS.BACKGROUND_LIGHT
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
		justifyContent: 'space-between'
	},
	header: {
		alignItems: 'center',
		marginTop: 60,
		marginBottom: 40
	},
	logoText: {
		fontSize: 48,
		fontWeight: 'bold',
		color: FIAP_COLORS.PRIMARY_GREEN,
		letterSpacing: 2,
		marginBottom: 16
	},
	welcomeText: {
		fontSize: 24,
		color: FIAP_COLORS.TEXT_PRIMARY,
		fontWeight: '600'
	},
	userInfoContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	userCard: {
		backgroundColor: FIAP_COLORS.BACKGROUND_WHITE,
		padding: 32,
		borderRadius: 16,
		...SHADOW_STYLES.MEDIUM,
		minWidth: 300,
		alignItems: 'center'
	},
	userLabel: {
		fontSize: 16,
		color: FIAP_COLORS.TEXT_SECONDARY,
		marginBottom: 12,
		fontWeight: '500'
	},
	userEmail: {
		fontSize: 18,
		color: FIAP_COLORS.PRIMARY_GREEN,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	buttonContainer: {
		marginBottom: 40
	},
	signOutButton: {
		backgroundColor: FIAP_COLORS.ERROR,
		height: 56,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: FIAP_COLORS.ERROR,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6
	},
	signOutButtonText: {
		color: FIAP_COLORS.TEXT_WHITE,
		fontSize: 18,
		fontWeight: 'bold'
	}
});

export default Page;