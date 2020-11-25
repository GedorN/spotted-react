import React from 'react';
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import heimdallr from "../../../../../components/Heimdallr/Heimdallr";


export default class PostOptions extends React.Component {
	constructor (props){
		super(props);
		this.state = {

		}
	}

	closeAlert = () => {
		this.props.close(true);
	}

	goToReport = () => {
		this.props.report();
	}



	deletePost = async () => {

		if(this.props.typeEntity === 'comentario'){
			this.props.deletePost(this.props.idEntity);
		}
		else {
			this.props.deletePost(true);
		}
	}

	render() {
		return (
			<View style={styles.container}>
				{
					heimdallr.user_id === this.props.userId &&
					<View>
						<View style = {{ paddingBottom: 20, paddingTop: 10}}>
							<Text style={styles.deleteTitle}>Ações</Text>
						</View>
						<TouchableOpacity onPress={this.deletePost.bind(this)}>
							<View style = {styles.deleteView}>
								<Image style= {styles.deleteIcon} source={require('../../../../../assets/images/minus-circle-solid.png')}/>
								<Text style={{fontSize: 14, fontWeight: 'bold'}}>Excluir postagem</Text>
							</View>
						</TouchableOpacity>
					</View>
				}
				{
					heimdallr.user_id !== this.props.userId &&
					<View>
						<View style = {{ paddingBottom: 20, paddingTop: 10}}>
							<Text style={styles.deleteTitle}>Ações</Text>
						</View>
						<TouchableOpacity onPress={this.goToReport.bind(this)}>
							<View style = {styles.deleteView}>
								<Image style= {styles.deleteIcon} source={require('../../../../../assets/images/ban-solid.png')}/>
								<Text style={{fontSize: 14, fontWeight: 'bold'}}>Denunciar post</Text>
							</View>
						</TouchableOpacity>
					</View>
				}
			</View>
		)
	}
}

const styles= StyleSheet.create({
	container: {
		padding: 10,
		height:200,
	},
	deleteTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#8f8f8f'
	},
	deleteView: {
		padding: 5,
		paddingBottom: 20,
		paddingTop: 10,
		flexDirection: 'row',
		margin: 5
	},
	deleteIcon: {
		opacity: 0.5,
		width: 25,
		height: 25,
		marginRight: 15
	}
})
