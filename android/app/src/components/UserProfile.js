import React from 'react';
import {
	Dimensions,
	StyleSheet,
	View,
	Text,
	TextInput,
	Image,
	TouchableOpacity,
	PermissionsAndroid,
	FlatList,
	ActivityIndicator,
} from 'react-native';

import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-picker';
import PostViewer from "../../../../components/General/PostViewer";
import heimdallr from '../../../../components/Heimdallr/Heimdallr';
import UserImgProfile from '../../../../components/General/UserImgProfile';
import Modal from "react-native-modal";
import UUIDGenerator from 'react-native-uuid-generator';
import theme from "../../../../components/General/Theme";
const width = Dimensions.get('screen').width;

export default class UserProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			posts: null,
			pulledPosts: 10,
			loading: false,
			pulling: false,
			endPulling: false,
		};
	}

	componentDidMount = () => {
		heimdallr.getSimilarUser();
		console.log('token: ', this.props.user);
		let result = heimdallr.getUserColletion('post', this.state.pulledPosts, heimdallr.user_id);
		result.then( (resolve) => {
			console.log('peguei esses caras aqui', resolve);
			this.setState({ posts: resolve });
		});
	}

	pullMorePosts = (distanceFromEnd) => {
		if (!this.state.endPulling) {
			console.log('interval?', distanceFromEnd);
			console.log('state before: ', this.state);
			if (!this.state.pulling) {
				console.log('int pullling');
				this.setState({ pulling: true });
				console.log('chegou');
				let n = this.state.pulledPosts;
				n = 5 + n;
				console.log('puxando: ', n);
				let result = heimdallr.getUserColletion('post', n, heimdallr.user_id);
				result.then((resolve) => {
					if (resolve.length === this.state.posts.length) {
						this.setState({ endPulling: true });
					}
					console.log(`resolve do carai? `, resolve);
					this.setState({posts: resolve});
					this.setState({pulledPosts: n});
					this.setState({ pulling: false });
				});
			}
		}
	}

	renderFooter = () =>  {
		if (!this.state.endPulling) {
			return (
				<View style={{marginBottom: 70}}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			);
		}
		return (
			<Text>Fim da linha</Text>
		)
	};




	render() {
		return (
			<View style={{}}>
				<FlatList
					data = {this.state.posts}
					renderItem={ ({item}) =>
							<PostViewer text={item._data.text} pid={item._data.pid} uid={item._data.uid} images={item._data.images} user={item._data.user_name} userImage={item._data.user_image} navigation={this.props.navigation}/>
					}
					ListHeaderComponent={() =>
						<View style={styles.profileHeader}>
							<UserImgProfile circular height={70} width={70} borderWidth={2} borderColor={theme.primary} uri={heimdallr.user_image}/>
							<View style={styles.headerText}>
								<Text>{heimdallr.user_name}</Text>
							</View>
						</View>
					}
					keyExtractor={item => item._ref.id}
					onEndReachedThreshold={0.3}
					onEndReached={({ distanceFromEnd }) => {
						this.pullMorePosts(distanceFromEnd);
					}}
					ListFooterComponent={ this.renderFooter.bind(this)}

				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
	},
	profileHeader: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: theme.primary,
		height: 100,
		padding: 10,
	},
	headerText: {
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		marginLeft: 20,
	},
});
