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

    getOption = (item,labelOption) => {
      
        this.setState({option : item});
        this.props.customizationCallback(item,labelOption);

    }

    render = () => {
        return (

            <View>
                {this.props.customization.map(i =>
                    <View key = {i}>
                    {i.field === 'textArea'?(
                        <View style = {{alignSelf:'center',marginBottom:theme.height * 0.05}}>
                            <Text style = {{fontWeight:'bold' ,fontSize:22, marginBottom:theme.height * 0.01}}>{i.label}</Text>
                            <TextInput
                                style = {{borderColor:'#8f8f8f',borderWidth:2, width:theme.width*0.9,opacity: 0.7,borderRadius:10,fontSize:14,fontWeight:'500',paddingLeft:10}}
                                placeholder = {this.state.option === null ? 'Digite o que deseja' : this.state.option}
                                onChangeText = {text => this.getOption(text,i.label)}
                            />
                        </View>
                    ):null}
                    </View>
                    )}
            </View>
        )
    }

}