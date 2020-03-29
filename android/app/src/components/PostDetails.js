import React from 'react';
import {
	Text,
	StyleSheet,
	Dimensions,
	View,
	TextInput,
	Image,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
	KeyboardAvoidingView,
} from 'react-native';

import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import UserImgProfile from "../../../../components/General/UserImgProfile";
import theme from "../../../../components/General/Theme";
import OptionsMenu from "react-native-options-menu";
import CommentaryViewer from "./CommentaryViewer";
const width = Dimensions.get('screen').width;
const  height = Dimensions.get('screen').height;

export default class PostDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			post: null,
			commentText: null,
			showModal: false,
			comments: null,
			endPulling: false,
			pulling: false,
			pulledComments: 10,
		};
	}

	componentWillMount () {
		// BackHandler.addEventListener("hardwareBackPress", () => {
		// 	console.warn('nao nao');
		// })
		// let keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
		// 	console.warn('apareci');
		// });
	}

	componentDidMount = () => {
		console.log('post clicado: ', this.props.navigation.getParam('pid'));
		this.setState({ pulling: true });
		let result = heimdallr.querycolletion('post', 'pid', this.props.navigation.getParam('pid'));
		result.then((resolve) => {
			this.setState( { post: resolve[0]._data });
			console.log('Postado: ', this.state.post);
			this.forceUpdate();
			this.setState({ pulling: false });
		});

		let res = heimdallr.querycolletion('comment', 'pid', this.props.navigation.getParam('pid'));
		res.then((resolve) => {
			this.setState({ comments: resolve });
			console.log('comentarios ativos: ', this.state.comments);
		});

	}

	_keyboardDidShow = (e) => {
		console.log('hehue', e);
	}

	goToUserProfile = () => {
		// console.warn(this.props.uid);
		this.props.navigation.navigate('PresentationProfile', {
			userId: this.props.uid,
		});
	}

	getModalImagesLayout = () => {
		if (!this.state.post || !this.state.post.images) {
			return ;
		}
		console.log('seu cu', this.state.post);
		if (this.state.post.images) {

			if (this.state.post.images.length === 1) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
						<View style={{ flexDirection: 'row'}}>
							<View style={{width: 280, height: 200}}>
								<Image
									source={{uri: this.state.post.images[0]}}
									style={{width: 280, height: 200, borderRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
						</View>
					</View>
				)
			} else if (this.state.post.images.length === 2) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
						<View style={{ flexDirection: 'row', marginBottom: 5}}>
							<View style={{width: 140, height: 200}}>
								<Image
									source={{uri: this.state.post.images[0]}}
									style={{width: 139, height: 200, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
							<View style={{width: 140, height: 200}}>
								<Image
									source={{uri: this.state.post.images[1]}}
									style={{width: 139, height: 200,  borderTopRightRadius: 10, borderBottomRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
						</View>
					</View>
				)
			} else if (this.state.post.images.length === 3) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
						<View style={{ flexDirection: 'row'}}>
							<View style={{width: 140, height: 200}}>
								<Image
									source={{uri: this.state.post.images[0]}}
									style={{width: 140, height: 200, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
							<View style={{flexDirection: 'column'}}>
								<View style={{width: 140, height: 100}}>
									<Image
										source={{uri: this.state.post.images[1]}}
										style={{width: 139, height: 99,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</View>
								<View style={{width: 140, height: 99}}>
									<Image
										source={{uri: this.state.post.images[2]}}
										style={{width: 139, height: 99, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</View>
							</View>
						</View>
					</View>
				)
			} else if (this.state.post.images.length === 4) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
						<View style={{ flexDirection: 'row'}}>
							<View style={{width: 140, height: 100}}>
								<Image
									source={{uri: this.state.post.images[1]}}
									style={{width: 139, height: 99, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
							<View style={{width: 140, height: 100}}>
								<Image
									source={{uri: this.state.post.images[1]}}
									style={{width: 139, height: 99, borderBottomLeftRadius: 10, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
						</View>
						<View style={{ flexDirection: 'row',  marginBottom: 5}}>
							<View style={{width: 140, height: 100}}>
								<Image
									source={{uri: this.state.post.images[2]}}
									style={{width: 139, height: 99,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
							<View style={{width: 140, height: 100}}>
								<Image
									source={{uri: this.state.post.images[3]}}
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

	pullMoreCommentaries = (distanceFromEnd) => {
		if (!this.state.endPulling) {
			if (!this.state.pulling) {
				this.setState({ pulling: true });
				let n = this.state.pulledComments;
				n = n + 5;
				let result = heimdallr.querycolletion('comment', 'pid', this.props.navigation.getParam('pid'));
				result.then((resolve) => {
					console.log('buscou: ', resolve);
					if (resolve.length === this.state.comments.length) {
						this.setState({ endPulling: true });
					}
					this.setState( { comments: resolve });
					this.setState({ pulledComments: n });
					this.setState({ pulling: false });
				})
			}
		}
	}

	toggleModal () {
		this.setState({showModal: !this.state.showModal});
		console.log('opened');
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

	addCommentary = () => {
		console.log('escutei');
		if (!this.state.commentText || this.state.commentText === '') {
			return ;
		}
		const params = {};
		params.pid = this.state.post.pid;
		params.comment = this.state.commentText;
		params.date = new Date();
		params.user_image = heimdallr.user_image;
		params.user_name = heimdallr.user_name;
		heimdallr.getUID().then((uuid) => {
			params.cid = uuid;
			console.log('here loko');
			let result = heimdallr.saveCollection('comment', params);
			result.then((resolve) => {
				console.log('entrou aqui pelo menos', resolve);

				const _data = {};
				_data.user_image = heimdallr.user_image;
				_data.user_name = heimdallr.user_name;
				_data.comment = this.state.commentText;
				_data.cid = uuid;
				const _ref = {id: resolve};
				let posts = this.state.comments;
				posts.unshift({_data, _ref});
				this.setState({ comments: posts });
				console.log('postado');
				this.postTextInput.clear();

			});


		})
	}

	return = () => {
		this.props.navigation.goBack();
	}


	render() {
		return (
			<KeyboardAvoidingView
				style={{zIndex: 0, flex: 1}}
			>
				<TouchableOpacity onPress={this.return.bind(this)}>
					<View style={{flexDirection: 'row', marginTop: 5, marginBottom: 5,  paddingLeft: 10}}>
						<Image
							style={{width: 20, height: 20}}
							source={require('../../../../assets/images/arrow-left.png')}
						/>
						<Text style={{marginLeft: 5}}>
							voltar
						</Text>
					</View>
				</TouchableOpacity>
				<View style={styles.colContainer}>
					<View
						style={{height: height - 145 }}
					>
						<FlatList
							ListHeaderComponent = {() =>
								<View style={styles.rowContainer}>
									<View style={styles.postHeaderUserImage}>
										<TouchableOpacity onPress={this.goToUserProfile.bind(this)}>
											<UserImgProfile circular height={45} width={45} borderWidth={2} borderColor={theme.primary} uri={this.props.userImage}/>
										</TouchableOpacity>
									</View>
									<View style={{flexDirection: 'column'}}>
										<View style={styles.postHeader}>
											{/*<View style={styles.postHeaderUserImage}>*/}
											{/*    <TouchableOpacity onPress={this.goToUserProfile.bind(this)}>*/}
											{/*        <UserImgProfile circular height={45} width={45} borderWidth={2} borderColor={theme.primary} uri={this.props.userImage}/>*/}
											{/*    </TouchableOpacity>*/}
											{/*</View>*/}
											<TouchableOpacity onPress={this.goToUserProfile.bind(this)}>
												<Text
													style={{marginLeft: 16, fontWeight: 'bold'}}
												>
													{heimdallr.user_name}
												</Text>
											</TouchableOpacity>
											<View style={{left: width * 0.55}}>
												<TouchableOpacity
												>
													<OptionsMenu
														button={require('../../../../assets/images/ellipsis-h-solid.png') }
														buttonStyle={{ width: 20, height: 20}}
														options={['Denunciar']}
														actions={[this.toggleModal.bind(this)]}
													/>
												</TouchableOpacity>
											</View>
										</View>
										<View style={styles.body}>
											<View style={styles.post}>
												<Text> {this.state.post ? this.state.post.text : null} </Text>
												<View >
													{this.getModalImagesLayout()}
												</View>
											</View>
										</View>
									</View>
								</View>
							}
							data = {this.state.comments}
							renderItem={ ({item}) =>
								<CommentaryViewer userImage={item._data.user_image} text={item._data.comment} user_name={item._data.user_name}/>
							}
							keyExtractor={item => item._ref.id}
							onEndReachedThreshold={0.3}
							onEndReached={ ({ distanceFromEnd }) => {
								this.pullMoreCommentaries(distanceFromEnd);
							}}
							ListFooterComponent={ this.renderFooter.bind(this)}
						/>
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
			</KeyboardAvoidingView>
		);
	}
}


const styles = StyleSheet.create({
	colContainer: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		// padding: 10,
		borderTopWidth: 0.2,
		borderColor: 'rgba(59, 56, 50, 0.2)',
		flex: 1,
	},
	rowContainer: {
		width: width,
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: 10,
		borderBottomWidth: 0.2,
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
		width: width * 0.8,
	},
	body: {
		flexDirection: 'column',
	},
	postHeader: {
		flexDirection: 'row',
		height: 15,
		fontWeight: 'bold',
		alignItems: 'center',
		alignContent: 'center',
		width: width * 0.95,
	},
	commentContainer: {
		position: 'absolute',
		alignItems: 'flex-end',
		width: width,
		bottom: 0,
		alignSelf: 'flex-end',
		borderTopWidth: 0.5,
		borderColor: theme.primary,
		height: 50,
		flexDirection: 'row',
		backgroundColor: 'white',
		padding: 5,
		zIndex: 1,
	},
	post: {
		alignSelf: 'flex-start',
		width: width * 0.7,
		padding: 2,
		marginLeft: 10,
		borderRadius: 8,
		color: 'black',
	}
});