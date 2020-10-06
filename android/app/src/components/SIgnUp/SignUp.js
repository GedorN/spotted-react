import React from 'react';
import {
	View,
	StyleSheet,
	Animated,
	BackHandler
} from 'react-native';

import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../../components/General/Theme";
import {NavigationActions, StackActions} from "react-navigation";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";
import AnimatedLoader from "react-native-animated-loader";
var interval = null;
var RNFS = require('react-native-fs');
var backButtonListner = null;



export default  class SignUp extends React.Component {
	constructor (props) {
		super(props);
		this.state= {
			email: null,
			name: null,
			password: null,
			phone: null,
			profileImage: null,
			imageCompressed: null,
			showErrorMessage: false,
			showEmailAlreadyInUse: false,
			showEmailBadlyFormatted: false,
			confirmationFunction: null,
			codeInput: null,
			countdownToReset: 30,
			inputedWrongCode: false,
			creatingAccount: false,
			pastStep: 0,
			currentStep: 1,
			firstStepSize: new Animated.Value(theme.width),
			secondStepSize: new Animated.Value(0),
			thirdStepSize: new Animated.Value(0),
		};
	}

	toggleSecureEntry = () => {
		this.setState({ securePassword: !this.state.securePassword });
	}


	sendVerificationMessage = async () => {
		clearInterval(interval);
		interval = setInterval(() => {
			const time = this.state.countdownToReset;
			if (time > 0) {
				this.setState({ countdownToReset: this.state.countdownToReset - 1 });
			} else {
				this.setState({ countdownToReset: 30 });
				this.sendVerificationMessage();
			}
		}, 1000);
		const func = await heimdallr.sendVerificationMessage('+55' + this.state.phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', ''));
		this.setState({ confirmationFunction: func });
		heimdallr.checkUser().then((result) => {
			if (result) {
				clearInterval(interval);
				this.setState({ creatingAccount: true });
				heimdallr.deleteConectedUser().then(
					(success) => {
						this.register();
					},
					(reject) => {
						this.setState({ creatingAccount: false });
						this.setState({ inputedWrongCode: true });
					}
				)
			}
		})
	}

	confirmCode = () => {
		if (!this.state.codeInput || this.state.codeInput === '') {
			return ;
		}

		this.setState({ creatingAccount: true });

		this.state.confirmationFunction.confirm(this.state.codeInput).then(
			() => {
				heimdallr.deleteConectedUser().then(
					() => {
						this.register();
					},
					() => {
					}
				)
			},
			() => {
				heimdallr.deleteConectedUser();
				this.setState({ creatingAccount: false, inputedWrongCode: true });
			}
		)
	}

	register = () => {

		const params = {};
		params.email = this.state.email;
		params.password = this.state.password;
		let result = heimdallr.signUp(params);
		result.then(
			(resolve) => {
				backButtonListner.remove();
				this.saveUser(resolve);
			},
			(reject) => {
				if (reject.message ==  "The email address is already in use by another account.") {
					this.setState({ creatingAccount: false, showEmailAlreadyInUse: true });
					Animated.timing(this.state.thirdStepSize, {
						toValue: 0,
						duration: 100
					}).start(
						() => {
							this.setState({ currentStep: 1 })
							Animated.timing(this.state.firstStepSize, {
								toValue: theme.width,
								duration: 100
							}).start(() => this.setState({ pastStep: 2 }))
						}
					);

				}
				if (reject.message ==  "The email address is badly formatted.") {
					this.setState({ showEmailBadlyFormatted: true, creatingAccount: false });
					Animated.timing(this.state.thirdStepSize, {
						toValue: 0,
						duration: 100
					}).start(
						() => {
							this.setState({ currentStep: 1 })
							Animated.timing(this.state.firstStepSize, {
								toValue: theme.width,
								duration: 100
							}).start(() => this.setState({ pastStep: 2 }))
						}
					);
				}

			}
		);
	}

	saveUser = (user) => {
		if (this.state.profileImage) {
			let result = heimdallr.uploadImage(this.state.imageCompressed);
			result.then(async (resolve) => {
				let token = resolve.indexOf('&');
				resolve = resolve.substring(0, token);
				const params = {};
				params.name = this.state.name;
				params.email = this.state.email;
				params.creation_date = await heimdallr.getServerTime();
				params.active = 1;
				params.phone = this.state.phone;
				params.password = this.state.password;
				params.uid = user.user.uid;
				params.user_image = resolve;
				let success = heimdallr.saveCollection('user', params);
				success.then((r) => {
					this.forceUpdate();
					this.updateUser(params);
				});
			});
		} else {
			RNFS.mkdir(RNFS.DocumentDirectoryPath + '/Spotted');
			RNFS.downloadFile(
				{
					fromUrl: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/mask-solid.png?alt=media',
					toFile: `${RNFS.DocumentDirectoryPath}/Spotted/mask.png`
				}
			).promise.then(
				() => {
					heimdallr.uploadImage(`${RNFS.DocumentDirectoryPath}/Spotted/mask.png`).then(
						async (resolve) => {
							let token = resolve.indexOf('&');
							resolve = resolve.substring(0, token);
							const params = {};
							params.name = this.state.name;
							params.email = this.state.email;
							params.creation_date = await heimdallr.getServerTime();
							params.phone = this.state.phone;
							params.active = 1;
							params.password = this.state.password;
							params.uid = user.user.uid;
							params.user_image = resolve;
							let success = heimdallr.saveCollection('user', params);
							success.then((r) => {
								this.forceUpdate();
								this.updateUser(params);
							});
						}
					);
				},
				(e) => {
				}
			)
		}
	}

	componentDidMount(): void {
		// Tratamento para click de voltar quando se está na raiz no pp
		backButtonListner = BackHandler.addEventListener('hardwareBackPress', () => {
			if (this.state.currentStep > 0) {
				this.goBack();
				return true;
			}
		})
	}

	updateUser = (user) => {
		heimdallr.updateProfile(user).then(
			(resolve) => {
				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({ routeName: 'Home' })],
				});
				heimdallr.encryptUserData(user.uid);
				this.props.navigation.dispatch(resetAction);
			}
		);
	}


	cancelPress = () => {
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Home' })],
		});
		this.props.navigation.dispatch(resetAction);
	}

	closeCodeModal = () => {
		this.setState({ showConfirmCodeModal: false, countdownToReset: 30 });
		clearInterval(interval);
	}

	redirect = (route, params) => {
		this.props.navigation.push(route, params);
	}

	goBack = () => {
		console.warn('estou no goBack');
		switch (this.state.currentStep) {
			case 1:
				this.setState({ pastStep: 1, currentStep: 0 });
				backButtonListner.remove();
				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({ routeName: 'Home' })],
				});
				this.props.navigation.dispatch(resetAction);
				break;
			case 2:
				Animated.timing(this.state.secondStepSize, {
					toValue: 0,
					duration: 100
				}).start(
					() => {
						this.setState({ currentStep: 1, pastStep: 2 })
						Animated.timing(this.state.firstStepSize, {
							toValue: theme.width,
							duration: 100
						}).start(() => this.setState({ pastStep: 2 }));
					}
				);
				break;
			case 3:
				clearInterval(interval);
				Animated.timing(this.state.thirdStepSize, {
					toValue: 0,
					duration: 100
				}).start(
					() => {
						this.setState({ currentStep: 2 })
						Animated.timing(this.state.secondStepSize, {
							toValue: theme.width,
							duration: 100
						}).start(() => this.setState({ pastStep: 3 }))
					}
				);
		}
	}

	nextStep = (params) => {
		if (this.state.currentStep === 1) {
			this.state.name = params.name;
			this.state.email = params.email;
			this.state.imageCompressed = params.imageCompressed;
			this.state.profileImage = params.profileImage;
			this.setState({ pastStep: 1 })
			Animated.timing(this.state.firstStepSize, {
				toValue: 0,
				duration: 100
			}).start(
				() => {
					this.setState({ currentStep: 2 })
					Animated.timing(this.state.secondStepSize, {
						toValue: theme.width,
						duration: 100
					}).start()
				}
			);
		} else if (this.state.currentStep === 2) {
			this.state.phone = params.phone;
			this.state.password = params.password;
			this.setState({ pastStep: 2 });
			this.sendVerificationMessage();
			Animated.timing(this.state.secondStepSize, {
				toValue: 0,
				duration: 100
			}).start(
				() => {
					this.setState({ currentStep: 3 })
					Animated.timing(this.state.thirdStepSize, {
						toValue: theme.width,
						duration: 100
					}).start()
				}
			);
		} else if (this.state.currentStep === 3) {
			this.state.codeInput = params.codeInput;
			this.setState({ pastStep: 3 });
			this.confirmCode();
		}

	}


	render(){
		return (
			<View style={{flex: 1}}>
				{
					this.state.currentStep === 1 &&
					<Animated.View style={{width: this.state.firstStepSize}}>
						<FirstStep
							foward={this.nextStep.bind(this)}
							goBack={this.goBack.bind(this)}
							showEmailAlreadyInUse={this.state.showEmailAlreadyInUse}
							showEmailBadlyFormatted={this.state.showEmailBadlyFormatted}
							name={this.state.name}
							email={this.state.email}
							profileImage={this.state.profileImage}
							redirect={this.redirect.bind(this)}

						/>
					</Animated.View>
				}
				{
					this.state.currentStep === 2 &&
					<Animated.View style={{width: this.state.secondStepSize, alignSelf: this.state.pastStep === 1 || this.state.pastStep === 3 ? 'flex-end' : 'flex-start'}}>
						<SecondStep
							foward={this.nextStep.bind(this)}
							goBack={this.goBack.bind(this)}
							phone={this.state.phone}
							password={this.state.password}
						/>
					</Animated.View>
				}
				{
					this.state.currentStep === 3 &&
					<Animated.View style={{width: this.state.thirdStepSize, alignSelf: 'flex-end'}}>
						<ThirdStep foward={this.nextStep.bind(this)} countdown={this.state.countdownToReset} inputedWrongCode={this.state.inputedWrongCode} goBack={this.goBack.bind(this)}/>
					</Animated.View>
				}
				{
					<AnimatedLoader
						visible={this.state.creatingAccount}
						source={require("../../../../../assets/lf30_editor_q8ipcq3s")}
						overlayColor="rgba(255,255,255, 1)"
						animationStyle={styles.lottie}
						speed={1}
						loop={true}
						autoPlay={true}
					/>
				}
			</View>
		);
	}
}

const styles= StyleSheet.create({
	lottie: {
		width: 100,
		height: 100
	},
});
