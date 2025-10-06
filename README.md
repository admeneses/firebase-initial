# Firebase + React Native + Expo

Este é um projeto de demonstração que integra **React Native**, **Expo** e **Firebase** para implementar um sistema completo de autenticação.

## Stack

- **React Native** - Framework para desenvolvimento mobile multiplataforma
- **Expo** - Plataforma que simplifica o desenvolvimento React Native
- **Firebase** - Backend-as-a-Service da Google para autenticação e outros serviços
- **TypeScript** - Superset do JavaScript com tipagem estática

## Configuração do Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- Expo CLI instalado globalmente
- Conta no Firebase Console
- Xcode (para iOS) ou Android Studio (para Android)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd firebase-initial
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Baixe os arquivos de configuração:
     - `google-services.json` (Android) → pasta `android/app/`
     - `GoogleService-Info.plist` (iOS) → pasta `ios/comfirebaseinitial/`
   - Ative a autenticação por email/senha no Firebase

4. **Execute o projeto**
   ```bash
   npx expo start
   ```

## 📁 Estrutura do Projeto

```
firebase-initial/
├── app/                    # Código principal da aplicação
│   ├── (auth)/            # Rotas autenticadas
│   ├── _layout.tsx        # Layout principal
│   └── index.tsx          # Tela inicial
├── config/                 # Configurações e utilitários
├── android/                # Configurações específicas do Android
├── ios/                    # Configurações específicas do iOS
└── assets/                 # Recursos estáticos (imagens, fontes)
```

## Autenticação

O projeto implementa um sistema de autenticação completo:

- **Login** - Autenticação com email e senha
- **Registro** - Criação de novas contas
- **Proteção de Rotas** - Acesso restrito a usuários autenticados
- **Persistência** - Manutenção do estado de autenticação

## Notificações Push e Toast

O projeto inclui suporte a notificações push e exibição de mensagens toast:

- Push: implementado com `@react-native-firebase/messaging` (solicitação de permissão, obtenção de token FCM e listeners de mensagens em foreground/background).
- Toast: implementado com `react-native-toast-message` para avisos em primeiro plano quando uma notificação chega.

Envio de notificações:
- Use o token FCM exibido na tela para testes.
- Para melhor entrega, envie mensagens com prioridade alta (Android/iOS) a partir do servidor ou Firebase Console.

## Como Executar

### Desenvolvimento
```bash
npx expo start
```

### Build para Produção
```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

## Documentação

- Consulte a [documentação do Expo](https://docs.expo.dev/)
- Consulte a [documentação do Firebase](https://firebase.google.com/docs)
