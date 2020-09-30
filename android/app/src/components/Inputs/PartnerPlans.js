import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	Image,
	ActivityIndicator,
	TouchableOpacity,
	ScrollView,
	StatusBar,
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
import RNFetchBlob from 'rn-fetch-blob';
let verify = null;

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
			showRulesModal: false,
			modalPlan: null,
			planRules: null,
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


		let payment_due_date = await heimdallr.getServerTime();
		payment_due_date = moment(payment_due_date).add(20, 'm').format();
		let selectedPlan = this.state.planId[this.state.selectedPlan];

		const params = {};

		params.store = this.state.store;
		params.planId = selectedPlan;
		params.referenceId = await heimdallr.getUID();
		params.userId = heimdallr.user_id;
		params.userPrice = (parseFloat(this.state.partnersPlan[selectedPlan].price.replace(',','.')) * 1.16).toFixed(2);


		heimdallr.verifyMembersNumber(this.state.store, params.planId).then(
			(resolve) => {
				if(resolve){
					axios({
						method: 'post',
						url: 'https://appws.picpay.com/ecommerce/public/payments',
						headers: {'x-picpay-token': '3782eb80-9b55-4611-a81a-111555fc39ec'},
						data: {
							"referenceId": params.referenceId,
							"callbackUrl": "http://3.23.33.91/plan-status",
							"value": params.userPrice,
							"expiresAt": payment_due_date,
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
								params.url = result.data.paymentUrl;
								RNFetchBlob.config({
									trusty: true
								}).fetch('POST',
									'https://3.23.33.91/allocate-plan',
									{ 'Content-Type': 'application/json'},
									JSON.stringify({
										...params
									})
								);
								this.setState({showLoading: false});
								Linking.openURL(result.data.paymentUrl);
								this.props.navigation.goBack();

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

	opeRulesModal = (partnerPlan) => {
		this.setState({ showRulesModal: true, modalPlan: partnerPlan.name, planRules: partnerPlan.rules});
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
														<Text style={{fontWeight:'bold', marginBottom: 5}}>{'Preço: R$ ' + (parseFloat(this.state.partnersPlan[i].price.replace(',','.')) * 1.16).toFixed(2).toString().replace('.',',')}</Text>
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
														<TouchableOpacity onPress={this.opeRulesModal.bind(this,this.state.partnersPlan[i])}>
															<View style={styles.planRulesView}>
																<Text style={{ ...styles.rulesTitle, color: '#8f8f8f' }}>{ 'Ao assinar o plano você concorda com os '}
																	<Text style={{fontWeight: 'bold', color: this.state.colors[0], textDecorationLine: 'underline'}}>{'termos'}</Text>
																</Text>
															</View>
														</TouchableOpacity>
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
				<Modal
		            hardwareAccelerated={true}
		            animationType='fade'
		            transparent={true}
		            visible={this.state.showRulesModal}
		            onRequestClose={() => { this.setState({showRulesModal: false})}}
		            style = {{ height: 50, width: theme.width * 0.5 }}
	            >
		            <View style = {styles.centeredView}>
			            <View style = {{ ...styles.modalContainer, height: theme.height * 0.7 }}>
							<View style = {{ ...styles.modalHeader , backgroundColor: this.state.colors[0] }}>
								<TouchableOpacity onPress={() => this.setState({showRulesModal: false})}>
									<View style = {{ width: theme.width * 0.15, height: theme.height*0.05, alignSelf: 'flex-end' }}>
										<Image
											style = {{ width: 15, height: 15, opacity: 0.4, alignSelf: 'flex-end', tintColor: this.state.colors[0] ? heimdallr.getTxtColor(this.state.colors[0]) : 'black' }}
											source = {require('../../../../../assets/images/times-solid.png')}
										/>
									</View>
								</TouchableOpacity>
								<Text  ellipsizeMode='tail' numberOfLines={1} style = {{ marginTop: -(theme.height *  0.025), fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5, alignSelf: 'center', color: this.state.colors[0] ? heimdallr.getTxtColor(this.state.colors[0]) : 'white' }}>{'Plano ' + this.state.modalPlan}</Text>
							</View>
							<View style = {{ height: theme.height * 0.55, marginTop: theme.height * 0.1 }}>
								<ScrollView style = {{ height: theme.height * 0.55, marginTop: 0 }} showsVerticalScrollIndicator = {false}>
									<View style={{ marginBottom: 10 }}>
										<Text style={{ fontWeight: 'bold', color: this.state.colors[0], fontSize: 15 }}>Regras e termos do plano</Text>
									</View>
									<View>
										<Text style={{color: '#8f8f8f',lineHeight: 20, textAlign: 'justify'}}>{JSON.parse(this.state.planRules)}</Text>
									</View>
								</ScrollView>
							</View>
						</View>
					</View>
				</Modal>
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
	planRulesView: {
		flexDirection: 'row',
		width: theme.width * 0.82,
		zIndex: 100,
		paddingTop: 5,
		paddingBottom: 5,
    },
    descriptionTitle: {
		fontWeight:'bold',
		flexWrap: 'wrap'
	},
	rulesTitle: {
		flexWrap: 'wrap',
		fontSize: 11,
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
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: -(theme.height * 0.1),
		paddingTop:theme.height * 0.1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContainer: {
		width: theme.width * 0.9,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 25,
		paddingBottom:20,
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		zIndex:0,
	},
	modalHeader : {
		flexDirection: 'column',
		width: theme.width * 0.9,
		borderTopLeftRadius:20,
		borderTopRightRadius:20,
		padding:20,
		position:'absolute',
		marginLeft:0.001,
		height: theme.height * 0.11
	},
})
