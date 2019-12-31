import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import MainScreen from './android/app/src/components/MainScreen';
import SignUp from "./android/app/src/components/SignUp";
import PasswordRestore from "./android/app/src/components/PasswordRestore";
import PresentationProfile from "./android/app/src/components/PresentationProfile";
import PostDetails from "./android/app/src/components/PostDetails";
const RootStack = createStackNavigator(
	{
		Home: { screen: MainScreen },
		SignUp: { screen: SignUp },
		PasswordRestore: { screen: PasswordRestore },
		PresentationProfile: { screen: PresentationProfile },
		PostDetails: { screen: PostDetails },
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
