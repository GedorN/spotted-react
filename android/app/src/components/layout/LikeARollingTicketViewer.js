import React from 'react';

import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	Alert,
	Modal,
	Button,
	Clipboard,
	Linking,
} from 'react-native'

import Ripple from 'react-native-material-ripple';


import theme from "../../../../../components/General/Theme";
import LikeAPrayerductViewer from "./LikeAPrayerductViewer";
import moment from "moment";
import 'moment/locale/pt-br';
import {ActivityIndicator} from "react-native-paper";
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
		console.warn('IID',this.props.ticket.iid);
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
								<View style = {{width:theme.width*0.27}}>
									<Text style = {{...styles.productName, color: this.props.ticket.colors[0]}}
												    ellipsizeMode='tail' numberOfLines={1}>
										{ this.props.ticket? this.props.ticket.product_name : '' }
									</Text>
								</View>
								<TouchableOpacity  onPress = {this.goToProductScreen.bind(this)}>
									<Image
										style = {styles.productImage}
										source ={{uri : this.props.ticket.image }}
									/>
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
								<Text style = {{marginTop:-(theme.height *  0.025),fontSize:20, fontWeight:'bold', alignSelf:'center', color: heimdallr.getTxtColor(this.props.ticket.colors[0])}}>{'Detalhes do pedido'}</Text>
							</View>
							<View style = {{marginTop:theme.height*0.08}}>
								<Text style = {{fontWeight:'bold',fontSize:15,marginBottom:4}}>
								{'Produto : ' + this.props.ticket.product_name }</Text>
								<Text style = {{flexDirection:'row',textAlign: 'justify' ,marginBottom:10}}>
								{
									this.props.ticket.description.map(i =>
										<Text key = {i.label} style = {styles.modalProduct}>
										{i.value?(' ' + i.label + ' - ' + i.value + (this.props.ticket.description.indexOf(i) === (this.props.ticket.description.length - 1) ? '.' : ',')):''}
										</Text>
										)
								}
								</Text>
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
								<Image
										style = {styles.modalImage}
										source ={{uri : this.props.ticket.image }}
									/>
							</TouchableOpacity>
				            {
					            this.props.ticket.payment === 'PicPay' && this.props.ticket.status === 'Pendente' &&
								<View style = {{ marginTop: 12 }}>
									<FatBottomedButton text={'Pagar'} backgroundColor={this.props.ticket.colors[0]} color={heimdallr.getTxtColor(this.props.ticket.colors[0])} onTap={this.redirectToPay.bind(this)}/>
								</View>
				            }

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
		width:100,
		height:115,
		marginLeft:theme.width * 0.02,
		marginTop:theme.height * 0.02
	},
	ticketHeader : {
		height: theme.height *0.03,
		width: theme.width * 0.89,
		marginTop: theme.height *  0.01
	},
	ticketLogo : {
		width: 40,
		height: 30,
		marginLeft: theme.width * 0.02,
		alignSelf: 'center',
		marginTop: theme.height * 0.012
	},
	ticketDetails : {
		marginLeft:10,
		flexDirection:'row',
		height:theme.height*0.11,
		marginTop:theme.height*0.04
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
		marginTop:theme.height * 0.04,
		fontWeight:'bold',
	},
	modalContainer: {
		width: theme.width * 0.9,
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
		padding:20,position:'absolute',
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
		width: 130,
		height: 160,
		marginLeft:theme.width * 0.02,
		alignSelf:'center'
	},
	modalButton : {
		borderRadius: 10,
		width:theme.width * 0.5,
		alignContent:'center',
		alignItems:'center',
		justifyContent:'center'
	}
});
