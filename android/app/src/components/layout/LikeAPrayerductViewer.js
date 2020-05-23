import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
} from 'react-native';

import theme from "../../../../../components/General/Theme";

export default class LikeAPrayer extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			opacityValue: 0.7,
			opacityValueScrolling: 1,
		}
	}
	componentDidMount(): void {
		console.log('produto recebido: ', this.props.product);
	}

	getTxtColor = (color) => {
		if (!color) {
			return 'black';
		}
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

	getFontSize = (txt) => {
		if (!txt) {
			return ;
		}
		if (txt.length > 25) {
			return 11
		} else {
			return 16
		}
	}

	goToProductScreen = () => {
		try {
			this.props.navigation.push('ProductScreen', {iid: this.props.product.iid});
		} catch (e) {
			console.log(e);
		}
	}


	render() {
		return (
			<TouchableOpacity
				onPress={this.goToProductScreen.bind(this)}
				activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue}
			>
				<View style={styles.container}>
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
						}}>
							<Text style={{
								textAlign: 'center',fontWeight:'bold',
								fontSize:16,
								color: this.props.colors ? this.props.colors[1] : 'black'
							}}
								ellipsizeMode='tail' numberOfLines={2}>
								{ this.props.product ? this.props.product.name : '' }
							</Text>
						</View>
						<View style = {{width:theme.width * 0.43, height:theme.height * 0.25, alignSelf:'center'}}>
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
						<Text style = {{fontWeight:'bold', color:'#8f8f8f', alignSelf:'center'}}>{ this.props.product && this.props.product.price? ('Valor: R$ ' + this.props.product.price) : ''}</Text>
					</View>
				</View>
			</TouchableOpacity>
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
		backgroundColor: 'white'
	},

})
