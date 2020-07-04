import React from 'react';

import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Image,
	Modal,
	Clipboard,
	Linking,
	ScrollView
} from 'react-native'

import Ripple from 'react-native-material-ripple';


import theme from "../../../../../components/General/Theme";
import moment from "moment";
import 'moment/locale/pt-br';
import FatBottomedButton from "../buttons/FatBottomedButton";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";

export default class LikeARollingTicketViewer extends React.Component {
	constructor(props) {
		super (props);
		this.state = {
			opacityValue: 0.7,
			opacityValueScrolling: 1,
			ticketDate: '',
			showModal: false,
			copiedText: false,
		}
	}
	componentDidMount(): void {
		console.log('ticket recebido: ', this.props.ticket);
		let formatDate = moment(this.props.ticket.date).locale('pt-br').format('DD/MM/YYYY');
		this.setState({ticketDate : formatDate });

	}

	disableModal = () => {
		this.setState({ showModal: false });
	}

	goToProductScreen = () => {
		if(this.state.showModal === true){
			this.setState({showModal:false})
		}
		this.props.navigation.push('ProductScreen', {
			iid: this.props.ticket.iid,
		});
	}

	getChipColor = () => {
		if (this.props.ticket.status === 'Pendente') {
			return '#8f8f8f';
		} else if (this.props.ticket.status === 'Pago') {
			return 'green';
		} else if (this.props.ticket.status === 'Entregue') {
			return this.props.ticket.colors[0];
		}

		return '#8f8f8f';
	}

	copyText = () => {
		Clipboard.setString(this.props.ticket.referenceId);
		this.setState({ copiedText: true });
	}

	redirectToPay = () => {
		Linking.openURL(this.props.ticket.url);
	}

