# Firebase Authentication

O aplicativo já usa `@react-native-firebase/app` e `@react-native-firebase/auth`.
O login por email e senha, o restabelecimento de senha e a restauração da sessão
estão prontos no código. Falta conectar este repositório ao projeto Firebase da equipe.

## 1. Criar e configurar o projeto

1. Crie ou selecione o projeto no [Firebase Console](https://console.firebase.google.com/).
2. Em **Authentication > Sign-in method**, ative **Email/Password**.
3. Em **Authentication > Settings**, configure o domínio e o modelo de email de
   recuperação, se necessário. O Firebase envia o email de redefinição de senha.

## 2. Registrar os aplicativos nativos

Registre os dois aplicativos no Firebase usando estes identificadores já definidos
no projeto:

| Plataforma | Identificador |
| --- | --- |
| Android | `com.triade.spotted` |
| iOS | `com.triade.spotted` |

Baixe os arquivos de configuração e coloque-os nestes caminhos:

| Plataforma | Arquivo | Destino |
| --- | --- | --- |
| Android | `google-services.json` | `android/app/google-services.json` |
| iOS | `GoogleService-Info.plist` | `ios/GoogleService-Info.plist` |

Depois, abra o workspace iOS no Xcode, arraste `GoogleService-Info.plist` para o
projeto `SpottedTemplate` e marque o target `SpottedTemplate`. Os dois arquivos
ficam ignorados pelo Git para que cada ambiente use o projeto Firebase correto.

## 3. Sincronizar dependências nativas

Após adicionar os arquivos acima, execute:

```bash
cd ios && pod install && cd ..
npm run android
# ou
npm run ios
```

No Android, o plugin Google Services já está configurado. Para testar o login no
emulador/dispositivo, use uma conta criada pelo fluxo de cadastro futuro ou adicione
um usuário de teste em **Authentication > Users**.

## Próximo passo: cadastro

O cadastro visual existente ainda não cria usuários. Quando formos implementá-lo,
usaremos `createUserWithEmailAndPassword` e atualizaremos o perfil com nome,
telefone e foto. A etapa de confirmação por telefone exigirá habilitar também o
provedor **Phone** e configurar os fingerprints SHA-1/SHA-256 do Android no Firebase.
