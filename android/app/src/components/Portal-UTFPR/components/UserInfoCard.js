import React from 'react';

import {
	View,
	StyleSheet,
	Text,
	Image,
    TouchableOpacity
} from 'react-native';
import heimdallr from "../../../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../../../components/General/Theme";

export default class UserInfoCard extends React.Component {
	constructor(props) {
		super(props);
		this.props = {
			userImage: '',
			courseData: null
		}
	}

	componentDidMount = () => {
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={{ marginTop: 15 }}>
                    <TouchableOpacity onPress={this.props.goToSettings} style={{ alignSelf: 'flex-end', position: "absolute", padding: 1 }}>
                        <Image
                            source={require('../../../../../../assets/images/cog-solid.png')}
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: 100,
                                borderWidth: 1,

                            }}
                        />
                    </TouchableOpacity>
					<Image
						source={{ uri: this.props.userImage }}
						style={{
							width: 70,
							height: 70,
							borderRadius: 100,
							borderWidth: 1,
							alignSelf: 'center',
						}}
					/>


				</View>
				{
					this.props.courseData &&
					<View>
						<View>
							<Text style={styles.studentName}>{this.props.courseData.pessNomeVc}</Text>
						</View>
						<View style={{ marginTop: 15 }}>
							<Text style = { styles.courseName }>{this.props.courseData.cursNomeVc}</Text>
						</View>
						<View style={ styles.cardView }>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<View style={{ flexDirection: 'row' }}>
									<Text style = { styles.cardText }>CR: </Text>
									<Text style = { styles.cardText }>{this.props.courseData.alCuCoefNr}</Text>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<Text style = { styles.cardText }>{this.props.courseData.alCuPeriodoNr}</Text>
									<Text style = { styles.cardText }>° PERÍODO</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', marginTop: 15 }}>
								<Text style = { styles.cardText }>RA: </Text>
								<Text style = { styles.cardText }>{this.props.courseData.ra}</Text>
							</View>
						</View>
					</View>
				}
			</View>
		)
	}

}

const styles = StyleSheet.create({
	container: {
		width: theme.width * 0.9,
		height: theme.height * 0.32,
		elevation: 6,
		alignSelf: 'center',
		borderRadius: 20,
		padding: 5,
		paddingHorizontal: 30,
		backgroundColor: 'white'
	},
	studentName: {
		alignSelf: 'center',
		marginTop: 2,
		fontWeight: 'bold',
		fontSize: 15,
		textAlign: 'center'
	},
	courseName: {
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 14
	},
	cardText: {
		fontSize: 13
	},
	cardView: {
		marginTop: 15,
		width: theme.width * 0.7,
		alignSelf: 'center'
	}
});
