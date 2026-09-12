import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
} from 'react-native';

import theme from "../../components/General/Theme";
import Ripple from 'react-native-material-ripple';


export default class LikeAPrayer extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			opacityValue: 0.7,
			opacityValueScrolling: 1,
			price: '',
			partnersPlan: null,
			stock: 1,
		}
	}
	componentDidMount() {
		this.state.price = this.props.product.price;
		this.state.partnersPlan = this.props.partnersPlan;
		this.state.stock = this.props.product.stock;

		if(this.props.validPlan && !this.props.product.no_plan_discount){

			this.planDiscount();
		} else {
			this.setState({});
		}
	}

	planDiscount = () =>{

		if(this.props.discountType === 0){
			let newPrice = this.state.price - (this.state.price * (this.props.discount/100));
			this.setState({ price: newPrice });
		}else{
			let newPrice = this.state.price - this.props.discount;
			newPrice <= 0 ? newPrice = 0 : newPrice;
			this.setState({ price: newPrice });
		}

	}

	goToProductScreen = () => {

		this.props.navigation.push('ProductScreen',
		{
			iid: this.props.product.iid,
		})
	}


	render() {
		return (
			<View style={{ ...styles.container, opacity: this.state.stock > 0 ? 1 : 0.7}}>
				<Ripple
					rippleOpacity={0.42}
					rippleColor="rgba(143, 143, 143, .8)"
					onPress={this.goToProductScreen.bind(this)}
					activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue}
					disabled={this.state.stock <= 0}
				>
					<View>
						<View style={{
							alignSelf:'center',
							height: theme.height * 0.1,
							width: theme.width * 0.43,
							borderTopLeftRadius: 30,
							borderTopRightRadius: 30,
							borderBottomRightRadius:2,
							borderBottomLeftRadius:2,
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: this.props.colors ? this.props.colors[0] : null,
							paddingLeft:theme.width * 0.03,
							paddingRight:theme.width * 0.03,
						}}>
							<View style = {{ width: theme.width * 0.35, alignSelf: 'center', padding: 2 }}>
								<Text style={{
									textAlign: 'center',fontWeight:'bold',
									fontSize:16,
									color: this.props.colors ? this.props.colors[1] : 'black',
									alignSelf:'center'
								}}
									ellipsizeMode='tail' numberOfLines={2}>
									{ this.props.product ? this.props.product.name : '' }
								</Text>
							</View>
						</View>
						<View style = {{width:theme.width * 0.43, height:theme.height * 0.25, alignSelf:'center',paddingTop:theme.height*0.01,marginBottom:theme.height * 0.005}}>
							<Image
								style={{
									flex: 1,
									width: null,
									height: null,
									resizeMode: 'contain',
								}}
								source={{ uri: this.props.product && this.props.product.images ? this.props.product.images[0] : null}}
							/>
						</View>
						<Text style = {{fontWeight:'bold', color:'#8f8f8f', alignSelf:'center'}}>{ this.state.stock > 0 ? ('Valor: R$ ' + (parseFloat(this.state.price) * 1.16).toFixed(2).toString().replace('.',',')) : 'ESGOTADO'}</Text>
					</View>
				</Ripple>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop:10,
		width: theme.width * 0.43,
		height: theme.height * 0.4,
		borderRadius:30,
		alignSelf:'center',
		elevation: 2,
		alignContent:'center',
		alignItems:'center',
		backgroundColor: 'white',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},

})
