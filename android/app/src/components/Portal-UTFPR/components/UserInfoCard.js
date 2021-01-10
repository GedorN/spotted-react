import React from 'react';

import {
	View,
	StyleSheet,
	Text,
	Image
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
					<Image
						source={{ uri: this.props.userImage }}
						style={{
							width: 70,
							height: 70,
							borderRadius: 100,
							borderWidth: 1,
							borderColor: '#F6C500',
							alignSelf: 'center',
						}}
					/>
				</View>
				{
					this.props.courseData &&
					<View>
						<View>
							<Text style={styles.courseName}>{this.props.courseData.pessNomeVc}</Text>
						</View>
						<View style={{ marginTop: 15 }}>
							<Text>{this.props.courseData.cursAbrevVc}</Text>
						</View>
						<View style={{ marginTop: 15 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<View style={{ flexDirection: 'row' }}>
									<Text>CR: </Text>
									<Text>{this.props.courseData.alCuCoefNr}</Text>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<Text>{this.props.courseData.alCuPeriodoNr}</Text>
									<Text>° período</Text>
								</View>
							</View>
						</View>
						<View style={{ flexDirection: 'row', marginTop: 4 }}>
							<Text>RA: </Text>
							<Text>{this.props.courseData.ra}</Text>
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
	courseName: {
		alignSelf: 'center',
		marginTop: 2,
		fontWeight: 'bold'
	}
});
