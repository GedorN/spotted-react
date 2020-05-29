import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import MainScreen from './android/app/src/components/MainScreen';
import SignUp from "./android/app/src/components/SignUp";
import PasswordRestore from "./android/app/src/components/PasswordRestore";
import PresentationProfile from "./android/app/src/components/PresentationProfile";
import PostDetails from "./android/app/src/components/PostDetails";
import UserProfile from "./android/app/src/components/UserProfile";
import ProductScreen from "./android/app/src/components/ProductScreen";
import Store from "./android/app/src/components/Store";
import Settings from "./android/app/src/components/Settings";
import Tickets from "./android/app/src/components/Tickets";
import AboutUs from "./android/app/src/components/AboutUs";


const RootStack = createStackNavigator(
	{
		Home: { screen: MainScreen },
		SignUp: { screen: SignUp },
		PasswordRestore: { screen: PasswordRestore },
		PresentationProfile: { screen: PresentationProfile },
		PostDetails: { screen: PostDetails },
		UserProfile: { screen: UserProfile},
		ProductScreen: { screen: ProductScreen },
		Store: { screen: Store },
		Settings: { screen: Settings },
		Tickets: { screen: Tickets},
		AboutUs: { screen: AboutUs },

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

//App.js
