import React from 'react';

import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	FlatList
} from 'react-native';
import theme from "../../components/General/Theme";
import heimdallr from "../../components/Heimdallr/Heimdallr";
import PeriodProgressCard from "./components/PeriodProgressCard";
import SkeletonPlaceholder from "react-native-skeleton-placeholder/lib/SkeletonPlaceholder";


export default class CourseInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			periodsProgress: [],
			courseData: [],
			loaded: false,
		}
	}

	componentDidMount(): void {
		heimdallr.getUserCourseData().then(
			(resolve) => {
				this.setState({ periodsProgress: resolve.courseProgress, courseData: JSON.parse(resolve.processedData), loaded: true })
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
				this.setState({ periodsProgress: resolve.courseProgress, courseData:  JSON.parse(resolve.processedData), loaded: true })
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
								source={require('../../../assets/images/chevron-circle-left-solid-white.png')}
							/>
						</View>
					</TouchableOpacity>
					<Text style = { styles.headerText }>Progresso do curso</Text>
				</View>
				{
					this.state.loaded ?
					<FlatList
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps={'always'}
						keyExtractor={ (item, index) => index }
						data={ this.state.periodsProgress }
						renderItem={ ({ item, index }) =>
							<PeriodProgressCard title = { (index + 1) + "° Período" }  progress={item} periodData={this.state.courseData[index]}/>
						}
					/>
						:
						<View>
							<View style={{ padding: 20 }}>
								<Text>Processando dados. Isso pode levar alguns segundos na primeira vez...</Text>
							</View>
							<SkeletonPlaceholder>
							<SkeletonPlaceholder.Item width={ theme.width * 0.95 } height={ theme.height * 0.135 } alignSelf="center" borderRadius={20}  marginTop={20}>
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item width={ theme.width * 0.95 } height={ theme.height * 0.135 } alignSelf="center" borderRadius={20}  marginTop={20}>
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item width={ theme.width * 0.95 } height={ theme.height * 0.135 } alignSelf="center" borderRadius={20}  marginTop={20}>
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item width={ theme.width * 0.95 } height={ theme.height * 0.135 } alignSelf="center" borderRadius={20}  marginTop={20}>
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item width={ theme.width * 0.95 } height={ theme.height * 0.135 } alignSelf="center" borderRadius={20}  marginTop={20}>
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item width={ theme.width * 0.95 } height={ theme.height * 0.135 } alignSelf="center" borderRadius={20}  marginTop={20}>
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item width={ theme.width * 0.95 } height={ theme.height * 0.135 } alignSelf="center" borderRadius={20}  marginTop={20}>
							</SkeletonPlaceholder.Item>
							</SkeletonPlaceholder>
						</View>
				}
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
