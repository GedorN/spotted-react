import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import MainScreen from './android/app/src/components/MainScreen';
import SignUp from "./android/app/src/components/SignUp";
const RootStack = createStackNavigator(
	{
		Home: { screen: MainScreen },
		SignUp: { screen: SignUp }
	},
	{
		initialRouteName: 'Home',
		headerMode: 'none',
		defaultNavigationOptions: {
			gesturesEnabled: false,
		},
	},
)

const AppContainer = createAppContainer(RootStack);
export default class App extends React.Component {
	render(){
		return <AppContainer />
	}
}
