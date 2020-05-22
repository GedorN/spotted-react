import React from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
    Dimensions,
    FlatList,
	ActivityIndicator,
    RefreshControl,
    TextInput,
} from 'react-native';

import theme from "../../../../components/General/Theme";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";




export default class CustomizationTextArea extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
            checked:'first',
            option : null,
		};
    }

    setOption = () => {
        this.props.customizationCallback({...this.props.item, value: this.state.option});
    }

    render = () => {
        return (

            <View style={styles.container}>
                {
                	this.props.item.field === 'textArea' &&
	                    <View style = {{alignSelf:'center',marginBottom:theme.height * 0.01,marginTop:theme.height * 0.04}}>
	                        <Text style = {{fontWeight:'bold' ,fontSize:22, marginBottom:theme.height * 0.01}}>{this.props.item.label}</Text>
	                        <TextInput
	                            style = {{borderColor:'#8f8f8f',borderWidth:2, width:theme.width*0.9,opacity: 0.7,borderRadius:10,fontSize:14,fontWeight:'500',paddingLeft:10}}
	                            placeholder = {this.state.option === null ? 'Digite o que deseja' : this.state.option}
	                            onChangeText = {text => this.setState({option :text})}
	                            value = {this.state.option}
	                            onEndEditing = {this.setOption.bind(this)}
	                        />
	                    </View>
                    }
            </View>
        )
    }

}


const styles= StyleSheet.create({
	container: {
		marginTop: 8,
	}
})
