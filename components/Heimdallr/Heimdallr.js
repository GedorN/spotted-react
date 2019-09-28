import firebase from 'react-native-firebase';
import collectionsStructures from "./CollectionsStructure";
function HeimdallrLib() {
  this.user_id = 'Yt5eZ0SGpy1U9QPTmIbI';

  this.getCollection = function () {
    const post = firebase.firestore().collection('post');
    post.onSnapshot(sp => {
      sp.forEach((e) => {
        console.log(e._data);
      });
    })
    console.log('papapap:', post);
  }

  this.saveCollection = function (collection, params) {
    let returnValue = null;
    return new Promise((resolve) => {
      console.log('checking params...');
      let parametersOK = true;
      const collections = collectionsStructures;
      const structure = collections[collection];

      structure.forEach((e) => {
        if (e.required === true) {
          if (!params[e.desc] || e.type != typeof(params[e.desc])) {
            console.log('ERRO: parâmetro ', e.desc, ' incorreto');
            parametersOK = false;
          }
        }
      });

      if (parametersOK) {
        const base = firebase.firestore().collection(collection);
        base.add(params).then(
          (docRef) => {
            console.log(`Documento ${docRef.id}`);
            returnValue = docRef.id;
            resolve();
          },
          () => {
            console.log('Erro ao criar o documento');
          }
        );
      } else {
        resolve();
      }

    }).then(function (resolve) {
      return returnValue;
    })
  }
}

const heimdallr = new HeimdallrLib();
export default  heimdallr;