	render() {
		return (
			<View style={{flex: 1, borderRadius: 25}}>
				<View style={styles.product_info}>
					<Ripple
						rippleOpacity={0.42}
						rippleColor="rgba(143, 143, 143, .8)"
				        onPress = {() => this.setState({showModal : true})}
						activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue}
					>
						<View style = {styles.ticketHeader}>
							<Image
								style = {styles.ticketLogo}
								source ={{uri : this.props.ticket.store_logo }}
							/>
						</View>
						<View style = {styles.product_info_body} >
							<View style={{flexDirection: 'column'}}>
								<View style = {{width:theme.width*0.27,alignSelf:'center'}}>
									<Text style = {{...styles.productName, color: this.props.ticket.colors[0]}}
												    ellipsizeMode='tail' numberOfLines={1}>
										{ this.props.ticket? this.props.ticket.product_name : '' }
									</Text>
								</View>
								<TouchableOpacity  onPress = {this.goToProductScreen.bind(this)}>
									<View style = {{width:theme.width * 0.3,height:theme.height * 0.17}}>
										<Image
											style = {styles.productImage}
											source ={{uri : this.props.ticket.image }}
										/>
									</View>
								</TouchableOpacity>
							</View>
							<View style = {{flexDirection:'column'}}>
								<View style = {styles.ticketDetails}>
									<View style = {{...styles.ticketView,width:theme.width*0.24}}>
										<Text style = {{...styles.ticketLetter,color:this.props.ticket.colors[0]}}>{'Data'}</Text>
										<Text style = {styles.dateLetter}>{this.state.ticketDate}</Text>
									</View>
									<View style = {{...styles.ticketView, width:theme.width * 0.3 }}>
										<Text style = {{...styles.ticketLetter, color:this.props.ticket.colors[0]}}>{'Pagamento'}</Text>
										<Text style = {{...styles.paymentLetter, textAlign:'justify'}}>{'R$ ' + (this.props.ticket ? this.props.ticket.product_price : '')}</Text>
										<Text style = {styles.paymentLetter}> {this.props.ticket ? this.props.ticket.payment : null} </Text>
									</View>
								</View>
								<View style = {{...styles.ticketStatus, backgroundColor: this.getChipColor()}} >
									<Text style = {{
										alignSelf:'center',
										fontWeight:'bold',
										color: heimdallr.getTxtColor(this.getChipColor()),
										fontSize:18,
										marginBottom:theme.height*0.002
									}}
									>
										{(this.props.ticket ? this.props.ticket.status : null)}
									</Text>
								</View>
							</View>
						</View>
					</Ripple>
				</View>
				<Modal
		            hardwareAccelerated={true}
		            animationType='fade'
		            transparent={true}
		            visible={this.state.showModal}
		            onRequestClose={() => {
			            this.disableModal();
		            }}
		            style={{ height: 50, width: theme.width * 0.5 }}
	            >
		            <View style={styles.centeredView}>

			            <View style={styles.modalContainer}>
							<View style = {{ ...styles.modalHeader , backgroundColor: this.props.ticket.colors[0]}}>
								<TouchableOpacity onPress={() => {this.disableModal()}}>
								<View style = {{width:theme.width * 0.15,height:theme.height*0.05,alignSelf:'flex-end'}}>
									<Image
										style = {{width: 15, height: 15,opacity:0.4, alignSelf: 'flex-end', tintColor: heimdallr.getTxtColor(this.props.ticket.colors[0])}}
										source = {require('../../../../../assets/images/times-solid.png')}
									/>
								</View>
								</TouchableOpacity>
								<Text style = {{marginTop:-(theme.height *  0.025),fontSize:20, fontWeight:'bold', alignSelf:'center', color: this.props.ticket.colors[1] }}>{'Detalhes do pedido'}</Text>
							</View>
							<View style = {{ height: theme.height * 0.7 }}>
								<ScrollView style = {{height: theme.height * 0.6, marginTop:theme.height * 0.07}}
									showsVerticalScrollIndicator = {false}>
									<View style = {{marginTop:theme.height*0.02}}>
										<Text style = {{fontWeight:'bold',fontSize:15,marginBottom:4}}>
										{'Produto : ' + this.props.ticket.product_name }</Text>
										{
											this.props.ticket && this.props.ticket.description && this.props.ticket.description.length > 0 &&
											<Text style = {{flexDirection:'row',textAlign: 'justify' ,marginBottom:10}}>
											{
												this.props.ticket.description.map(i =>
													<Text key = {i.label} style = {styles.modalProduct}>
													{i.value?(' ' + i.label + ' - ' + i.value + (this.props.ticket.description.indexOf(i) === (this.props.ticket.description.length - 1) ? '.' : ',')):''}
													</Text>
													)
											}
											</Text>
										}
										<Text style = {styles.modalLetter}>{'Data: ' +this.state.ticketDate }</Text>
										<Text style = {styles.modalLetter}>
										{'Pagamento: ' +this.props.ticket.payment+  ' -  R$ ' +this.props.ticket.product_price }</Text>
										<TouchableOpacity onPress={this.copyText.bind(this)}>
											<View style={{flexDirection: 'row', alignItems: 'flex-start', alignContent: 'center',marginTop:theme.height * 0.01}}>
												<Image
													style={{width: 18, height: 20, tintColor: '#8f8f8f'}}
													source={require('../../../../../assets/images/copy-regular.png')}
												/>
												<Text style = {{fontSize:12, color:'#8f8f8f', marginLeft: 4}}>{this.props.ticket.referenceId}</Text>
											</View>
										</TouchableOpacity>
										{
											this.state.copiedText &&
											<Text style={{fontSize: 12, color: 'green', alignSelf: 'center'}}> copiado</Text>
										}
										<Text style = {{...styles.modalStatus,color:this.props.ticket.colors[0]}}>{'Status: ' + this.props.ticket.status}</Text>
									</View>
									<TouchableOpacity  onPress = {this.goToProductScreen.bind(this)}>
										<View style = {{width:theme.width*0.5,height:theme.height * 0.3,alignSelf:'center',marginTop:theme.height * 0.02,
										paddingBottom:theme.height * 0.02}}>
											<Image
													style = {styles.modalImage}
													source ={{uri : this.props.ticket.image }}
												/>
										</View>
									</TouchableOpacity>
									{
										this.props.ticket.payment === 'PicPay' && this.props.ticket.status === 'Pendente' &&
										<View style = {{ marginBottom: theme.height * 0.02}}>
											<FatBottomedButton text={'Pagar'} backgroundColor={this.props.ticket.colors[0]} borderWidth = {0.1} color={this.props.ticket.colors[1]} onTap={this.redirectToPay.bind(this)}/>
										</View>
									}
									{
										this.props.ticket.payment === 'PicPay' && this.props.ticket.status === 'Entregue' &&
										<View style = {{ marginBottom: theme.height * 0.02}}>
											<Text style = {styles.textStatus}> Seu pedido foi entregue!  </Text>
										</View>
									}
									{
										this.props.ticket.payment === 'PicPay' && this.props.ticket.status === 'Pago' &&
										<View style = {{ marginBottom: theme.height * 0.02}}>
											<Text style = {{ flexDirection: 'row', textAlign: 'justify' }}>
												<Text style = {styles.textStatus}>{'O pagamento foi efetivado, você já pode entrar em contato com '}</Text>
												<Text style = {styles.textStatus}>{this.props.ticket.store_name}</Text>
												<Text style = {styles.textStatus}>{' para retirar seu pedido.'}</Text>
											</Text>
										</View>	
									}
								</ScrollView>
							</View>
			            </View>
		            </View>
	            </Modal>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: theme.width * 0.8,
		flexDirection: 'row',
		borderColor:'black',
		borderWidth:1,
		height:theme.height * 0.3,
	},
	product_info: {
		marginTop: 20,
		flexDirection:'column',
		flexWrap: 'wrap',
		width: theme.width * 0.89,
		borderRadius:25,
		height:theme.height * 0.30,
		alignContent:'center',
		alignItems:'center',
		alignSelf:'center',
		elevation: 2,
		backgroundColor: 'white',
	},
	product_info_body: {
		flexDirection: 'row',
		width: theme.width * 0.89,
		paddingRight: theme.width*0.01,
		paddingLeft: theme.width*0.01,
		justifyContent:'center'
	},
	productImage : {
		width:null,
		height:null,
		marginLeft:theme.width * 0.02,
		marginTop:theme.height * 0.02,
		resizeMode: 'contain',
		flex:1
	},
	ticketHeader : {
		height: theme.height *0.05,
		width: theme.width * 0.4,
		marginTop: theme.height *  0.01,
		alignSelf: 'center',
		marginTop:theme.height * 0.015
	},
	ticketLogo : {
		resizeMode: 'contain',
		flex: 1,
		width: null,
		height: null,
	},
	ticketDetails : {
		marginLeft:10,
		flexDirection:'row',
		height:theme.height*0.11,
		marginTop:theme.height*0.03
	},
	ticketLetter : {
		fontSize:15,
		alignSelf:'center',
		fontWeight:'bold',
		marginBottom:theme.height*0.005
	},
	ticketView : {
		flexDirection:'column',
		height:theme.height*0.11
	},
	ticketStatus : {
		padding:20,
		borderRadius:15,
		alignSelf:'center',
		justifyContent:'center',
		marginTop: theme.height * 0.01,
		height: theme.height * 0.05,
		width: theme.width * 0.52
	},
	paymentLetter : {
		alignSelf:'center',
		fontWeight:'bold',
		color:'#8f8f8f'
	},
	dateLetter : {
		fontWeight:'bold',
		color:'#8f8f8f',
		textAlign:'justify',
		padding:5
	},
	productName : {
		fontSize:15,
		alignSelf:'center',
		marginTop:theme.height * 0.03,
		fontWeight:'bold',
	},
	modalContainer: {
		width: theme.width * 0.9,
		height: theme.height * 0.75,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
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
		marginTop: 22,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		paddingTop: theme.height * 0.1,
		marginTop: -(theme.height * 0.1)
	},
	modalLetter: {
		fontWeight:'bold',
		fontSize:15,
		marginBottom:5,
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
	modalProduct : {
		color:'#8f8f8f',
		fontSize:15,
		textAlign: 'justify',
		lineHeight: 25,
		fontWeight:'bold'
	},
	modalStatus : {
		fontWeight:'bold',
		fontSize:20,
		marginBottom: 1,
		alignSelf:'center',
		marginTop:5
	},
	modalImage : {
		width: null,
		height: null,
		resizeMode:'contain',
		flex:1,
	},
	modalButton : {
		borderRadius: 10,
		width:theme.width * 0.5,
		alignContent:'center',
		alignItems:'center',
		justifyContent:'center'
	},
	textStatus: {
		color: '#8f8f8f',
		alignSelf: 'center',
		textAlign: 'justify',
		lineHeight: 20
	}
});
