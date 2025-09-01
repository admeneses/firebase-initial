import { Alert } from 'react-native';

// Função principal para exibir alerts com título "Login"
export const showLoginAlert = (message: string, type: 'success' | 'error' = 'success') => {
	Alert.alert(
		'Login',
		message,
		[
			{
				text: 'OK',
				style: 'default'
			}
		]
	);
};
