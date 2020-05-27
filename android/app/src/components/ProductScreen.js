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
		}
	}

	componentDidMount(): void {
		console.log('ih rapazinho', this.props.navigation.getParam('iid'));
		this.state.iidProduct =  this.props.navigation.getParam('iid');
		heimdallr.getProduct(this.state.iidProduct).then((resolve) => {
			resolve.price = (parseFloat(resolve.price) * 1.16).toFixed(2);
			this.setState({product: resolve, productImages: resolve.images, PicPayPrice : resolve.price});
		})


	}

	renderPage(image, index) {
		return (
            <View key={index} style = {{ height:theme.height * 0.58,width:theme.width * 0.8,alignSelf:'center',marginBottom:theme.height * 0.03}}>
                <Image style={{flex: 1, resizeMode: 'contain', width: theme.width * 0.85, height:theme.height * 0.55, alignSelf:'center' }} source={{ uri: image }} />
            </View>
        );
	}
	openAlert = () =>{
		this.setState({showAlert : true});
	}

	ticketsRegister = async () => {
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
			console.warn('VOu ir pelo pic',heimdallr.user_name.split(' ')[0], heimdallr.user_name.split(' ')[1], heimdallr.email );
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
			params.url = 'PicPay';
			params.description = this.state.product.customization;
			params.payment = 'PicPay';
			params.product_price = this.state.PicPayPrice;
			params.referenceId = await heimdallr.getUID();


			axios({
			    method: 'post',
			    url: 'https://appws.picpay.com/ecommerce/public/payments',
			    headers: {'x-picpay-token': '3782eb80-9b55-4611-a81a-111555fc39ec'},
			    data: {
				    "referenceId": params.referenceId,
				    "callbackUrl": "http://www.spottedutfpr.com.br/callback",
				    "value": this.state.PicPayPrice,
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
					this.setState({showAlert : false, showLoading: false, showConfirmButton: true, showCancelButton: true});
					showMessage({
						message: "Compra realizada com sucesso",
						type: "success",
						icon: 'success'
					});
			    },
			    (reject) => {
					console.log('tava esperando: ', reject);
				    this.setState({showAlert : false, showLoading: false, showConfirmButton: true, showCancelButton: true});
				    showMessage({
					    message: "Erro ao realizar a compra",
					    type: "danger",
					    icon: 'danger'
				    });
			    }
			);
		

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



	render() {
		return (
			<KeyboardAvoidingView style={{flex: 1}}>
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
											style = {{width:90,height:70,alignSelf:'center'}}
											source={{ uri:this.state.product? this.state.product.logo : null}}>
										</Image>
									</View>
									<View style = {{marginTop:20,marginBottom:15,width:theme.width*0.9,alignSelf:'center'}}>
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
													{'Valor: R$ ' + this.state.PicPayPrice }
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

									<View style = {styles.descriptionContainer}>
										<Text style = {styles.descriptionWord}>{'Descrição:'}</Text>
										<Text style = {styles.description}> {this.state.product ? this.state.product.description : null} </Text>
									</View>
									<View style = {{marginTop:theme.height * 0.04, padding:20, backgroundColor:this.state.product ? this.state.product.colors[0] : null,elevation: 8, }}>
										<Text style = {{alignSelf:'center', fontSize: 24 , fontWeight: 'bold', color: (this.state.product ? this.getTxtColor(this.state.product.colors[0]) : 'black')}}>{'Opções de Personalização'}</Text>
									</View>
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
											<Text style = {{alignSelf:'center', color:'#8f8f8f', padding:4,paddingLeft:theme.width * 0.04,paddingRight:theme.width * 0.04,textAlign:'center'}}>{'Após preencher as opções confirme a compra:'}</Text>
											<View style = {styles.footer}>
												{
													this.state.errorMissingValues &&
													<Text style={{color: 'red', marginBottom: 4}}> *Obrigatório o preenchimento de todos os campos </Text>
												}
												<FatBottomedButton
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
										<Text style = {{ flexDirection:'row',marginTop:theme.height * 0.01}}>
											{	this.state.product &&
												this.state.product.customization.map(i =>
											<Text key = {i.label} style = {{fontWeight:'bold',color:'#8f8f8f',fontSize:15,textAlign: 'justify', lineHeight: 25}}>
												{i.value?(' ' + i.label + ' - ' + i.value + (this.state.product.customization.indexOf(i) === (this.state.product.customization.length - 1) ? '.' : ',')):''}
											</Text>
										)}
										</Text>
								
									{
										this.state.payment === 'true' &&
										<View style = {{backgroundColor:'red'}}>
											<Text style = {{fontWeight:'bold'}}>
												{'Escolha uma forma de pagamento'}
											</Text>
										</View>
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
													flexDirection:'row',
												}}
											>
												<Text
													style = {{fontWeight:'bold',fontSize:15,marginBottom:7}}
													>{'R$ ' + this.state.PicPayPrice + ' - Pago pelo '}
												</Text>
												<Image
													style = {{width:61,height:20,marginLeft:3,marginTop:0}}
													source = {{uri:'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/cac%2Fpicpay-logo.png?alt=media&token=dbcdc019-adda-4b85-8573-668a886e72fc'}}>
												</Image>
											</View>
											<Text style = {{textAlign: 'justify',color:'#8f8f8f',fontWeight:'700',lineHeight:20}}>{'O pagamento é efetivado na hora, com opções de parcelamento oferecidas pelo PicPay. '+(this.state.product? this.state.product.sid : 'o reponsável')+
															' receberá automaticamente o comprovante de seu pagamento e entrará em contato para marcar a entrega do produto.' }</Text>
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
					onConfirmPressed={this.ticketsRegister}
				/>
				<FlashMessage ref={'buyMessage'} style={{ zIndex: 99 }} duration={2500}/>
			</KeyboardAvoidingView>
		)
	}
}


const styles = StyleSheet.create({
	logoContainer : {
		width:theme.width * 0.8,
		height:theme.height * 0.12,
		alignSelf:'center',
		justifyContent:'center'

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
		borderTopWidth:1,
		paddingLeft:theme.width*0.06,
		paddingRight:theme.width*0.06,
		paddingTop:theme.height*0.03
	}
});
