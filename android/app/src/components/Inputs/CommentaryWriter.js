import React from 'react';
import {
	Image,
	TextInput,
	TouchableOpacity,
	View,
	Text,
	StyleSheet, Dimensions
} from 'react-native';
import theme from "../../../../../components/General/Theme";
import FatBottomedButton from "../buttons/FatBottomedButton";

const width = Dimensions.get('screen').width;
const  height = Dimensions.get('screen').height;

export default class CommentaryWriter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			anonymousUser: false,
			postText: false,
			anonymousText: "Postar como anônimo ?",
		}
	}


	getAnonymous = () => {
		const isAnon = !this.state.anonymousUser;
		this.setState({anonymousUser: isAnon});
		if(isAnon){
			this.setState({anonymousText: "Será postado como anônimo"});
		}
		else{
			this.setState({anonymousText: "Postar como anônimo ?"})
		}
	}

	doComment = () => {
		this.props.context.state.commentText = this.state.postText;
		this.props.context.state.anonymousUser = this.state.anonymousUser;
		this.props.context.addCommentary();
		this.props.close();
	}

	render() {
		return (
			<View style={styles.container}>
				<View>
					<View>
						<View style={styles.header}>
							<TouchableOpacity onPress={this.props.close}>
								<Image
									source={require('../../../../../assets/images/times-solid.png')}
									style={{width: 20, height: 20,marginRight:5}}
								/>
							</TouchableOpacity>
						</View>
						{/*<UserImgProfile circular height={50} width={50} uri={heimdallr.user_image}/>*/}
						<View>
							<TextInput
								style={{width: width + 10,
									borderBottomWidth: 0.7,
									borderColor: 'grey',
									height: height * 0.70,
								}}
								onChangeText={text => this.setState({postText: text})}
								autoCapitalize="sentences"
								multiline
								textAlignVertical="top"
								placeholder="O que você está pensando?"
								ref={input => (this.postTextInput = input)}
							/>
						</View>
						<View style = {{flexDirection:"row", height: 45 , marginTop: 2}}>
							<TouchableOpacity
								onPress = {this.getAnonymous.bind(this)}
								style =
									{{
										width: 45,
										height: 45,
										marginTop: 3,
										marginLeft: theme.width * 0.08}}
							>
								<Image
									source={require('../../../../../assets/images/mask-solid.png')}
									style = {{ width: 50, height: 40, alignSelf: 'flex-start', opacity: 1}}
								/>

							</TouchableOpacity>
							<Text style = {{marginTop:14,marginLeft:11, opacity: !this.state.anonymousUser ? 0.5 : 1, width:theme.width *0.55,
								fontWeight: !this.state.anonymousUser ? 'normal':'bold' }}>{this.state.anonymousText}</Text>
						</View>
						<View style={{marginTop:15, width: width * 0.9, marginLeft: 25}}>
							<FatBottomedButton backgroundColor = {theme.primary} color={'white'} text={'Comentar'} onTap={this.doComment.bind(this)}/>
						</View>
					</View>
				</View>
			</View>
		)
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: height,
		alignItems: 'center',
		alignContent: 'center',
		position: 'absolute',
		backgroundColor: 'white',
		zIndex: 99999
	},
	header: {
		width: width,
		height: 20,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		alignContent: 'center',
		padding: 4,
		marginTop: 10,
	},
	postWriter: {
		// width: width + 10,
		// borderBottomWidth: 1,
		// borderColor: theme.primary,
		// height: this.state.postImages.length > 0 ? 300 : 500,
	},
});

