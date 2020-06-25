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
  this.email = null;
  this.token = null;
  this.phone = null;


  // Deixar aqui essa função como exemplo e teste de como chamar a firebase.functions()
  this.test = function (uid, limit) {
  	let docs = null;
  	return new Promise((resolve) => {
	    var antes = Date.now();
  		console.log('la vou eu')
        firebase.functions().httpsCallable('getTime')({ uid: uid, limit: limit }).then(
		    (result) => {
		        docs = result;
		        console.log('deu boa crad');
		        resolve();
		    }
	    )
    }).then(function (res) {
	    console.log('resultado functions: ', docs.data);
	    return docs.data;
    });
	}

	this.getUserTickets = function () {
		return new Promise((resolve) => {
			firebase.firestore().collection('tickets').where('uid', '==', this.user_id).get().then(
				(result) => {
					let docs = result.docs;
					docs.sort((a, b) => {
						return (b.data().date - a.data().date)
					});
					resolve(docs);
				}
			)
		})
	}


	this.getNotificationsNumber = function (context) {
  	    return new Promise((resolve) => {
  	    	firebase.firestore().collection('rel_user_notification').where('uid', '==', this.user_id).onSnapshot(
  	    		(querySnapshot) => {
  	    			console.log('foi alterado', querySnapshot.docs);
	                if (querySnapshot.docs[0]) {
		                    context.setState( { numberBadge: querySnapshot.docs[0].data().counter });
			        }
            })
        })
	}

	this.incrementNotification = function(uid){
	    return new Promise((resolve) => {
	      try{
	          firebase.functions().httpsCallable('incrementUserNotification')({uid:uid}).then(
	            (result) => {
	              console.log("increment notification",result);
	            }
	          )
	      } catch (e) {
	        console.log("erro increment function",e);
	      }
	    })
	}


	this.saveComment = function (params) {
		let returnValue = null;
		return new Promise((resolve) => {
			console.log('checking params...');
			let parametersOK = true;
			const collections = collectionsStructures;
			const structure = collections['comment'];

			structure.forEach((e) => {
				if (e.required === true) {
					if (!params[e.desc] || e.type != typeof(params[e.desc])) {
						console.log('ERRO: parâmetro ', e.desc, ' incorreto');
						if (e.type != typeof(params[e.desc])) {
							console.log(`Parametro esperado: ${e.type} porém recebido um ${typeof(params[e.desc])}`);
						}
						parametersOK = false;
					}
				}
			});

			if (parametersOK) {
				let comments = [];
				firebase.firestore().collection('comment').doc(params.pid).get().then(
					(result) => {
						console.log('dos paranue', params);
						console.log('resultado novo: ', result);
						if (result.data()) {
							let temp = result.data().comments;
							temp.push(params);
							comments = temp;
						} else {
							comments.push(params);
						}
						firebase.firestore().collection('comment').doc(params.pid).set(
							{
								comments: comments
							},
							{
								merge: true
							}
						);
					}
				)
				// const base = firebase.firestore().collection('notification').doc(params.uid);
				// base.set(params).then(
				// 	(docRef) => {
				// 		// console.warn(`Documento ${docRef.id}`);
				// 		// console.log(`Documento ${docRef.id}`);
				// 		returnValue = docRef.id;
				// 		if (collection === 'user') {
				// 			this.user_image = params.user_image ? params.user_image : null;
				// 			this.user_name = params.name;
				// 			this.email = params.email;
				// 			this.uid = params.uid;
				// 		}
				// 		resolve();
				// 	},
				// 	() => {
				// 		console.log('Erro ao criar a notificação');
				// 	}
				// );
			} else {
				resolve();
			}

		}).then(function (resolve) {
			return returnValue;
		})
	}

	this.saveNotification = function (params) {
		let returnValue = null;
		return new Promise((resolve) => {
			console.log('checking params...');
			let parametersOK = true;
			const collections = collectionsStructures;
			const structure = collections['notification'];

			structure.forEach((e) => {
				if (e.required === true) {
					if (!params[e.desc] || e.type != typeof(params[e.desc])) {
						console.log('ERRO: parâmetro ', e.desc, ' incorreto');
						if (e.type != typeof(params[e.desc])) {
							console.log(`Parametro esperado: ${e.type} porém recebido um ${typeof(params[e.desc])}`);
						}
						parametersOK = false;
					}
				}
			});

			if (parametersOK) {
				let notifications = [];
				firebase.firestore().collection('notification').doc(params.uid).get().then(
					(result) => {
						console.log('dos paranue', params);
						console.log('resultado novo: ', result);
						if (result.data()) {
							let temp = result.data().notifications;
							temp.unshift(params);
							notifications = temp;
						} else {
							notifications.push(params);
						}
						firebase.firestore().collection('notification').doc(params.uid).set(
							{
								notifications: notifications
							},
							{
								merge: true
							}
						);
					}
				)
				// const base = firebase.firestore().collection('notification').doc(params.uid);
				// base.set(params).then(
				// 	(docRef) => {
				// 		// console.warn(`Documento ${docRef.id}`);
				// 		// console.log(`Documento ${docRef.id}`);
				// 		returnValue = docRef.id;
				// 		if (collection === 'user') {
				// 			this.user_image = params.user_image ? params.user_image : null;
				// 			this.user_name = params.name;
				// 			this.email = params.email;
				// 			this.uid = params.uid;
				// 		}
				// 		resolve();
				// 	},
				// 	() => {
				// 		console.log('Erro ao criar a notificação');
				// 	}
				// );
			} else {
				resolve();
			}

		}).then(function (resolve) {
			return returnValue;
		})
	}

	this.resetNotifications = function(uid){
	    return new Promise((resolve) => {
	      try{
	        firebase.functions().httpsCallable('resetUserNotifications')({uid:uid}).then(
	          (result) => {
	            console.log("reset Notifications", result);
	          }
	        )
	      } catch (e) {
	        console.log("erro reset notifications:",e);
	      }
	    })
  }


	this.getUserNotifications = function (uid, limit) {
  	let docs = null;
  	return new Promise((resolve) => {
        const post = firebase.firestore()
		    .collection('notification')
	        .doc(heimdallr.user_id)
		    .get().then((result) => {
		    	console.log('result not; ', result);
		    	if (result && result.data().notifications.length > 0) {
			        // console.log('user notification: ', result.docs[0].data());
			        // docs = result.docs.sort((a, b) => {
				    //     console.log('a:', a.data().date );
				    //     return b.data().date - a.data().date;
			        // });
			        resolve(result.data().notifications.slice(0, limit));
			    } else {
		    		console.log('null');
		    		resolve(null);
			    }
	        }).catch ((e) => {
	            console.log('notifications error: ', e);
            });
    })
	}

	this.getStoreProducts = function (store) {
  	return new Promise((resolve) => {
	  firebase.firestore().collection('products').where('sid', '==', store).get().then(
		  (result) => {
		  	resolve(result);
		  },
		  (reject) => {
		  	console.log('Erro ao pegar produtos da loja do: ', store);
		  },
	  )

    })
	}

	this.getProduct = function (iid) {
		let product = null;
		return new Promise ((resolve, reject) => {
			firebase.firestore()
			.collection('products')
			.where('iid', '==', iid).get().then(
				(result) => {
					if (!result._docs[0]) {
						reject()
					} else {
						product =  result._docs[0]._data;
						resolve(product);
					}
				})
		});
	}


  this.getStoreInfo = function (store) {
  	let info = null;
  	return new Promise((resolve) => {
  		try {
		        console.log('store info from ', store);
		        firebase.firestore().collection('user_store_manager').where('store_code', '==', store).get().then(
				    (result) => {
				    	if (result && result.docs) {
				    		console.log('resultado ', result);
				            resolve(result.docs[0].data().store_info);
					    }
				        console.log('resutlado dos docs: ', result.data());
				    },
				    (error) => {
				        console.log('deu merdinha: ', error);
				    }
			    )

	    } catch (e) {
		    console.log('peguei caca: ', e);
	    }
    })
  }

	this.getServerTime = function (uid, limit) {
		let docs = null;
		return new Promise((resolve) => {
			var antes = Date.now();
			firebase.functions().httpsCallable('getTime')().then(
				(result) => {
					docs = result;
					resolve();
				}
			)
		}).then(function (res) {
			return docs.data;
		});
	}

	this.getCoupons = (store_code) => {
		let docs = null;
		return new Promise((resolve) => {
				const store = firebase.firestore()
				.collection('coupons').doc(store_code)
				.get().then((result) => {
					docs = result.data() ? result.data().coupons : null;
					resolve();
				}).catch((e) => {
					console.warn("erro",e);
				});
		}).then(function (resolve) {
			 return docs;
		})
	}

	this.StoreCoupons = function (saveCoupons,store){
		return new Promise((resolve, reject) => {
			try {
				firebase.firestore().collection('coupons').doc(store).set({
					coupons:saveCoupons
				}, {merge : true});
			 } catch (e) {
				 console.warn('peguei: ', e);
				 reject();
			 }
			 resolve();
		})

	}

	this.saveUserCoupon = function (userCoupons){

		return new Promise((resolve, reject) => {
			try {
				firebase.firestore().collection('user').where('uid', '==', this.user_id).get().then(
					(res) => {
						firebase.firestore().collection('user').doc(res.docs[0]._ref.path.split('/')[1]).set({
							coupons:userCoupons
						}, {merge : true});
					}
				)
			 } catch (e) {
				 console.warn('peguei: ', e);
				 reject();
			 }
			 resolve();
		})
	}


	this.getUserCoupons = function (){

		let docs = null;
		return new Promise((resolve) => {
				const store = firebase.firestore()
				.collection('user').where('uid', '==', this.user_id)
				.get().then((result) => {
					docs = result && result.docs[0] && result.docs[0].data() ? result.docs[0].data().coupons : null;
					resolve(docs);
				}).catch((e) => {
					console.warn("erro",e);
				});
		});
	}

  this.sendVerificationMessage = async (number) => {
  	console.log('to na verifica: ', number);
  	try {
	   return await firebase.auth().signInWithPhoneNumber(number);
    } catch (e) {
	    console.log('peguei: ', e);
    }

  }
	this.deleteUser = function (user, password) {
		return new Promise((resolve, reject) => {
			try{
				firebase.auth().signInWithEmailAndPassword(user, password).then(
					() => {
						firebase.auth().currentUser.delete().then(
							(success) => {
								resolve();
							},
							(error) => {
								reject();
							}
						)
					},
					(rej) => {
						console.warn('desgraça: ', rej);
						reject();

					}
				)

			}catch (e) {
				console.log('erro desca', e);
			}
		})
	}


  this.deleteConectedUser = function () {
  	return new Promise((resolve, reject) => {
	  firebase.auth().currentUser.delete().then(
		  (success) => {
		    resolve(success);
		  },
		  (error) => {
		  	console.warn('deu merda pra deletar', error);
		  	reject(error);
		  }
	  )
    })
  }

  this.getTxtColor = (color) => {
	  let c = color.substring(1);      // strip #
	  let rgb = parseInt(c, 16);   // convert rrggbb to decimal
	  let r = (rgb >> 16) & 0xff;  // extract red
	  let g = (rgb >>  8) & 0xff;  // extract green
	  let b = (rgb >>  0) & 0xff;  // extract blue
	  let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709


	  if (luma < 40) {
		  return 'white'
	  } else {
		  return '#000000'
	  }

  }

	this.saveTicketsRegister = function (item){

		return new Promise((resolve) => {
			try{
				firebase.firestore().collection('tickets').add({
					...item
				});
				firebase.firestore().collection('products').where('iid', '==', item.iid).get().then(
					(res) => {
						firebase.firestore().collection('products').doc(res.docs[0]._ref.path.split('/')[1]).set({
							stock: res.docs[0].data().stock - 1
						}, {merge: true});
					}
				)
			} catch (e) {
				console.warn("erro save tickets", e);
				resolve();
			}
			resolve();
		})
	}

  this.saveData = function (chave, data) {
	  return new Promise((resolve) => {
	  	try{
		  firebase.firestore().collection('errors').add({
			  problem: data,
			  from: chave
		  });

	    } catch (e) {
		    console.warn('aconteceu isso: ', e);
		    resolve();
	    }
		  resolve();

    })
  }



  this.getElapsedTime = function (elapsedTime) {
	  if (elapsedTime ===  'há poucos segundos') {
		  return '1 min';
	  } else if (elapsedTime.split(' ')[2] === 'minuto') {
		  return `1min`;
	  } else if (elapsedTime.split(' ')[2] === 'minutos') {
		  return `${elapsedTime.split(' ')[1]}min`;
	  } else if (elapsedTime.split(' ')[2] === 'hora') {
		  return `1h`;
	  } else if (elapsedTime.split(' ')[2] === 'horas') {
		  return `${elapsedTime.split(' ')[1]}h`;
	  } else if (elapsedTime.split(' ')[2] === 'dia') {
		  return `1d`;
	  } else if (elapsedTime.split(' ')[2] === 'dias') {
		  return `${elapsedTime.split(' ')[1]}d`;
	  } else if (elapsedTime.split(' ')[1] === 'mes') {
		  return `1mo`;
	  } else if (elapsedTime.split(' ')[1] === 'meses') {
		  return `${elapsedTime.split(' ')[1]}mo`;
	  } else if (elapsedTime.split(' ')[1] === 'ano') {
		  return `1y`;
	  } else if (elapsedTime.split(' ')[1] === 'anos') {
		  return `${elapsedTime.split(' ')[1]}y`;
	  }

	  return null;
  }


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

  this.getSimilarUser = function () {
  	return new Promise((resolve) => {
	    firebase.firestore()
		    .collection('user')
		    .orderBy('name')
		    .startAt('Triade')
		    .endAt('Tria'+"\uf8ff").once("name").get().then(
		    (result) => {
		    	console.log('Similares: ', result);
		    }
	    )

    })
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

  this.updateUserData = function (user) {
	  return new Promise((resolve) => {
	  	firebase.firestore().collection('user').where('uid', '==', user.uid).get().then(
		    (result) => {
		    	if (result && result.docs && result.docs[0]) {
		    		console.warn('seguindo', result.docs[0]._ref.path.split('/')[1]);
		    		firebase.firestore().collection('user').doc(result.docs[0]._ref.path.split('/')[1]).set({
					    user_image: user.user_image ? user.user_image : null,
					    name: user.name,
				    }, {merge: true}).then((res) => {
				    	console.warn('deu boa');
				    	resolve();
				    })
			    }
		    }
	    )
	  })
  }

  this.updateProfile = function (user) {
	  return new Promise((resolve) => {
		  firebase.auth().currentUser.updateProfile({
		      displayName: user.name,
		      photoURL: user.user_image,
		  }).then(function () {
			  this.user_image = user.user_image ? user.user_image : null;
			  this.user_name = user.name;
		      resolve(true);
		  }).catch(function (error) {
		      console.warn('update profile error: ', error);
		      resolve(false);
		  })
	  });
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
                      this.email = user._user.email;
                      console.log('this.token', this.user_id);
                      this.getUserData(user);
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

  this.getUserData = function (user) {
	  firebase.firestore().collection('user').where('uid', '==', user._user.uid).get().then(
		  (resolve) => {
		  	console.log('resolve USER', resolve.docs[0].data().phone);
		  	this.phone = resolve.docs[0].data().phone;
		  	console.log(this.phone);
		  }
	  )
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
  	return new Promise((resolve, reject) => {
	    firebase.auth().createUserWithEmailAndPassword(params.email, params.password).then(
		    (success) => {
		    	console.log('sucessso: ', success);
		    	newUser = success;
			    resolve();
		    },
		    (error) => {
		    	console.log('deu ruim: ',error);
		    	reject(error);
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
					if(result._docs.length > 0){
						user = result._docs[0]._data;
					}
					else{
						user = null;
					}
		    	resolve();
	    })
	  }).then(function (resolve) {
		  return user;
	  }).catch((error) => {
			console.log("erro usuário",error);
		
		});
  }

  this.getUserColletion = function (limit, uid) {
  	let docs = null;
  	console.log('recebi:', limit, uid);
  	return new Promise((resolve) => {
        firebase.firestore()
		    .collection('user_posts')
	        .doc(uid)
		    .get().then((result) => {
			    console.log('asdasd', result);
		    	if (result && result.data() && result.data().posts) {
		    		let docs = result.data().posts.slice(0, limit);
				    // docs = result.docs.filter((d) => {return !d.data().anonymous})
			        // docs = docs.sort((a, b) => {
				    //     return b.data().date - a.data().date;
				    // console.log('ta´certo: ', docs);
				    console.log('ué', docs);
				    // });
				    resolve(docs);
			    } else {
		    		console.log('caiu aqui');
		    		resolve(null);
			    }
	        }).catch ((e) => {
	            console.log('que caca: ', e);
            });
    })

  }

	this.getComments = (pid, limit) => {
		let docs = null;
		return new Promise((resolve) => {
			const post = firebase.firestore()
				.collection('comment')
				.doc(pid)
				.get().then((result) => {
					// docs = result.docs;
					// docs.sort((a, b) => {
					// 	return (b._data.date) - (a._data.date)
					// });
					// docs = docs.slice(0, limit);
					console.log('so acheu isso', result);
					docs = result.data() ? result.data().comments.slice(0, limit) : [];
					resolve();
				}).catch ((e) => {
					console.log('Erro: ', e);
				});

		}).then(function (resolve) {
			return docs;
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
                  .collection(collection)
                  .get().then((result) => {
                      docs = result.docs;
                      // result.docs.forEach(e => {
                      //     console.log(e);
                      // });
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

	this.savePersonalColletion = function (params) {
  	console.log('recebi po');
		return new Promise((resolve) => {
			firebase.firestore().collection('user_posts').doc(params.uid).get().then().then(
				(result) => {
					console.log('o que tem aqui', result);
					if (!result.data()) {
						firebase.firestore().collection('user_posts').doc(params.uid).set({
							posts: [params]
						});
					} else {
						let posts = result.data().posts;
						posts.unshift(params);
						firebase.firestore().collection('user_posts').doc(params.uid).set({
							posts: posts
						});
					}
				}
			)
		})
	}

	this.deletePost = function (collection, pid) {

		let document = null;

		return new Promise((resolve) => {
			firebase.firestore().collection(collection).where('pid', '==', pid).get().then(
				(result) => {
					document = result._docs[0]._ref.id;
				}
			).then((resolve) => {
				firebase.firestore().collection(collection).doc(document).delete();

			}).catch(function(error){
				console.log('Error removing document',error);
			})
		})
	}

	this.deletePostComments = function (collection,pid){
		firebase.firestore().collection(collection).doc(pid).delete().then(function(){
			console.log("post comments deleted");
		}).catch(function(error) {
			console.log("Error removing document: ", error);
		})
	}

	this.deletePostNotifications = function (collection,userId,pid){
		let docs = null;
		return new Promise((resolve) => {
			firebase.firestore().collection(collection).doc(userId).get().then(
				(result) => {
					docs = result.data().notifications.filter(item => item.eid != pid);
					firebase.firestore().collection('notification').doc(userId).set(
						{
							notifications: docs
						},
						{
							merge: true
						}
					);

				}
			)
		}).catch(function(error){
			console.log("error get commentary",error);
		})
	}
	

	this.deleteUserPost = function (collection, pid, userId) {
		let docs = [];
		return new Promise((resolve) => {
			firebase.firestore().collection(collection).doc(userId).get().then(
				(result) => {
					let post = null;
					let index = null;
					let removed = null;
					post = result.data().posts.find((item) => item.pid === pid); 
					index = result.data().posts.indexOf(post);
					removed = result.data().posts.splice(index,1);
					firebase.firestore().collection('user_posts').doc(userId).set(
						{
							posts: result.data().posts
						},
						{
							merge: true
						}
					);
				})
		}).catch(function(error){
			console.log("error get commentary",error);
		})
	}

	this.deleteCommentNotification = function (collection, cid, userId){
		let docs = [];
		return new Promise((resolve) => {
			firebase.firestore().collection(collection).doc(userId).get().then(
				(result) => {
					let notification = null;
					let index = null;
					let removed = null;
					notification = result.data().notifications.find((item) => item.cid === cid); 
					index = result.data().notifications.indexOf(notification);
					removed = result.data().notifications.splice(index,1);
					firebase.firestore().collection('notification').doc(userId).set(
						{
							notifications: result.data().notifications
						},
						{
							merge: true
						}
					);

				}
			)
		}).catch(function(error){
			console.log("error get commentary",error);
		})
	}


	this.deleteCommentary = function (collection, pid, cid) {
		let docs = [];
		return new Promise((resolve) => {
			firebase.firestore().collection(collection).doc(pid).get().then(
				(result) => {
					let commentary = null;
					let index = null;
					let removed = null;
					commentary = result.data().comments.find((item) => item.cid === cid); 
					index = result.data().comments.indexOf(commentary);
					removed = result.data().comments.splice(index,1);
					firebase.firestore().collection('comment').doc(pid).set(
						{
							comments: result.data().comments
						},
						{
							merge: true
						}
					);

				}
			)
		}).catch(function(error){
			console.log("error get commentary",error);
		})
	}

	this.saveSpecificColletion = function (collection,params) {
  	console.log('params.uid',params.uid);
		return new Promise((resolve) => { 
			firebase.firestore().collection(collection).doc(params.uid).get().then(
				(result) => {
					console.log('result', result.data());
					if (!result.data()) {
						firebase.firestore().collection(collection).doc(params.uid).set({
							dataArray: [params]
						});
					} else {
						let saveData = result.data().dataArray;
						saveData.unshift(params);
						firebase.firestore().collection(collection).doc(params.uid).set({
							dataArray: saveData
						});
					}
				}
			)
		})
	}

  this.saveCollection = function (collection, params) {
    let returnValue = null;
    console.log('ue');
    return new Promise((resolve) => {
      console.log('checking params...');
      let parametersOK = true;
      const collections = collectionsStructures;
      const structure = collections[collection];

      structure.forEach((e) => {
        if (e.required === true) {
          if (!params[e.desc] || e.type != typeof(params[e.desc])) {
            console.log('ERRO: parâmetro ', e.desc, ' incorreto');
            if (e.type != typeof(params[e.desc])) {
            	console.log(`Parametro esperado: ${e.type} porém recebido um ${typeof(params[e.desc])}`);
            }
            parametersOK = false;
          }
        }
      });

      if (parametersOK) {
        const base = firebase.firestore().collection(collection);
        base.add(params).then(
          (docRef) => {
          	// console.warn(`Documento ${docRef.id}`);
            // console.log(`Documento ${docRef.id}`);
            returnValue = docRef.id;
            if (collection === 'post') {
            	heimdallr.saveCollection('unverified_post', params);
            	console.log('deve entrar: ', params.anonymous);
            	if (!params.anonymous) {
            	    heimdallr.savePersonalColletion(params);
	            }
            }
            if (collection === 'user') {
            	this.user_image = params.user_image ? params.user_image : null;
            	this.user_name = params.name;
            	this.email = params.email;
            	this.uid = params.uid;
            }
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

  this.checkTicketsStatus = function(uid) {
  	return new Promise((resolve, reject) => {
  		firebase.functions().httpsCallable('verifyUserTickets')({uid:uid}).then(
  			(result) => {
  				resolve(result);
		    },
		    (error) => {
  				reject(error);
		    }
	    )
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
