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
import { RadioButton } from 'react-native-paper';



export default class CustomizationOptions extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
            checked:'first',
            i : 0,
            color:null,
            color1: 'black',
            color2: '#8f8f8f'
		};
    }

    componentDidMount(): void {
    }


    getOption = (item) => {
      
        this.setState({ color: item });
        this.props.customizationCallback(item,this.props.itemIndex);

    }

    getRadioButtomOption = (item) => {

        this.setState({checked: item});
        this.props.customizationCallback(item,this.props.itemIndex);
    }




    render = () => {
        return (
            <View style={{alignSelf:'center'}}>
                {
                	this.props.custom.field === 'select' &&
                    <View style = {{width:theme.width * 0.90}}>
                        <Text style = {{ fontWeight:'bold' ,fontSize:25,alignSelf:'center',marginTop:25,marginBottom:5}}>{this.props.custom.label}</Text>
                        {
                        	this.props.custom.options.map((i) =>
		                        <TouchableOpacity style = {{elevation: 2 ,borderColor:(this.state.color === i?this.props.colors[0] :'#8f8f8f'),borderWidth:(this.state.color === i? 4 : 2),borderRadius:25, marginTop:25,justifyContent:'center'}} onPress = {this.getOption.bind(this,i)}>
		                            <View  key={i} >
		                                <Text style = {{fontSize:22,marginBottom:theme.height*0.025,marginTop:theme.height*0.025,alignSelf:'center',fontWeight:'bold',color:(this.state.color === i? this.props.colors[0] :'#8f8f8f')}}>{i}</Text>
		                            </View>
		                        </TouchableOpacity>
                            )}

                    </View>
                }

                {
                	this.props.custom.field === 'radio' &&
                    <View style = {{width:theme.width * 0.90}}>
                        <Text style = {{ fontWeight:'bold' ,fontSize:25,alignSelf:'center',marginTop:25,marginBottom:5}}>{this.props.custom.label}</Text>
                        {
                        	this.props.custom.options.map(i =>
	                            <View key={i}>
	                                <View style = {{marginBottom:20,justifyContent:'center'}}>
	                                    <Text style = {{fontSize:22,marginBottom:theme.height*0.025,marginTop:theme.height*0.025,alignSelf:'center',color:'#8f8f8f',fontWeight:'bold'}}>{i}</Text>
	                                   <View style = {{ width:theme.width * 0.1,alignSelf:'center'}}>
	                                        <RadioButton
	                                            color  = {this.props.colors[0]}
	                                            value = {i}
	                                            status={this.state.checked ===  i ? 'checked' : 'unchecked'}
	                                            onPress={ this.getRadioButtomOption.bind(this,i)}
	                                            />
	                                    </View>
	                                </View>
	                            </View>
                            )}
                    </View>
                }
                


            </View>
        );
    }
}
