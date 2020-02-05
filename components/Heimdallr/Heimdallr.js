/*
* Aquele que tudo sabe e tudo vê
* Ele fara a integração entre o sistema e o back no firebase. Todas as consultas, tratamento de queryies,
* informações gerais devem estar aqui
* */

import firebase from 'react-native-firebase';
import collectionsStructures from "./CollectionsStructure";
import UUIDGenerator from 'react-native-uuid-generator';


function HeimdallrLib() {
  this.user_id = /*'Yt5eZ0SGpy1U9QPTmIbI'*/ null;
  this.user_image ='https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/teste?alt=media&token=69a7d809-ca9f-4b62-870d-3cae93aa98a4';
  this.user_name = 'Admin';
  this.token = null;


  
  this.getUID = function () {
  	let UID = null;
  	return new Promise((resolve) => {
  		UUIDGenerator.getRandomUUID((uuid) => {
  			UID = uuid;
  			resolve();
	    })
    }).then(function (resolve) {
    	if (!UID) {
    		console.warn('Problema ao gerar chave única');
	    }
    	return UID;
    })
  }
  
  this.PasswordRestore = function (params) {
  	let resseted= false;
  	return new Promise((resolve) => {
  		firebase.auth().sendPasswordResetEmail(params.email).then(
		    (success) => {
  		        resolve();
		    },
		    (fail) => {
		    	resolve();
		    },
	    );
    }).then(function (resolve) {
    	resseted = true;
    	return resseted;
    });
  }

  this.signOut = function () {
	  return new Promise((resolve) => {
		  firebase.auth().signOut().then(
		      (sucess) => {
		          console.log('sign out sucess: ', sucess);
		          resolve();
		      },
		      (fail) => {
		          console.log('fail in signOut:', fail);
		      }
		  );
	  }).then(function (resolve) {
	  	console.log('Sign out successfully');
		  this.user_id = null;
		  this.user_image = 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/teste?alt=media&token=69a7d809-ca9f-4b62-870d-3cae93aa98a4';
		  this.user_name = 'Anônimo';
		  this.token = null;
		  return true;
	  })
  }

  this.updateProfile = function (user) {
	  return new Promise((resolve) => {
		  firebase.auth().currentUser.updateProfile({
		      displayName: user.name,
		      photoURL: user.user_image,
		  }).then(function () {
		      console.log('update profile sucessful');
		  }).catch(function (error) {
		      console.log('update profile error: ', error);
		  })
	  }). then(function (resolve) {

	  })
  }

  this.checkUser = function () {
      let u = null;
      // firebase.auth().signOut().then(
      //     (sucess) => {
      //         console.log('sign out sucess: ', sucess);
      //     },
      //     (fail) => {
      //         console.log('fail in signOut:', fail);
      //     }
      // );
      // firebase.auth().currentUser.updateProfile({
      //     displayName: 'Triade',
      //     photoURL: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/teste?alt=media&token=69a7d809-ca9f-4b62-870d-3cae93aa98a4'
      // }).then(function () {
      //     console.log('update sucessful');
      // }).catch(function (error) {
      //     console.log('update error: ', error);
      // })
      return new Promise((resolve) => {
          firebase.auth().onAuthStateChanged(
              (user) => {
                  console.log('user checkado: ', user);
                  if (user) {
                      this.user_id = user._user.uid;
                      this.user_image = user._user.photoURL;
                      this.user_name = user._user.displayName;
                      console.log('this.token', this.user_id);
                      u = user;
                  } else {
                      return false;
                  }
                  resolve();
              }
          )
      }).then(function (resolve) {
          return u;
      })
  }

  this.signIn = function (params) {
      let user = null;
      return new Promise((resolve) => {
          console.log('params: ', params);
          if (params.user && params.password) {
              console.log('vou enviar então');
              firebase.auth().signInWithEmailAndPassword(params.user, params.password)
                  .then(
                      (result) => {
                          console.log('deu boa');
                          console.log('resolve: ', result);
                          user = result;
                          resolve();
                      }
                  ).catch((error) => {
                      console.log('error: ', error)
                  resolve();
                  });

          } else {
              console.log('vaza');
          }
      }).then(function (resolve) {
          return user;
      })
  }

  this.signUp = function (params) {
  	let newUser = null;
  	return new Promise((resolve) => {
	    firebase.auth().createUserWithEmailAndPassword(params.email, params.password).then(
		    (success) => {
		    	console.log('sucessso: ', success);
		    	newUser = success;
			    resolve();
		    },
		    (error) => {
		    	console.log('deu ruim: ',error);
		    }
	    )

    }).then(function (resolve) {
	    return newUser;
    })
  }

  this.getUserInfo = function (userId) {
	  let user = null;
	  console.log('procurando pelo...', userId);
	  return new Promise((resolve) => {
	  	firebase.firestore()
		    .collection('user')
		    .where('uid', '==', userId).get().then((result) => {
		    	console.log('veio o user: ', result);
		    	user = result._docs[0]._data;
		    	resolve();
	    })
	  }).then(function (resolve) {
		  return user;
	  })
  }

  this.getCollection = function (collection, limit) {
      let docs = null;
      return new Promise((resolve) => {
          if (limit) {
            console.log('indo pegar com limite...');
            const post = firebase.firestore()
              .collection(collection)
                .orderBy('date', 'desc')
                .limit(limit)
              .get().then((result) => {
                  console.log('chegou');
                  let orderByDesc = [];
                  docs = result.docs;
                  resolve();
              }).catch ((e) => {
                  console.log('que caca: ', e);
              });
          } else {
              console.log('indo pegar sem limite...');
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
          }

      }).then(function (resolve) {
          return docs;
      })
  }

	this.querycolletion = function (collection, param, condition) {
		let docs = null;
		return new Promise((resolve) => {
			console.log('indo pegar com condição...');
			const post = firebase.firestore()
				.collection(collection)
				.where(param, '==', condition)
				.get().then((result) => {
					console.log('chegou');
					let orderByDesc = [];
					docs = result.docs;
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
          	console.warn(`Documento ${docRef.id}`);
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
    const rand = 'img' + new Date().getTime().toString();
    let uploadedUrl = null;

    return new Promise((resolve) => {
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
