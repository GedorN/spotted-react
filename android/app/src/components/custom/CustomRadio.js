import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import theme from "../../../../../components/General/Theme";


export default class CustomRadio extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			color: null,
			color1: 'black',
			color2: '#8f8f8f'
		};
	}

	getOption = (i) => {
		this.setState({ color: i });
		this.props.selected({...this.props.custom, value: i});
	}

	render() {
		return (
			<View style={styles.container}>
				<View style = {{ width:theme.width * 0.90 }}>
					<Text style = {{
						fontWeight:'bold',
						fontSize:25,
						alignSelf:'center',
						marginTop:25,marginBottom:5}}
					>
						{this.props.custom.label}
					</Text>
					{
						this.props.custom.options.map((i) =>
							<TouchableOpacity onPress = {this.getOption.bind(this,i)}>
								<View style = {{elevation: 2 ,borderColor:(this.state.color === i ? this.props.colors[0] :'#8f8f8f'),borderWidth:(this.state.color === i? 4 : 2),borderRadius:25, marginTop:25,justifyContent:'center'}} key={i} >
									<Text style = {{
										fontSize:22,
										marginBottom:theme.height*0.025,
										marginTop:theme.height*0.025,
										alignSelf:'center',
										fontWeight:'bold',
										color:(this.state.color === i? this.props.colors[0] :'#8f8f8f')}}
									>
										{i}
									</Text>
								</View>
							</TouchableOpacity>
						)}
				</View>
			</View>
		)
	}
}

const styles =  StyleSheet.create({
	container: {
		alignSelf: 'center',
	},
})



