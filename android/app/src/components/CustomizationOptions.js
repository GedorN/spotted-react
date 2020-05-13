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
/*
        console.warn("PRODUCT CUSTOMIZATION", this.props.productCustomization);
        console.warn("CUSTOM",this.props.custom.label);
        console.warn("colors RECEIVED",this.props.colors); */
        this.props.productCustomization.forEach(item => {

            if(item === this.props.custom.label){
                this.state.i = this.props.productCustomization.indexOf(item);
                /* console.warn("state i"  ,this.state.i); */
            }
        })

    }

    getOption = (item) => {
       /*  console.warn("item",item); */
        this.state.color = item;
        this.setState({ color: item });
       /*  console.warn("STATE COLOR",this.state.color); */
       this.props.customizationCallback(this.state.i,this.i);

    }




    render = () => {
        return (
            <View style={{alignSelf:'center'}}>
                {
                	this.props.custom.field === 'select' &&
                    <View style = {{width:theme.width * 0.50}}>
                        <Text style = {{ fontWeight:'bold' ,fontSize:20,alignSelf:'center',marginTop:25,marginBottom:5}}>{this.props.custom.label}</Text>
                        {
                        	this.props.custom.options.map(i =>
		                        <TouchableOpacity style = {{marginTop:25,justifyContent:'center'}} onPress = {this.getOption.bind(this,i)}>
		                            <View  key={i} >
		                                <Text style = {{fontSize:17,marginBottom:22,alignSelf:'center',fontWeight:'bold',color:(this.state.color === i? this.state.color1 : this.state.color2)}}>{i}</Text>
		                            </View>
		                        </TouchableOpacity>
                            )}

                    </View>
                }

                {
                	this.props.custom.field === 'radio' &&
                    <View style = {{width:theme.width * 0.50}}>
                        <Text style = {{ fontWeight:'bold' ,fontSize:20,alignSelf:'center',marginTop:15,marginBottom:this.props.custom.options.length > 2 ? 10 : 50}}>{this.props.custom.label}</Text>
                        {
                        	this.props.custom.options.map(i =>
	                            <View key={i}>
	                                <View style = {{marginBottom:25,justifyContent:'center'}}>
	                                    <Text style = {{fontSize:17,marginBottom:11,marginTop:11,alignSelf:'center',color:'#8f8f8f',fontWeight:'bold'}}>{i}</Text>
	                                   <View style = {{ width:theme.width * 0.1,alignSelf:'center'}}>
	                                        <RadioButton
	                                            color  = {this.props.colors[0]}
	                                            value = {i}
	                                            status={this.state.checked ===  i ? 'checked' : 'unchecked'}
	                                            onPress={() => { this.setState({ checked: i }); }}
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
