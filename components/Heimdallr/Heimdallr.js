import firebase from 'react-native-firebase';
import collectionsStructures from "./CollectionsStructure";
function HeimdallrLib() {
  this.user_id = 'Yt5eZ0SGpy1U9QPTmIbI';
  this.user_image ='https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/teste?alt=media&token=69a7d809-ca9f-4b62-870d-3cae93aa98a4';
  this.user_name = 'Admin';


  this.getCollection = function () {
    // const post = firebase.firestore().collection('post');
    // post.onSnapshot(sp => {
    //   sp.forEach((e) => {
    //     console.log(e._data);
    //   });
    // }
      let docs = null;
      return new Promise((resolve) => {
        console.log('indo pegar...');
        const post = firebase.firestore()
          .collection('post')
          .get().then((result) => {
              console.log('chegou');
              docs = result.docs;
              result.docs.forEach(e => {
                  console.log(e);
              });
              resolve();
          }).catch ((e) => {
              console.log('que caca: ', e);
          });

      }).then(function (resolve) {
          return docs;
      })
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

  this.uploadImage = function (image) {
    console.log('in upload: ', image);
    const rand = 'img' + new Date().getTime().toString();
    let uploadedUrl = null;

    return new Promise((resolve) => {
      console.log('herasdasde!');
      firebase.storage().ref(`${this.user_id}/${rand}`).putFile(image)
        .on('state_changed', (snapshot) => {
          let total = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('progress: ' +  total + '%');
          if (total === 100 || snapshot.state === 'success') {
            console.log('Upload complete: ', snapshot.downloadURL);
            uploadedUrl = snapshot.downloadURL;
            resolve();
          }
        }), (err) => {
        console.log('Error: ', err);
      }, (uploadedAsset) => {
        console.log('UPLOAD ASSETS: ', uploadedAsset);
      }
    }).then(function (resolve) {
        return uploadedUrl;
    })
  }
}

const heimdallr = new HeimdallrLib();
export default  heimdallr;
