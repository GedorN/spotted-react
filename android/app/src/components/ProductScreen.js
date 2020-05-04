import React from 'react';

import {
	StyleSheet,
	View,
	Text,
} from 'react-native';


export default class ProductScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	componentDidMount(): void {
		console.warn('ih rapaz', this.props.navigation.getParam('iid'));
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: 'red'}}>
				<Text>
					você tá na dela de produto
				</Text>
			</View>
		)
	}
}


const styles = StyleSheet.create({

});