import React from 'react';

import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	FlatList
} from 'react-native';
import theme from "../../../../../components/General/Theme";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import PeriodProgressCard from "./components/PeriodProgressCard";


export default class CourseInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			periodsProgress: [],
			courseData: [],
		}
	}

	componentDidMount(): void {
		heimdallr.getUserCourseData().then(
			(resolve) => {
				this.setState({ periodsProgress: resolve.courseProgress, courseData: JSON.parse(resolve.processedData) })
				console.log("Resolve retonado: ", resolve.courseProgress);
			},
			(reject) => {
				this.fetchData();
			}
		)
	}

	fetchData () {
		console.log("Pesquisando nvoamente");
		heimdallr.getUserCourseData().then(
			(resolve) => {
				this.setState({ periodsProgress: resolve.courseProgress, courseData: resolve.processedData })
				console.log("Resolve retonado: ", resolve.courseProgress);
			},
			(reject) => {
				this.fetchData();
			}
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<View style = { styles.header }>
					<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
						<View style={{ flexDirection: 'row', width: theme.width * 0.2, height:theme.height * 0.04 }}>
							<Image
								style={ styles.arrowImage }
								source={require('../../../../../assets/images/chevron-circle-left-solid-white.png')}
							/>
						</View>
					</TouchableOpacity>
					<Text style = { styles.headerText }>Progresso do curso</Text>
				</View>
				<FlatList
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps={'always'}
					keyExtractor={ (item, index) => index }
					data={ this.state.periodsProgress }
					renderItem={ ({ item, index }) =>
						<PeriodProgressCard title = { (index + 1) + "° Período" }  progress={item} periodData={this.state.courseData[index]}/>
					}
				/>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		height: theme.height * 0.9,
		flex: 1
	},
	header: {
		backgroundColor: '#F6C500',
		paddingTop: 10,
		paddingBottom: 20,
		marginBottom: 6,
	},
	headerText: {
		fontSize: 20,
		alignSelf: 'center',
		fontWeight: 'bold'
	},
	arrowImage: {
		width: 30,
		height: 30,
		opacity: 0.6,
		position: 'absolute',
		marginLeft: 8,
		marginTop: 8
	}
});
