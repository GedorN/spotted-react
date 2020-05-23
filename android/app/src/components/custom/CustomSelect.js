import React from 'react';

import {
	StyleSheet,
	Text,
	View
} from 'react-native';

import {
	TouchableRipple
} from 'react-native-paper'
import theme from "../../../../../components/General/Theme";

export default class CustomSelect extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			color: [],
			color1: 'black',
			color2: '#8f8f8f'
		};
	}

	getOption = (i) => {
		let selected = this.state.color;
		if (selected.find((c) => c === i)) {
			selected.splice(selected.indexOf(i), 1);
		} else {
			selected.push(i);
		}
		this.setState({ color: selected });
		this.props.selected({...this.props.custom, value: i});
	}

	render() {
		return (
			<View style={styles.container}>
				<View style = {{width:theme.width * 0.90}}>
					<Text
						style = {{
							fontWeight:'bold',
							fontSize:25,
							alignSelf:'center',
							marginTop:25,
							marginBottom:5
						}}
					>
						{this.props.custom.label}
					</Text>
					{
						this.props.custom.options.map((i) =>
							<TouchableRipple rippleColor="rgba(143, 143, 143, .8)" onPressIn={this.getOption.bind(this,i)}>
								<View style = {{elevation: 2, backgroundColor: 'white', borderColor:(this.state.color.find((c) => c === i) ? this.props.colors[0] :'#8f8f8f'), borderWidth:(this.state.color.find((c) => c === i) ? 4 : 2), borderRadius:25, marginTop:25, justifyContent:'center'}} key={i} >
									<Text style = {{fontSize:22, marginBottom:theme.height*0.025, marginTop:theme.height*0.025, alignSelf:'center', fontWeight:'bold', color:(this.state.color.find((c) => c === i) ?this.props.colors[0] :'#8f8f8f')}}>{i}</Text>
								</View>
							</TouchableRipple>
						)}

				</View>
			</View>
		)
	}
}

const styles =  StyleSheet.create({
	container: {
		alignSelf: 'center',
	}
})



