import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    console.log('Mensagem processada em background:', remoteMessage);
    
    // Aqui você pode processar dados da mensagem
    if (remoteMessage.data) {
      console.log('Dados da mensagem:', remoteMessage.data);
      
      // Exemplo: salvar dados no AsyncStorage ou fazer alguma ação
      // await AsyncStorage.setItem('lastNotification', JSON.stringify(remoteMessage.data));
    }
    
    // Exemplo: mostrar notificação local se necessário
    if (remoteMessage.notification) {
      console.log('Notificação recebida em background:', remoteMessage.notification);
    }
    
  } catch (error) {
    console.log('Erro ao processar mensagem em background:', error);
  }
});

AppRegistry.registerComponent('app', () => App);