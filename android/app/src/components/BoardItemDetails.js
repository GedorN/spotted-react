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
	RefreshControl,
	Modal,
} from 'react-native';

import { FAB } from 'react-native-paper';

import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import UserImgProfile from "../../../../components/General/UserImgProfile";
import theme from "../../../../components/General/Theme";
import CommentaryViewer from "./CommentaryViewer";
import BoardCommentaryViewer from "./layout/BoardCommentaryViewer";
import PostOptions from "./Inputs/PostOptions";
import BoardCommentaryWriter from "./Inputs/BoardCommentaryWriter";
import CarouselModaFoka from "./layout/CarouselModaFoka";

import Video from 'react-native-video';
import moment from "moment";
import 'moment/locale/pt-br';
import OptionsMenu from "react-native-options-menu";
import RBSheet from "react-native-raw-bottom-sheet";
import ReportGod from "./Inputs/ReportGod";
import AwesomeAlert from "react-native-awesome-alerts";
import ImageViewer from "react-native-image-zoom-viewer";






export default class BoardItemDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showBoardCommentaryModal: false,
            title: '',
            text: '',
            images: false,
            videoIncluded: false,
            userImage: false,
            userName: false,
            date:false,
            showImages: false,
            indexImage: 0,
            galleryObj: [],
            uid: false,
            pid: false,
            comments: null,
            isRefreshing: false,
            endPulling: false,
            pulling: false,
            pulledComments: 10,
            showAlert: false,
            deleteComment: false,
            showDeleteAlert: false,
            commentId: null
        }
    }

    componentDidMount = () => {
        this.setState({ title: this.props.navigation.getParam('title'), text: this.props.navigation.getParam('text'),images: this.props.navigation.getParam('images'),
                        videoIncluded: this.props.navigation.getParam('video'), userImage: this.props.navigation.getParam('userImage'), userName: this.props.navigation.getParam('userName'),
                        date: this.props.navigation.getParam('date'), uid: this.props.navigation.getParam('uid'), pid: this.props.navigation.getParam('pid')   });

        let postImages = this.props.navigation.getParam('images');
        let images = [];
        postImages.forEach((img) => {
            images.push({url: img});
            this.setState({ galleryObj: images });
        });
        
        heimdallr.getComments(this.props.navigation.getParam('pid'), this.state.pulledComments).then((resolve) => {
			 resolve.forEach((doc) => {
				const time = moment(doc.date).fromNow();
				doc.elapsed_time = heimdallr.getElapsedTime(time);
			}) 
			this.setState({ comments: resolve });
		});    
    }

    _hideModal = () => {
        this.setState({ showBoardCommentaryModal: false })
    }

    _openBoardCommentaryWriter = () => {
        this.setState({ showBoardCommentaryModal: true });
    }

    goToUserProfile = () => {
		this.props.navigation.push('UserProfile', {
			userId: this.state.uid,
		});
    }
    
    addCommentary = async (params) => {
		
        heimdallr.saveComment(params);
        let posts = this.state.comments;
        posts.push(params);
        this.setState({ comments: posts });
        this.triggerNotification(params.comment, params.cid);

    }

    triggerNotification = async (comment, cid) => {
		if(heimdallr.user_id != this.state.uid){
			const notifications = {};
			notifications.eid = this.state.pid;
			notifications.uid = this.state.uid;
			notifications.uid_notification = heimdallr.user_id;
			notifications.user_name = heimdallr.user_name;
			notifications.user_image = heimdallr.user_image;
			notifications.anonymous =  false,
			notifications.content = comment;
            notifications.cid = cid;
            notifications.origin = 1;
			notifications.date = await heimdallr.getServerTime();
			notifications.visualized = 0;
			notifications.entity = "commentary";
			heimdallr.incrementNotification(this.state.uid);

			heimdallr.getUID().then((uuid) => {
				notifications.nid = uuid;
				let result = heimdallr.saveNotification(notifications);
				result.then((resolve) => {
					console.log("notification received", resolve);
				});
			})
		}
	}

    
    onRefresh = () => {
		this.setState({ isRefreshing: true });
		let result = heimdallr.getComments(this.state.pid, 10);
		result.then( (resolve) => {
			resolve.forEach((doc) => {
				const time = moment(doc.date).fromNow();
				doc.elapsed_time = heimdallr.getElapsedTime(time);
			})
			this.setState({ comments: resolve, isRefreshing: false,  pulledComments: 10, endPulling: false  });
		});
	}

    pullMoreCommentaries = (distanceFromEnd) => {
		console.log('fui chamado');
		if (!this.state.endPulling) {
			if (!this.state.pulling) {
				this.setState({ pulling: true });
				let n = this.state.pulledComments;
				n = n + 5;
				let result = heimdallr.getComments(this.props.navigation.getParam('pid'), n);
				result.then((resolve) => {
					resolve.forEach((doc) => {
						const time = moment(doc.date).fromNow();
						doc.elapsed_time = heimdallr.getElapsedTime(time);
					})

					if (resolve.length === 0) {
						this.setState({ endPulling: true });
						this.setState({ comments: this.state.comments.concat(resolve)  })
					} else if (resolve.length === this.state.comments.length) {
						this.setState({ endPulling: true });
					} else {
						this.setState( { comments: resolve });
					}
					this.setState({ pulledComments: n });
					this.setState({ pulling: false });
				})
			}
		}
    }

    commentaryCallback = () => {
		this.setState({ showAlert: true });
	}
    
    commentaryDelete = (cid) => {
		this.setState({  showDeleteAlert: true, deleteComment: true, commentId: cid });
    }

    deletePost = () => {

		this.setState({ showDeleteAlert: false });

		if(this.state.deleteComment){
			heimdallr.deleteCommentary(this.state.pid, this.state.commentId).then(
				() => {
					let comments = this.state.comments;
					comments.splice(comments.findIndex((c) => c.cid === this.state.commentId), 1);
					this.setState({ deleteComment: false, comments: comments });
				}
			);
		}
		else{
			heimdallr.deletePost(this.state.pid);
			heimdallr.deleteUserPost(this.state.pid).then(
				() => {
					this.props.navigation.push('Home');
				}
			);
		}

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

    getModalImagesLayout = ({item}) => {
		if (this.state.videoIncluded) {
			return (
				<View style={{alignItems: 'center', alignSelf: 'center', marginTop: 10}}>
					<View style={{ flexDirection: 'row'}}>
						<View style={{width: theme.width * 0.67, height: 200}}>
							<Video
								resizeMode={'cover'}
								repeat={true}
								source={{uri: this.state.images[0].path}}
								style={{width: 280, height: 200, borderRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'black'}}
							/>
						</View>
					</View>
				</View>
			)
		}else if (this.state.images.length > 0) {
			const index = this.state.images.indexOf(item);
            return(
                <View key={index} style = {styles.imageView}>
                    <TouchableOpacity onPress={() => {this.setState({ showImages: true, indexImage: index })}}>
                        <Image style={styles.carouselImage} source={{ uri: this.state.images[index] }} />
                    </TouchableOpacity>
                </View>
            )
		} else {
			return ;
		}
    }

    

    disableModal () {
		this.setState({ showImages: false });
    }

    render() {
		return (
			<View style={styles.container}>
                <Modal
					visible={this.state.showImages}
					transparent={true}
					onRequestClose={() => {
						this.disableModal();
					}}
				>
					<ImageViewer
						imageUrls={this.state.galleryObj}
						index={this.state.indexImage}
						swipeDownThreshold={0.5}
						enableSwipeDown={true}
						onSwipeDown={() => {this.setState({ showImages: false })}}
					/>
				</Modal>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
					<View style={styles.returnView}>
						<Image
							style={styles.returnImage}
							source={require('../../../../assets/images/arrow-left.png')}
						/>
						<Text style={{marginLeft: 5}}>
							voltar
						</Text>
					</View>
				</TouchableOpacity>
                <FlatList
                    ListHeaderComponent = {() =>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={this.goToUserProfile.bind(this)}>
                                <View style={styles.userHeader}>
                                    <UserImgProfile circular marginBottom={5} height={45} width={45} uri={this.state.userImage? this.state.userImage : null}/>
                                    <Text style={styles.userName}>{this.state.userName}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.postHeader}>
                                <View style={styles.textHeader}>
                                    <Text style={styles.title}>{this.state.title}</Text>
                                    <View style = {{width: theme.width * 0.7}}>
                                        <Text style={styles.text}>{this.state.text}</Text>
                                    </View>
                                </View>
                                <View style={styles.carouselView}>
                                    <CarouselModaFoka images={this.state.images} renderMethod={this.getModalImagesLayout.bind(this)}/>
                                </View>
                            </View>
                            <Text style={styles.date}>{this.state.date}</Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                    data = {this.state.comments}
                    renderItem={ ({item}) =>
                        < BoardCommentaryViewer commentary={item} navigation={this.props.navigation} commentaryCallback= {this.commentaryCallback.bind(this)} deleteCommentary={this.commentaryDelete.bind(this)} />
                    }
                    keyExtractor={item => item.cid}
                    onEndReachedThreshold={0.3}
                    showsVerticalScrollIndicator={false}
                    onEndReached={ ({ distanceFromEnd }) => {
                        this.pullMoreCommentaries(distanceFromEnd);
                    }}
                    ListFooterComponent={ this.renderFooter.bind(this)}
                    />
                <FAB
                    style={styles.fab}
                    small
                    icon={require('../../../../assets/images/comment-regular.png')}
                    onPress={this._openBoardCommentaryWriter.bind(this)}
                />
                <AwesomeAlert
					show={this.state.showAlert}
					showProgress={false}
					title= {"Denúncia realizada"}
		      		message= {"Nossos criadores irão analisar a postagem denunciada"}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showConfirmButton={true}
					confirmText= {"OK"}
					confirmButtonColor={'green'}
					onConfirmPressed={() => {
						this.setState({ showAlert: false })
					}}
				/>
                <AwesomeAlert
					show={this.state.showDeleteAlert}
					showProgress={false}
					title= {"Tem certeza que deseja excluir ? "}
					titleStyle = {{fontSize: 15, justifyContent: 'center'}}
					message= {"Após confirmada essa ação não poderá ser desfeita."}
					messageStyle = {{fontSize: 13}}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showCancelButton = {true}
			  		cancelText = {"Não"}
					showConfirmButton={true}
					confirmText= {"Sim"}
					confirmButtonColor={'green'}
					onConfirmPressed={() => {
						 this.deletePost();
					}}
					onCancelPressed={() => {
						this.setState({ showDeleteAlert: false })
					}}
				/>
                <Modal
					statusBarTranslucent={false}
					transparent={true}
					hardwareAccelerated={true}
					animationType='slide'
					visible={this.state.showBoardCommentaryModal}
					onDismiss={this._hideModal}
					onRequestClose={this._hideModal.bind(this)}
					contentContainerStyle={{backgroundColor: 'white', width: theme.width + 10, height: theme.height, position: 'absolute'}}
				>
                    <BoardCommentaryWriter close={this._hideModal.bind(this)} pid={this.state.pid} saveComment={this.addCommentary.bind(this)}/>
				</Modal>
            </View>
		)
	}
}

