import React from 'react';
import { createStackNavigator, StackViewTransitionConfigs } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import MainScreen from './src/components/MainScreen';
import SignUp from "./src/components/SIgnUp/SignUp";
import PasswordRestore from "./src/components/PasswordRestore";
import PresentationProfile from "./src/components/PresentationProfile";
import PostDetails from "./src/components/PostDetails";
import UserProfile from "./src/components/UserProfile";
import ProductScreen from "./src/components/ProductScreen";
import Store from "./src/components/Store";
import Settings from "./src/components/Settings";
import Tickets from "./src/components/Tickets";
import AboutUs from "./src/components/AboutUs";
import Board from "./src/components/Board";
import BoardItems from "./src/components/BoardItems";
import BoardItemDetails from "./src/components/BoardItemDetails";
import PartnerPlans from "./src/components/Inputs/PartnerPlans";
import ReceivedPhoneRequests from "./src/components/phoneRequest/ReceivedPhoneRequests";
import MyPhoneRequests from "./src/components/phoneRequest/MyPhoneRequests";
import ReportScreen from "./src/components/ReportScreen";
import ThanksForReport from "./src/components/ThanksForReport";
import PortalUTFPR from "./src/components/Portal-UTFPR/PortalUTFPR";
import LoginPortal from "./src/components/Portal-UTFPR/LoginPortal";
import StudentHistory from "./src/components/Portal-UTFPR/StudentHistory";
import CourseInfo from "./src/components/Portal-UTFPR/CouseInfo";
import Schedule from "./src/components/Portal-UTFPR/Schedule";
import PortalSettings from "./src/components/Portal-UTFPR/PortalSettings";
import ReportCard from "./src/components/Portal-UTFPR/ReportCard";

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
		Plans: {screen: PartnerPlans},
		ReceivedRequests: { screen: ReceivedPhoneRequests },
		MyPhoneRequests: { screen: MyPhoneRequests },
		ReportScreen: { screen: ReportScreen },
		ThanksForReport: { screen: ThanksForReport },
		PortalUTFPR: { screen: PortalUTFPR },
		LoginPortal: { screen: LoginPortal },
		StudentHistory: { screen: StudentHistory },
		CourseInfo: { screen: CourseInfo },
    Schedule: { screen: Schedule },
    PortalSettings: { screen: PortalSettings },
    ReportCard: {screen: ReportCard }
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
