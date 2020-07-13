import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	FlatList,
	Modal, RefreshControl
} from 'react-native';

import theme from "../../../../components/General/Theme";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";


export default class Board extends React.Component {

    constructor(props) {
		super(props);
		this.state = {

		}

    }


    render() {
        return (
            <View style = {{ padding: theme.width * 0.05}} >
                <Text>Mural</Text>
            </View>
        )
    }
}