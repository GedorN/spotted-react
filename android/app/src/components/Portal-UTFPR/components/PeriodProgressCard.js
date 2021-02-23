import React from 'react';

import {
	View,
	Text,
	StyleSheet,
	Animated,
	TouchableOpacity, Easing
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import theme from "../../../../../../components/General/Theme";


export default class PeriodProgressCard extends React.Component{
	constructor(props) {
		super(props);
		this.spinValue = new Animated.Value(0);
		this.state = {
			spin: this.spinValue.interpolate({
				inputRange: [0, 1],
				outputRange: ['0deg', '-180deg']
			}),
			showContent: false,
			cardHeight: new Animated.Value(0),
			cardMargin: new Animated.Value(8),
		}
	}
	componentDidMount(): void {
		console.log("E o que eu tenho? ", this.props.periodData);
	}

	showContent = () => {
		Animated.timing(
			this.spinValue,
			{
				toValue: !this.state.showContent ? 1 : 0,
				duration: 200,
				easing: Easing.linear, // Easing is an additional import from react-native
				useNativeDriver: true  // To make use of native driver for performance
			}
		).start();

		if (!this.state.showContent) {
			Animated.timing(this.state.cardMargin, {
				toValue: theme.height * 0.30 ,
				duration: 200,
				useNativeDriver: false
			}).start();
			Animated.timing(this.state.cardHeight, {
				toValue: theme.height * 0.4 ,
				duration: 200,
				useNativeDriver: false
			}).start(
				() => {
					this.setState({showContent: !this.state.showContent });
				}
			);

		} else {
			this.setState({showContent: !this.state.showContent });
			Animated.timing(this.state.cardHeight, {
				toValue: 0,
				duration: 200,
				useNativeDriver: false
			}).start();
			Animated.timing(this.state.cardMargin, {
				toValue: 8,
				duration: 200,
				useNativeDriver: false
			}).start();
		}

	}

	render() {
		return (
			<View>
				<View>
					<Animated.View style={{...styles.card, padding: 10, marginBottom: this.state.cardMargin}}>
						<TouchableOpacity onPress={ this.showContent.bind(this) } activeOpacity={1}>
							<View style={styles.row}>
								<AnimatedCircularProgress
									size={75}
									width={12}
									fill={this.props.progress}
									tintColor="#F6C500"
									backgroundColor="#d6d6d6"
									rotation={0}
								>
									{
										() => (
											<Text >{Math.trunc(this.props.progress)}%</Text>
										)


									}
								</AnimatedCircularProgress>

								<Text style={{ marginTop: theme.height * 0.04, marginRight: 10, fontWeight: 'bold', fontSize: 16}}>{ this.props.title }</Text>
								<View style={styles.arrowImage}>
									<Animated.Image
										style={{ width: 20, height: 30, transform: [{ rotate: this.state.spin }] }}
										source={ require('../../../../../../assets/images/sort-down-solid.png') }
									/>
								</View>
							</View>
						</TouchableOpacity>
					</Animated.View>
					<Animated.View style = {{ ...styles.periodInfoCard, height: this.state.cardHeight }}>
						{
							this.state.showContent &&
								<View style={{marginTop: theme.height * 0.135}}>
									<Text>ola</Text>
								</View>
						}
					</Animated.View>

				</View>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	card: {
		elevation: 4,
		backgroundColor: 'white',
		width: theme.width * 0.95,
		height: theme.height * 0.135,
		alignSelf: 'center',
		marginTop: 8,
		borderRadius: 20,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	arrowImage: {
		width:20 ,
		height: 30,
		marginTop: theme.height * 0.03,
		alignSelf: 'flex-start',
		marginRight: 10,
	},
	periodInfoCard: {
		elevation: 2,
		borderRadius: 20,
		width: theme.width * 0.95,
		alignSelf: 'center',
		position: 'absolute',
		marginTop: 20,
		zIndex: -1
	}

})
