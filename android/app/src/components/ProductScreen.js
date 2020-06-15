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
} from 'react-native';

import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../components/General/Theme";
import Carousel from 'react-native-banner-carousel';
import FatBottomedButton from'./buttons/FatBottomedButton';
import CustomizationTextArea from './CustomizationTexArea';
import AwesomeAlert from "react-native-awesome-alerts";
import CustomSelect from "./custom/CustomSelect";
import CustomRadio from "./custom/CustomRadio";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import axios from 'react-native-axios';
import moment from "moment";


export default class ProductScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			iidProduct: '',
			product : null,
			productImages: null,
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
		}
	}

	componentDidMount(): void {
		this.state.iidProduct =  this.props.navigation.getParam('iid');
		heimdallr.getProduct(this.state.iidProduct).then(
			(resolve) => {
				const original_price = resolve.price;
				resolve.price = (parseFloat(resolve.price) * 1.16).toFixed(2);
				this.setState({product: resolve, productImages: resolve.images, PicPayPrice : resolve.price,
				price_without_tax: original_price,storePrice : original_price, spottedPrice : resolve.price, initialLoad: false});
			},
			() => {
				this.setState({initialLoad: false})
			}
		)
	}

	renderPage(image, index) {
		return (
            <View key={index} style = {{ height:theme.height * 0.58,width:theme.width * 0.8,alignSelf:'center',marginBottom:theme.height * 0.03}}>
                <Image style={{flex: 1, resizeMode: 'contain', width: theme.width * 0.85, height:theme.height * 0.55, alignSelf:'center' }} source={{ uri: image }} />
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
					/* this.ticketsRegister(); */

				} else if(coupon.active === false){
					this.setState({discountApplied: false, warning:'Cupom fora da validade',discountPicPayPrice: this.state.PicPayPrice});
				/* 	this.ticketsRegister(); */
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
						this.ticketsRegister();
					}
					coupons = res;
					coupon =  coupons.find((item) => (item.hash === this.state.newCoupon.hash && item.quantity > 0 && item.active === true ));
					if (coupon) {
						if (coupon.quantity === 0) {
							this.setState({discountApplied: false, warning:'Cupom esgotado'});
							this.ticketsRegister();
						}  else if(coupon.active === false) {
							this.setState({discountApplied: false, warning:'Cupom fora da validade'});
							this.ticketsRegister();
						} else {
							heimdallr.getUserCoupons().then((resolve) => {
								userCoupons = resolve;
								if (!resolve || (resolve && !userCoupons.find((item) => coupon.id === item.id))) {
									userCoupons.push(this.state.newCoupon);
									let index = coupons.indexOf(coupon);
									coupons[index].quantity  = coupons[index].quantity - 1;
									this.setState({userCouponsRegister : userCoupons, storeCoupons : coupons, discountApplied : true, ticketStore:this.state.product.sid});
									this.ticketsRegister();
								} else {
									this.setState({discountApplied: false, warning:'Cupom já utilizado'});
									this.ticketsRegister();
								}
							});
						}
					}
					else {
						this.setState({discountApplied:false, warning:'Código inválido'});
						this.ticketsRegister();
					}
				})}
			})

	}


	setSelectValue(item) {
		if (this.state.product.customization.find((i) => (i.label === item.label)).value) {
			this.state.product.customization.find((i) => (i.label === item.label)).value.push(item.value)
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
		if (this.state.product.customization.map((p) => p.value).some((fp) => {return fp === undefined})) {
			this.setState( { errorMissingValues: true });
		} else {
			this.openAlert();
		}
	}

	setPromotionalCode = () => {
		this.setState({ settingPromotionalCode: true, warning: null, discountApplied: false });
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
							this.setState({discountPicPayPrice : ((this.state.PicPayPrice - discount).toFixed(2)), discountApplied : true, newCoupon : coupon, warning: 'Desconto aplicado ;)', settingPromotionalCode: false,discountPriceWithoutTax : this.state.storePrice});
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
										this.setState({discountPicPayPrice: (this.state.price_without_tax - coupon.value), discountApplied : true, newCoupon : coupon,discountPriceWithoutTax : (this.state.price_without_tax - coupon.value), warning: 'Desconto aplicado ;)', settingPromotionalCode: false });
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

	receivePromotionalCode = (value) => {
		this.state.texInputCode = value;
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
								ListHeaderComponent = {() =>
									<View>
										<TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
											<View style={{flexDirection: 'row', marginTop: 7, marginBottom: 5,  paddingLeft: 10}}>
												<Image
													style={{width: 12, height: 12, marginTop:4}}
													source={require('../../../../assets/images/arrow-left.png')}
												/>
												<Text style={{marginLeft: 5}}>
													voltar
												</Text>
											</View>
										</TouchableOpacity>
										<View style = {styles.logoContainer}>
											<Image
												style = {{resizeMode:'contain',flex:1,width:null,height:null}}
												source={{ uri:this.state.product? this.state.product.logo : null}}>
											</Image>
										</View>
										<View style = {{marginTop:theme.height*0.03,marginBottom:theme.height*0.04,width:theme.width*0.9,alignSelf:'center'}}>
											<Text style = {styles.productName} >
												{this.state.product? this.state.product.name : null}
											</Text>
										</View>

										<Carousel
											activePageIndicatorStyle = {{backgroundColor:this.state.product ? this.state.product.colors[0] : 'black'}}
											autoplay
											autoplayTimeout={5000}
											loop
											index={0}
											pageSize={theme.width}
										>
											{this.state.productImages? this.state.productImages.map((image, index) => this.renderPage(image, index)) :null}
										</Carousel>

										<View style = {styles.payContainer}>
												<Text style = {{fontWeight:'bold',fontSize:20}}>
														{'Valor: R$ ' + (this.state.discountApplied ? this.state.discountPicPayPrice : this.state.PicPayPrice) }
												</Text>

											{/* <View style = {{flexDirection:'row'}}>
												<Text style = {{fontWeight:'bold',fontSize:17}}>
													{'R$ ' + (this.state.product ? this.state.product.price : '') + ' - Pago para '}
												</Text>
												<Image
													style = {{width:37,height:29,marginLeft:3}}
													source = {{uri:this.state.product? this.state.product.logo : ''}}>

												</Image>
											</View> */}
											<View style = {{flexDirection:'row',marginTop:5}}>
												<Text style = {{fontWeight:'bold',fontSize:17}}>
													{'Pago pelo '}
												</Text>
												<Image
													style = {{width:61,height:20,marginLeft:3,marginTop:5}}
													source = {{uri:'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/cac%2Fpicpay-logo.png?alt=media&token=dbcdc019-adda-4b85-8573-668a886e72fc'}}>
												</Image>
											</View>
										</View>
										<View style ={{flexDirection : 'row',alignItems:'flex-end',alignSelf:'center', marginTop:theme.height * 0.03,marginBottom:theme.height * 0.02}}>
											<TextInput
													placeholder = {this.state.placeholderCoupon}
													style={{borderBottomWidth: 0.8, borderBottomColor: '#8f8f8f', height: 40}}
													onChangeText = {this.receivePromotionalCode.bind(this)}
													width = {theme.width*0.68}
												/>
												<TouchableOpacity
													disabled={this.state.settingPromotionalCode}
													style = {{zIndex : 1}}
													onPress = {this.setPromotionalCode.bind(this)}
												>
													<View style = {{zIndex:1,backgroundColor:this.state.product?this.state.product.colors[0]: null,padding:theme.width * 0.03,borderRadius:7,marginLeft:theme.width*0.02}}>
														{
															this.state.settingPromotionalCode ?
															<ActivityIndicator size="small" color={(this.state.product ? this.getTxtColor(this.state.product.colors[0]) : 'black')} /> :
															<Text style = {{color:(this.state.product ? this.getTxtColor(this.state.product.colors[0]) : 'black'), fontWeight:'bold'}}>{'OK'}</Text>
														}
													</View>
												</TouchableOpacity>
										</View>
										{
											this.state.warning != null &&
											<View style = {{width:theme.width * 0.78,alignSelf:'center'/* ,borderColor:'black',borderWidth:1 */}}>
												<Text style = {{fontWeight:'bold'}}>{this.state.warning}</Text>
											</View>
										}
										<View style = {styles.descriptionContainer}>
											<Text style = {styles.descriptionWord}>{'Descrição:'}</Text>
											<Text style = {styles.description}> {this.state.product ? this.state.product.description : null} </Text>
										</View>
										{
											this.state.product && this.state.product.customization && this.state.product.customization.length > 0 &&
											<View style = {{marginTop:theme.height * 0.04, padding:20, backgroundColor:this.state.product ? this.state.product.colors[0] : null,elevation: 8, }}>
												<Text style = {{alignSelf:'center', fontSize: 24 , fontWeight: 'bold', color: (this.state.product ? this.getTxtColor(this.state.product.colors[0]) : 'black')}}>{'Opções de Personalização'}</Text>
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
											<View style = {{marginTop: theme.height*0.04}}>
											{
												this.state.product && this.state.product.customization && this.state.product.customization.length > 0 &&
												<View style = {{borderColor : '#8f8f8f', borderBottomWidth:1}}>
													<Text style = {{alignSelf:'center', color:'#8f8f8f', padding:4,paddingLeft:theme.width * 0.04,paddingRight:theme.width * 0.04,textAlign:'center'}}>{'Após preencher as opções confirme a compra:'}</Text>
												</View>
											
											}
												<View style = {styles.footer}>
													{
														this.state.errorMissingValues &&
														<Text style={{color: 'red', marginBottom: 4}}> *Obrigatório o preenchimento de todos os campos </Text>
													}
													<FatBottomedButton
														disabled={this.state.product.stock <= 0}
														text = {'Comprar'}
														backgroundColor = {this.state.product? this.state.product.colors[0] : null}
														color = {this.state.product? this.getTxtColor(this.state.product.colors[0]) : 'black' }borderWidth = {0.1} height = {54}
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
								<View style={{flexDirection: 'row', marginTop: 7, marginBottom: 5,  paddingLeft: 10}}>
									<Image
										style={{width: 12, height: 12, marginTop:4}}
										source={require('../../../../assets/images/arrow-left.png')}
									/>
									<Text style={{marginLeft: 5}}>
										voltar
									</Text>
								</View>
							</TouchableOpacity>
							<Text style={{padding: 5, marginTop: 10, fontWeight: 'bold'}}>
								Está produto não está mais diponível (´;︵;`)
							</Text>
						</View>
				}
				<AwesomeAlert
					show={this.state.showAlert}
					showProgress={false}
					title="Confirmação da compra"
					titleStyle = {{fontWeight:'bold', width:theme.width * 0.8, marginTop:-(theme.height * 0.015),borderTopLeftRadius:6, borderTopRightRadius:6, paddingTop:14,paddingBottom:14,backgroundColor:this.state.product?this.state.product.colors[0]: null,color:this.state.product?this.state.product.colors[1]:'black'}}
					contentContainerStyle = {{ padding:0, width:theme.width,paddingBottom:theme.height*0.01}}
					customView = {
						<View style = {{ padding: theme.width * 0.025 }}>
							{
								!this.state.showLoading &&
								<View>
										<Text style = {{fontWeight:'bold',fontSize:15,textAlign: 'justify', lineHeight: 25,marginLeft:theme.width * 0.007}}>{'Produto : ' + (this.state.product?this.state.product.name : '')}</Text>
										{this.state.product && this.state.product.customization && this.state.product.customization.length > 0 &&
											<Text style = {{ flexDirection:'row',marginTop:theme.height * 0.01}}>
											{	
												this.state.product.customization.map(i =>
											<Text key = {i.label} style = {{fontWeight:'bold',color:'#8f8f8f',fontSize:15,textAlign: 'justify', lineHeight: (this.state.product.customization.length > 0 ? 25 : 0) }}>
												{i.value?(' ' + i.label + ' - ' + i.value + (this.state.product.customization.indexOf(i) === (this.state.product.customization.length - 1) ? '.' : ',')):''}
											</Text>
										)}
											</Text>
										}
										
									{
										this.state.warning != null && 
										<Text style = {{fontWeight:'bold',marginBottom:theme.height * 0.01}}>{this.state.warning}</Text>
									}
									<Text style = {{fontWeight:'bold',marginLeft:theme.width * 0.01,marginBottom:theme.width * 0.02,marginTop:theme.width * 0.04,fontSize:15}}>{'Informações:'}</Text>
									{/* <TouchableOpacity onPress = { () => this.setState({ picPay : false, directlyToStore: true })}>
										<View
											style = {{
												borderColor:'#8f8f8f',
												borderWidth:(this.state.directlyToStore ? 3 : 1),
												paddingLeft:10,
												paddingRight:7,
												paddingTop:15,
												paddingBottom:10,
												marginLeft:5,
												marginRight:5,
												marginTop:10,
												borderRadius:25
											}}
										>
											<View
												style = {{
													flexDirection:'row',
												}}
											>
												<Text
													style = {{fontWeight:'bold',fontSize:15,marginBottom:7}}
													>{'R$ ' + (this.state.product ? this.state.product.price : '') + ' - Pago diretamente para '}
												</Text>
												<Image
													style = {{width:37,height:29,marginLeft:3}}
													source = {{uri:this.state.product? this.state.product.logo : null}}>
												</Image>
											</View>
											<Text style = {{textAlign: 'justify',color:'#8f8f8f',fontWeight:'700'}}>{'Seu telefone será enviado para ' + (this.state.product? this.state.product.sid : 'o reponsável') +
											' entrar em contato e agendar hora e local para pagamento presencial.A compra será confirmada após essa etapa.'}</Text>
										</View>
									</TouchableOpacity> */}

										<View
											style = {{
												borderColor:'#21c25e',
												borderWidth:4,
												paddingLeft:10,
												paddingRight:7,
												paddingTop:15,
												paddingBottom:10,
												marginTop:10,
												borderRadius:25
											}}
										>
											<View
												style = {{
													flexDirection:'column',
												}}
											>
											
												
													<View style={{ flexDirection: 'row'}}>
														<Text
															style = {{fontWeight:'bold',fontSize:15,marginBottom:7}}
														>
															{'R$ ' +(this.state.discountPicPayPrice != null ? this.state.discountPicPayPrice : this.state.PicPayPrice) + ' - Pago pelo '}
														</Text>
														<Image
															style = {{width:61,height:20,marginLeft:3,marginTop:0}}
															source = {{uri:'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/cac%2Fpicpay-logo.png?alt=media&token=dbcdc019-adda-4b85-8573-668a886e72fc'}}>
														</Image>
													</View>
													{
														this.state.discountApplied &&
														<Text style ={{fontWeight:'bold', marginBottom:theme.height*0.01}}>{'Valor com desconto'}</Text>
													}

											</View>
											<Text style = {{textAlign: 'justify',color:'#8f8f8f',fontWeight:'700',lineHeight:20}}>{'O pagamento é rapidamente efetivado, com opções de parcelamento oferecidas pelo PicPay. '+(this.state.product? this.state.product.sid : 'o reponsável')+
															' receberá automaticamente o comprovante de seu pagamento e a retirada do produto será realizada com o mesmo.' }</Text>
										</View>

								</View>
							}
							{
								this.state.showLoading &&
								<View>
									<ActivityIndicator size="large" color={this.state.product? this.state.product.colors[0] : theme.primary} />
									<View style={{flexDirection: 'row', width: theme.width * 0.7, wordWrap: 'wrap' , flexWrap: 'wrap'}}>
										<Text style={{fontStyle: 'italic'}}>
											HOOOOOOLD!
										</Text>
										<Text style={{wordWrap: 'break-word' }}>
											Estamos preparando o seu pedido ;)
										</Text>
									</View>
								</View>
							}
						</View>

					}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showCancelButton = {this.state.showCancelButton}
					showConfirmButton={this.state.showConfirmButton}
					confirmText="Confirmar"
					confirmButtonColor={this.state.product?this.state.product.colors[0] : '#03fc77'}
					confirmButtonTextStyle={ this.state.product? this.getTxtColor(this.state.product.colors[0]) : 'black'}
					cancelText = "Cancelar"
					onCancelPressed = {() => {
						this.setState({ showAlert: false })
					}}
					onConfirmPressed={this.state.discountApplied ? this.discountedTickets : this.ticketsRegister}
				/>
				<FlashMessage ref={'buyMessage'} style={{ zIndex: 99 }} duration={2500}/>
			</KeyboardAvoidingView>
		)
	}
}


const styles = StyleSheet.create({
	logoContainer : {
		width:theme.width * 0.8,
		height:theme.height * 0.1,
		alignSelf:'center',
		justifyContent:'center',
	},
	productName : {
		fontWeight:'bold',
		fontSize:25,
		alignSelf:'center',
		textAlign:'justify'
	},

	payContainer : {
		width:theme.width * 0.9,
		alignSelf:'center',
		marginTop:theme.height*0.05,
		marginLeft:theme.width * 0.02
	},
	descriptionContainer : {
		width:theme.width * 0.92,
		alignSelf:'center',
		paddingLeft:15,
		paddingRight:17,
		marginTop: theme.height * 0.03,
		borderRadius:25,
		paddingBottom:20,
		paddingTop:20,
		elevation:3,
		backgroundColor: 'white',
	},
	description : {
		flex:1,
		fontSize:15,
		textAlign: 'justify',
		lineHeight: 25,
	},
	descriptionWord : {
		fontWeight:'bold',
		fontSize:16,
		marginBottom:theme.height * 0.004
	},
	productDetails : {
		borderBottomColor:'#8f8f8f',
		borderBottomWidth:0.8,
		width: theme.width * 0.8,
		paddingRight:10,
		paddingLeft:10,
		paddingBottom:5,
		paddingTop:5
	},
	footer : {
		width: theme.width,
		alignSelf:'center',
		marginBottom:theme.height*0.04,
		borderTopColor:'#8f8f8f',
		paddingLeft:theme.width*0.06,
		paddingRight:theme.width*0.06,
		paddingTop:theme.height*0.03
	}
});
