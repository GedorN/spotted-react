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

import ImNotTheOnlyChip from "./layout/ImNotTheOnlyChip";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../components/General/Theme";
import SevenBannerArmy from "./layout/SevenBannerArmy";
import LikeAPrayerductViewer from "./layout/LikeAPrayerductViewer";
import {Button} from 'react-native-paper';
import axios from 'react-native-axios';
import moment from "moment";
import 'moment/locale/pt-br';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";

let scrolling = false;
let interval = 5000;
export default class Store extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			categories: [],
			filteredCategories: [],
			colors: [],
			products: [],
			filteredProducts: [],
			logo: null,
			banner: null,
			isRefreshing: false,
			storeCode: null,
			partnersPlan: [],
			planId: [],
			showPartnerModal: false,
			selectedPlan: null,
			validPlan: false,
			discount: null,
			discountType: null,
			dueDatePlan: null,
			plan: null,
			showLoading:false
		}
	}

	onRefresh = () => {
		this.setState({ isRefreshing: true });
		heimdallr.getStoreProducts(this.props.navigation.getParam('store')).then(
			(resolve) => {
				if (resolve.docs.length > 0) {
					let mappedDocs =  resolve.docs.map((d) => d._data);
					mappedDocs = mappedDocs.filter((i) => i.stock > 0);
					this.setState({ products: mappedDocs, filteredProducts: mappedDocs, isRefreshing: false });
				}
			}
		)

	}

	componentDidMount(): void {
		BackHandler.addEventListener('hardwareBackPress', () => {
			StatusBar.setBackgroundColor('white');
			StatusBar.setBarStyle('dark-content');
		});

		heimdallr.getPartnersPlan(this.props.navigation.getParam('store'))
		.then((resolve) => {
			this.setState({ planId: Object.keys(resolve), partnersPlan: resolve }) 
	 	}); 

		this.verifyPlan().then((result) => {
			heimdallr.getStoreProducts(this.props.navigation.getParam('store')).then(
				(resolve) => {
					if (resolve.docs.length > 0) {
						let mappedDocs =  resolve.docs.map((d) => d._data);
						mappedDocs = mappedDocs.filter((i) => i.stock > 0);
						this.setState({ products: mappedDocs, filteredProducts: mappedDocs });
					}
					result();
				}
			)
		});


		heimdallr.getStoreInfo(this.props.navigation.getParam('store')).then(
			(resolve) => {
				StatusBar.setBackgroundColor(resolve.colors[0]);
				StatusBar.setBarStyle('light-content');
				this.setState({
					categories: resolve.categories,
					colors: resolve.colors,
					logo : resolve.logo,
					banner: resolve.banner,
				});
			}

		);

	}

	verifyPlan = async () => {

		let today = await heimdallr.getServerTime(); 

		return new Promise((result) => {
			let userPlans = null;
			let store_code =this.props.navigation.getParam('store');
			if(heimdallr.userPlans != null && heimdallr.userPlans[store_code]){
				userPlans = heimdallr.userPlans[store_code];
				if(today < userPlans[0].due_date){	
					this.setState({ 
						validPlan: true, 
						discount: userPlans[0].value, 
						discountType: userPlans[0].type, 
						plan: userPlans[0].name, 
						dueDatePlan: moment(userPlans[0].due_date).format('DD/MM/YYYY'), 
					});
				}
			}
			result();	
		})
	
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress');
	}

	registerPartnerPlan = async () => {

		this.setState({showLoading: true});

		let price = null;
		let timeNow = null;
		let user = {};
		let selectedPlan = this.state.planId[this.state.selectedPlan];
		let store_code = this.props.navigation.getParam('store');
		let userParams = Object.assign({},this.state.partnersPlan[selectedPlan]);
		let collectionParams = Object.assign({}, this.state.partnersPlan[selectedPlan]);

		userParams.referenceId = await heimdallr.getUID();
		userParams.signature_date = await heimdallr.getServerTime();
		userParams.due_date =  moment(userParams.signature_date).add(userParams.vigor,'d').valueOf();
		userParams.members = null;

		user.user_name = heimdallr.user_name;
		user.email = heimdallr.email;
		user.image = heimdallr.user_image;
		user.phone = heimdallr.phone;
		user.referenceId = 	userParams.referenceId;

		if(collectionParams.members &&collectionParams.members.length > 0){
			collectionParams.members.push(user);
		}
		else{
			let newUsers = [];
			newUsers.push(user);
			collectionParams.members = newUsers;
		}

		collectionParams.members_number = (collectionParams.members_number - 1);

		timeNow = moment(userParams.signature_date).add(4,'m').format();
		price = parseFloat(userParams.price.replace(',','.'));


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
			(resolve) => {

				userParams.url = resolve.data.paymentUrl;
				Linking.openURL(resolve.data.paymentUrl);
				
				paymentFunction = () => {
					axios({
						method: 'get',
						url: 'https://appws.picpay.com/ecommerce/public/payments/'+`${userParams.referenceId}`+'/status',
						headers: {'x-picpay-token': '3782eb80-9b55-4611-a81a-111555fc39ec'}
					}).then(
						(resolve) => {
							this.setState({ showPartnerModal : false, showLoading: false });
							if(resolve.data.status === 'paid'){

								clearFunction();

								showMessage({
									message: "Compra realizada com sucesso",
									type: "success",
									icon: 'success'
								});

								heimdallr.updatePartnerPlan(store_code,selectedPlan,collectionParams);
								heimdallr.savePartnerPlan(store_code,userParams)
								.then((result) => {
									this.props.navigation.push('Store', { store: store_code });
								}); 
								
							}
						},
						(reject) => {
							this.setState({ showPartnerModal : false, showLoading: false });
						})
				}

				let verify = setInterval(paymentFunction,interval); 

				clearFunction = () => {
					clearTimeout(verify);
				}

				setTimeout(clearFunction,240000);
			},
			(reject) => {

 				showMessage({
					message: "Erro ao realizar a compra",
					type: "danger",
					icon: 'danger'
				});
			})        
	}


	chipPressed = (chip) => {
		heimdallr.sendEvent(`${this.props.navigation.getParam('store')}_category`)
		let filteredCategories = this.state.filteredCategories;
		let filteredProducts = [];
		if (filteredCategories.find((fc) => fc === chip)) {
			filteredCategories.splice(filteredCategories.indexOf(chip), 1);
		} else {
			filteredCategories.push(chip);
		}

		if (filteredCategories.length > 0) {
			for(let i = 0; i < filteredCategories.length; i++) {
				let prod = this.state.products.filter((p) => p.category === filteredCategories[i]);
				filteredProducts = filteredProducts.concat(prod);
			}
		} else {
			filteredProducts = this.state.products;
		}
		this.setState({ filteredProducts: filteredProducts, filteredCategories: filteredCategories });

	}

	clearStatusBar = () => {
		StatusBar.setBackgroundColor('white');
		StatusBar.setBarStyle('dark-content');
	}

	partnerModal = () => {
		this.setState({ showPartnerModal: true})
			/* this.setState({ partnersPlan: resolve, showPartnerModal: true}); */
	}

	getTxtColor = (color) => {
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

	render() {
		return (
			<ScrollView style={styles.container} showsVerticalScrollIndicator = {false}>
				<View style = {{width:theme.width*0.98,alignSelf:'center'}}>
					<View style={{flexDirection: 'row', marginTop: 7, marginBottom: 5,  paddingLeft: 10, position: 'absolute', zIndex: 999}}>
						<TouchableOpacity onPress={() => {this.clearStatusBar(); this.props.navigation.goBack()}}>
							<Image
								style={{width: 30, height: 30, marginTop:4, opacity: 0.6}}
								source={require('../../../../assets/images/chevron-circle-left-solid-white.png')}
							/>
						</TouchableOpacity>
					</View>
					<SevenBannerArmy url={this.state.banner}/>
					{
						this.state.validPlan &&
						<View style={styles.messageView}>
							<Text style={{fontSize:12, color:'#8f8f8f', alignSelf:'center'}}>{'Seu plano ' + this.state.plan + ' é válido até ' + this.state.dueDatePlan}</Text>
						</View>
					}
					{
						this.state.planId.length > 0 &&
						<View style={{ ...styles.partnerButton, backgroundColor: this.state.colors[0]}}>
							<TouchableOpacity style ={{ padding:10, width: theme.width * 0.9 }} onPress = {()=> this.setState({ showPartnerModal : true})}>
								<View style={styles.partnerButtonView}>
									<Image
										style = {{ ...styles.partnerButtonIcon, tintColor: this.state.colors[0] === 'white' ? 'black' : 'white'}}
										source = {require('../../../../assets/images/star-solid.png')}
									/>
									<Text style={{ ...styles.buttonPartnerText, color:  this.state.colors[0] === 'white' ? 'black' : 'white'}}>TORNE-SE SÓCIO</Text>
								</View>
							</TouchableOpacity>
						</View>
					}
					<View style={{flexDirection: 'row', width: theme.width * 0.95, flexWrap: 'wrap',marginTop:10, paddingLeft:theme.width*0.04}}>
						{
							this.state.categories.map(i =>
								<View style={{margin: 5}} key={i.name}>
									<ImNotTheOnlyChip
										selected={this.state.filteredCategories}
										text={i.name}
										id={i.key}
										colors={this.state.colors ? this.state.colors : null}
										cbFunction={this.chipPressed.bind(this)}
									/>
								</View>
							)
						}
					</View>
					<View style = {{paddingLeft:theme.width*0.06,marginTop:30,flexDirection:'row'}}>
						<Text style = {{fontSize:23,fontWeight:'bold',paddingTop:theme.width*0.05}}>{'Produtos '}</Text>
						<View style = {{width:theme.width * 0.4, height : theme.height * 0.1, marginBottom:theme.height * 0.03, marginLeft: 5}}>
							<View style = {{width:theme.width * 0.35, height : theme.height * 0.1, marginBottom:theme.height * 0.03, marginLeft: -20}}>
								<Image
									source = {{ uri: this.state.logo }}
									style = {{resizeMode: 'contain', flex:1, width:null, height:null}}>
								</Image>
							</View>
						</View>
					</View>
				</View>
				<FlatList
					numColumns={2}
					showsVerticalScrollIndicator={false}
					onScrollEndDrag={() => {scrolling = false}}
					onScrollBeginDrag={() => {scrolling = false}}
					keyExtractor={item => item.name}
					data={this.state.filteredProducts}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							onRefresh={this.onRefresh.bind(this)}
						/>
					}
					renderItem={({item}) =>
					<View style = {{width:theme.width*0.49,marginBottom:theme.width*0.07}}>
						<LikeAPrayerductViewer
							scrolling={scrolling}
							product={item}
							validPlan={this.state.validPlan}
							discountType={this.state.discountType}
							discount={this.state.discount}
							colors={this.state.colors ? this.state.colors : null}
							navigation={this.props.navigation}
						/>
					</View>
					}
				/>
				<Modal
		            hardwareAccelerated={true}
		            animationType='fade'
		            transparent={true}
		            visible={this.state.showPartnerModal}
		            onRequestClose={() => { this.setState({showPartnerModal: false}) }}
		            style = {{ height: 50, width: theme.width * 0.5 }}
	            >
					<View style = {styles.centeredView}>
						<View style = {{ ...styles.modalContainer, height: this.state.planId.length > 1 ?  theme.height * 0.7 : theme.height * 0.55}}>
							<View style = {{ ...styles.modalHeader , backgroundColor: this.state.colors? this.state.colors[0]: null}}>
								<TouchableOpacity onPress={() => {this.setState({showPartnerModal: false})}}>
									<View style = {styles.iconView}>
										<Image
											style = {{ ...styles.timesSolid, tintColor: heimdallr.getTxtColor(this.state.colors[0] ? this.state.colors[0]: 'black') }}
											source = {require('../../../../assets/images/times-solid.png')}
										/>
									</View>
								</TouchableOpacity>
								<Text style = {{ ...styles.modalText, color: (this.state.product ? this.state.product.colors[1] : null) }}>{'Opções de plano'}</Text>
							</View>
							{
								!this.state.showLoading &&
								<View>
									<View style = {{ ...styles.modalView, height:  this.state.planId.length > 1 ? theme.height * 0.64 : theme.height * 0.5 }}>
										<ScrollView style = {styles.scrollView} showsVerticalScrollIndicator = {false}>
											<View>
												<View style={{marginBottom: 20, marginLeft: 10}}>
													<Text style={{color: '#8f8f8f', fontWeight: 'bold', marginTop: 10}}>Selecione o plano</Text> 
												</View>
												{
													this.state.planId.map(i =>
													<View  key = {i} style={styles.partnersPlanView}>
														<View style={{...styles.selectedPlan, borderColor: (this.state.selectedPlan === this.state.planId.indexOf(i) ? this.state.colors[0]: null), borderWidth: (this.state.selectedPlan === this.state.planId.indexOf(i) ? 3 : 0) }}>
															<TouchableOpacity onPress={() => this.setState({selectedPlan: this.state.planId.indexOf(i)})}>
																<Text style={{ ...styles.planName, color: this.state.colors[0] }}>{ 'Plano: ' + this.state.partnersPlan[i].name}</Text>
																<View style={styles.planDescriptionView}>
																	<Text style={styles.descriptionTitle}>{ 'Descrição: '}
																		<Text style = {styles.planDescription}>{JSON.parse(this.state.partnersPlan[i].description) + '.'}</Text>
																	</Text>
																</View>
																<View style={{ flexDirection: 'row', width: theme.width * 0.55 }}>
																	<Text style={{ fontWeight:'bold', flexWrap: 'wrap' }}>{ 'Valor de desconto nas compras: ' }</Text>
																	<Text style={{ color: '#8f8f8f', flexWrap: 'wrap' }}>{this.state.partnersPlan[i].type === 0 ? this.state.partnersPlan[i].value + '%' : 'R$' + parseFloat(this.state.partnersPlan[i].value).toFixed(2)}</Text>
																</View>
																<Text style={{ fontWeight: 'bold' }}>{'O plano é válido por ' + this.state.partnersPlan[i].vigor + ' dias.'}</Text>
																<Text style={{fontWeight:'bold'}}>{'Preço: R$ ' + this.state.partnersPlan[i].price}</Text>
															</TouchableOpacity>
														</View>
													</View>
													)
												}
												<View style = {styles.modalButtons}>
													<TouchableOpacity activeOpacity={1} onPress = { () => this.setState({ showPartnerModal: false }) }>
														<View style = { styles.cancelButton }>
															<Text style ={{ color: 'white', fontWeight: 'bold', letterSpacing: 0.5 }}>{ 'Cancelar' }</Text>
														</View>
													</TouchableOpacity>
													<TouchableOpacity activeOpacity={1} onPress = { this.registerPartnerPlan.bind(this) }>
														<View style = {{ ...styles.confirmButton, backgroundColor: this.state.colors[0]}}>
															<Text style = {{ fontWeight: 'bold', letterSpacing: 0.5, color: this.state.colors[1] }}>{ 'Confirmar' }</Text>
														</View>
													</TouchableOpacity>
												</View>
											</View>
										</ScrollView>
									</View>
								</View>
							}
							{
								this.state.showLoading &&
								<View style = {{marginTop: theme.height * 0.1}}>
									<ActivityIndicator size="large" color={this.state.product? this.state.product.colors[0] : theme.primary} />
									<View style={{flexDirection: 'row', width: theme.width * 0.7, wordWrap: 'wrap' , flexWrap: 'wrap', justifyContent: 'center',marginTop:theme.height * 0.05 }}>
										<Text style={{fontStyle: 'italic', fontWeight: 'bold', fontSize: 25, color: '#8f8f8f'}}>
											HOOOOOOLD!
										</Text>
										<Text style={{fontWeight: 'bold', fontSize: 25, textAlign: 'center', marginTop: theme.height * 0.05, lineHeight: 50 }}>
											Estamos registrando o seu plano ;)
										</Text>
									</View>
								</View>
							}
						</View>
					</View>
				</Modal>
				<FlashMessage ref={'buyMessage'} style={{ zIndex: 99 }} duration={2500}/>
			</ScrollView>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		alignSelf:'center',
		backgroundColor: 'white',
		width:theme.width * 0.98
	},
	fab: {
		position: 'absolute',
		marginTop: theme.height * 0.75,
		marginLeft: theme.width * 0.80,
		padding: 5,
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
		marginLeft:0.001
	},
	iconView: {
		width: theme.width * 0.15, 
		height: theme.height*0.05, 
		alignSelf: 'flex-end' 
	},
	modalText: {
		marginTop: -(theme.height *  0.025), 
		fontSize: 20, 
		fontWeight: 'bold', 
		letterSpacing: 0.5, 
		alignSelf: 'center' 
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom:theme.height * 0.04,
		marginTop: theme.height * 0.05
	},
	cancelButton: {
		paddingTop: 14,
		paddingBottom: 14,
		width:theme.width * 0.32,
		elevation: 2,
		backgroundColor: '#cccccc',
		borderRadius: 14,
		marginRight: theme.width * 0.02,
	    flexDirection:'row',
		justifyContent: 'center',
	},
	confirmButton: {
		paddingTop: 14,
		paddingBottom: 14,
		width:theme.width * 0.32,
		elevation: 2,
		borderRadius: 14,
		flexDirection: 'row',
		justifyContent: 'center'
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
	},
	messageView: {
		width:theme.width * 0.8, 
		alignSelf: 'center', 
		marginBottom: 10
	},
	modalView: { 
		marginTop: theme.height * 0.08, 
		paddingBottom: 50
	},
	timesSolid: {
		width: 15, 
		height: 15, 
		opacity: 0.4, 
		alignSelf: 'flex-end',
	},
	partnerButtonIcon: {
		width: 22, 
		height: 20, 
		alignSelf: 'center',
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
		width: theme.width * 0.75,
	},
	planDescriptionView: {
		flexDirection: 'row', 
		width: theme.width * 0.65
	},
	planDescription: {
		flexWrap: 'wrap', 
		fontWeight:'400',
		color: '#8f8f8f'
	},
	scrollView: {
		height: theme.height * 0.35, 
		marginTop: 0 
	},
	descriptionTitle: {
		fontWeight:'bold', 
		flexWrap: 'wrap'
	},
	planName: {
		fontWeight: 'bold', 
		fontSize: 17, 
		marginBottom: 10,
	},
	buttonPartnerText: {
		fontWeight: 'bold', 
		fontSize: 15, 
		letterSpacing: 1, 
		alignSelf: 'center', 
		marginLeft: 10, 
	},
	partnerButtonView: {
		flexDirection : 'row', 
		alignSelf: 'center',
		width: theme.width * 0.47, 
		height: theme.height * 0.03, 
		alignContent: 'center', 
		justifyContent:'flex-start'
	}
});
