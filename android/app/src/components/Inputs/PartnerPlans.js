import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	Image,
	ActivityIndicator,
	TouchableOpacity,
	RefreshControl,
	ScrollView,
	StatusBar,
	BackHandler,
	Modal,
	Linking,
} from "react-native";

import theme from "../../../../../components/General/Theme";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import axios from 'react-native-axios';
import moment from "moment";
import 'moment/locale/pt-br';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import SkeletonPlaceholder from "react-native-skeleton-placeholder/lib/SkeletonPlaceholder";

export default class PartnerPlans extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			selectedPlan: null,
			showLoading: false,
			colors: [],
			partnersPlan: null,
			logo: null,
			planId: [],
			store: null,
			loading: true,
			today: 0,
		}
    }

    componentDidMount (): void {
		const store = this.props.navigation.getParam('store');
	    heimdallr.getStoreInfo(this.props.navigation.getParam('store')).then(
		    async (resolve) => {
	            const time = await heimdallr.getServerTime();
			    StatusBar.setBackgroundColor(resolve.colors[0]);
			    StatusBar.setBarStyle('light-content');
			    heimdallr.getPartnersPlan(this.props.navigation.getParam('store')).then(
			    	(result) => {
					    this.setState({
						    planId: Object.keys(result),
						    partnersPlan: result,
						    colors: resolve.colors,
						    logo : resolve.logo,
						    store: store,
						    today: time,
						    loading: false,
					    })
				    });
		    }
	    );
    }

	registerPartnerPlan = async () => {

		this.setState({showLoading: true});


		let price = null;
		let timeNow = null;
		let user = {};
		let selectedPlan = this.state.planId[this.state.selectedPlan];
		let userParams = Object.assign({},this.state.partnersPlan[selectedPlan]);

		userParams.referenceId = await heimdallr.getUID();
		userParams.signature_date = await heimdallr.getServerTime();
		userParams.due_date =  moment(userParams.signature_date).add(userParams.vigor,'d').valueOf();
		userParams.members = null;
		userParams.active = 1;

		user.name = heimdallr.user_name;
		user.email = heimdallr.email;
		user.image = heimdallr.user_image;
		user.phone = heimdallr.phone;
        user.referenceId = 	userParams.referenceId;
		user.signature_date = userParams.signature_date;
		user.due_date = userParams.due_date;
        user.uid = heimdallr.user_id;


		timeNow = moment(userParams.signature_date).add(4,'m').format();
		price = parseFloat(userParams.price.replace(',','.'));

		heimdallr.verifyMembersNumber(this.state.store, userParams.plan_id).then(
			(resolve) => {
				if(resolve){
					axios({
						method: 'post',
						url: 'https://appws.picpay.com/ecommerce/public/payments',
						headers: {'x-picpay-token': '3782eb80-9b55-4611-a81a-111555fc39ec'},
						data: {
							"referenceId":userParams.referenceId,
							"callbackUrl": "http://www.spottedutfpr.com.br/callback",
							"value": price,
							"expiresAt": timeNow,
							"buyer": {
								"firstName": heimdallr.user_name.split(' ')[0],
								"lastName": heimdallr.user_name.split(' ')[0],
								"document": "123.456.789-10",
								"email": heimdallr.email,
								"phone": "+55 27 12345-6789"
							}
						}
						}).then(
							(result) => {
								this.setState({showLoading: false});
								userParams.url = result.data.paymentUrl;
								Linking.openURL(result.data.paymentUrl);

								let verify = setInterval(() => {
									axios({
										method: 'get',
										url: 'https://appws.picpay.com/ecommerce/public/payments/'+`${userParams.referenceId}`+'/status',
										headers: {'x-picpay-token': '3782eb80-9b55-4611-a81a-111555fc39ec'}
									}).then(
										(rest) => {
											if(rest.data.status === 'paid'){

												showMessage({
													message: "Compra realizada com sucesso",
													type: "success",
													icon: 'success'
												});

												clearInterval(verify);
												const currentPlan = this.props.navigation.getParam('current_plan');
												if(currentPlan){
													heimdallr.deletePreviousPlan(currentPlan.plan_id, currentPlan.referenceId).then(
														() => {
															heimdallr.updateNewPartner(userParams.plan_id, user);
															heimdallr.alterMembersNumber(this.state.store,currentPlan.plan_id,-1);
														});

													heimdallr.alterMembersNumber(this.state.store,selectedPlan,1);
													heimdallr.savePartnerPlan(this.state.store,userParams).then(
														() => {
															heimdallr.newPlanAdded = true;
															this.props.navigation.goBack();
														});
												}
												else{
													heimdallr.updateNewPartner(userParams.plan_id,user);
													heimdallr.alterMembersNumber(this.state.store,selectedPlan,1);
													heimdallr.savePartnerPlan(this.state.store, userParams).then(
														() => {
															heimdallr.newPlanAdded = true;
															this.props.navigation.goBack();
														});

												}
											}
										},
										() => {
											this.setState({showLoading: false});

										})
								}, 5000);

								setTimeout(() => {
									clearInterval(verify);
								},240000);
							},
							(reject) => {
								clearInterval(verify);
								this.setState({showLoading: false});

								showMessage({
									message: "Erro ao realizar a compra",
									type: "danger",
									icon: 'danger'
								});
							})
				} else {
					this.setState({showLoading: false});
					showMessage({
						message: "Número de membros acabou de ser esgotado",
						type: "danger",
						icon: 'danger'
					});
				}
			})
	}

    render() {
        return (
            <View style={styles.container}>
	            {
					!this.state.showLoading &&
					<View style={styles.container}>
						<View style = {styles.timesView}>
							<TouchableOpacity
								onPress={() => this.props.navigation.goBack()}>
								<View style={styles.iconView}>
									<Image
										source={require('../../../../../assets/images/times-solid.png')}
										style={{ width: 20, height: 20,marginRight: 5, opacity: 0.7, tintColor: this.state.colors[0] }}
									/>
								</View>
							</TouchableOpacity>
						</View>
						<View style = {styles.header}>
							<View style={{flexDirection: 'row', paddingLeft: theme.width * 0.1}}>
								<Text style = {styles.headerText}>{'Opções Plano Sócio'}</Text>
								<View style = {styles.imageView}>
									<View style = {styles.secondImageView}>
										<Image
											source = {{ uri: this.state.logo }}
											style = {styles.logoImage}>
										</Image>
									</View>
								</View>
							</View>
							{
							this.state.selectedPlan != null &&
							<View style={{ ...styles.partnerButton, backgroundColor: this.state.colors[0]}}>
								<TouchableOpacity
									style ={{ padding:10, width: theme.width * 0.9 }}
									onPress = {this.registerPartnerPlan.bind(this)}
									onPressIn={() => heimdallr.sendEvent('buy_plan')}
								>
									<View style={styles.partnerButtonView}>
										<Image
											style = {{ ...styles.partnerButtonIcon, tintColor: this.state.colors[0] ? heimdallr.getTxtColor(this.state.colors[0]) : 'white'}}
											source = {require('../../../../../assets/images/star-solid.png')}
										/>
										<Text style={{ ...styles.buttonPartnerText, color:  this.state.colors[0] ? heimdallr.getTxtColor(this.state.colors[0]) : 'white'}}>TORNE-SE SÓCIO</Text>
									</View>
								</TouchableOpacity>
							</View>
							}
						</View>
						{
						!this.state.loading ?
						<View>
							<View style = {{ ...styles.modalView, height:  theme.height * 0.8 }}>
								<ScrollView style = {styles.scrollView} showsVerticalScrollIndicator = {false}>
									<View style ={{ marginTop: 10, marginBottom: (this.state.selectedPlan != null ? 50 : 20) }}>
										{
											this.state.planId.length > 0 ?
												<View style={styles.subtitleView}>
													<Text style={{ ...styles.subtitleText, color: this.state.colors[0] }}>Selecione o plano e seja feliz</Text>
												</View>

												:
												<View style={styles.subtitleView}>
													<Text style={{ ...styles.subtitleText, color: this.state.colors[0] }}>Esta entidade ainda não possui planos disponíveis ಠ︵ಠ</Text>
												</View>
										}

										{
											this.state.planId &&
											this.state.planId.map(i =>
											<View  key = {i} style={styles.partnersPlanView}>
												<View style={{...styles.selectedPlan, opacity: (this.state.partnersPlan[i].members_number === parseInt(this.state.partnersPlan[i].userLimiter) || (this.props.navigation.getParam('current_plan').plan_id === this.state.partnersPlan[i].plan_id && this.props.navigation.getParam('current_plan').active === 1 && this.props.navigation.getParam('current_plan').due_date > this.state.today) ? 0.8 : 1), borderColor: (this.state.selectedPlan === this.state.planId.indexOf(i) ? this.state.colors[0]: null), borderWidth: (this.state.selectedPlan === this.state.planId.indexOf(i) ? 3 : 0) }}>
													<TouchableOpacity
														disabled={this.state.partnersPlan[i].members_number === parseInt(this.state.partnersPlan[i].userLimiter) || (this.props.navigation.getParam('current_plan').plan_id === this.state.partnersPlan[i].plan_id && this.props.navigation.getParam('current_plan').active === 1 && this.props.navigation.getParam('current_plan').due_date > this.state.today) ? true : false}
														onPress={() => this.setState({selectedPlan: this.state.planId.indexOf(i)})}
													>
														<Text style={{ ...styles.planName, color: this.state.colors[0] }}>{ 'Plano ' + this.state.partnersPlan[i].name}</Text>
														<View style={styles.planDescriptionView}>
															<Text style={styles.descriptionTitle}>{ 'Descrição: '}
																<Text style = {styles.planDescription}>{JSON.parse(this.state.partnersPlan[i].description)}</Text>
															</Text>
														</View>
														<View style={styles.discountView}>
															<Text style={{ fontWeight:'bold', flexWrap: 'wrap' }}>{ 'Valor de desconto nas compras: ' }</Text>
															<Text style={{ color: '#8f8f8f', flexWrap: 'wrap' }}>{this.state.partnersPlan[i].type === 0 ? this.state.partnersPlan[i].value + '%' : 'R$' + parseFloat(this.state.partnersPlan[i].value).toFixed(2)}</Text>
														</View>
														<Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{'O plano é válido por ' + this.state.partnersPlan[i].vigor + ' dias.'}</Text>
														<Text style={{fontWeight:'bold', marginBottom: 5}}>{'Preço: R$ ' + this.state.partnersPlan[i].price}</Text>
														{
															this.state.partnersPlan[i].members_number === parseInt(this.state.partnersPlan[i].userLimiter) &&
															<Text style={{ ...styles.planName, color: this.state.colors[0] }}>Número de membros esgotado</Text>
														}
														{
															this.props.navigation.getParam('current_plan').plan_id === this.state.partnersPlan[i].plan_id &&
															this.props.navigation.getParam('current_plan').active === 1 &&
															this.props.navigation.getParam('current_plan').due_date > this.state.today &&
															<Text style={{ ...styles.planName, color: this.state.colors[0] }}>Seu plano atual</Text>
														}
													</TouchableOpacity>
												</View>
											</View>
											)
										}
										{/*{*/}
										{/*	this.state.planId.length > 0 &&*/}
										{/*	<View style={{ ...styles.partnerButton, backgroundColor: this.state.colors[0], opacity: this.state.selectedPlan != null ? 1 : 0.5}}>*/}
										{/*		<TouchableOpacity style ={{ padding:10, width: theme.width * 0.9 }} onPress = {this.registerPartnerPlan.bind(this)} disabled={this.state.selectedPlan != null? false : true}>*/}
										{/*			<View style={styles.partnerButtonView}>*/}
										{/*				<Image*/}
										{/*					style = {{ ...styles.partnerButtonIcon, tintColor: this.state.colors[0] === 'white' ? 'black' : 'white'}}*/}
										{/*					source = {require('../../../../../assets/images/star-solid.png')}*/}
										{/*				/>*/}
										{/*				<Text style={{ ...styles.buttonPartnerText, color:  this.state.colors[0] === 'white' ? 'black' : 'white'}}>TORNE-SE SÓCIO</Text>*/}
										{/*			</View>*/}
										{/*		</TouchableOpacity>*/}
										{/*	</View>*/}
										{/*}*/}
									</View>
								</ScrollView>
							</View>
						</View>
							:
						<SkeletonPlaceholder>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
								<SkeletonPlaceholder.Item width={theme.width * 0.9} height={190} borderRadius={10} />
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
								<SkeletonPlaceholder.Item width={theme.width * 0.9} height={190} borderRadius={10} marginTop={6}/>
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={6}>
								<SkeletonPlaceholder.Item width={theme.width * 0.9} height={190} borderRadius={10} />
							</SkeletonPlaceholder.Item>
						</SkeletonPlaceholder>
						}
						<FlashMessage position="top" ref={'plansMessage'} style={{ zIndex: 99 }} duration={2500}/>
					</View>
	            }
				{
					this.state.showLoading &&
					<View style = {{marginTop: theme.height * 0.1}}>
						<ActivityIndicator size="large" color={this.state.colors[0]} />
						<View style={{flexDirection: 'row', width: theme.width * 0.7, wordWrap: 'wrap' , flexWrap: 'wrap', justifyContent: 'center',marginTop:theme.height * 0.05 }}>
							<Text style={{fontStyle: 'italic', fontWeight: 'bold', fontSize: 25, color: '#8f8f8f'}}>
								Você está quaaaaaaase
							</Text>
							<Text style={{fontWeight: 'bold', fontSize: 25, textAlign: 'center', marginTop: theme.height * 0.05, lineHeight: 50, color: this.state.colors[0] }}>
								virando sócio!  ;)
							</Text>
						</View>
					</View>
				}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: theme.height,
        width:theme.width,
        alignItems: 'center',
        alignContent: 'center',
        position: 'absolute',
        backgroundColor: 'white',
        zIndex: 99999
	},
	header: {
		/* paddingLeft: theme.width*0.06, */
		marginTop: 0,
		flexDirection: 'column'
	},
	headerText: {
		fontSize: 20,
		fontWeight: 'bold',
		paddingTop: theme.width*0.05,
		marginRight: 5
	},
	imageView: {
		width: theme.width * 0.5,
		height: theme.height * 0.1,
		marginBottom: theme.height * 0.03,
		marginLeft: 5
	},
	secondImageView: {
		width: theme.width * 0.35,
		height: theme.height * 0.1,
		marginBottom: theme.height * 0.03,
		marginLeft: -20
	},
	logoImage: {
		resizeMode: 'contain',
		flex: 1,
		width: null,
		height: null
	},
    partnersPlanView: {
		borderRadius: 10,
		marginBottom: 10,
		marginRight: 5,
		alignSelf: 'center',
		backgroundColor: 'white'
    },
    selectedPlan: {
		backgroundColor: 'white',
		padding:15,
		borderRadius: 10,
		elevation: 2,
		width: theme.width * 0.9,
    },
    planName: {
		fontWeight: 'bold',
		fontSize: 17,
		marginBottom: 10,
    },
    planDescriptionView: {
		flexDirection: 'row',
        width: theme.width * 0.82,
    },
    descriptionTitle: {
		fontWeight:'bold',
		flexWrap: 'wrap'
    },
    planDescription: {
		flexWrap: 'wrap',
		fontWeight:'400',
        color: '#8f8f8f',
        lineHeight: 20,
	},
	discountView: {
		flexDirection: 'row',
		width: theme.width * 0.55,
		marginTop: 5,
		marginBottom: 5
	},
    modalView: {
		marginTop: theme.height * 0.01,
		paddingBottom: 80,
    },
    scrollView: {
        height: theme.height * 0.35,
        width: theme.width,
		marginTop: 0,
    },
    partnerButton: {
		elevation: 2,
		width: theme.width * 0.9,
		alignSelf: 'center',
		borderRadius: 15,
		flexDirection:'row',
		justifyContent: 'center',
		alignContent :'center',
        alignItems:'center',
		marginTop: 20,
    },
    partnerButtonView: {
		flexDirection : 'row',
		alignSelf: 'center',
		width: theme.width * 0.47,
		height: theme.height * 0.03,
		alignContent: 'center',
		justifyContent:'flex-start'
    },
    partnerButtonIcon: {
		width: 22,
		height: 20,
		alignSelf: 'center',
    },
    buttonPartnerText: {
		fontWeight: 'bold',
		fontSize: 15,
		letterSpacing: 1,
		alignSelf: 'center',
		marginLeft: 10,
	},
	timesView: {
		width: theme.width,
		paddingTop: 10,
		paddingRight: 10
	},
	iconView: {
		width: 25,
		height: 30,
		alignSelf: 'flex-end'
	},
	subtitleView: {
		width: theme.width *0.9,
		alignSelf: 'center',
		marginBottom: 20,
		marginLeft: 10
	},
	subtitleText: {
		fontWeight: 'bold',
		marginTop: 10,
		fontSize: 15
	}
})
