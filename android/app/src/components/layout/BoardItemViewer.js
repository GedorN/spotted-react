import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image
} from 'react-native';

import moment from "moment";
import 'moment/locale/pt-br';
import theme from '../../../../../components/General/Theme';
import UserImgProfile from "../../../../../components/General/UserImgProfile";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";

export default class BoardItemViewer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			boardItemDate: null,
		}
	}

	componentDidMount = () => {
		const time = moment(this.props.date).fromNow();
		this.state.boardItemDate = heimdallr.getElapsedTime(time);
		this.setState({  });
	}

	goToBoardItemDetails = () => {
		this.props.navigation.push('BoardItemDetails', {
			item: this.props.item,
			docName: this.props.docName,
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPressIn={() => heimdallr.sendEvent('board_details_click')} onPress={this.goToBoardItemDetails.bind(this)}>
					<View style={styles.item}>
						<View style ={styles.header}>
							<UserImgProfile  circular marginBottom={5} height={45} width={45} uri={this.props.userImage? this.props.userImage : null}/>
							<View style={styles.userNameView}>
								<Text style={{fontWeight: 'bold'}}>{this.props.userName}</Text>
								<Image style={styles.circleSolid}
									   source={require('../../../../../assets/images/circle-solid.png') }
								/>
								<Text>{this.state.boardItemDate}</Text>
							</View>
						</View>
						<View style={styles.bodyView}>
							<View style={styles.titleView}>
								<Text style={styles.title}>{ this.props.title }</Text>
							</View>
							<View style={styles.textView} >
								<Text ellipsizeMode='tail' numberOfLines={2} style={{flexWrap:'wrap'}}>{this.props.text}</Text>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		paddingBottom: 10,
		paddingLeft:10,
		paddingRight:10,
		backgroundColor: 'white',
		marginBottom: 10,
		marginTop: 10,
		borderColor: '#b2b5b1',
		borderBottomWidth :0.2,
		width: theme.width,
		borderRadius: 10,
		alignSelf:'center'
	},
	item: {
		flexDirection:'column',
		paddingTop: 10,
		paddingBottom: 10
		/* height: 65 */
	},
	title: {
		fontWeight: 'bold',
		flexWrap: 'wrap'
	},
	header: {
		flexDirection: 'row',
		alignContent:'space-between',
		justifyContent: 'space-between',
		width: theme.width *0.9,
		alignSelf: 'center',
	},
	userNameView: {
		width: theme.width* 0.75,
		alignSelf: 'center',
		flexDirection: 'row'
	},
	circleSolid:{
		width: 4,
		height: 4,
		marginLeft: 4,
		marginRight: 4,
		marginTop:10,
		opacity:0.7
	},
	bodyView:{
		width: theme.width*0.78,
		alignSelf: 'flex-end',
		flexDirection: 'column',
		marginTop: 5
	},
	titleView: {
		width:theme.width * 0.75,
		alignSelf :'flex-start'
	},
	textView: {
		width: theme.width * 0.75,
		alignSelf: 'flex-start',
		marginTop: 10,
		paddingLeft: 5,
		height:theme.height * 0.05
	},
	commentIMage: {
		width: theme.width * 0.78,
		alignSelf: 'flex-end'
	}
});


