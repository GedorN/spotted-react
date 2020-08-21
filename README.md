# Spotted

## Preparação de ambiente
* Nodejs:
```bash
$ url -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```
* React Native CLI
```bash
$ npm install -g react-native-cli
```
* [Java](https://www.oracle.com/br/java/technologies/javase/javase-jdk8-downloads.html)
* [Android Studio](https://developer.android.com/studio/index.html)
    * Selecione "Custom" quando perguntado sobre o tipo de intalação desejado e certifique-se de marcar as seguintes opções no instalador da ferramenta antes de clicar em "Next" e instalar efetivametne os componentes:
        * Android SDK
        * Android SDK Platform
        * Android Virtual Device
    * Depois de instalado precisamos ir em *Configure* -> *SDK Manager*
        * Selecione a aba *SDK Platforms* e marque o checkbox *Show Package Details* no canto inferior direito. Abra a seção *Android 6.0 (Marshmallow)* e certifique-se de selecionar os seguintes items:
            * Google APIs
            * Android SDK Platform 23
            * Intel x86 Atom_64 System Image
            * Google APIs Intel x86 Atom_64 System Image
            
            ![imagem-instrucao](https://s3.amazonaws.com/caelum-online-public/react-native-parte-1/images/a1v1-preparando-ambiente-ubuntu-2.png)
        * Agora selecione a aba *SDK Tools* e marque o checkbox *Show Package Details* no canto inferior direito. Abra a seleção *Android SDK Build-Tools* e selecione a opção *23.0.1*
        ![imagem-instrucao-2](https://s3.amazonaws.com/caelum-online-public/react-native-parte-1/images/a1v1-preparando-ambiente-ubuntu-3.png)
        * Por fim, clique em *Apply* para baixar e instalar o SDK e as Build Tools.
* Variáveis de ambiente
    * Adicione as seguitnes ao seu arquivo de configuração bash $HOME/.bashrc:
    ```bash
      export ANDROID_HOME=$HOME/Android/Sdk
      export PATH=$PATH:$ANDROID_HOME/tools
      export PATH=$PATH:$ANDROID_HOME/platform-tools
      export ANDROID_SDK_ROOT=$HOME/Android/Sdk
    ```
