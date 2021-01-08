import React from 'react';
import  {
	View,
	StyleSheet,
	Text,
} from 'react-native';
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";


export default class PortalUTFPR extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}


	componentDidMount(): void {
		if (!heimdallr.UTFPRToken) {
			this.props.navigation.navigate('LoginPortal');
		}
	}

	render() {
		return (
			<View>
				<Text>Portal UTFPR</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({

})
