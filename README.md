# Firebase Authentication with React Native + Expo 🔥

Este é um projeto de demonstração que integra **React Native**, **Expo** e **Firebase** para implementar um sistema completo de autenticação.

## 🚀 Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile multiplataforma
- **Expo** - Plataforma que simplifica o desenvolvimento React Native
- **Firebase** - Backend-as-a-Service da Google para autenticação e outros serviços
- **TypeScript** - Superset do JavaScript com tipagem estática

## 📱 Funcionalidades

- ✅ Configuração completa do Firebase
- ✅ Sistema de autenticação (login/registro)
- ✅ Navegação protegida com rotas autenticadas
- ✅ Interface moderna e responsiva
- ✅ Suporte para iOS e Android

## 🛠️ Configuração do Projeto

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

## 🔐 Autenticação

O projeto implementa um sistema de autenticação completo:

- **Login** - Autenticação com email e senha
- **Registro** - Criação de novas contas
- **Proteção de Rotas** - Acesso restrito a usuários autenticados
- **Persistência** - Manutenção do estado de autenticação

## 📱 Plataformas Suportadas

- **iOS** - Desenvolvido e testado
- **Android** - Desenvolvido e testado
- **Web** - Suporte básico via Expo

## 🚀 Como Executar

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

## 📚 Recursos Adicionais

- **Navegação** - Sistema de roteamento com Expo Router
- **Estilização** - Design system consistente
- **Tratamento de Erros** - Sistema robusto de tratamento de erros
- **Configuração** - Arquivos de configuração organizados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

- Consulte a [documentação do Expo](https://docs.expo.dev/)
- Consulte a [documentação do Firebase](https://firebase.google.com/docs)