const styles = StyleSheet.create({
    container: {
        width: theme.width * 0.98,
        alignSelf: 'center',
        paddingTop: theme.height * 0.007,
        paddingBottom: theme.height * 0.01,
        flex: 1
    },
    header:{
        width: theme.width , 
        marginBottom: 15,
        borderBottomColor: '#b2b5b1', 
        borderTopColor: '#b2b5b1', 
        paddingTop: theme.height * 0.02, 
        borderBottomWidth: 0.4, 
        paddingBottom: theme.height * 0.01,
        borderTopWidth:0.2, 
        justifyContent:"center"
    },
    fab: {
		position: 'absolute',
		backgroundColor: theme.primary,
		marginTop: theme.height * 0.75,
		marginLeft: theme.width * 0.80,
		padding: 5,
    },
    deleteImgIcon: {
		width: 20,
		height: 20,
		borderColor: 'black',
		tintColor: 'white',
    },
    returnView:{
        flexDirection: 'row', 
        marginBottom: 10,  
        paddingLeft: 12
    },
    returnImage: {
        width: 12, 
        height: 12, 
        marginTop:4
    },
    carouselImage: {
		width: theme.width * 0.75,
		height: theme.height * 0.27,
        alignSelf:'center',

    },
    imageView: {
		height: theme.height * 0.27,
		width:theme.width * 0.8,
		alignSelf:'center',
		
    },
    userHeader: {
        flexDirection: 'row',
        width: theme.width * 0.95, 
        alignItems: 'center',
        alignSelf: 'center'
    },
    date:{
        fontSize: 10, 
        color:'#b2b5b1', 
        width: theme.width * 0.75,
        marginLeft: theme.width * 0.1, 
        alignSelf: 'center'
    },
    userName: {
        marginLeft: 17, 
        fontWeight:'bold'
    },
    textHeader: {
        flexDirection: 'column', 
        width: theme.width * 0.90, 
        alignSelf: 'center', 
        marginLeft: theme.width * 0.27,
    },
    title: {
        fontWeight:'700', 
        marginBottom: theme.height * 0.02, 
        marginTop: theme.height * 0.02
    },
    postHeader: {
        width: theme.width * 0.9, 
        alignSelf:'center', 
        flexDirection: 'column'
    },
    text: {
        marginBottom: theme.height * 0.02, 
        flexWrap: 'wrap', 
        textAlign: 'justify'
    },
    carouselView: {
        alignContent: 'center',
        width: theme.width * 0.75, 
        marginLeft: theme.width * 0.1,
        alignSelf: 'center'
    }
})