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
		this.state = {
			userImage: '',
			courseData: null
		}
	}

	componentDidMount = () => {
		console.log("Vou chamar as foto");
		heimdallr.getPortalPhoto().then(
			(resolve) => {
				this.setState({ userImage: `data:image/png;base64,${resolve}` });
			},
			(reject) => {
				console.log("caiu no reject");
				this.props.navigation.replace('LoginPortal');
			}
		);

		heimdallr.getStudentInfo().then(
			(resolve) => {
				this.setState({ courseData: resolve });
			},
			(reject) => {
				this.props.navigation.replace('LoginPortal');
				// this.props.navigation.pop();
				// this.props.navigation.navigate('LoginPortal');
				// console.log("caiu no reject");
			}
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={{ marginTop: 15 }}>
					<Image
						source={{ uri: this.state.userImage }}
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
					this.state.courseData &&
					<View>
						<View>
							<Text style={styles.courseName}>{this.state.courseData.pessNomeVc}</Text>
						</View>
						<View style={{ marginTop: 15 }}>
							<Text>{this.state.courseData.cursAbrevVc}</Text>
						</View>
						<View style={{ marginTop: 15 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<View style={{ flexDirection: 'row' }}>
									<Text>CR: </Text>
									<Text>{this.state.courseData.alCuCoefNr}</Text>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<Text>{this.state.courseData.alCuPeriodoNr}</Text>
									<Text>° período</Text>
								</View>
							</View>
						</View>
						<View style={{ flexDirection: 'row', marginTop: 4 }}>
							<Text>RA: </Text>
							<Text>{this.state.courseData.ra}</Text>
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
