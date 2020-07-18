import React from 'react';
import {
	Image,
	TextInput,
	TouchableOpacity,
	View,
	StyleSheet,
	StatusBar,
	ActivityIndicator,
	Text,
	Keyboard
} from 'react-native';

import {ProgressBar} from "react-native-paper";

import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import ImagePicker from "react-native-image-picker";
import theme from "../../../../../components/General/Theme";
import FatBottomedButton from "../buttons/FatBottomedButton";
import ImageResizer from "react-native-image-resizer";
import Video from 'react-native-video';
import {RNPhotoEditor} from "react-native-photo-editor";
var RNFS = require('react-native-fs');

export default class BoardCommentaryWriter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			postText: false,
			activity: false,
		}
	}
	
	async savePost() {
		
		heimdallr.sendEvent('commentary_write')
		const params = {};
		params.comment = this.state.postText;
		params.date = await heimdallr.getServerTime();
		params.user_image = heimdallr.user_image;
		params.user_name =  heimdallr.user_name;
		params.id_user = heimdallr.user_id;
		params.pid = this.props.pid;

		heimdallr.getUID().then((uuid) => {
			params.cid = uuid;
			this.props.saveComment(params);
		});

	}


    doPost = () =>{
	   this.props.close();
	   this.savePost();
    }

    render() {
        return ( 
            <View style={styles.container}>
				<View style = {{ width: theme.width }}>
					<ProgressBar size="large" visible={this.state.activity} indeterminate color={theme.primary}/>
					<View style = {styles.headerView}>
						<View style={styles.header}>
							<TouchableOpacity onPress={this.props.close}>
								<Image
									source={require('../../../../../assets/images/times-solid.png')}
									style={styles.solid}
								/>
							</TouchableOpacity>
						</View>
					</View>
					<View style = {styles.textInputView}>
						<TextInput
							style={styles.textInput}
							onChangeText={text => this.setState({postText: text})}
							autoCapitalize="sentences"
							multiline
							textAlignVertical="top"
							placeholder="O que você está pensando?"
							ref={input => (this.postText = input)}
						/>
					</View>
					<View style={styles.button}>
						<FatBottomedButton backgroundColor = {theme.primary} color={'white'} text={'Comentar'} onTap={this.doPost.bind(this)}/>
					</View>
				</View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: theme.height,
		alignItems: 'center',
		alignContent: 'center',
		position: 'absolute',
		backgroundColor: 'white',
		zIndex: 99999
    },
    header: {
		width: theme.width * 0.2,
		height: 20,
		alignSelf:'flex-end',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		alignContent: 'center',
		padding: 4,
		marginTop: 10,
	},
	textInput: {
		width: theme.width * 0.9,
		alignSelf:'center',
		height: theme.height * 0.75,
	},
	button: {
		marginTop:5, 
		width: theme.width * 0.9, 
		alignSelf: 'center' 
	},
	textInputView: {
		borderColor: '#f2f2f2', 
		borderBottomWidth: 2 
	},
	solid: {
		width: 20, 
		height: 20,
		marginRight:5
	},
	headerView: {
		width: theme.width * 0.98,
		alignSelf: 'center' 
	}
})