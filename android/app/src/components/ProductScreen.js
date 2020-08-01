import React from 'react';

import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
	RefreshControl,
	Modal,
	TextInput,
	KeyboardAvoidingView,
	Linking,
	ScrollView
} from 'react-native';

import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../components/General/Theme";
import FatBottomedButton from'./buttons/FatBottomedButton';
import CustomizationTextArea from './CustomizationTexArea';
import AwesomeAlert from "react-native-awesome-alerts";
import CustomSelect from "./custom/CustomSelect";
import CustomRadio from "./custom/CustomRadio";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import axios from 'react-native-axios';
import CarouselModaFoka from "./layout/CarouselModaFoka";
import moment from "moment";
import {Button} from 'react-native-paper';

let interval = 5000;
export default class ProductScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			iidProduct: '',
			product : null,
			activeIndex: 0,
			productImages: [],
			customizationItems : [],
			customizationDetails: [],
			price_without_tax : null,
			description : '',
			showAlert : false,
			picPay : true,
			directlyToStore: false,
			PicPayPrice : '',
			payment: false,
			errorMissingValues: false,
			showLoading: false,
			isRefreshing: false,
			showConfirmButton: true,
			showCancelButton : true,
			initialLoad: true,
			newCoupon: null,
			placeholderCoupon : 'Código promocional',
			discountApplied : false,
			warning : null,
			texInputCode : '',
			storeCoupons : null,
			userCouponsRegister : null,
			couponApply : false,
			ticketStore : null,
			storePrice : null,
			spottedPrice : null,
			settingPromotionalCode: false,
			discountPicPayPrice: null,
			discountPriceWithoutTax: null,
			showPartnerModal: false,
			partnersPlan: null,
			selectedPlan: null,
			planId: null,
		}
	}

	componentDidMount(): void {

		this.state.iidProduct =  this.props.navigation.getParam('iid');

		
		heimdallr.getProduct(this.state.iidProduct).then(
			(resolve) => {
				heimdallr.sendEvent(`${resolve.sid}_product_click`)
				const original_price = resolve.price;
				resolve.price = (parseFloat(resolve.price) * 1.16).toFixed(2);
				this.setState({product: resolve, productImages: resolve.images,
				price_without_tax: original_price,storePrice : original_price, spottedPrice : resolve.price, initialLoad: false});
				heimdallr.getPartnersPlan(this.state.product.sid)
				.then((result) => {
					this.setState({ planId: Object.keys(result), partnersPlan: result });
					this.planDiscount(); 
				}); 

			},
			() => {
				this.setState({initialLoad: false})
			}
		)
	}

	planDiscount = async () =>{

		let today = await heimdallr.getServerTime(); 
		let userPlans = null;

		if(heimdallr.userPlans != null && heimdallr.userPlans[this.state.product.sid]){

			userPlans =  heimdallr.userPlans[this.state.product.sid];

			if(today < userPlans[0].due_date){

				if( userPlans[0].type === 0){

					let newPrice = this.state.storePrice - (this.state.storePrice * ((userPlans[0].value)/100));
					this.setState({ PicPayPrice: (newPrice * 1.16).toFixed(2) });

				}else{

					let newPrice = this.state.storePrice - userPlans[0].value;
					newPrice <= 0 ? newPrice = 0 : newPrice
					this.setState({ PicPayPrice: (newPrice * 1.16).toFixed(2) });
				}
			}

		}
		else{
			this.setState({ PicPayPrice : this.state.spottedPrice});
		}
	}

	renderPage({item}) {
		return (
            <View style = {{ height:theme.height * 0.40,width:theme.width * 0.8,alignSelf:'center',marginBottom:theme.height * 0.03}}>
	            <Image style={{flex: 1, resizeMode: 'contain', width: theme.width * 0.75, height:theme.height * 0.45, alignSelf:'center'}} source={{ uri: item }} />
            </View>
        );
	}
	openAlert = () =>{
		this.setState({showAlert : true,warning:null});
	}

	ticketsRegister = async () => {
		if (this.state.showLoading) {
			return ;
		}
		/* if (this.state.directlyToStore ){
			this.setState({showLoading: true, showConfirmButton: false, showCancelButton: false});

			let params = {};
			params.colors = this.state.product.colors;
			params.date = await heimdallr.getServerTime();
			params.iid = this.state.iidProduct;
			params.image = this.state.productImages[0];
			params.product_name = this.state.product.name;
			params.status = 'Pendente';
			params.store_name = this.state.product.sid;
			params.store_logo = this.state.product.logo;
			params.uid = heimdallr.user_id;
			params.description = this.state.product.customization;
			params.payment = this.state.product.sid;
			params.product_price = this.state.product.price;
			params.referenceId = await heimdallr.getUID();
			params.buyer_email = heimdallr.email;
			params.buyer_phone= heimdallr.phone;
			params.buyer_name = heimdallr.user_name;

			heimdallr.saveTicketsRegister(params);

			this.setState({showAlert : false, showLoading: true});
			showMessage({
				message: "Compra realizada com sucesso",
				type: "success",
				icon: 'success'
			});
		}  */
			this.setState({showLoading: true, showConfirmButton: false, showCancelButton: false});

			let params = {};
			params.colors = this.state.product.colors;
			params.date = await heimdallr.getServerTime();
			params.iid = this.state.iidProduct;
			params.image = this.state.productImages[0];
			params.category = this.state.product.category;
			params.category_name = this.state.product.category_name;
			params.product_name = this.state.product.name;
			params.status = 'Pendente';
			params.store_name = this.state.product.sid;
			params.store_logo = this.state.product.logo;
			params.uid = heimdallr.user_id;
			params.url = 'PicPay';
			params.description = this.state.product.customization;
			params.payment = 'PicPay';
			params.product_price = this.state.discountApplied ? this.state.discountPicPayPrice : this.state.PicPayPrice;
			params.no_tax_value = this.state.discountApplied ? this.state.discountPriceWithoutTax : this.state.price_without_tax;
			params.buyer_name = heimdallr.user_name;
			params.buyer_phone = heimdallr.phone;
			params.buyer_email = heimdallr.email;
			params.referenceId = await heimdallr.getUID();

			if (params.product_price == 0) {
				params.status = 'Pago';
				params.url = '';
				heimdallr.saveTicketsRegister(params);
				if(this.state.discountApplied){
					heimdallr.StoreCoupons(this.state.storeCoupons, this.state.ticketStore);
					heimdallr.saveUserCoupon(this.state.userCouponsRegister);
					this.setState({discountPicPayPrice : null, discountPriceWithoutTax : null});
				}
				this.setState({showAlert : false, showLoading: false, showConfirmButton: true, showCancelButton: true,  warning: null, discountApplied: false});
				showMessage({
					message: "Compra realizada com sucesso",
					type: "success",
					icon: 'success'
				});
			} else {
				axios({
					method: 'post',
					url: 'https://appws.picpay.com/ecommerce/public/payments',
					headers: {'x-picpay-token': '3782eb80-9b55-4611-a81a-111555fc39ec'},
					data: {
						"referenceId": params.referenceId,
						"callbackUrl": "http://www.spottedutfpr.com.br/callback",
						"value": params.product_price,
						"expiresAt": "2022-05-01T16:00:00-03:00",
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

						params.url = resolve.data.paymentUrl;
						heimdallr.saveTicketsRegister(params);
						Linking.openURL(resolve.data.paymentUrl);
						if(this.state.discountApplied){
							heimdallr.StoreCoupons(this.state.storeCoupons, this.state.ticketStore);
							heimdallr.saveUserCoupon(this.state.userCouponsRegister);
							this.setState({discountPicPayPrice : null, discountPriceWithoutTax : null});
						}
						this.setState({showAlert : false, showLoading: false, showConfirmButton: true, showCancelButton: true,  warning: null, discountApplied: false});
						showMessage({
							message: "Compra realizada com sucesso",
							type: "success",
							icon: 'success'
						});
					},
					(reject) => {
						this.setState({showAlert : false, showLoading: false, showConfirmButton: true, showCancelButton: true});
						showMessage({
							message: "Erro ao realizar a compra",
							type: "danger",
							icon: 'danger'
						});
					}
				);
			}





	}

	discountedTickets = async () => {

		let coupon = null;
		let userCoupons = null;
		let coupons = null;



		heimdallr.getCoupons('spotted').then((res) => {
			if (res && res.find((item) => (item.hash === this.state.newCoupon.hash))) {
				coupons = res;
				coupon =  coupons.find((item) => (item.hash === this.state.newCoupon.hash));
				if(coupon && coupon.quantity === 0){
					this.setState({discountApplied: false, warning:'Cupom esgotado',discountPicPayPrice: this.state.PicPayPrice});

				} else if(coupon.active === false){
					this.setState({discountApplied: false, warning:'Cupom fora da validade',discountPicPayPrice: this.state.PicPayPrice});

				} else {
					heimdallr.getUserCoupons().then((resolve) => {
						userCoupons = resolve;
						if (!userCoupons || (userCoupons && !userCoupons.find((item) => coupon.id === item.id))) {
							if (!userCoupons) {
								userCoupons = [];
							}
							userCoupons.push(this.state.newCoupon);
							let index = coupons.indexOf(coupon);
							coupons[index].quantity  = coupons[index].quantity - 1;
							this.setState({userCouponsRegister : userCoupons, storeCoupons : coupons, discountApplied : true,ticketStore:'spotted'});
							this.ticketsRegister();
							heimdallr.sendEvent(`spotted_ticket_apply`)
						} else {
							this.setState({discountApplied: false, warning:'Cupom já utilizado', discountPicPayPrice : this.state.PicPayPrice});
							return ;
						}
					});

				}
			} else {
				heimdallr.getCoupons( this.state.product.sid).then((res) => {
					if (!res) {
						this.setState({discountApplied: false, warning:'Código inválido'});

					}
					else if (res && res.find((item) => (item.hash === this.state.newCoupon.hash))) {
						coupons = res;
						coupon =  coupons.find((item) => (item.hash === this.state.newCoupon.hash));
						if (coupon.quantity === 0) {
							this.setState({discountApplied: false, warning:'Cupom esgotado',discountPicPayPrice : null});

						}  else if(coupon.active === false) {
							this.setState({discountApplied: false, warning:'Cupom fora da validade',discountPicPayPrice : null});

						} else {
							heimdallr.getUserCoupons().then((resolve) => {
								userCoupons = resolve;
								if (!userCoupons || (userCoupons && !userCoupons.find((item) => coupon.id === item.id))) {
									if (!userCoupons) {
										userCoupons = [];
									}
									userCoupons.push(this.state.newCoupon);
									let index = coupons.indexOf(coupon);
									coupons[index].quantity  = coupons[index].quantity - 1;
									this.setState({userCouponsRegister : userCoupons, storeCoupons : coupons, discountApplied : true, ticketStore:this.state.product.sid});
									this.ticketsRegister();
									heimdallr.sendEvent(`${this.state.product.sid}_ticket_apply`)
								} else {
									this.setState({discountApplied: false, warning:'Cupom já utilizado'});

								}
							});
						}
					}
					else {
						this.setState({discountApplied:false, warning:'Código inválido'});

					}
				})}
			})

	}


	setSelectValue(item) {
		if (this.state.product.customization.find((i) => (i.label === item.label)).value) {
			const index = this.state.product.customization.find((i) => (i.label === item.label)).value.indexOf(item.value);
			if (index >= 0) {
				this.state.product.customization.find((i) => (i.label === item.label)).value.splice(index, 1);
				if (this.state.product.customization.find((i) => (i.label === item.label)).value.length === 0 ) {
					this.state.product.customization.find((i) => (i.label === item.label)).value = undefined;
				}
			} else {
				this.state.product.customization.find((i) => (i.label === item.label)).value.push(item.value)
			}
		} else {
			this.state.product.customization.find((i) => (i.label === item.label)).value = [item.value];
		}
	}

	setRadioValue(item) {
		this.state.product.customization.find((i) => (i.label === item.label)).value = item.value;
	}
	setTextValue (item) {
		this.state.product.customization.find((i) => (i.label === item.label)).value = item.value;
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

	onRefresh = () => {
		this.setState({ isRefreshing: true });
		heimdallr.getProduct(this.state.iidProduct).then((resolve) => {
			this.setState({product: resolve, productImages: resolve.images, PicPayPrice : (parseFloat(resolve.price) * 1.1).toFixed(2), isRefreshing: false});
		})
	}


	buttonEnabled = () => {
		this.setState({});
		if (this.state.product.customization.map((p) => p.value).some((fp) => {return fp === undefined})) {
			this.setState( { errorMissingValues: true });
		} else {
			heimdallr.sendEvent('buy_press');
			this.openAlert();
		}
	}

	setPromotionalCode = () => {
		if (!this.state.texInputCode) {
			return ;
		}
		this.setState({ settingPromotionalCode: true, warning: null, discountApplied: false});
		let coupons = null;
		let coupon = null;

		heimdallr.getCoupons('spotted').then((result) =>{

			coupons = result;
			coupon =  coupons.find((item) => (item.hash === this.state.texInputCode));

			if (coupon){
				if (coupon.quantity === 0){
					this.setState({warning : 'Cupom esgotado', settingPromotionalCode: false, discountApplied : false});
				}  else if (!coupon.active){
					this.setState({warning : 'Cupom fora da validade', settingPromotionalCode: false, discountApplied : false});
				}  else {
					heimdallr.getUserCoupons().then((resolve) => {
						let userCoupons = resolve;
						if (!userCoupons || (userCoupons && !userCoupons.find((item) => coupon.id === item.id))) {
							let discount = ((coupon.value / 100) * this.state.PicPayPrice);
							let finalValue = ((this.state.PicPayPrice - discount).toFixed(2));
							if (finalValue <= 0) {
								finalValue = 0;
							}
							this.setState({discountPicPayPrice : finalValue, discountApplied : true, newCoupon : coupon, warning: 'Desconto aplicado ;)', settingPromotionalCode: false,discountPriceWithoutTax : this.state.storePrice});
						} else {
							this.setState({warning : 'Código já utilizado', settingPromotionalCode: false, discountApplied : false});
						}
					});
				}
			} else {
				heimdallr.getCoupons( this.state.product.sid ).then((resolve) => {
					if (!result) {
						this.setState({warning:'Código inválido', settingPromotionalCode: false, discountApplied : false});
						return ;
					}
					coupons = resolve;
					coupon =  coupons.find((item) => (item.hash === this.state.texInputCode));

					if (coupon) {
						if(coupon.quantity === 0){
							this.setState({warning : 'Cupom esgotado', settingPromotionalCode: false, discountApplied : false});
						} else if (!coupon.active) {
							this.setState({warning : 'Cupom fora da validade', settingPromotionalCode: false, discountApplied : false});
						} else {
							heimdallr.getUserCoupons().then((resolve) => {
								let userCoupons = resolve;
								if (!userCoupons ||  (userCoupons && !userCoupons.find((item) => coupon.id === item.id))) {
									if(coupon.type === 0){
										let discount = ((coupon.value / 100) * this.state.PicPayPrice);
										const no_tax_discount = ((coupon.value / 100) * this.state.price_without_tax);
										this.setState({discountPicPayPrice : (this.state.PicPayPrice - discount), discountApplied : true, newCoupon : coupon, discountPriceWithoutTax : (this.state.price_without_tax - no_tax_discount), warning: 'Desconto aplicado ;)', settingPromotionalCode: false });
									}
									else {
										let tempDiscountPriceWithoutTax = parseFloat(parseFloat(this.state.price_without_tax) - parseFloat(coupon.value)).toFixed(2);
										let finalValue = parseFloat(parseFloat(this.state.PicPayPrice) - parseFloat(coupon.value)).toFixed(2);
										if (finalValue <= 0) {
											finalValue = 0
										}
										if (tempDiscountPriceWithoutTax <= 0) {
											tempDiscountPriceWithoutTax = 0;
										}
										this.setState({discountPicPayPrice: finalValue, discountApplied : true, newCoupon : coupon, discountPriceWithoutTax :tempDiscountPriceWithoutTax, warning: 'Desconto aplicado ;)', settingPromotionalCode: false });
									}
								} else{
									this.setState({warning : 'Código já utilizado', settingPromotionalCode: false, discountApplied : false});
								}
							});

						}
					}
					else {
						this.setState({warning:'Código inválido', settingPromotionalCode: false, discountApplied : false});
					}
				})

			}
		})

	}


	registerPartnerPlan = async () => {

		this.setState({showLoading: true});

		let price = null;
		let timeNow = null;
		let user = {};
		let selectedPlan = this.state.planId[this.state.selectedPlan];
		let store_code = this.state.product.sid;
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
			"referenceId": userParams.referenceId,
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
									this.props.navigation.push('ProductScreen',
																{
																	iid: this.state.iidProduct,
																	validPlan: true,
																	discount: userParams.value,
																	discountType: userParams.type,
																	/* partnersPlan: this.state.partnersPlan */
																});
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

	receivePromotionalCode = (value) => {
		this.state.texInputCode = value;
	}

	disableModal = () => {
		this.setState({ showAlert: false });
	}

	render() {
		return (
			<KeyboardAvoidingView style={{flex: 1}}>
				{
					// caso exista o produto
					this.state.product || this.state.initialLoad?
					<View>
						<View>
			                <FlatList
								showsVerticalScrollIndicator={false}
								keyboardShouldPersistTaps={'handled'}
								ListHeaderComponent = {() =>
									<View>
										<TouchableOpacity onPress={() => { this.props.navigation.goBack() } }>
											<View style={{ flexDirection: 'row', marginTop: 7, marginBottom: 5,  paddingLeft: 10 }}>
												<Image
													style={{ width: 30, height: 30, marginTop:4, opacity: 0.6 }}
													source={require('../../../../assets/images/chevron-circle-left-solid-white.png')}
												/>
											</View>
										</TouchableOpacity>
										<View style = { styles.logoContainer }>
											<Image
												style = {{ resizeMode: 'contain', flex: 1, width: null, height: null }}
												source={{ uri:this.state.product ? this.state.product.logo : null }}>
											</Image>
										</View>
										<View style = {{ marginTop: theme.height*0.03, marginBottom: theme.height*0.04, width: theme.width*0.9, alignSelf: 'center' }}>
											<Text style = { styles.productName } >
												{this.state.product? this.state.product.name : null}
											</Text>
										</View>
										<View style = {{ alignContent:'center',alignItems:'center',width:theme.width,height:theme.height * 0.45 }}>
											<CarouselModaFoka images={this.state.productImages ? this.state.productImages: []} dotColor={this.state.product ? this.state.product.colors[0] : 'black'}/>
										</View>
										<View style = { styles.payContainer }>
											<Text style = {{ fontWeight: 'bold', fontSize: 20 }}>
													{ 'Valor: R$ ' + (this.state.discountApplied ? this.state.discountPicPayPrice : this.state.PicPayPrice) }
											</Text>
											<View style = {{ flexDirection: 'row', marginTop: 5 }}>
												<Text style = {{ fontWeight: 'bold', fontSize: 17 }}>{ 'Pago pelo ' }</Text>
												<Image
													style = {{ width: 61, height: 20, marginLeft: 3, marginTop: 5 }}
													source = {{ uri:'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/cac%2Fpicpay-logo.png?alt=media&token=dbcdc019-adda-4b85-8573-668a886e72fc' }}>
												</Image>
											</View>
										</View>
										<View style = { styles.cuponView }>
											<TextInput
													placeholder = { this.state.placeholderCoupon }
													style={{ borderBottomWidth: 0.8, borderBottomColor: '#8f8f8f', height: 40 }}
													onChangeText = { this.receivePromotionalCode.bind(this) }
													width = { theme.width*0.68 }
												/>
												<TouchableOpacity
													disabled={ this.state.settingPromotionalCode }
													style = {{ zIndex: 1 }}
													onPress = { this.setPromotionalCode.bind(this) }
												>
													<View style = {{ ...styles.cuponInput, backgroundColor:this.state.product ? this.state.product.colors[0] : null }}>
														{
															this.state.settingPromotionalCode ?
															<ActivityIndicator size = "small" color = {(this.state.product ? this.state.product.colors[1] : null)} /> :
															<Text style = {{ color:(this.state.product ? this.state.product.colors[1] : null), fontWeight: 'bold' }}>{ 'OK' }</Text>
														}
													</View>
												</TouchableOpacity>
										</View>
										{
											this.state.warning != null &&
											<View style = {{ width: theme.width * 0.78, alignSelf: 'center', marginBottom: 20 }}>
												<Text style = {{ fontWeight: 'bold' }}> { this.state.warning } </Text>
											</View>
										}
										{
											this.state.planId != null  && this.state.planId.length > 0  &&
											<View style={{ ...styles.partnerButton, backgroundColor: this.state.product? this.state.product.colors[0] : null }}>
												<TouchableOpacity style ={{ padding:10, width: theme.width * 0.9 }} onPress = {()=> this.setState({ showPartnerModal : true})}>
													<View style={styles.partnerButtonView}>
														<Image
															style = {{ ...styles.partnerButtonIcon, tintColor: this.state.product && this.state.product.colors[0] === 'white' ? 'black' : 'white'}}
															source = {require('../../../../assets/images/star-solid.png')}
														/>
														<Text style={{ ...styles.buttonPartnerText, color:  this.state.product && this.state.product.colors[0] === 'white' ? 'black' : 'white'}}>TORNE-SE SÓCIO</Text>
													</View>
												</TouchableOpacity>
											</View>
										}
										{
											this.state.product && this.state.product.description != "" && this.state.product.description != null &&
											<View style = { styles.descriptionContainer }>
												<Text style = { styles.descriptionWord }>{'Descrição:'}</Text>
												<Text style = { styles.description }> { this.state.product ? this.state.product.description : null } </Text>
											</View>
										}
										{
											this.state.product && this.state.product.customization && this.state.product.customization.length > 0 &&
											<View style = {{ marginTop: theme.height * 0.04, padding:20, backgroundColor: this.state.product ? this.state.product.colors[0] : null, elevation: 8, }}>
												<Text style = {{ alignSelf:'center', fontSize: 24, fontWeight: 'bold', color: (this.state.product ? this.state.product.colors[1] : null) }}>{'Opções de Personalização'}</Text>
											</View>
										}
									</View>

								}
			                    data = {this.state.product ? this.state.product.customization : null}
								refreshControl={
									<RefreshControl
										refreshing={this.state.isRefreshing}
										onRefresh={this.onRefresh.bind(this)}
									/>
								}
								renderItem={ ({item}) =>

									<View style = {{alignSelf:'center'}} >
										{
											item.field === 'select' &&
											<CustomSelect selected={this.setSelectValue.bind(this)} colors = {this.state.product.colors} custom = {item}/>
										}
										{
											item.field === 'radio' &&
											<CustomRadio selected={this.setRadioValue.bind(this)} colors = {this.state.product.colors} custom = {item}/>
										}
										{
											item.field === 'textArea' &&
											<CustomizationTextArea  customizationCallback={this.setTextValue.bind(this)}  item = {item}/>
										}

									</View>
								}
								numColumns={1}
			                    keyExtractor={item => item.label}
								onEndReachedThreshold={0.3}
								ListFooterComponent={ () =>
									<View>
										{
											this.state.product &&
											<View style = {{ marginTop: theme.height*0.04 }}>
											{
												this.state.product && this.state.product.customization && this.state.product.customization.length > 0 &&
												<View style = {{ borderColor : '#8f8f8f', borderBottomWidth:1 }}>
													<Text style = {{ alignSelf: 'center', color: '#8f8f8f', padding: 4, paddingLeft: theme.width * 0.04, paddingRight: theme.width * 0.04, textAlign: 'center' }}>{'Após preencher as opções confirme a compra:'}</Text>
												</View>

											}
												<View style ={{ ...styles.footer, paddingTop:(this.state.product && this.state.product.description != "" && this.state.product.description != null ? theme.height*0.03 : 0) }}>
													{
														this.state.errorMissingValues &&
														<Text style={{ color: 'red', marginBottom: 4 }}> *Obrigatório o preenchimento de todos os campos </Text>
													}
													<FatBottomedButton
														disabled={this.state.product.stock <= 0}
														text = {'Comprar'}
														fontSize = {27}
														backgroundColor = {this.state.product? this.state.product.colors[0] : null}
														color = { this.state.product ? this.state.product.colors[1] : null }borderWidth = {0.1} height = {54}
														onTap = {this.buttonEnabled.bind(this)}
													/>
												</View>
											</View>
										}
									</View>

								}
			                />
		                </View>
					</View>
					:
					//	caso não exista
					!this.state.initialLoad &&
					<View>
						<TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
							<View style={{ flexDirection: 'row', marginTop: 7, marginBottom: 5,  paddingLeft: 10 }}>
								<Image
									style={{width: 12, height: 12, marginTop:4}}
									source={require('../../../../assets/images/arrow-left.png')}
								/>
								<Text style={{ marginLeft: 5 }}>
									voltar
								</Text>
							</View>
						</TouchableOpacity>
						<Text style={{ padding: 5, marginTop: 10, fontWeight: 'bold' }}>
							Esta produto não está mais diponível (´;︵;`)
						</Text>
					</View>
				}
				<Modal
		            hardwareAccelerated={true}
		            animationType='fade'
		            transparent={true}
		            visible={this.state.showAlert}
		            onRequestClose={() => { this.disableModal() }}
		            style = {{ height: 50, width: theme.width * 0.5 }}
	            >
		            <View style = {styles.centeredView}>
			            <View style = {{ ...styles.modalContainer, height: (this.state.product && this.state.product.customization && this.state.product.customization.length > 0  ? theme.height * 0.72 : theme.height * 0.69) }}>
							<View style = {{ ...styles.modalHeader , backgroundColor: this.state.product?this.state.product.colors[0]: null}}>
								<TouchableOpacity
									onPressIn={() => heimdallr.sendEvent('buy_cancel')}
									onPress={() => {this.disableModal()}}>
									<View style = {{ width: theme.width * 0.15, height: theme.height*0.05, alignSelf: 'flex-end' }}>
										<Image
											style = {{ width: 15, height: 15, opacity: 0.4, alignSelf: 'flex-end', tintColor: heimdallr.getTxtColor(this.state.product?this.state.product.colors[0]: 'black') }}
											source = {require('../../../../assets/images/times-solid.png')}
										/>
									</View>
								</TouchableOpacity>
								<Text style = {{ marginTop: -(theme.height *  0.025), fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5, alignSelf: 'center', color: (this.state.product ? this.state.product.colors[1] : null)}}>{'Confirmação da compra'}</Text>
							</View>
							<View style = {{ height: (this.state.product && this.state.product.customization && this.state.product.customization.length > 0  ? theme.height * 0.57 : theme.height * 0.55), marginTop: theme.height * 0.1 }}>
								{
									!this.state.showLoading &&
									<ScrollView style = {{ height: theme.height * 0.5, marginTop: 0 }} showsVerticalScrollIndicator = {false}>
										<View>
											<Text style = {{ fontWeight: 'bold', fontSize: 15, textAlign: 'justify', lineHeight: 25, marginLeft: theme.width * 0.007, letterSpacing: 0.5 }}>{'Produto : ' + (this.state.product?this.state.product.name : '')}</Text>
											{
												this.state.product && this.state.product.customization && this.state.product.customization.length > 0 &&
												<View style = {{ flexDirection: 'row'}}>
													<Text style = {{ flexDirection:'row', marginTop: theme.height * 0.01, textAlign: 'justify' }}>
													{
														this.state.product.customization.map(i =>
														<Text key = {i.label} style = {{ flex: 1, flexWrap: 'wrap', fontWeight:'bold', color:'#8f8f8f', fontSize:15, letterSpacing: 0.5, textAlign: 'justify', lineHeight: (this.state.product.customization.length > 0 ? 25 : 0) }}>
															{i.value?(' ' + i.label + ' - ' + i.value + (this.state.product.customization.indexOf(i) === (this.state.product.customization.length - 1) ? '.' : ',')):''}
														</Text>
														)
													}
													</Text>
												</View>

											}
											{
												this.state.warning != null &&
												<Text style = {{ fontWeight:'bold', letterSpacing: 0.5, marginTop: theme.height * 0.02, marginLeft:theme.width * 0.01, color: this.state.product? this.state.product.colors[0] : 'black' }}>{this.state.warning}</Text>
											}
											<Text style = { styles.information }>{'Informações:'}</Text>
												<View style = { styles.picPayView }  >
													<View style = {{ margin: 20, flexWrap: 'wrap'}}>
														<View style = {{ flexDirection:'column', flexWrap: 'wrap'}}>
															<View style={{ flexDirection: 'row' }}>
																<Text style = {styles.paymentText} >
																	{'R$ ' +(this.state.discountPicPayPrice != null ? parseFloat(this.state.discountPicPayPrice).toFixed(2).toString().replace(".", ",") : this.state.PicPayPrice) + ' - Pago pelo '}
																</Text>
																<Image
																	style = {{ width: 61, height: 20, marginLeft: 3, marginTop:0}}
																	source = {{ uri:'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/cac%2Fpicpay-logo.png?alt=media&token=dbcdc019-adda-4b85-8573-668a886e72fc' }}>
																</Image>
															</View>
															{
																this.state.discountApplied &&
																<View>
																	<Text style ={{ fontWeight: 'bold', marginBottom: theme.height*0.01, letterSpacing: 0.5}}>{'Valor com desconto'}</Text>
																</View>

															}
														</View>
														<View style={{ flexDirection:'row' }}>
															<Text style={styles.buyConfirmText}>
																{ 'O pagamento é rapidamente efetivado, com opções de parcelamento oferecidas pelo PicPay. '+(this.state.product? this.state.product.store_name : 'o reponsável') + ' receberá automaticamente o comprovante de seu pagamento e a retirada do produto será realizada com o mesmo.' }
															</Text>
														</View>
													</View>
												</View>
												<View style = {{ ...styles.modalButtons,  marginTop: (this.state.product && this.state.product.customization && this.state.product.customization.length > 0 ? theme.height * 0.07 : theme.height * 0.05)}}>
													<TouchableOpacity
														activeOpacity={1}
														onPressIn={() => heimdallr.sendEvent('buy_cancel')}
														onPress = { this.disableModal.bind(this) }>
														<View style = { styles.cancelButton }>
															<Text style ={{ color: 'white', fontWeight: 'bold', letterSpacing: 0.5 }}>{ 'Cancelar' }</Text>
														</View>
													</TouchableOpacity>
													<TouchableOpacity
														activeOpacity={1}
														onPressIn={() => heimdallr.sendEvent(`${this.state.product.sid}_buy_confirm`)}
														onPress = { this.state.discountApplied ? this.discountedTickets : this.ticketsRegister }>
														<View style = {{ ...styles.confirmButton, backgroundColor: this.state.product? this.state.product.colors[0] : 'green' }}>
															<Text style = {{ fontWeight: 'bold', letterSpacing: 0.5, color: (this.state.product ? this.state.product.colors[1] : null) }}>{ 'Confirmar' }</Text>
														</View>
													</TouchableOpacity>
												</View>

										</View>
									</ScrollView>
								}
								{
									this.state.showLoading &&
									<View style = {{marginTop: theme.height * 0.05}}>
										<ActivityIndicator size="large" color={this.state.product? this.state.product.colors[0] : theme.primary} />
										<View style={{flexDirection: 'row', width: theme.width * 0.7, wordWrap: 'wrap' , flexWrap: 'wrap', justifyContent: 'center',marginTop:theme.height * 0.05 }}>
											<Text style={{fontStyle: 'italic', fontWeight: 'bold', fontSize: 25, color: '#8f8f8f'}}>
												HOOOOOOLD!
											</Text>
											<Text style={{fontWeight: 'bold', fontSize: 25, textAlign: 'center', marginTop: theme.height * 0.05, lineHeight: 50 }}>
												Estamos preparando o seu pedido ;)
											</Text>
										</View>
									</View>
								}
							</View>
			            </View>
		            </View>
	            </Modal>
				<Modal
		            hardwareAccelerated={true}
		            animationType='fade'
		            transparent={true}
		            visible={this.state.showPartnerModal}
		            onRequestClose={() => { this.setState({showPartnerModal: false}) }}
		            style = {{ height: 50, width: theme.width * 0.5 }}
	            >
		            <View style = {styles.centeredView}>
						<View style = {{ ...styles.modalContainer, height: this.state.planId && this.state.planId.length > 1 ?  theme.height * 0.7 : theme.height * 0.55}}>
							<View style = {{ ...styles.modalHeader , backgroundColor:  this.state.product? this.state.product.colors[0]: null}}>
								<TouchableOpacity onPress={() => {this.setState({showPartnerModal: false})}}>
									<View style = {styles.iconView}>
										<Image
											style = {{ ...styles.timesSolid, tintColor: heimdallr.getTxtColor(this.state.product? this.state.product.colors[0]: 'black') }}
											source = {require('../../../../assets/images/times-solid.png')}
										/>
									</View>
								</TouchableOpacity>
								<Text style = {{ ...styles.modalText, color: (this.state.product ? this.state.product.colors[1] : null)}}>{'Opções de plano'}</Text>
							</View>
							{
								!this.state.showLoading &&
								<View style = {{ ...styles.modalView, height:  this.state.planId &&  this.state.planId.length > 1 ? theme.height * 0.64 : theme.height * 0.5 }}>
									<ScrollView style = {styles.scrollView} showsVerticalScrollIndicator = {false}>
										<View>
											<View style={{ marginBottom: 20, marginLeft: 10, marginTop: 10 }}>
												<Text style={{ color: '#8f8f8f', fontWeight: 'bold' }}>Selecione o plano</Text> 
											</View>
											{
												this.state.planId != null && this.state.planId.map(i =>
												<View  key = {i} style={styles.partnersPlanView}>
													<View style={{ ...styles.selectedPlan, borderColor: (this.state.selectedPlan === this.state.planId.indexOf(i) && this.state.product ? this.state.product.colors[0]: null), borderWidth: (this.state.selectedPlan === this.state.planId.indexOf(i) ? 3 : 0) }}>
														<TouchableOpacity onPress={() => this.setState({ selectedPlan: this.state.planId.indexOf(i) })}>
															<Text style={{ ...styles.planName, color: (this.state.product ? this.state.product.colors[0] : null)}}>{ 'Plano: ' + this.state.partnersPlan[i].name}</Text>
															<View style={styles.planDescriptionView}>
																<Text style={styles.descriptionTitle}>{ 'Descrição: '}
																	<Text style = {styles.planDescription}>{JSON.parse(this.state.partnersPlan[i].description) + '.'}</Text>
																</Text>
															</View>
															<View style={{flexDirection: 'row'}}>
																<Text style={{fontWeight:'bold'}}>{ 'Valor de desconto nas compras: ' }</Text>
																<Text style={{color: '#8f8f8f'}}>{this.state.partnersPlan[i].type === 0 ? this.state.partnersPlan[i].value + '%' : 'R$ ' + parseFloat(this.state.partnersPlan[i].value).toFixed(2)}</Text>
															</View>
															<Text style={{fontWeight: 'bold'}}>{'O plano é válido por ' + this.state.partnersPlan[i].vigor + ' dias.'}</Text>
															<Text style={{fontWeight:'bold'}}>{'Preço: R$' + this.state.partnersPlan[i].price}</Text>
														</TouchableOpacity>
													</View>
												</View>
												)
											}
											<View style = {{ ...styles.modalButtons,  marginTop: theme.height * 0.05}}>
												<TouchableOpacity activeOpacity={1} onPress = { () => this.setState({ showPartnerModal: false }) }>
													<View style = { styles.cancelButton }>
														<Text style ={{ color: 'white', fontWeight: 'bold', letterSpacing: 0.5 }}>{ 'Cancelar' }</Text>
													</View>
												</TouchableOpacity>
												<TouchableOpacity activeOpacity={1} onPress = { this.registerPartnerPlan.bind(this) }>
													<View style = {{ ...styles.confirmButton, backgroundColor: (this.state.product ? this.state.product.colors[0] : null)}}>
														<Text style = {{ fontWeight: 'bold', letterSpacing: 0.5, color: (this.state.product ? this.state.product.colors[1] : null) }}>{ 'Confirmar' }</Text>
													</View>
												</TouchableOpacity>
											</View>
										</View>
									</ScrollView>
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
			</KeyboardAvoidingView>
		)
	}
}


const styles = StyleSheet.create({
	logoContainer: {
		width: theme.width * 0.8,
		height: theme.height * 0.1,
		alignSelf: 'center',
		justifyContent: 'center',
	},
	productName: {
		fontWeight: 'bold',
		fontSize: 25,
		alignSelf: 'center',
		textAlign: 'justify'
	},

	payContainer: {
		width: theme.width * 0.9,
		alignSelf: 'center',
		marginTop: theme.height*0.05,
		marginLeft: theme.width * 0.02
	},
	descriptionContainer: {
		width: theme.width * 0.92,
		alignSelf: 'center',
		paddingLeft: 15,
		paddingRight: 17,
		marginTop: theme.height * 0.02,
		borderRadius: 25,
		paddingBottom: 20,
		paddingTop: 20,
		elevation: 3,
		backgroundColor: 'white',
	},
	description: {
		flex: 1,
		fontSize: 15,
		textAlign: 'justify',
		lineHeight: 25,
	},
	descriptionWord: {
		fontWeight: 'bold',
		fontSize: 16,
		marginBottom: theme.height * 0.004
	},
	productDetails: {
		borderBottomColor: '#8f8f8f',
		borderBottomWidth: 0.8,
		width: theme.width * 0.8,
		paddingRight: 10,
		paddingLeft: 10,
		paddingBottom: 5,
		paddingTop: 5
	},
	footer: {
		width: theme.width,
		alignSelf:'center',
		marginBottom:theme.height*0.04,
		borderTopColor:'#8f8f8f',
		paddingLeft:theme.width*0.06,
		paddingRight:theme.width*0.06,
		paddingTop:theme.height*0.03
	},
	buyConfirmText: {
		flex: 1,
		flexWrap: 'wrap',
		color:'#8f8f8f',
		fontWeight:'700',
		textAlign:'justify',
		letterSpacing : 0.5,
		lineHeight: 25,

	},
	picPayView: {
		borderColor:'#21c25e',
		borderWidth: 2,
		marginTop:15,
		borderRadius: 25,
	},
	cuponView: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		alignSelf: 'center',
		marginTop: theme.height * 0.03,
		marginBottom:theme.height * 0.02
	},
	cuponInput: {
		zIndex: 1,
		padding: theme.width * 0.03,
		borderRadius: 7,
		marginLeft: theme.width*0.02
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
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: -(theme.height * 0.1),
		paddingTop:theme.height * 0.1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom:theme.height * 0.04
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
	information: {
		fontWeight: 'bold',
		marginLeft: theme.width * 0.01,
		marginBottom: theme.width * 0.02,
		letterSpacing: 0.5,
		marginTop: theme.width * 0.04,
		fontSize: 15
	},
	paymentText: {
		fontWeight:'bold',
		fontSize: 15,
		marginBottom: 7,
		letterSpacing: 0.5
	},
	fab: {
		position: 'absolute',
		marginTop: theme.height * 0.75,
		marginLeft: theme.width * 0.80,
		padding: 5,
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
	timesSolid: {
		width: 15, 
		height: 15, 
		opacity: 0.4, 
		alignSelf: 'flex-end', 
	},
	modalView: {
		height: theme.height * 0.4, 
		marginTop: theme.height * 0.08, 
		paddingBottom: 50
	},
	scrollView: {
		height: theme.height * 0.35, 
		marginTop: 0 
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
	planName: {
		fontWeight: 'bold',
		fontSize: 17, 
		marginBottom: 10,
	},
	planDescriptionView: {
		flexDirection: 'row', 
		width: theme.width * 0.65
	},
	descriptionTitle: {
		fontWeight:'bold', 
		flexWrap: 'wrap'
	},
	planDescription: {
		flexWrap: 'wrap', 
		fontWeight:'400',
		color: '#8f8f8f',
		lineHeight:20
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
	partnerButtonView: {
		flexDirection : 'row', 
		alignSelf: 'center',
		width: theme.width * 0.47, 
		height: theme.height * 0.03, 
		alignContent: 'center', 
		justifyContent:'flex-start'
	}


});
