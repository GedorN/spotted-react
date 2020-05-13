import React from 'react';

import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
	RefreshControl,
	Modal,
	TextInput,
} from 'react-native';

import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../components/General/Theme";
import Carousel from 'react-native-banner-carousel';
import CustomizationOptions from './CustomizationOptions';
import FatBottomedButton from'./buttons/FatBottomedButton';
import CustomizationTextArea from './CustomizationTexArea';


export default class ProductScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			iidProduct: '',
			product : null,
			productImages: null,
			selectOptions: [],
			radioOptions: [],
			textAreaOptions: [],
			productCustomization: [],
		}
	}

	componentDidMount(): void {
		console.warn('ih rapaz', this.props.navigation.getParam('iid'));
		this.state.iidProduct =  this.props.navigation.getParam('iid');
		let result = heimdallr.getProduct(this.state.iidProduct);
		result.then((resolve) => {
			this.setState({product: resolve});
			this.setState({productImages: resolve.images});

			for(let i = 0; i < resolve.customization.length; i++) {
				this.state.productCustomization.push(resolve.customization[i].label);
				if(resolve.customization[i].field === 'select'){
					this.state.selectOptions.push(resolve.customization[i]);
				}
				else if(resolve.customization[i].field == 'radio'){
					this.state.radioOptions.push(resolve.customization[i]);
				}
				else if(resolve.customization[i].field == 'textArea'){
					this.state.textAreaOptions.push(resolve.customization[i]);
				}
			}

			// resolve.customization.forEach(element => {
			// 	if(element.field === 'select'){
			// 		this.state.selectOptions.push(element);
			// 	}
			// 	else if(element.field == 'radio'){
			// 		this.state.radioOptions.push(element);
			// 	}
			// 	else if(element.field == 'textArea'){
			// 		this.state.textAreaOptions.push(element);
			// 	}
			// });

		 	// this.state.product.customization.forEach(item => {
			//
			// 	this.state.productCustomization.push(item.label);
			//
			// })
			/* console.warn("PRODUCT CUSTOMIZATION", this.state.productCustomization);  */
		})

	}

	renderPage(image, index) {
        return (
            <View key={index} style = {{/* borderColor: 'black',borderWidth:1, */ height:theme.height * 0.58}}>
                <Image style={{ /* borderColor: 'black',borderWidth:1, */width: theme.width * 0.85,height:theme.height * 0.55,alignSelf:'center'  }} source={{ uri: image }} />
            </View>
        );
	}

	renderFooter = () => {
		if (this.state.comments && this.state.comments.length > 0 && !this.state.endPulling) {
			return (
				<View style={{marginBottom: 70}}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			);
		}
		return <View></View>;
	}

	addCustomizationOption = (i, option) => {
		this.state.productCustomization[i] = option;
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<View >
                <FlatList
					ListHeaderComponent = {() =>
						<View>
							<View
								style = {{width:170,height:100,alignSelf:'center',justifyContent:'center'}}>
								<Image
									style = {{width:90,height:70,alignSelf:'center'}}
									source={{ uri:this.state.product? this.state.product.logo : null}}>
								</Image>
							</View>
							<View style = {{marginTop:20,marginBottom:15}}>
								<Text
								style = {{fontWeight:'bold',fontSize:25, alignSelf:'center'}}
								> {this.state.product? this.state.product.name : null}</Text>
							</View>

							<Carousel
								activePageIndicatorStyle = {{backgroundColor:this.state.product ? this.state.product.colors[0] : 'black'}}
								autoplay
								autoplayTimeout={5000}
								loop
								index={0}
								pageSize={theme.width}
							>
								{this.state.productImages? this.state.productImages.map((image, index) => this.renderPage(image, index)) :null}
							</Carousel>

							<View style = {{width:theme.width * 0.9, /* borderColor: 'black',borderWidth:1 */alignSelf:'center'}}>
								<Text
								style = {{color:'#8f8f8f', fontWeight:'bold',fontSize:19,marginBottom:4}}
								>{'Valor:'}
								</Text>
								<View style = {{flexDirection:'row'}}>
									<Text
									style = {{fontWeight:'bold',fontSize:17}}
									>{'R$ ' + (this.state.product ? this.state.product.price : '') + ' - Pago diretamente para '}
									</Text>
									<Image
										style = {{width:37,height:29,marginLeft:3}}
										source = {{uri:this.state.product? this.state.product.logo : null}}>

									</Image>
								</View>
								<View style = {{flexDirection:'row',marginTop:5}}>
									<Text
									style = {{fontWeight:'bold',fontSize:17}}
									>{'R$ ' + (this.state.product? this.state.product.PicPayPrice : '') + ' - Pago pelo '}
									</Text>
									<Image
										style = {{width:61,height:20,marginLeft:3,marginTop:5}}
										source = {{uri:this.state.product? this.state.product.PicPayLogo : null}}>
									</Image>
								</View>
							</View>
							<View style = {{width:theme.width * 0.9, /* borderColor: 'black',borderWidth:1 */alignSelf:'center',marginTop:theme.height * 0.02}}>
								<Text
								style = {{color:'#8f8f8f',fontSize:15,textAlign: 'justify', lineHeight: 25}}
								>{'Caracaterísticas escolhidas: Nenhuma por enquanto ' }</Text>
							</View>

							<View style = {{ width: theme.width * 0.9,alignSelf:'center',marginTop:theme.height*0.03}}>
							<FatBottomedButton text = {'Comprar'} backgroundColor = {this.state.product? this.state.product.colors[0] : null}
												color = {this.state.product? this.state.product.colors[1] : null }borderWidth = {0.1} height = {48}
												/>
							</View>
							<View style = {{ width:theme.width * 0.9, alignSelf:'center',
											padding:10, marginTop: theme.height * 0.03}}>
								<Text style = {{fontWeight:'bold', fontSize:16,marginBottom:theme.height * 0.004}}>{'Descrição:'}</Text>
								<Text style = {{flex:1,fontSize:15, textAlign: 'justify', lineHeight: 25,}}>{this.state.product? this.state.product.Description : null}</Text>
							</View>
							<View style = {{marginTop:theme.height * 0.04, padding:20, backgroundColor:this.state.product? this.state.product.colors[0] : null,
									elevation: 8, }}>
								<Text style = {{alignSelf:'center', fontSize:22,fontWeight:'bold'}}>{'Opções de Personalização'}</Text>
							</View>
						</View>

					}
                    data = {this.state.product ? this.state.product.customization : null}
					renderItem={ ({item}) =>

						<View style = {{alignSelf:'center'}} >

							<CustomizationOptions customizationCallback = {this.addCustomizationOption} productCustomization = {this.state.productCustomization} colors = {this.state.product.colors} custom = {item}/>

						</View>
					}
					numColumns={2}
                    keyExtractor={item => item.id}
					onEndReachedThreshold={0.3}
					ListFooterComponent={ () =>
						<View>
							{this.state.product ? (
								<View>
									<Text style = {{color:'#8f8f8f',marginLeft:theme.width * 0.05}}>{'Preencha apenas os campos em que desejar escrita :'}</Text>
									<View style = {{borderTopColor:'#8f8f8f',borderTopWidth:0.5,marginTop:theme.height * 0.005,paddingTop:theme.height * 0.02}}>
										<CustomizationTextArea customization ={this.state.product.customization}/>
									</View>
								</View>) : null}
						</View>

					}
                />
            	</View>
			</View>
		)
	}
}


const styles = StyleSheet.create({

});
