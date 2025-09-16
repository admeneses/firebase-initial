import { createUserWithEmailAndPassword, FirebaseAuthTypes, getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import remoteConfig from '@react-native-firebase/remote-config';
import { FirebaseError } from 'firebase/app';
import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';
import { FIAP_COLORS, SHADOW_STYLES } from '../config/colors';
import { getErrorMessage, SUCCESS_MESSAGES } from '../config/errors';
import { showLoginAlert } from '../config/utils';

export default function Index() {
	const config = remoteConfig();
	const [title, setTitle] = useState('FIAP');
	const [newScreen, setScreen] = useState(false);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const fetchRemoteConfig = async () => {
		try {
			await config.fetchAndActivate()
			const titleValue = config.getValue('titleApp').asString();
			const screenValue = config.getValue('NewScreenEnabled').asBoolean();
			
			setTitle(titleValue);
			setScreen(screenValue);
		} catch (error) {
			console.log('Erro ao buscar Remote Config:', error);
		}
	}

	const signUp = async () => {		
		setLoading(true);
		try {
			const response = await createUserWithEmailAndPassword(getAuth(), email, password);

			if (response.user) {
				await createProfile(response);
			}

			showLoginAlert(SUCCESS_MESSAGES.SIGNUP_SUCCESS, 'success');
		} catch (erro: FirebaseError | any) {
			console.log('Erro no cadastro:', erro);
			const errorCode = erro?.code || erro?.message || 'unknown';
			const errorMessage = getErrorMessage(errorCode);
			showLoginAlert(errorMessage, 'error');
		} finally {
			setLoading(false);
		}
	};

	const signIn = async () => {		
		setLoading(true);
		try {
			await signInWithEmailAndPassword(getAuth(), email, password);
		} catch (erro: FirebaseError | any) {
			console.log('Erro no login:', erro);
			const errorCode = erro?.code || erro?.message || 'unknown';
			const errorMessage = getErrorMessage(errorCode);
			showLoginAlert(errorMessage, 'error');
		} finally {
			setLoading(false);
		}
	};

	const createProfile = async (response: FirebaseAuthTypes.UserCredential) => {
		database().ref(`/users/${response.user.uid}`).set({email: response.user.email});
	}

	useEffect(() => {
		config.setConfigSettings({minimumFetchIntervalMillis: 0})
		config.setDefaults({
			title: 'FIAP',
			NewScreenEnabled: false,
		})

		fetchRemoteConfig();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView 
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardView}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
			>
				<ScrollView 
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.logoContainer}>
						<Text style={styles.logoText}>{title}</Text>
						<Text style={styles.subtitleText}>Autenticação Firebase</Text>
					</View>

					<View style={styles.formContainer}>
						<View style={styles.inputContainer}>
							<Text style={styles.inputLabel}>Email</Text>
							<TextInput
								style={styles.input}
								value={email}
								onChangeText={setEmail}
								autoCapitalize="none"
								keyboardType="email-address"
								placeholder="Digite seu email"
								placeholderTextColor={FIAP_COLORS.TEXT_LIGHT}
								returnKeyType="next"
							/>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLabel}>Senha</Text>
							<TextInput
								style={styles.input}
								value={password}
								onChangeText={setPassword}
								secureTextEntry
								placeholder="Digite sua senha"
								placeholderTextColor={FIAP_COLORS.TEXT_LIGHT}
								returnKeyType="done"
							/>
						</View>

						{loading ? (
							<View style={styles.loadingContainer}>
								<ActivityIndicator size="large" color={FIAP_COLORS.PRIMARY_GREEN} />
								<Text style={styles.loadingText}>Carregando...</Text>
							</View>
						) : (
							<View style={styles.buttonContainer}>
								<TouchableOpacity 
									style={[
										styles.loginButton,
										!(email && password) && styles.disabledButton
									]} 
									onPress={signIn}
									disabled={!(email && password)}
								>
									<Text style={[
										styles.loginButtonText,
										!(email && password) && styles.disabledButtonText
									]}>
										Entrar
									</Text>
								</TouchableOpacity>
								
								<TouchableOpacity 
									style={[
										styles.signupButton,
										!(email && password) && styles.disabledOutlineButton
									]} 
									onPress={signUp}
									disabled={!(email && password)}
								>
									<Text style={[
										styles.signupButtonText,
										!(email && password) && styles.disabledOutlineButtonText
									]}>
										Criar Conta
									</Text>
								</TouchableOpacity>

								{newScreen && 
									<TouchableOpacity 
										style={[
											styles.signupButton,
											styles.forgotPasswordButton,
										]} 
									>
										<Text style={[
											styles.signupButtonText,
										]}>
											Esqueci minha senha
										</Text>
									</TouchableOpacity>
								}
							</View>
						)}
					</View>

					<View style={styles.footer}>
						<Text style={styles.footerText}>© 2025 - Adeilton Meneses - FIAP - Todos os direitos reservados</Text>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: FIAP_COLORS.BACKGROUND_LIGHT
	},
	keyboardView: {
		flex: 1
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'space-between',
		paddingHorizontal: 24,
		paddingVertical: 20
	},
	logoContainer: {
		alignItems: 'center',
		marginTop: 40,
		marginBottom: 40
	},
	logoText: {
		fontSize: 48,
		fontWeight: 'bold',
		color: FIAP_COLORS.PRIMARY_GREEN,
		letterSpacing: 2
	},
	subtitleText: {
		fontSize: 16,
		color: FIAP_COLORS.TEXT_SECONDARY,
		marginTop: 8,
		fontWeight: '500'
	},
	formContainer: {
		flex: 1,
		justifyContent: 'center',
		maxWidth: 400,
		alignSelf: 'center',
		width: '100%',
		minHeight: 300
	},
	inputContainer: {
		marginBottom: 20
	},
	inputLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: FIAP_COLORS.TEXT_PRIMARY,
		marginBottom: 8
	},
	input: {
		height: 56,
		borderWidth: 2,
		borderColor: FIAP_COLORS.BORDER_LIGHT,
		borderRadius: 12,
		paddingHorizontal: 16,
		backgroundColor: FIAP_COLORS.BACKGROUND_WHITE,
		fontSize: 16,
		color: FIAP_COLORS.TEXT_PRIMARY,
		...SHADOW_STYLES.SMALL
	},
	buttonContainer: {
		marginTop: 32
	},
	loginButton: {
		backgroundColor: FIAP_COLORS.PRIMARY_GREEN,
		height: 56,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
		shadowColor: FIAP_COLORS.PRIMARY_GREEN,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6
	},
	loginButtonText: {
		color: FIAP_COLORS.TEXT_WHITE,
		fontSize: 18,
		fontWeight: 'bold'
	},
	signupButton: {
		backgroundColor: 'transparent',
		height: 56,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: FIAP_COLORS.PRIMARY_GREEN
	},
	signupButtonText: {
		color: FIAP_COLORS.PRIMARY_GREEN,
		fontSize: 18,
		fontWeight: '600'
	},
	// Estilos para botões desabilitados
	disabledButton: {
		backgroundColor: FIAP_COLORS.TEXT_LIGHT,
		shadowOpacity: 0.1,
		elevation: 2
	},
	disabledButtonText: {
		color: FIAP_COLORS.TEXT_SECONDARY
	},
	disabledOutlineButton: {
		borderColor: FIAP_COLORS.TEXT_LIGHT
	},
	disabledOutlineButtonText: {
		color: FIAP_COLORS.TEXT_LIGHT
	},
	forgotPasswordButton: {
		marginTop: 16
	},
	loadingContainer: {
		alignItems: 'center',
		marginTop: 32
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: FIAP_COLORS.TEXT_SECONDARY,
		fontWeight: '500'
	},
	footer: {
		alignItems: 'center',
		paddingVertical: 24
	},
	footerText: {
		fontSize: 12,
		color: FIAP_COLORS.TEXT_LIGHT,
		textAlign: 'center'
	}
});
