import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, FirebaseAuthTypes, getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import remoteConfig from '@react-native-firebase/remote-config';
import { FirebaseError } from 'firebase/app';
import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView, PermissionsAndroid, Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';
import Toast from 'react-native-toast-message';
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
	
	const [fcmToken, setFcmToken] = useState<string | null>(null);

	async function requestUserPermission() {
		try {
			console.log('Solicitando permissões de notificação...');
			
			// Primeiro solicitar permissões
			PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

			const authStatus = await messaging().requestPermission();
			const enabled =
				authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
				authStatus === messaging.AuthorizationStatus.PROVISIONAL;

			console.log('Status de permissão:', authStatus, 'Habilitado:', enabled);

			if (enabled) {
				console.log('Permissões de notificação concedidas:', authStatus);
				
				// Registrar dispositivo para mensagens remotas APÓS permissão concedida
				if (Platform.OS === 'ios') {
					try {
						await messaging().registerDeviceForRemoteMessages();
						console.log('Dispositivo registrado para mensagens remotas (iOS)');
					} catch (registerError) {
						console.log('Erro no registro do dispositivo:', registerError);
					}
				}
				
				// Obter token após permissão concedida
				const token = await getFCMToken();
				if (token) {
					setFcmToken(token);
				}
			} else {
				console.log('Permissões de notificação negadas:', authStatus);
			}
			return enabled;
		} catch (error) {
			console.log('Erro ao solicitar permissões:', error);
			return false;
		}
	}

	async function getFCMToken() {
		try {
			console.log('Verificando token FCM...');
			let fcmToken = await AsyncStorage.getItem('fcmToken');
			console.log('Token armazenado:', fcmToken ? 'Existe' : 'Não existe');
			
			if (!fcmToken) {
				console.log('Gerando novo token FCM...');
				
				// Tentar obter token diretamente
				const token = await messaging().getToken();
				console.log('Token FCM obtido:', token ? 'Sucesso' : 'Falha');
				
				if (token) {
					await AsyncStorage.setItem('fcmToken', token);
					console.log('Token FCM salvo no AsyncStorage');
					console.log('Token completo:', token);
					return token;
				} else {
					console.log('Falha ao obter token FCM');
				}
			} else {
				console.log('Token FCM já existe:', fcmToken);
			}
			return fcmToken;
		} catch (error) {
			console.log('Erro ao obter token FCM:', error);
			return null;
		}
	}

	const setupNotificationListeners = () => {
		try {
			// Listener para quando o app é aberto a partir de uma notificação (background)
			const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(remoteMessage => {
				console.log('App aberto a partir de notificação (background):', remoteMessage);
				// Aqui você pode navegar para uma tela específica baseada nos dados da notificação
				if (remoteMessage.data?.screen) {
					console.log('Navegar para tela');
				}
			});

			// Verificar se o app foi aberto a partir de uma notificação (quit state)
			messaging()
				.getInitialNotification()
				.then(remoteMessage => {
					if (remoteMessage) {
						console.log('App aberto a partir de notificação (quit state):', remoteMessage);
						// Aqui você pode navegar para uma tela específica
						if (remoteMessage.data?.screen) {
							console.log('Navegar para tela');
						}
					}
				})
				.catch(error => {
					console.log('Erro ao verificar notificação inicial:', error);
				});

			// Listener para mensagens recebidas quando o app está em foreground
			const unsubscribeForegroundMessage = messaging().onMessage(async remoteMessage => {
				console.log('Mensagem recebida em foreground:', remoteMessage);
				
				// Mostrar toast personalizado para notificações em primeiro plano
				if (remoteMessage.notification) {
					Toast.show({
						type: 'info',
						text1: remoteMessage.notification.title || 'Nova mensagem',
						text2: remoteMessage.notification.body || 'Você recebeu uma nova notificação',
						position: 'top',
						visibilityTime: 4000,
						autoHide: true,
						topOffset: 60,
						onPress: () => {
							// Navegar para tela de detalhes se necessário
							console.log('Ver detalhes da notificação');
						}
					});
				}
			});

			// Retornar função para limpar os listeners
			return () => {
				unsubscribeNotificationOpened();
				unsubscribeForegroundMessage();
			};
		} catch (error) {
			console.log('Erro ao configurar listeners de notificação:', error);
			return () => {};
		}
	};

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

	useEffect(() => {
		// Configurar listeners de notificação
		const unsubscribeListeners = setupNotificationListeners();
		
		// Solicitar permissões e obter token
		requestUserPermission();

		// Cleanup function
		return () => {
			if (unsubscribeListeners) {
				unsubscribeListeners();
			}
		};
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

					{/* Seção de Debug FCM */}
					<View style={styles.debugContainer}>
						<Text style={styles.debugTitle}>Status FCM</Text>
						{fcmToken && (
							<View style={styles.tokenContainer}>
								<Text style={styles.tokenLabel}>Token FCM:</Text>
								<Text style={styles.tokenText} numberOfLines={3} ellipsizeMode="middle">
									{fcmToken}
								</Text>
								<TouchableOpacity 
									style={styles.copyButton}
									onPress={() => {
										console.log('Token para copiar:', fcmToken);
										Alert.alert('Token FCM', fcmToken);
									}}
								>
									<Text style={styles.copyButtonText}>Copiar Token</Text>
								</TouchableOpacity>
							</View>
						)}
						<TouchableOpacity 
							style={styles.refreshButton}
							onPress={async () => {
								console.log('Atualizando token FCM...');
								const token = await getFCMToken();
								if (token) {
									setFcmToken(token);
								}
							}}
						>
							<Text style={styles.refreshButtonText}>Atualizar Token</Text>
						</TouchableOpacity>
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
	},
	debugContainer: {
		backgroundColor: FIAP_COLORS.BACKGROUND_WHITE,
		borderRadius: 12,
		padding: 16,
		marginHorizontal: 24,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: FIAP_COLORS.BORDER_LIGHT,
		...SHADOW_STYLES.SMALL
	},
	debugTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: FIAP_COLORS.PRIMARY_GREEN,
		marginBottom: 8,
		textAlign: 'center'
	},
	debugText: {
		fontSize: 14,
		color: FIAP_COLORS.TEXT_SECONDARY,
		marginBottom: 12,
		textAlign: 'center'
	},
	tokenContainer: {
		backgroundColor: FIAP_COLORS.BACKGROUND_LIGHT,
		borderRadius: 8,
		padding: 12,
		marginBottom: 12
	},
	tokenLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: FIAP_COLORS.TEXT_PRIMARY,
		marginBottom: 4
	},
	tokenText: {
		fontSize: 12,
		color: FIAP_COLORS.TEXT_SECONDARY,
		fontFamily: 'monospace',
		backgroundColor: FIAP_COLORS.BACKGROUND_WHITE,
		padding: 8,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: FIAP_COLORS.BORDER_LIGHT
	},
	copyButton: {
		backgroundColor: FIAP_COLORS.PRIMARY_GREEN,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
		marginTop: 8,
		alignSelf: 'flex-start'
	},
	copyButtonText: {
		color: FIAP_COLORS.TEXT_WHITE,
		fontSize: 12,
		fontWeight: '600'
	},
	refreshButton: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: FIAP_COLORS.PRIMARY_GREEN,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
		alignSelf: 'center'
	},
	refreshButtonText: {
		color: FIAP_COLORS.PRIMARY_GREEN,
		fontSize: 14,
		fontWeight: '600'
	}
});
