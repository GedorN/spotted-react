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
} from 'react-native';

import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../components/General/Theme";
import Carousel from 'react-native-banner-carousel';
import CustomizationOptions from './CustomizationOptions';
import FatBottomedButton from'./buttons/FatBottomedButton';
import CustomizationTextArea from './CustomizationTexArea';
import AwesomeAlert from "react-native-awesome-alerts";


export default class ProductScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			iidProduct: '',
			product : null,
			productImages: null,
			customizationDetails: [],
			description : '',
			showAlert : false,
			PicPay : null,
		}
	}

	componentDidMount(): void {
		console.warn('ih rapaz', this.props.navigation.getParam('iid'));
		this.state.iidProduct =  this.props.navigation.getParam('iid');
		let result = heimdallr.getProduct(this.state.iidProduct);
		result.then((resolve) => {
			this.setState({product: resolve});
			this.setState({productImages: resolve.images});

			this.state.product.customization.forEach((item) => {
				let params = {};
				params.label = item.label;
				params.selectedOption = null;
				this.state.customizationDetails.push(params);

			})
		})
	}

	

	renderPage(image, index) {
        return (
            <View key={index} style = {{ height:theme.height * 0.58}}>
                <Image style={{ width: theme.width * 0.85,height:theme.height * 0.55,alignSelf:'center'  }} source={{ uri: image }} />
            </View>
        );
	}

	renderFooter = () => {
		if (this.state.comments && this.state.comments.length > 0 && !this.state.endPulling) {
			return (
				<View style={{marginBottom: 70}}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			);
		}
		return <View></View>;
	}

	getOptionCustomization = (i,labelOption) => {

		this.state.customizationDetails.forEach((item) => {
			if(item.label === labelOption){
				if(this.state.customizationDetails.indexOf(item) === this.state.customizationDetails.length-1){
					item.selectedOption = (i + '.');
				}
				else{
					item.selectedOption = (i + ',');
				}
	
			}
		})


		let saveProduct = '';
		this.state.customizationDetails.forEach((item) => {
			
			if(item.selectedOption != null){
			
				saveProduct = ( saveProduct + ' ' + item.label + ' '+ item.selectedOption );
				
			}
			this.setState({description : saveProduct });

		})
	}

	openAlert = () =>{

		this.setState({showAlert : true});
	}

	ticketsRegister = async () => {

		this.setState({showAlert : false});

		if(this.state.description != '' && this.state.PicPay != null){

		let params = {};
		params.colors = this.state.product.colors;
		params.date = await heimdallr.getServerTime();
		params.iid = this.state.iidProduct;
		params.image = this.state.productImages[0];
		params.product_name = this.state.product.name;
		params.status = 'pending';
		params.store_name = this.state.product.sid;
		params.uid = heimdallr.user_id;
		params.url = 'PicPay';
		params.description = this.state.description;
		params.payment = (this.state.PicPay === true? 'PicPay' : this.state.product.sid);
	
		heimdallr.saveTicketsRegister(params);
		/* 
		this.setState({description: ''});
		this.setState({PicPay : null});  */
		}
		
		/* this.setState({PicPay : null}); */
	}

	

	render() {
		return (
			<KeyboardAvoidingView
				style={{zIndex: 0, flex: 1}}
			>
			<View style={{flex: 1}}>
				<View >
                <FlatList
					ListHeaderComponent = {() =>
						<View>
							<View
								style = {styles.logoContainer}>
								<Image
									style = {{width:90,height:70,alignSelf:'center'}}
									source={{ uri:this.state.product? this.state.product.logo : null}}>
								</Image>
							</View>
							<View style = {{marginTop:20,marginBottom:15}}>
								<Text
								style = {styles.productName}
								> {this.state.product? this.state.product.name : null}</Text>
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
										{'R$ ' + (this.state.product ? this.state.product.price : '') + ' - Pago diretamente para '}
									</Text>
									<Image
										style = {{width:37,height:29,marginLeft:3}}
										source = {{uri:this.state.product? this.state.product.logo : null}}>

									</Image>
								</View>
								<View style = {{flexDirection:'row',marginTop:5}}>
									<Text style = {{fontWeight:'bold',fontSize:17}}>
										{'R$ ' + (this.state.product? this.state.product.PicPayPrice : '') + ' - Pago pelo '}
									</Text>
									<Image
										style = {{width:61,height:20,marginLeft:3,marginTop:5}}
										source = {{uri:this.state.product? this.state.product.PicPayLogo : null}}>
									</Image>
								</View>
							</View>
							<View style = {{width:theme.width * 0.9,alignSelf:'center',marginTop:theme.height * 0.02}}>
								<Text style = {{color:'#8f8f8f',fontSize:15,textAlign: 'justify', lineHeight: 25}}>
									{'Caracaterísticas escolhidas:' + (this.state.description === ''? ' Nenhuma por enquanto' :this.state.description) }
								</Text>
							</View>

							<View style = {{ width: theme.width * 0.9,alignSelf:'center',marginTop:theme.height*0.03}}>
							<FatBottomedButton text = {'Comprar'} backgroundColor = {this.state.product? this.state.product.colors[0] : null}
												color = {this.state.product? this.state.product.colors[1] : null }borderWidth = {0.1} height = {48}
												onTap = {this.openAlert.bind(this)}/>
							</View>
							<View style = {styles.descriptionContainer}>
								<Text style = {styles.descriptionWord}>{'Descrição:'}</Text>
								<Text style = {styles.description}>{this.state.product? this.state.product.Description : null}</Text>
							</View>
							<View style = {{marginTop:theme.height * 0.04, padding:20, backgroundColor:this.state.product? this.state.product.colors[0] : null,elevation: 8, }}>
								<Text style = {{alignSelf:'center', fontSize:24,fontWeight:'bold',color: (this.state.product?this.state.product.colors[1]:'black')}}>{'Opções de Personalização'}</Text>
							</View>
						</View>

					}
                    data = {this.state.product ? this.state.product.customization : null}
					renderItem={ ({item}) =>

						<View style = {{alignSelf:'center'}} >

							<CustomizationOptions customizationCallback = {this.getOptionCustomization}  colors = {this.state.product.colors} custom = {item}/>

						</View>
					}
					numColumns={1}
                    keyExtractor={item => item.label}
					onEndReachedThreshold={0.3}
					ListFooterComponent={ () =>
						<View>
							{this.state.product ? (
								<View style = {{marginTop:20}}>
									<Text style = {{color:'#8f8f8f',marginLeft:theme.width * 0.05}}>{'Preencha apenas os campos em que desejar escrita :'}</Text>
									<View style = {{borderTopColor:'#8f8f8f',borderTopWidth:0.5,marginTop:theme.height * 0.005,paddingTop:theme.height * 0.02}}>
										<CustomizationTextArea  customizationCallback = {this.getOptionCustomization}  customization ={this.state.product.customization}/>
									</View>
								</View>) : null}
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
					contentContainerStyle = {{padding:0,width:theme.width}}
					customView = {
						<View>
							<View style = {styles.productDetails}>
								<Text style = {{textAlign: 'justify',lineHeight: 25,color:'black',fontWeight:'700'}}>{'Detalhes do produto:'+ (this.state.description === ''? ' Nenhum detalhe selecionado.':this.state.description)}</Text>
							</View>
							<Text style = {{color:'#8f8f8f',fontWeight:'700',marginLeft:10,marginBottom:7,marginTop:10}}>{'Selecione a forma de pagamento :'}</Text>
							<TouchableOpacity onPress = { () => this.setState({PicPay : false})}
							style = {{borderColor:'#8f8f8f',borderWidth:(this.state.PicPay === false? 3:1),paddingLeft:10,paddingRight:7,paddingTop:15,paddingBottom:10,marginLeft:5,marginRight:5,marginTop:10,borderRadius:25}}>
								<View style = {{flexDirection:'row'}}>
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
							</TouchableOpacity>
							<TouchableOpacity onPress = { () => this.setState({PicPay : true})}
							style = {{borderColor:'#21c25e',borderWidth:(this.state.PicPay === true? 3:1),paddingLeft:10,paddingRight:7,paddingTop:15,paddingBottom:10,marginLeft:5,marginRight:5,marginTop:10,borderRadius:25}}>
								<View style = {{flexDirection:'row'}}>
									<Text
										style = {{fontWeight:'bold',fontSize:15,marginBottom:7}}
										>{'R$ ' + (this.state.product? this.state.product.PicPayPrice : '') + ' - Pago pelo '}
									</Text>
									<Image
										style = {{width:61,height:20,marginLeft:3,marginTop:0}}
										source = {{uri:this.state.product? this.state.product.PicPayLogo : null}}>
									</Image>
								</View>
								<Text style = {{textAlign: 'justify',color:'#8f8f8f',fontWeight:'700'}}>{'O pagamento é efetivado na hora, '+(this.state.product? this.state.product.sid : 'o reponsável')+
												' receberá automaticamente o comprovante de seu pagamento e a confirmação da sua compra. Assim que seu produto chegar entrarão em contato.' }</Text>
							</TouchableOpacity>
						</View>

					}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showCancelButton = {true}
					showConfirmButton={true}
					confirmText="Confirmar"
					confirmButtonColor={this.state.product?this.state.product.colors[0]: 'green'}
					cancelText = "Cancelar"
					onCancelPressed = {() => {
						this.setState({ showAlert: false })
					}}
					onConfirmPressed={this.ticketsRegister}
				/>
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
		width:theme.width * 0.9,
		alignSelf:'center',
		padding:10,
		marginTop: theme.height * 0.03
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
	}
});
