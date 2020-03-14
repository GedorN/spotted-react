import React from 'react';
import {
	Text,
	StyleSheet,
	Dimensions,
	View,
	TextInput,
	Image,
	TouchableOpacity,
} from 'react-native';

import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import UserImgProfile from "../../../../components/General/UserImgProfile";
import theme from "../../../../components/General/Theme";
const width = Dimensions.get('screen').width;

export default class PostDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			post: null,
			commentText: null,
		};
	}

	componentDidMount = () => {
		console.log('post clicado: ', this.props.navigation.getParam('pid'));
		let result = heimdallr.querycolletion('post', 'pid', this.props.navigation.getParam('pid'));
		result.then((resolve) => {
			console.log('voltou o certo? ', resolve[0]._data);
			console.log('normal: ', resolve);
			this.setState( { post: resolve[0]._data });
		});
	}

	goToUserProfile = () => {
		// console.warn(this.props.uid);
		console.warn('passing: ', this.props.uid);
		this.props.navigation.navigate('PresentationProfile', {
			userId: this.props.uid,
		});
	}

	getModalImagesLayout = () => {
		console.log('%c calculando...', 'color: green');
		if (this.props.images) {

			if (this.props.images.length === 1) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
						<View style={{ flexDirection: 'row'}}>
							<View style={{width: 280, height: 200}}>
								<Image
									source={{uri: this.props.images[0]}}
									style={{width: 280, height: 200, borderRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
						</View>
					</View>
				)
			} else if (this.props.images.length === 2) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
						<View style={{ flexDirection: 'row', marginBottom: 5}}>
							<View style={{width: 140, height: 200}}>
								<Image
									source={{uri: this.props.images[0]}}
									style={{width: 139, height: 200, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
							<View style={{width: 140, height: 200}}>
								<Image
									source={{uri: this.props.images[1]}}
									style={{width: 139, height: 200,  borderTopRightRadius: 10, borderBottomRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
						</View>
					</View>
				)
			} else if (this.props.images.length === 3) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
						<View style={{ flexDirection: 'row'}}>
							<View style={{width: 140, height: 200}}>
								<Image
									source={{uri: this.props.images[0]}}
									style={{width: 140, height: 200, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
							<View style={{flexDirection: 'column'}}>
								<View style={{width: 140, height: 100}}>
									<Image
										source={{uri: this.props.images[1]}}
										style={{width: 139, height: 99,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</View>
								<View style={{width: 140, height: 99}}>
									<Image
										source={{uri: this.props.images[2]}}
										style={{width: 139, height: 99, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</View>
							</View>
						</View>
					</View>
				)
			} else if (this.props.images.length === 4) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
						<View style={{ flexDirection: 'row'}}>
							<View style={{width: 140, height: 100}}>
								<Image
									source={{uri: this.props.images[1]}}
									style={{width: 139, height: 99, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
							<View style={{width: 140, height: 100}}>
								<Image
									source={{uri: this.props.images[1]}}
									style={{width: 139, height: 99, borderBottomLeftRadius: 10, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
						</View>
						<View style={{ flexDirection: 'row',  marginBottom: 5}}>
							<View style={{width: 140, height: 100}}>
								<Image
									source={{uri: this.props.images[2]}}
									style={{width: 139, height: 99,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
							<View style={{width: 140, height: 100}}>
								<Image
									source={{uri: this.props.images[3]}}
									style={{width: 139, height: 99, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
						</View>
					</View>
				)
			}
		} else {
			return ;
		}
	}



	addCommentary = () => {
		console.log('escutei');
		if (!this.state.commentText || this.state.commentText === '') {
			return ;
		}
		const params = {};
		params.pid = this.state.post.pid;
		params.comment = this.state.commentText;
		params.date = new Date();
		heimdallr.getUID().then((uuid) => {
			params.cid = uuid;
			let result = heimdallr.saveCollection('comment', params);
			result.then((resolve) => {
				this.postTextInput.clear();
			});


		})
	}


	render() {
		return (
			<View style={styles.container}>
				{/*<Text>{this.state.post ? this.state.post.text : null}</Text>*/}
				<View style={styles.postHeaderUserImage}>
					<TouchableOpacity onPress={this.goToUserProfile.bind(this)}>
						<UserImgProfile circular height={45} width={45} borderWidth={2} borderColor={theme.primary} uri={this.props.userImage}/>
					</TouchableOpacity>
				</View>
				<View style={styles.commentContainer}>
					<TextInput
						style={styles.textInput}
						capitalize='sentences'
						placeholder='Comentário...'
						multiline
						onChangeText={text => this.setState({commentText: text})}
						ref={input => (this.postTextInput = input)}
					/>
					<TouchableOpacity onPress={this.addCommentary.bind(this)}>
						<Image
							style={{width: 30, height: 30, marginLeft: 15}}
							source={require('../../../../assets/images/send.png')}
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: 10,
		borderTopWidth: 0.2,
		borderColor: 'rgba(59, 56, 50, 0.2)',
	},
	postHeaderUserImage: {
		justifyContent: "flex-start",
		alignContent: 'flex-start',
		padding: 0,
		alignItems: 'flex-start',
		height: 30
	},
	textInput: {
		height: 40,
		borderBottomWidth: 1,
		borderBottomColor: 'red',
		width: width * 0.8,
	},
	commentContainer: {
		flexDirection: 'row',
		padding: 5
	}
});