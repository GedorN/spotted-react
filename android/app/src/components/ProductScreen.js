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
			picPay : false,
			directlyToStore: false,
			PicPayPrice : '',
			payment: false,
			errorMissingValues: false,
		}
	}

	componentDidMount(): void {
		console.log('ih rapazinho', this.props.navigation.getParam('iid'));
		this.state.iidProduct =  this.props.navigation.getParam('iid');
		heimdallr.getProduct(this.state.iidProduct).then((resolve) => {
			this.setState({product: resolve, productImages: resolve.images, PicPayPrice : (parseFloat(resolve.price) * 1.1).toFixed(2)});
		})


	}

	renderPage(image, index) {
        return (
            <View key={index} style = {{ height:theme.height * 0.58}}>
                <Image style={{ width: theme.width * 0.85, height:theme.height * 0.55, alignSelf:'center' }} source={{ uri: image }} />
            </View>
        );
	}
	openAlert = () =>{
		this.setState({showAlert : true});
	}

	ticketsRegister = async () => {
		if (this.state.directlyToStore ){
			this.setState({showAlert : false});

			let params = {};
			params.colors = this.state.product.colors;
			params.date = await heimdallr.getServerTime();
			params.iid = this.state.iidProduct;
			params.image = this.state.productImages[0];
			params.product_name = this.state.product.name;
			params.status = 'pending';
			params.store_name = this.state.product.sid;
			params.uid = heimdallr.user_id;
			params.description = this.state.product.customization;
			params.payment = (this.state.picPay ? 'PicPay' : this.state.product.sid);

			heimdallr.saveTicketsRegister(params);
			showMessage({
				message: "Compra realizada com sucesso",
				type: "success",
				icon: 'success'
			});
		} else if (this.state.picPay ) {
			console.log('VOu ir pelo pic',heimdallr.user_name.split(' ')[0], heimdallr.user_name.split(' ')[1], heimdallr.email );
			this.setState({showAlert : false});

			let params = {};
			params.colors = this.state.product.colors;
			params.date = await heimdallr.getServerTime();
			params.iid = this.state.iidProduct;
			params.image = this.state.productImages[0];
			params.product_name = this.state.product.name;
			params.status = 'pending';
			params.store_name = this.state.product.sid;
			params.uid = heimdallr.user_id;
			params.description = this.state.product.customization;
			params.payment = (this.state.picPay ? 'PicPay' : this.state.product.sid);
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
					showMessage({
						message: "Compra realizada com sucesso",
						type: "success",
						icon: 'success'
					});
			    },
			    (reject) => {
					console.log('tava esperando: ', reject);
				    showMessage({
					    message: "Erro ao realizar a compra",
					    type: "danger",
					    icon: 'danger'
				    });
			    }
			);
		}

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


	buttonEnabled = () => {
		if (this.state.product.customization.map((p) => p.value).some((fp) => {return fp === undefined})) {
			this.setState( { errorMissingValues: true });
		} else {
			this.openAlert();
		}
	}



	render() {
		return (
			<KeyboardAvoidingView style={{zIndex: 0, flex: 1}} >
				<View style={{flex: 1}}>
					<View>
	                <FlatList
						ListHeaderComponent = {() =>
							<View>
								<View style = {styles.logoContainer}>
									<Image
										style = {{width:90,height:70,alignSelf:'center'}}
										source={{ uri:this.state.product? this.state.product.logo : null}}>
									</Image>
								</View>
								<View style = {{marginTop:20,marginBottom:15}}>
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
									<Text style = {{color:'#8f8f8f', fontWeight:'bold',fontSize:19,marginBottom:4}}>
										{'Valor:'}
									</Text>
									<View style = {{flexDirection:'row'}}>
										<Text style = {{fontWeight:'bold',fontSize:17}}>
											{'R$ ' + (this.state.product ? this.state.product.price : '') + ' - Pago para '}
										</Text>
										<Image
											style = {{width:37,height:29,marginLeft:3}}
											source = {{uri:this.state.product? this.state.product.logo : ''}}>

										</Image>
									</View>
									<View style = {{flexDirection:'row',marginTop:5}}>
										<Text style = {{fontWeight:'bold',fontSize:17}}>
											{'R$ ' + this.state.PicPayPrice + ' - Pago pelo '}
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
										<Text style = {{alignSelf:'center', color:'#8f8f8f', fontWeight:'bold', padding: 4}}>{'Após preencher as opções necessárias confirme a compra :'}</Text>

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
					titleStyle = {{fontWeight:'bold',width:theme.width * 0.8,marginTop:-(theme.height * 0.015),borderTopLeftRadius:6, borderTopRightRadius:6, paddingTop:14,paddingBottom:14,backgroundColor:this.state.product?this.state.product.colors[0]: null,color:this.state.product?this.state.product.colors[1]:'black'}}
					contentContainerStyle = {{ padding:0, width:theme.width}}
					customView = {
						<View style = {{ padding: 10 }}>
							<Text style = {{width:theme.width * 0.8,paddingRight:7,paddingLeft:7, alignSelf:'center',marginTop:theme.height * 0.01,flexDirection:'row',textAlign: 'justify',borderBottomColor:'#8f8f8f',borderBottomWidth:0.5}}>
								<Text style = {{color:'#8f8f8f',fontSize:15,textAlign: 'justify', lineHeight: 25}}>{'Caracaterísticas escolhidas:'}</Text>
								{	this.state.product &&
									this.state.product.customization.map(i =>
								<Text key = {i.label} style = {{color:'#8f8f8f',fontSize:15,textAlign: 'justify', lineHeight: 25}}>
									{i.value?(' ' + i.label + ' ' + i.value + (this.state.product.customization.indexOf(i) === (this.state.product.customization.length - 1) ? '.' : ',')):''}
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
							<Text style = {{color:'#8f8f8f',fontWeight:'700',marginLeft:10,marginBottom:7,marginTop:7}}>{'Selecione a forma de pagamento :'}</Text>
							<TouchableOpacity onPress = { () => this.setState({ picPay : false, directlyToStore: true })}>
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
							</TouchableOpacity>
							<TouchableOpacity onPress = { () => this.setState({ picPay : true, directlyToStore: false })}>
								<View
									style = {{
										borderColor:'#21c25e',
										borderWidth:(this.state.picPay ? 3 : 1),
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
											>{'R$ ' + this.state.PicPayPrice + ' - Pago pelo '}
										</Text>
										<Image
											style = {{width:61,height:20,marginLeft:3,marginTop:0}}
											source = {{uri:'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/cac%2Fpicpay-logo.png?alt=media&token=dbcdc019-adda-4b85-8573-668a886e72fc'}}>
										</Image>
									</View>
									<Text style = {{textAlign: 'justify',color:'#8f8f8f',fontWeight:'700'}}>{'O pagamento é efetivado na hora, '+(this.state.product? this.state.product.sid : 'o reponsável')+
													' receberá automaticamente o comprovante de seu pagamento e a confirmação da sua compra. Assim que seu produto chegar entrarão em contato.' }</Text>
								</View>
							</TouchableOpacity>
						</View>

					}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showCancelButton = {true}
					showConfirmButton={true}
					confirmText="Confirmar"
					confirmButtonColor={this.state.directlyToStore || this.state.picPay ? this.state.product.colors[0]:'#d0d0d0'}
					confirmButtonTextStyle={{color: this.state.directlyToStore || this.state.picPay ? this.getTxtColor(this.state.product.colors[0]):'black'}}
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
		alignSelf:'center'},

	payContainer : {
		width:theme.width * 0.9,
		alignSelf:'center'
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
