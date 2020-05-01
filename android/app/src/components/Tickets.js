import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	FlatList,
	Modal
} from 'react-native';

import theme from "../../../../components/General/Theme";

export default class Tickets extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.props.close}>
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
				<Text>Aqui você pode consultar os seus pedidos</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		height: theme.height,
		backgroundColor: 'white',
	}
})