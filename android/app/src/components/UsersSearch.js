import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Image,
} from 'react-native';
import RUMineTextInput from "./Inputs/RUMineTextInput";

const width = Dimensions.get('screen').width;

export default class UsersSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: null,
		};
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.headerSearch}>
					<Image
						source={require('../../../../assets/images/search-solid.png')}
						style={{height: 25, width: 25}}
					/>
					<View style={styles.search}>
						<RUMineTextInput
							// onChangeText={ text => this.setState({ password: text }) }
							placeholder='Usuario'
							textContentType='name'
							flex={1}
						/>
					</View>
				</View>
			</View>

		)
	}

}

const styles = StyleSheet.create({
	container: {
		padding: 5,
	},
	search: {
		flexDirection: 'row',
		width: width - 40,
		marginLeft: 5,
	},
	headerSearch: {
		flexDirection: 'row',
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	}
});