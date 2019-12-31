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
			<View>
				<Text>{this.state.post ? this.state.post.text : null}</Text>
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