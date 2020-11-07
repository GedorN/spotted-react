/*
* Aquele que tudo sabe e tudo vê
* Ele fara a integração entre o sistema e o back no firebase. Todas as consultas, tratamento de queryies,
* informações gerais devem estar aqui
* */

import firebase from 'react-native-firebase';
import collectionsStructures from "./CollectionsStructure";
import UUIDGenerator from 'react-native-uuid-generator';
import AsyncStorage from "@react-native-community/async-storage";
import RNFetchBlob from 'rn-fetch-blob';
import {Linking} from 'react-native';

function HeimdallrLib() {
  this.user_id = /*'Yt5eZ0SGpy1U9QPTmIbI'*/ null;
  this.user_image ='https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/teste?alt=media&token=69a7d809-ca9f-4b62-870d-3cae93aa98a4';
  this.user_name = 'Admin';
  this.email = null;
  this.token = null;
  this.phone = null;
  this.userPlans = null;
  this.messages = null;
  this.deviceToken = null;

  this.refreshKey = null;

  this.newPlanAdded = false;

  this.logCall = (call, params, result) => {
  	return new Promise(() => {
	    firebase.firestore().collection('log').add({
		    doc: call,
		    params: JSON.stringify(params),
		    result: JSON.stringify(result),
	    });
    })
  }

  this.tt = () => {
	  RNFetchBlob.config({
		  trusty: true
	  }).fetch('POST', 'https://3.23.33.91/teste',  { 'Content-Type': 'application/json'},
		  JSON.stringify({ hey: 'blabla' })).then(
		  (res) => {
		  	console.warn('reposta loka: ', res);
		  },
		  (err) => {
		  	console.warn('cagou tudo: ', err);
		  }
	  )
  }

  // Deixar aqui essa função como exemplo e teste de como chamar a firebase.functions()
  this.test = function (uid, limit) {
  	let docs = null;
  	return new Promise((resolve) => {
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



	this.testLink = (navigator) => {
	    return new Promise((resolve, reject) => {
		    try {
			    firebase.links().getInitialLink().then(
				    (link) => {
					    if (link) {
					        if (!this.user_id) {
							    navigator.navigate('SignUp', {navigation: navigator})
						    } else if (link.indexOf('/store') > 0) {
					            if (link.indexOf('cac') > 0) {
					                navigator.navigate('Store', { store: 'cac'});
							    } else if (link.indexOf('avalanche') > 0) {
								    navigator.navigate('Store', { store: 'avalanche'});
							    } else if(link.indexOf('metralhas') > 0) {
								    navigator.navigate('Store', { store: 'metralhas'});
							    } else if (link.indexOf('maleficoz') > 0) {
								    navigator.navigate('Store', { store: 'maleficoz'});
							    }
						    } else if (link.indexOf('/product') > 0) {
					            const index = link.indexOf('id') + 3;
					            const id = link.substring(index);
							    navigator.navigate('ProductScreen', { iid: id })
						    } else if (link.indexOf('/plan') > 0) {
							    if (link.indexOf('cac') > 0) {
								    navigator.navigate('Plans', { store: 'cac', current_plan: {}});
							    } else if (link.indexOf('avalanche') > 0) {
								    navigator.navigate('Plans', { store: 'avalanche', current_plan: {}});
							    } else if(link.indexOf('metralhas') > 0) {
								    navigator.navigate('Plans', { store: 'metralhas', current_plan: {}});
							    } else if (link.indexOf('maleficoz') > 0) {
								    navigator.navigate('Plans', { store: 'maleficoz', current_plan: {}});
							    }
						    } else if (link.indexOf('/tickets') > 0) {
							    navigator.navigate('Tickets',  {navigation: navigator})
						    }
						    resolve();
					    }
				    }
			    )

		    } catch (e) {
			    reject();
		    }
	    })
	}

	this.getUserTickets = function () {
		return new Promise((resolve, reject) => {
			firebase.firestore().collection('tickets').where('uid', '==', this.user_id).get().then(
				(result) => {
					let docs = result.docs;
					docs.sort((a, b) => {
						return (b.data().date - a.data().date)
					});
					resolve(docs);
				},
				() => {
				}
			)
		})
	}


	this.getNotificationsNumber = function (context) {
  	    return new Promise((resolve) => {
  	    	firebase.firestore().collection('rel_user_notification').where('uid', '==', this.user_id).onSnapshot(
  	    		(querySnapshot) => {
	                if (querySnapshot.docs[0]) {
		                    context.setState( { numberBadge: querySnapshot.docs[0].data().counter });
			        }
            })
        })
	}

	this.updateUserMessages = (index) => {
		firebase.firestore().collection('user').where('uid', '==', this.user_id).get().then(
			async (result) => {
				// let messages = await AsyncStorage.getItem('user_messages');
				// messages = JSON.parse(messages);
				// messages[index].viewed = true;
				// firebase.firestore().collection('user').doc(result.docs[0]._ref.path.split('/')[1]).set({
				// 	messages: messages,
				// }, {merge: true});

			}
		)
	}

	this.incrementNotification = function(uid){
	    return new Promise((resolve) => {
	      try{
	          firebase.functions().httpsCallable('incrementUserNotification')({uid:uid}).then(
	            (result) => {
	            	this.logCall('incrementUserNotification', {uid}, result);
	            }
	          )
	      } catch (e) {
	      }
	    })
	}

	this.notifyNewCommentary = (pid, uid, isAnonymous) => {
		RNFetchBlob.config({
			trusty: true
		}).fetch('POST',
			'https://3.23.33.91/comment-message',
			{ 'Content-Type': 'application/json'},
			JSON.stringify({
				destUserId: uid,
				userName: isAnonymous ? 'Um anônimo' : this.user_name,
				pid: pid,
			})
		);
	}

	this.encryptUserData = (uid) => {
  	    firebase.functions().httpsCallable('encryptUserData')({ user_id: uid });
	}




	this.saveComment = function (params) {
		return new Promise((resolve) => {
			firebase.firestore().collection('comment').add(params).then(
				(result) => {
					firebase.firestore().collection('post').where('pid', '==', params.pid).get().then(
						(res) => {
							firebase.firestore().collection('post').doc(res.docs[0]._ref.path.split('/')[1]).set({
								comments: res.docs[0].data().comments + 1
							}, {merge: true});
							this.logCall('comment', params, res);
						},
						(err) => {
							this.logCall('comment', params, err);
						}
					);
					resolve(result);
				}
			)
		});
	}

	this.saveBoardPost = function (params) {
		return new Promise((resolve) => {
			let posts = [];
			firebase.firestore().collection('board').doc(params.docName).get().then(
				(result) => {
					if (result.data()) {
						let temp = result.data().docs;
						temp.unshift(params);
						posts = temp;
					} else {
						posts.unshift(params);
					}
					firebase.firestore().collection('board').doc(params.docName).set(
						{
							docs: posts
						},
						{
							merge: true
						}
					).then(
						(res) => {
							this.logCall('board', params, res);
							resolve(res);
						},
						(err) => {
							this.logCall('board', params, err);
						}
					);
				}
			)

		});
	}

	this.saveNotification = function (params) {
		let returnValue = null;
		return new Promise((resolve) => {
			const collections = collectionsStructures;
			const structure = collections['notification'];
			let notifications = [];
			firebase.firestore().collection('notification').doc(params.uid).get().then(
				(result) => {
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
					).then(
						(res) => {
							this.logCall('notification', params, res);
						},
						(err) => {
							this.logCall('notification', params, err);
						}
					);
				}
			)
		}).then(function () {
			return returnValue;
		})
	}

	this.resetNotifications = function(uid){
	    return new Promise((resolve) => {
	    	firebase.firestore().collection('rel_user_notification').where('uid','==', this.user_id).get().then(
			    (result) => {
			    	firebase.firestore().collection('rel_user_notification').doc(result.docs[0]._ref.path.split('/')[1]).set({
					    counter: 0,
				    }, {merge: true});
				    firebase.functions().httpsCallable('resetUserNotifications')({uid:uid});
			    },
			    () => {}
		    )
	    })
  }


	this.getUserNotifications = function (uid, limit) {
  	return new Promise((resolve) => {
        const post = firebase.firestore()
		    .collection('notification')
	        .doc(heimdallr.user_id)
		    .get().then((result) => {
		    	console.log('result not; ', result);
		    	if (result && result.data() && result.data().notifications && result.data().notifications.length > 0) {
			        resolve(result.data().notifications.slice(0, limit));
			    } else {
		    		console.warn('null');
		    		resolve(null);
			    }
	        }).catch ((e) => {
            });
    })
	}

	this.getStoreProducts = function (store) {
  	return new Promise((resolve) => {
	  firebase.firestore().collection('products').where('sid', '==', store).get().then(
		  (result) => {
		  	resolve(result);
		  },
		  () => {
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
  	return new Promise((resolve) => {
  		try {
		        console.log('store info from ', store);
		        firebase.firestore().collection('user_store_manager').where('store_code', '==', store).get().then(
				    (result) => {
				    	if (result && result.docs) {
				    		console.log('resultado ', result);
				            resolve(result.docs[0].data().store_info);
					    }
				    },
				    () => {
				    }
			    )

	    } catch (e) {
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

	this.getPartnersPlan = (store_code) => {
		let docs = null
		return new Promise((resolve) => {
				firebase.firestore()
				.collection('partners_plan').doc(store_code)
				.get().then((result) => {
					docs = result.data();
					resolve();
				}).catch((e) => {
					console.warn("erro",e);
				});
		}).then(function (resolve) {
			 return docs;
		})
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

	this.getNominalCoupons = (code) => {
  	    return new Promise((resolve, reject) => {
  	    	firebase.firestore().collection('nominal_coupons').where('hash', '==', code).get().then(
		        (result) => {
		        	if (result && result.docs && result.docs.length > 0) {
		        		resolve(result.docs.map(i => i.data()));
			        } else {
		        	    resolve([]);
			        }
		        },
		        () => {
		        	reject();
		        }
	        )
        });
	}

	this.StoreCoupons = function (saveCoupons,store){
		return new Promise((resolve, reject) => {
			try {
				firebase.firestore().collection('coupons').doc(store).set({
					coupons:saveCoupons
				}, {merge : true}).then(
					(res) => {
						this.logCall('coupons', {saveCoupons, store}, res);
					},
					(err) => {
						this.logCall('coupons', {saveCoupons, store}, err);
					}
				);
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
						}, {merge : true}).then(
							(res) => {
								this.logCall('user', userCoupons, res);

							},
							(err) => {
								this.logCall('user', userCoupons, err);
							}
						);
					}
				)
			 } catch (e) {
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
  	try {
	   return await firebase.auth().signInWithPhoneNumber(number);
    } catch (e) {
    }

  }

	this.deleteUser = function (user, password) {
		return new Promise((resolve, reject) => {
			try{
				firebase.auth().signInWithEmailAndPassword(user, password).then(
					() => {
						firebase.auth().currentUser.delete().then(
							(success) => {
								firebase.firestore().collection('user').where('uid', '==', this.user_id).get().then(
									(res) => {
										firebase.firestore().collection('user').doc(res.docs[0]._ref.id).delete();
									}
								);
								this.logCall('deleteUser', { user: user }, success);
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

	this.editPassword = function (oldPass, newPass) {
		return new Promise((resolve, reject) => {
			firebase.auth().signInWithEmailAndPassword(this.email, oldPass).then(
				() => {
					firebase.auth().currentUser.updatePassword(newPass).then(
						(res) => {
							this.logCall('editPassword', {}, res);
							resolve();
						},
						(err) => {
							this.logCall('editPassword', {}, err);
							reject({err});
						}
					)
				},
				() => {
					reject({message: 'Senha atual incorreta'});
				}
			)
		})
	}


  this.deleteConectedUser = function () {
  	return new Promise((resolve, reject) => {
	  firebase.auth().currentUser.delete().then(
		  (success) => {
		  	this.logCall('deleteConectedUser', {user: this.user_name, uid: this.user_id, email: this.email}, success);
		    resolve(success);
		  },
		  (error) => {
			  this.logCall('deleteConectedUser -error', {user: this.user_name, uid: this.user_id, email: this.email}, error);
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


	  if (luma < 80) {
		  return 'white'
	  } else {
		  return '#000000'
	  }

  }

	this.saveTicketsRegister = function (item){
		return new Promise((resolve) => {
			try{
				firebase.firestore().collection('tickets').doc(item.referenceId).set({
					...item
				}).then(
					(res) => {
						this.logCall('saveTicketsRegister', item, res);
					},
					(err) => {
						this.logCall('saveTicketsRegister', item, err);
					}
				);
				firebase.firestore().collection('products').where('iid', '==', item.iid).get().then(
					(res) => {
						firebase.firestore().collection('products').doc(res.docs[0]._ref.path.split('/')[1]).set({
							stock: res.docs[0].data().stock - 1
						}, {merge: true});
					}
				)
			} catch (e) {
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
	  } else if (elapsedTime.split(' ')[2] === 'mês') {
		  return `1m`;
	  } else if (elapsedTime.split(' ')[2] === 'meses') {
		  return `${elapsedTime.split(' ')[1]}m`;
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

  this.signOut = function () {
	  return new Promise((resolve) => {
		  firebase.auth().signOut().then(
		      () => {
		          resolve();
		      },
		      () => {
		      }
		  );
	  }).then(function (resolve) {
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
		    async (result) => {
		    	if (result && result.docs && result.docs[0]) {
		    		let image = this.user_image;
		    		let end = image.indexOf('&');
		    		image = end > 0 ? image.substring(0, end) : image;
		    		firebase.firestore().collection('user').doc(result.docs[0]._ref.path.split('/')[1]).set({
					    name: user.name,
					    user_image: image
				    }, {merge: true}).then((res) => {
					    this.logCall('user', user, res);
					    resolve();
				    })
			    }
		    }
	    )
	  })
  }

  this.verifyMembersNumber = function(store_code,plan_id){
	return new Promise((resolve) => {
		firebase.firestore().collection('partners_plan').doc(store_code).get().then(
			(result) => {
				resolve(parseInt(result.data()[plan_id].members_number) < parseInt(result.data()[plan_id].userLimiter));
			}
		)
	});
}

  this.updateProfile = function (user) {
	  return new Promise((resolve) => {
		  firebase.auth().currentUser.updateProfile({
		      displayName: user.name,
		  }).then((res) => {
		  	this.logCall('updateProfile', user, res);
		  	this.user_name = user.name;
		  	resolve(true);
		  }).catch((error) => {
			  this.logCall('updateProfile', user, error);
			  resolve(false);
		  })
	  });
  }

  this.checkUser = () => {
      let u = null;
      return new Promise((resolve) => {
          firebase.auth().onAuthStateChanged(
          	(user) => {
                  if (user) {
                      this.user_id = user._user.uid;
                      this.user_image = user._user.photoURL;
                      this.user_name = user._user.displayName;
					  this.email = user._user.email;
                      this.getUserData(user);
	                  // AsyncStorage.setItem('uid', user._user.id);
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

  this.getUserData = function (userData) {
	  firebase.firestore().collection('user').where('uid', '==', userData._user.uid).onSnapshot(
	  (result) => {
			  let user =  result && result.docs[0] ? result.docs[0].data() : userData;
			  this.phone = user.phone;
			  this.user_image = user.user_image;
			  this.userPlans = user.userPlans ? user.userPlans : null;
			  this.deviceToken = user.deviceToken ? user.deviceToken : null;
			  // AsyncStorage.setItem('user_messages', JSON.stringify(user.messages));
		  	console.log(this.phone);
		  }
	  )
  }

  this.signIn = function (params) {
      let user = null;
      return new Promise((resolve) => {
          if (params.user && params.password) {
              firebase.auth().signInWithEmailAndPassword(params.user, params.password)
                  .then(
                      (result) => {
                          user = result;
                          resolve();
                      }
                  ).catch((error) => {
                      console.log('error: ', error)
                  resolve();
                  });

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
		    	this.logCall('signUp', {email: params.email}, success);
		    	newUser = success;
			    resolve();
		    },
		    (error) => {
			    this.logCall('signUp', {email: params.email}, error);
			    reject(error);
		    }
	    )

    }).then(function () {
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
  	return new Promise((resolve) => {
        firebase.firestore()
		    .collection('post')
	        .where('uid', '==', uid)
		    .get().then((result) => {
		    	if (result && result.docs) {
		    		let docs = result.docs.slice(0, limit);
		    		docs = docs.map((d) => d.data());
				    docs.sort((a, b) => {
					    return (b.date - a.date)
				    });
				    // docs = result.docs.filter((d) => {return !d.data().anonymous})
			        // docs = docs.sort((a, b) => {
				    //     return b.data().date - a.data().date;
				    // console.log('ta´certo: ', docs);
				    // });
				    resolve(docs);
			    } else {
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
				.where('pid', '==', pid)
				.get().then((result) => {
					docs = result.docs.slice(0, limit);
					docs = docs.map((d) => d.data());
					// docs = result.docs;
					docs.sort((a, b) => {
						return (a.date) - (b.date)
					});
					// docs = docs.slice(0, limit);
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
            const post = firebase.firestore()
              .collection(collection)
                .orderBy('sort_value', 'desc')
                .limit(limit)
              .get().then((result) => {
                  docs = result.docs;
                  resolve();
              }).catch (() => {
              });
          } else {
              firebase.firestore()
                  .collection(collection)
                  .get().then((result) => {
                      docs = result.docs;
                      resolve();
                  }).catch (() => {
                  });
          }

      }).then(function () {
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

	this.deletePost = function (pid) {
  	    this.sendEvent('delete_post');
		return new Promise((resolve, reject) => {
			firebase.firestore().collection('post').where('pid', '==', pid).get().then(
				(result) => {

					firebase.firestore().collection('post').doc(result._docs[0]._ref.id).delete().then(
						() => {
							resolve();
						},
						() => {
							reject();
						}
					);
				},
				(error) => {
					reject(error);
				}
			)
		})
	}

	this.deleteCommentary = function (pid, cid) {
		this.sendEvent('delete_comment');
		return new Promise((resolve, reject) => {
			firebase.firestore().collection('comment').where('cid', '==', cid).get().then(
				(result) => {
					firebase.firestore().collection('comment').doc(result.docs[0]._ref.path.split('/')[1]).delete().then(
						(res) => {
							this.logCall('deleteCommentary', {pid, cid}, res);
							firebase.firestore().collection('post').where('pid', '==', pid).get().then(
								(res) => {
									firebase.firestore().collection('post').doc(res.docs[0]._ref.path.split('/')[1]).set({
										comments: res.docs[0].data().comments - 1
									}, {merge: true});
								}
							);
							resolve();
						},
						(err) => {
							this.logCall('deleteCommentary', {pid, cid}, err);
						}
					)
				},
				() => {
					reject();
				}
			)
		}).catch(function(error){
		})
	}

	this.deleteBoardItem = function (docName, pid) {
		return new Promise((resolve, reject) => {
			firebase.firestore().collection('board').doc(docName).get().then(
				(result) => {
					let board = result.data().docs.filter((item) => item.pid != pid);
					firebase.firestore().collection('board').doc(docName).set(
						{ docs: board }, { merge: true }
					).then(
						(res) => {
							this.logCall('deleteBoardItem', {pid, docName}, res);
							resolve();
						},
						(err) => {
							this.logCall('deleteBoardItem', {pid, docName}, err);
							reject();
						}
					);

				},
				() => {
					reject();
				}
			)
		}).catch(function(error){
		})
	}

	this.sendEvent = function (eventName) {
	    firebase.analytics().logEvent(eventName);
	}


	this.savePhoneRequest = function(params) {
		let saved = false;
		return new Promise((resolve, reject) => {
		firebase.firestore().collection('phone_request').doc(params.request_id.toString()).set({
			...params
			}).then((result) => {
				console.log("Document written with ID: ", result.id);
				saved = true;
				resolve();
			},
			(error) => {
				reject(error);
			})
		}).then((resolve) => {
			return saved;
		})
	}

	this.checkRequestPhone = function (receiverId) {
		return new Promise((resolve, reject) => {
			firebase.firestore().collection('phone_request').where('receiver_id', '==', receiverId).get().then(
				(result) => {
					const phoneRequests = result.docs;
					let previous = phoneRequests.filter((item) => {return item._data.sender_id === this.user_id});

					if(previous.length > 0) {
						resolve();
					} else {
						reject();
					}

				},
				(error) => {
					reject(error);
				}
			)
		});
	}

  this.saveCollection = function (collection, params) {
    let returnValue = null;
    return new Promise((resolve) => {
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

      if (parametersOK && collection === 'post') {
      	    returnValue = params.pid;
	        heimdallr.saveCollection('unverified_post', params);
	        firebase.firestore().collection(collection).doc(params.pid).set(params).then(
		        () => {
		        	resolve();
		        }
	        )
      } else if (parametersOK) {
        const base = firebase.firestore().collection(collection);
        base.add(params).then(
          (docRef) => {
	          this.logCall(collection, params, docRef);
	          returnValue = docRef.id;
            if (collection === 'post') {
            	heimdallr.saveCollection('unverified_post', params);
            	console.log('deve entrar: ', params.anonymous);
            }
            if (collection === 'user') {
            	this.user_image = params.user_image ? params.user_image : null;
            	this.user_name = params.name;
            	this.email = params.email;
            	this.uid = params.uid;
            }
            resolve();
          },
          (err) => {
	          this.logCall(collection, params, err);
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

  this.userEditImage = function (image) {
  	return new Promise(async (resolve, reject) => {
	    let begin = this.user_image.indexOf('img')
	    let end = this.user_image.indexOf('?');
	    const bucket = this.user_image.substring(begin, end);
	    firebase.storage().ref(`${this.user_id}/${bucket}`).putFile(image).on('state_changed',
		    (snapshot) => {
			    let total = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			    console.log('progress: ' +  total + '%');
			    if (total === 100 || snapshot.state === 'success') {
				    console.log('Upload complete: ', snapshot.downloadURL);
				    resolve(snapshot.downloadURL);
			    }
		    },
		    (err) => {
			    console.log('Error: ', err);
			    reject();
		    }
	    );
    })
  }

  this.getDrawer = function () {
  	return new Promise((resolve, reject) => {
  		firebase.firestore().collection('sideDrawer').get().then(
		    (result) => {
		    	resolve(result.docs[0].data());
		    }
	    )
    })
  }

  this.getBoard = function (boardName) {
	  return new Promise((resolve, reject) => {
	  	firebase.firestore().collection('board').doc(boardName).get().then(
		    (result) => {
		    	resolve(result.data().docs);
		    }
	    )
	  })
  }

  this.getBoardItem = function (boardName, pid) {
	return new Promise((resolve, reject) => {
		firebase.firestore().collection('board').doc(boardName).get().then(
		  (result) => {
			  let board = result.data().docs;
			  let boardItem = board.filter(item => item.pid === pid);
			  resolve(boardItem);
		  }
	  )
	})
  }

  this.changeBoardItemPriority = function (boardName, pid) {
	  firebase.firestore().collection('board').doc(boardName).get().then(
		  (result) => {
			  let board = result.data().docs;
			  let boardItemIndex = board.findIndex(item => item.pid === pid);
			  if (boardItemIndex !== 0) {
			  	[board[boardItemIndex -1 ], board[boardItemIndex]] = [board[boardItemIndex], board[boardItemIndex - 1]];
			  	firebase.firestore().collection('board').doc(boardName).set({
				    docs: board
			    }, {merge: true});
			  }

		  }
	  )
  }

  this.likePost = (pid) => {
	  firebase.firestore().collection('post').where('pid', '==', pid).get().then(
		  async (resolve) => {
		  	if (!resolve.docs[0]) {
			    this.likePost(pid);
		    } else {
			    let doc = resolve.docs[0].data();
			    // Verifica se o usuário já deu like naquela publicação
			    const index = doc.liked_by ? doc.liked_by.indexOf(this.user_id) : -1;
			    // caso não tenha dado like, a ação continua
			    if (index == -1) {
				    this.sendEvent('like_post');
				    doc.likes = doc.likes ? doc.likes + 1 : 1;
				    if (doc.liked_by) {
					    doc.liked_by.push(this.user_id);
				    } else {
					    doc.liked_by = [this.user_id];
				    }
				    // adiciona o like a acrescenta "5 min" da postagem
				    firebase.firestore().collection('post').doc(resolve.docs[0]._ref.id).set({
					    likes: doc.likes,
					    liked_by: doc.liked_by,
					    sort_value: doc.sort_value + 300000
				    }, {merge: true});

				    if(this.user_id != doc.uid){
					    const notifications = {};
					    notifications.eid = doc.pid;
					    notifications.uid = doc.uid;
					    notifications.uid_notification = this.user_id;
					    notifications.user_name = this.user_name;
					    notifications.user_image = this.user_image;
					    notifications.content = `curtiu a sua postagem ❤`;
					    notifications.date = await this.getServerTime();
					    notifications.visualized = 0;
					    notifications.entity = "like";
					    this.incrementNotification(doc.uid);

					    this.getUID().then((uuid) => {
						    notifications.nid = uuid;
						    RNFetchBlob.config({
							    trusty: true
						    }).fetch('POST',
							    'https://3.23.33.91/like-message',
							    { 'Content-Type': 'application/json'},
							    JSON.stringify({
								    destUserId: doc.uid,
								    userName: this.user_name,
								    pid: doc.pid,
							    })
						    );
						    this.saveNotification(notifications);
					    })
				    }
			    }
		    }

		  },
		  () => {
		  }
	  )
  }

	this.dislikePost = function (pid) {
		firebase.firestore().collection('post').where('pid', '==', pid).get().then(
			(resolve) => {
				if (!resolve.docs[0]) {
					this.dislikePost(pid);
				} else {
					let doc = resolve.docs[0].data();
					const index = doc.liked_by.indexOf(this.user_id);
					if (index != -1) {
						doc.likes = doc.likes - 1;
						doc.liked_by.splice(index, 1);
					}
					firebase.firestore().collection('post').doc(resolve.docs[0]._ref.id).set({
						likes: doc.likes,
						liked_by: doc.liked_by,
						sort_value: doc.sort_value - 300000
					}, {merge: true});
				}

			},
			(reject) => {

			}
		)
	}

	this.likeCommentary = async function (cid) {
		firebase.firestore().collection('comment').where('cid', '==', cid).get().then(
			async (resolve) => {
				if (!resolve.docs[0]) {
					this.likeCommentary(cid);
				} else {
					let doc = resolve.docs[0].data();
					const index = doc.liked_by ? doc.liked_by.indexOf(this.user_id) : -1;
					if (index == -1) {
						this.sendEvent('like_commentary');
						doc.likes = doc.likes ? doc.likes + 1 : 1;
						if (doc.liked_by) {
							doc.liked_by.push(this.user_id);
						} else {
							doc.liked_by = [this.user_id];
						}
						firebase.firestore().collection('comment').doc(resolve.docs[0]._ref.id).set({
							likes: doc.likes,
							liked_by: doc.liked_by,
						}, {merge: true});
						if(this.user_id != doc.id_user){
							const notifications = {};
							notifications.eid = doc.pid;
							notifications.uid = doc.id_user;
							notifications.uid_notification = this.user_id;
							notifications.user_name = this.user_name;
							notifications.user_image = this.user_image;
							notifications.content = `curtiu o seu comentário ❤`;
							notifications.date = await this.getServerTime();
							notifications.visualized = 0;
							notifications.entity = "like";
							this.incrementNotification(doc.id_user);

							this.getUID().then((uuid) => {
								notifications.nid = uuid;
								this.saveNotification(notifications);
							})
						}
					}
				}

			},
			(reject) => {

			}
		)
	}

	this.dislikeCommentary = function (cid) {
		firebase.firestore().collection('comment').where('cid', '==', cid).get().then(
			(resolve) => {
				if (!resolve.docs[0]) {
					this.dislikeCommentary(cid);
				} else {
					let doc = resolve.docs[0].data();
					const index = doc.liked_by.indexOf(this.user_id);
					if (index != -1) {
						doc.likes = doc.likes - 1;
						doc.liked_by.splice(index, 1);
						firebase.firestore().collection('comment').doc(resolve.docs[0]._ref.id).set({
							likes: doc.likes,
							liked_by: doc.liked_by,
						}, {merge: true});
					}
				}
			},
			() => {
			}
		)
	}

	this.testNotification = (navigator) => {
		firebase.notifications().getInitialNotification().then(
			(remoteMessage ) => {
				// console.warn('pense na notify:', (remoteMessage.notification.data()));
				if (remoteMessage.notification._data.pid) {
					navigator.push('PostDetails', {
						pid: remoteMessage.notification._data.pid,
						userId: this.user_id
					})
				} else if (remoteMessage.notification._data.screen) {
					let params = remoteMessage.notification._data.params ? JSON.parse(remoteMessage.notification._data.params) : {};
					navigator.push(remoteMessage.notification._data.screen, params);
				} else if (remoteMessage.notification._data.boardId) {
					navigator.push('BoardItemDetails', {
						pid: remoteMessage.notification._data.boardId,
						docName: remoteMessage.notification._data.board,
						origin: 'notification'
					});
				} else if (remoteMessage.notification._data.url) {
					Linking.openURL(remoteMessage.notification._data.url)
				}
			}
		)
	}

	this.sendBoardCommentNotification = (notification) => {
		RNFetchBlob.config({
			trusty: true
		}).fetch('POST',
			'https://3.23.33.91/comment-board-message',
			{ 'Content-Type': 'application/json'},
			JSON.stringify({
				destUserId: notification.uid,
				userName: this.user_name,
				pid: notification.eid,
				board: notification.board
			})
		);
	}


	this.saveToken = (token) => {
		if (token !== this.deviceToken) {
			firebase.firestore().collection('user').where('uid', '==', this.user_id).get().then(
				(resolve) => {
					firebase.firestore().collection('user').doc(resolve.docs[0]._ref.id).set({
						deviceToken: token,
					}, {merge: true});
					this.logCall('saveToken', {token}, resolve);
				}
			)
		}
	}

	this.getDeviceToken = () => {
  	    firebase.messaging().getToken().then(
	        (token) => {
	        	this.saveToken(token);
	        }
        )
		firebase.messaging().onTokenRefresh((token => {
			this.saveToken(token);
		}))

	}

	this.validatePlanBeforeBuy = function (store, time) {
  	    return new Promise((resolve, reject) => {
			firebase.firestore().collection('user').where('uid', '==', this.user_id).get().then(
				(result) => {
					let user =  result.docs[0].data();
					this.userPlans = user.userPlans ? user.userPlans : null;
					if (user.userPlans && user.userPlans[store][0].due_date > time && user.userPlans[store][0].active === 1) {
						resolve(true);
					} else {
						resolve(false);
					}
				},
				(error) => {
					reject(error);
				}
			)
        })
	}

	this.setLastSeen =  function () {
		return new Promise((resolve, reject) => {
			firebase.firestore().collection('user').where('uid', '==', this.user_id).get().then(
				async (result) => {
					let time = await this.getServerTime();
					firebase.firestore().collection('user').doc(result.docs[0]._ref.id).set({
						lastSeen: time,
					}, {merge: true});
				},
				(error) => {
					reject(error);
				}
			)
		})
	}

	this.saveNominalCouponUsage = function (hash) {
		return new Promise((resolve, reject) => {
			console.warn('hash: ', hash);
			firebase.firestore().collection('nominal_coupons').doc(hash).get().then(
				(result) => {
					console.warn('achei aqui', result.data());
					let quantity = result.data().quantity - 1;
					firebase.firestore().collection('nominal_coupons').doc(hash).set({
						quantity: quantity
					}, {merge: true});
				},
				(error) => {

				}
			)
		});
	}

	this.getPhoneRequestsReceived = function () {
		return new Promise((resolve, reject) => {
			firebase.firestore().collection('phone_request').where('receiver_id', '==', this.user_id).get().then(
				(result) => {
					if (result && result.docs && result.docs.length > 0) {
						let docs = result.docs;
						docs.sort((a, b) => {
							return (b.data().date - a.data().date)
						});
						resolve(docs.map(i => i.data()));
					} else {
						resolve([]);
					}
				},
				(err) => {
					reject(err);
				}
			)
		})
	}

	this.getPhoneRequestsSended = function () {
		return new Promise((resolve, reject) => {
			firebase.firestore().collection('phone_request').where('sender_id', '==', this.user_id).get().then(
				(result) => {
					if (result && result.docs && result.docs.length > 0) {
						let docs = result.docs;
						docs.sort((a, b) => {
							return (b.data().date - a.data().date)
						});
						resolve(docs.map(i => i.data()));
					} else {
						resolve([]);
					}
				},
				(err) => {
					reject(err);
				}
			)
		})
	}


}

const heimdallr = new HeimdallrLib();
export default  heimdallr;
