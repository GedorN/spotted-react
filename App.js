import React from 'react';
import { createStackNavigator, StackViewTransitionConfigs } from 'react-navigation-stack';
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
import {CardStackStyleInterpolator} from 'react-navigation-stack';
import Board from "./android/app/src/components/Board";
import BoardItems from "./android/app/src/components/BoardItems";
import BoardItemDetails from "./android/app/src/components/BoardItemDetails";
import PartnerPlans from "./android/app/src/components/Inputs/PartnerPlans";


const config = {
	animation: 'timing',
	config: {
		stiffness: 1000,
		damping: 500,
		mass: 3,
		overshootClamping: true,
		restDisplacementThreshold: 0.01,
		restSpeedThreshold: 0.01,
	},
};

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
		Board: { screen: Board},
		BoardItems: { screen: BoardItems },
		BoardItemDetails: { screen: BoardItemDetails},
		Plans: {screen: PartnerPlans}


	},
	{

		initialRouteName: 'Home',
		headerMode: 'none',
		defaultNavigationOptions: {
			gesturesEnabled: false,
		},



		transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
	},
)

const AppContainer = createAppContainer(RootStack);
export default class App extends React.Component {
	render(){
		return <AppContainer />
	}
}

//App.js
