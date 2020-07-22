import React from 'react';

import {
	Image,
	StyleSheet,
	View
} from 'react-native';

import Carousel, {Pagination} from 'react-native-snap-carousel';
import theme from "../../../../../components/General/Theme";

export default class CarouselModaFoka extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
		}
	}

	renderPage({item}) {
		return (
			<View style = {{ height:theme.height * 0.40,width:theme.width * 0.8,alignSelf:'center',marginBottom:theme.height * 0.03}}>
				<Image style={{flex: 1, resizeMode: 'contain', width: theme.width * 0.75, height:theme.height * 0.45, alignSelf:'center'}} source={{ uri: item }} />
			</View>
		);
	}

	render() {
		return (
			<View>
				<Carousel
					layout={"default"}
					sliderWidth={300}
					itemWidth={300}
					data={this.props.images}
					renderItem={ this.props.renderMethod ? this.props.renderMethod : this.renderPage}
					loop={true}
					autoplay={true}
					autoplayInterval={5000}
					enableMomentum={false}
					onSnapToItem = { index => this.setState({activeIndex:index}) }
				/>
				<Pagination dotsLength={this.props.images.length} activeDotIndex={this.state.activeIndex} dotColor={this.props.dotColor ? this.props.dotColor : theme.primary} inactiveDotColor="gray"/>
			</View>
		)
	}

}
