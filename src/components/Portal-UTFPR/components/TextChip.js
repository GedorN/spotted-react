import React from "react";

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native'


export default class TextChip extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.6} onPress={this.props.onClick}>
                <View style={{ ...styles.container, backgroundColor: this.props.color ? this.props.color : 'black', opacity: this.props.active === true ? 0.2 : 1 }}>
                    <Text>{this.props.text ? this.props.text : '' }</Text>
                </View>
            </TouchableOpacity>

        )
    }
}


const styles = StyleSheet.create({
    container: {
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 10
    }
})
