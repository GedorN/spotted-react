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
import CustomSelect from "./custom/CustomSelect";
import CustomRadio from "./custom/CustomRadio";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import axios from 'react-native-axios';
import CarouselModaFoka from "./layout/CarouselModaFoka";
import RNFetchBlob from 'rn-fetch-blob';
import moment from "moment";
import {NavigationActions, StackActions} from "react-navigation";

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
			PicPayPrice : '0.00',
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
			discountPicPayPrice: '0.00',
			discountPriceWithoutTax: null,
			currentPlan: false,
			couponHash: null,
		}
	}

	componentDidMount = async () => {
		this.props.navigation.addListener('willFocus', () => {
			this.createListener();
		});

		this.state.iidProduct =  this.props.navigation.getParam('iid');

		heimdallr.getProduct(this.state.iidProduct).then(
			async (resolve) => {
				heimdallr.sendEvent(`${resolve.sid}_product_click`);
				const original_price = resolve.price;
				resolve.price = (parseFloat(resolve.price) * 1.16).toFixed(2);

				let today = await heimdallr.getServerTime();
				let userPlans = null;

				if(heimdallr.userPlans != null && heimdallr.userPlans[resolve.sid]){
					userPlans =  heimdallr.userPlans[resolve.sid];
					// verifica se o plano ainda está dentro da validade
					if (today < userPlans[0].due_date && userPlans[0].active === 1 && !resolve.no_plan_discount) {
						// verifica se o desconte deve ser absoluto ou porcentagem
						if( userPlans[0].type === 0 ){
							let newPrice = original_price - (original_price * ((userPlans[0].value)/100));
							this.setState({
								product: resolve,
								productImages: resolve.images,
								price_without_tax: newPrice,
								storePrice : original_price,
								spottedPrice : resolve.price,
								initialLoad: false,
								currentPlan: userPlans[0],
								PicPayPrice: (newPrice * 1.16).toFixed(2)
							});
						} else {
							let newPrice = original_price - parseFloat(userPlans[0].value).toFixed(2);
							newPrice = newPrice <= 0 ? 0 : newPrice;
							this.setState({
								product: resolve,
								productImages: resolve.images,
								price_without_tax: newPrice,
								storePrice : original_price,
								spottedPrice : resolve.price,
								initialLoad: false,
								currentPlan: userPlans[0],
								PicPayPrice: (newPrice * 1.16).toFixed(2),
							});
						}
					} else {
						this.setState({
							product: resolve,
							productImages: resolve.images,
							price_without_tax: original_price,
							storePrice : original_price,
							spottedPrice : resolve.price,
							initialLoad: false,
							PicPayPrice : resolve.price
						});
						if (today > userPlans[0].due_date && userPlans[0].active === 1) {
							heimdallr.sendEvent(`${resolve.sid}_plan_expired`);
						}
					}

				} else {
					this.setState({
						product: resolve,
						productImages: resolve.images,
						price_without_tax: original_price,
						storePrice : original_price,
						spottedPrice : resolve.price,
						initialLoad: false,
						PicPayPrice : resolve.price
					});
				}
			},
			() => {
				this.setState({initialLoad: false})
			}
		)
	}

	createListener = () => {
		heimdallr.newPlanAdded = false;
		heimdallr.getProduct(this.state.iidProduct).then(
			async (resolve) => {

				heimdallr.sendEvent(`${resolve.sid}_product_click`);
				const original_price = resolve.price;
				resolve.price = (parseFloat(resolve.price) * 1.16).toFixed(2);

				let today = await heimdallr.getServerTime();
				let userPlans = null;

				if(heimdallr.userPlans != null && heimdallr.userPlans[resolve.sid] && !resolve.no_plan_discount){
					userPlans =  heimdallr.userPlans[resolve.sid];

					// verifica se o plano ainda está dentro da validade
					if(today < userPlans[0].due_date && userPlans[0].active === 1){
						// verifica se o desconte deve ser absoluto ou porcentagem
						if( userPlans[0].type === 0 ){
							let newPrice = original_price - (original_price * ((userPlans[0].value)/100));
							this.setState({
								product: resolve,
								productImages: resolve.images,
								price_without_tax: newPrice,
								storePrice : original_price,
								spottedPrice : resolve.price,
								initialLoad: false,
								PicPayPrice: (newPrice * 1.16).toFixed(2),
								currentPlan: userPlans[0],
							});
						} else {
							let newPrice = original_price - parseFloat(userPlans[0].value).toFixed(2);
							newPrice = newPrice <= 0 ? 0 : newPrice;
							this.setState({
								product: resolve,
								productImages: resolve.images,
								price_without_tax: newPrice,
								storePrice : original_price,
								spottedPrice : resolve.price,
								initialLoad: false,
								PicPayPrice: (newPrice * 1.16).toFixed(2),
								currentPlan: userPlans[0]
							});
						}
					} else {
						this.setState({
							product: resolve,
							productImages: resolve.images,
							price_without_tax: original_price,
							storePrice : original_price,
							spottedPrice : resolve.price,
							initialLoad: false,
							PicPayPrice : resolve.price
						});
					}

				} else {
					this.setState({
						product: resolve,
						productImages: resolve.images,
						price_without_tax: original_price,
						storePrice : original_price,
						spottedPrice : resolve.price,
						initialLoad: false,
						PicPayPrice : resolve.price
					});
				}
			},
			() => {
				this.setState({initialLoad: false})
			}
		)
	}


	openAlert = () =>{
		this.setState({showAlert : true,warning:null});
	}

	ticketsRegister = async () => {
		if (this.state.showLoading) {
			return ;
		}
			this.setState({showLoading: true, showConfirmButton: false, showCancelButton: false});

			let due_date = await heimdallr.getServerTime();
			due_date = moment(due_date).add(20, 'm').format();

			if (this.state.currentPlan) {
				const time = await heimdallr.getServerTime();
				const check = await heimdallr.validatePlanBeforeBuy(this.state.product.sid, time);
				if (!check) {
					this.setState({showAlert : false, showLoading: false, showConfirmButton: true, showCancelButton: true,  warning: null, discountApplied: false});
					showMessage({
						message: "Plano expirado",
						type: "danger",
						icon: 'danger'
					});
					return ;
				}
			}
			let params = {};
			params.colors = JSON.stringify(this.state.product.colors);
			params.productId = this.state.iidProduct;
			params.image = this.state.productImages[0];
			params.category = this.state.product.category;
			params.categoryName = this.state.product.category_name;
			params.productName = this.state.product.name;
			params.storeName = this.state.product.sid;
			params.storeLogo = this.state.product.logo;
			params.userId = heimdallr.user_id;
			params.url = 'PicPay';
			params.description = JSON.stringify(this.state.product.customization);
			params.payment = 'PicPay';
			params.productPrice = this.state.discountApplied ? parseFloat(this.state.discountPicPayPrice).toFixed(2) : parseFloat(this.state.PicPayPrice).toFixed(2);
			params.noTaxValue = this.state.discountApplied ? parseFloat(this.state.discountPriceWithoutTax).toFixed(2) : parseFloat(this.state.price_without_tax).toFixed(2);
			params.buyerName = heimdallr.user_name;
			params.buyerPhone = heimdallr.phone;
			params.buyerEmail = heimdallr.email;
			params.referenceId = await heimdallr.getUID();
			if (this.state.discountApplied) {
				params.couponHash = this.state.couponHash;
			}

			if (params.product_price == 0) {
				params.status = 'Pago';
				params.url = '';
				heimdallr.saveTicketsRegister(params);
				if(this.state.discountApplied){
					heimdallr.StoreCoupons(this.state.storeCoupons, this.state.ticketStore);
					heimdallr.saveUserCoupon(this.state.userCouponsRegister);
					this.setState({discountPicPayPrice : null, discountPriceWithoutTax : null, couponHash: null});
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
						"callbackUrl": "http://3.23.33.91/purchase-status",
						"returnUrl": "https://spottedutfpr.com/app/tickets",
						"value": params.productPrice,
						"expiresAt": due_date,
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
						RNFetchBlob.config({
							trusty: true
						}).fetch('POST',
							'https://3.23.33.91/allocate-product',
							{ 'Content-Type': 'application/json'},
							JSON.stringify({
								...params
							})
						);
						Linking.openURL(resolve.data.paymentUrl);
						this.setState({showAlert : false, showLoading: false, showConfirmButton: true, showCancelButton: true,  warning: null, discountApplied: false, discountPicPayPrice : null, discountPriceWithoutTax : null, couponHash: null});
						showMessage({
							message: "Compra realizada com sucesso",
							type: "success",
							icon: 'success'
						});
						const resetAction = StackActions.reset({
							index: 0,
							actions: [NavigationActions.navigate({ routeName: 'Home' })],
						});
						this.props.navigation.dispatch(resetAction);
						this.props.navigation.push('Tickets');
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
							this.setState({userCouponsRegister : userCoupons, storeCoupons : coupons, discountApplied : true, ticketStore:'spotted', couponHash: coupons[index].hash });
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
									this.setState({userCouponsRegister : userCoupons, storeCoupons : coupons, discountApplied : true, ticketStore:this.state.product.sid, couponHash: coupons[index].hash});
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
		heimdallr.getProduct(this.state.iidProduct).then(
			async (resolve) => {
				const original_price = resolve.price;
				resolve.price = (parseFloat(resolve.price) * 1.16).toFixed(2);

				let today = await heimdallr.getServerTime();
				let userPlans = null;

				if(heimdallr.userPlans != null && heimdallr.userPlans[resolve.sid]){
					userPlans =  heimdallr.userPlans[resolve.sid];

					// verifica se o plano ainda está dentro da validade
					if (today < userPlans[0].due_date && userPlans[0].active === 1) {
						// verifica se o desconte deve ser absoluto ou porcentagem
						if( userPlans[0].type === 0 ){
							let newPrice = original_price - (original_price * ((userPlans[0].value)/100));
							this.setState({
								product: resolve,
								productImages: resolve.images,
								price_without_tax: newPrice,
								storePrice : original_price,
								spottedPrice : resolve.price,
								isRefreshing: false,
								currentPlan: userPlans[0],
								PicPayPrice: (newPrice * 1.16).toFixed(2)
							});
						} else {
							let newPrice = original_price - parseFloat(userPlans[0].value).toFixed(2);
							newPrice = newPrice <= 0 ? 0 : newPrice;
							this.setState({
								product: resolve,
								productImages: resolve.images,
								price_without_tax: newPrice,
								storePrice : original_price,
								spottedPrice : resolve.price,
								isRefreshing: false,
								currentPlan: userPlans[0],
								PicPayPrice: (newPrice * 1.16).toFixed(2),
							});
						}
					} else {
						this.setState({
							product: resolve,
							productImages: resolve.images,
							price_without_tax: original_price,
							storePrice : original_price,
							spottedPrice : resolve.price,
							isRefreshing: false,
							PicPayPrice : resolve.price
						});
					}

				} else {
					this.setState({
						product: resolve,
						productImages: resolve.images,
						price_without_tax: original_price,
						storePrice : original_price,
						spottedPrice : resolve.price,
						isRefreshing: false,
						PicPayPrice : resolve.price
					});
				}
			},
			() => {
				this.setState({isRefreshing: false})
			}
		)
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

	verifyGeneralCoupons = () => {
		let coupon = null;
		let coupons = null;
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

	setPromotionalCode = () => {
		if (!this.state.texInputCode) {
			return ;
		}
		this.setState({ settingPromotionalCode: true, warning: null, discountApplied: false});

		heimdallr.getNominalCoupons(this.state.texInputCode).then(
			(result) => {
				if (result.length > 0) {
					let coupon = result.filter((i) => (i.user === heimdallr.phone || i.user === heimdallr.email) && (i.store_code === this.state.product.sid || i.store_code === 'spotted') && i.active );
					if (coupon.length > 0) {
						coupon = coupon[0];
						if (coupon.quantity > 0) {
							if (coupon.store_code === 'spotted') {
								let discount = ((coupon.value / 100) * this.state.PicPayPrice);
								let finalValue = ((this.state.PicPayPrice - discount).toFixed(2));
								if (finalValue <= 0) {
									finalValue = 0;
								}
								this.setState({discountPicPayPrice : finalValue, discountApplied : true, newCoupon : coupon, warning: 'Desconto aplicado ;)', settingPromotionalCode: false,discountPriceWithoutTax : this.state.storePrice});
							} else {

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

							}
						} else {
							this.setState({warning : 'Cupom esgotado', settingPromotionalCode: false, discountApplied : false});
						}

					} else {
						this.verifyGeneralCoupons();
					}
				} else {
					this.verifyGeneralCoupons();
				}
			},
			() => {
				this.verifyGeneralCoupons();
			}
		);
	}

	receivePromotionalCode = (value) => {
		this.state.texInputCode = value;
	}

	disableModal = () => {
		this.setState({ showAlert: false });
	}

	goToPlans = () => {
		this.props.navigation.push('Plans', {store: this.state.product.sid, current_plan: this.state.currentPlan});
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
													{ 'Valor: R$ ' + (this.state.discountApplied ? parseFloat(this.state.discountPicPayPrice).toFixed(2).toString().replace('.',',') : parseFloat(this.state.PicPayPrice).toFixed(2).toString().replace('.',',')) }
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
										<View style={{ ...styles.partnerButton, backgroundColor: this.state.product? this.state.product.colors[0] : null }}>
											<TouchableOpacity
												style ={{ padding:10, width: theme.width * 0.9 }}
												onPress = {this.goToPlans.bind(this)}
												onPressIn={() => heimdallr.sendEvent('partners_list_click')}
											>
												<View style={styles.partnerButtonView}>
													<Image
														style = {{ ...styles.partnerButtonIcon, tintColor: this.state.product && this.state.product.colors[0] ? heimdallr.getTxtColor(this.state.product.colors[0]) : 'white'}}
														source = {require('../../../../assets/images/star-solid.png')}
													/>
													<Text style={{ ...styles.buttonPartnerText, color:  this.state.product && this.state.product.colors[0] ? heimdallr.getTxtColor(this.state.product.colors[0]) : 'white'}}>TORNE-SE SÓCIO</Text>
												</View>
											</TouchableOpacity>
										</View>
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
							Este produto não está mais diponível (´;︵;`)
						</Text>
					</View>
				}
				<Modal
		            hardwareAccelerated={true}
		            animationType='fade'
		            transparent={true}
		            visible={this.state.showAlert}
		            onRequestClose={() => { this.disableModal() }}
		            style = {{ height: 80, width: theme.width * 0.5 }}
	            >
		            <View style = {styles.centeredView}>
			            <View style = {{ ...styles.modalContainer, height: (this.state.product && this.state.product.customization && this.state.product.customization.length > 0  ? theme.height * 0.72 : theme.height * 0.75) }}>
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
							<View style = {{ height: (this.state.product && this.state.product.customization && this.state.product.customization.length > 0  ? theme.height * 0.57 : theme.height * 0.60), marginTop: theme.height * 0.1 }}>
								{
									!this.state.showLoading &&
									<ScrollView style = {{height: theme.height * 60, marginTop: 0 }} showsVerticalScrollIndicator = {false}>
										<View >
											<Text style = {{ fontWeight: 'bold', fontSize: 15, textAlign: 'justify', lineHeight: 25, marginLeft: theme.width * 0.007, letterSpacing: 0.5 }}>{'Produto : ' + (this.state.product?this.state.product.name : '')}</Text>
											{
												this.state.product && this.state.product.customization && this.state.product.customization.length > 0 &&
												<View style = {{ flexDirection: 'row'}}>
													<Text style = {{ flexDirection:'row', marginTop: theme.height * 0.01, textAlign: 'justify' }}>
													{
														this.state.product.customization.map(i =>
														<Text key = {i.label} style = {{ flex: 1, flexWrap: 'wrap', fontWeight:'bold', color:'#8f8f8f', fontSize:15, letterSpacing: 0.5, lineHeight: (this.state.product.customization.length > 0 ? 25 : 0) }}>
															{i.value?(i.label + ' - ' + i.value + (this.state.product.customization.indexOf(i) === (this.state.product.customization.length - 1) ? '.' : ', ')):''}
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
																	{'R$ ' +(this.state.discountApplied  ? parseFloat(this.state.discountPicPayPrice).toFixed(2).toString().replace(".", ",") :  parseFloat(this.state.PicPayPrice).toFixed(2).toString().replace(".", ",")) + ' - Pago pelo '}
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
																{ 'ATENÇÃO: Você terá 20 minutos para efetuar o pagamento. Após este tempo o pedido será expirado e retirado da sua lista de pediddos. '+(this.state.product? this.state.product.store_name : 'o reponsável') + ' receberá automaticamente o comprovante de seu pagamento e a retirada do produto será realizada com o mesmo.' }
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
	partnerButtonIcon: {
		width: 22,
		height: 20,
		alignSelf: 'center',
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
	},
	buttonPartnerText: {
		fontWeight: 'bold',
		fontSize: 15,
		letterSpacing: 1,
		alignSelf: 'center',
		marginLeft: 10,
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: -(theme.height * 0.1),
		paddingTop:theme.height * 0.1,
		paddingBottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContainer: {
		width: theme.width * 0.9,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 25,
		paddingBottom: 0,
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
});
