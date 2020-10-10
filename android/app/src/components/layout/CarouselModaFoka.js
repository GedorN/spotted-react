import React from 'react';

import {
	Image,
	StyleSheet,
	View,
	TouchableOpacity,
	Modal,
} from 'react-native';

import Carousel, {Pagination} from 'react-native-snap-carousel';
import theme from "../../../../../components/General/Theme";
import ImageViewer from "react-native-image-zoom-viewer";

export default class CarouselModaFoka extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
			showImageFull: false,
			galleryObj: [],
			showImageIndex: 0,
		}
	}

	componentDidMount(): void {
		for(let i = 0; i < this.props.images.length; i++) {
			this.state.galleryObj.push({ url: this.props.images[i] });
		}
	}

	disableModal () {
		this.setState({ showImageFull: false });
	}

	showImageFull = (image) => {
		this.setState({ showImageFull: true, showImageIndex: this.props.images.indexOf(image) });
	}

	renderPage({item}) {
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={this.showImageFull.bind(this, item)}>
				<View style = {{ height:theme.height * 0.40,width:theme.width * 0.8,alignSelf:'center',marginBottom:theme.height * 0.03}}>
					<Image style={{flex: 1, resizeMode: 'contain', width: theme.width * 0.75, height:theme.height * 0.45, alignSelf:'center'}} source={{ uri: item }} />
				</View>
			</TouchableOpacity>
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
					renderItem={ this.props.renderMethod ? this.props.renderMethod : this.renderPage.bind(this)}
					loop={true}
					autoplay={true}
					autoplayInterval={5000}
					enableMomentum={false}
					onSnapToItem = { index => this.setState({activeIndex:index}) }
				/>
				<Pagination dotsLength={this.props.images.length} activeDotIndex={this.state.activeIndex} dotColor={this.props.dotColor ? this.props.dotColor : theme.primary} inactiveDotColor="gray"/>
				<Modal
					visible={ this.state.showImageFull }
					transparent={ true }
					onRequestClose={() => {
						this.disableModal();
					}}
				>
					<ImageViewer
						imageUrls={this.state.galleryObj}
						index={this.state.showImageIndex}
						swipeDownThreshold={0.5}
						enableSwipeDown={true}
						onSwipeDown={() => {this.setState({ showImageFull: false })}}
					/>
				</Modal>
			</View>
		)
	}

}
