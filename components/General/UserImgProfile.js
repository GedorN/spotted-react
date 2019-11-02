import React from 'react';
import {
  View,
  Image,
} from 'react-native';
export default class UserImgProfile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log('props: ', this.props);
  }

  getImageStructure() {
    console.log('props: ', this.props);
    if (this.props.uri) {
      console.log('caiu no if');
      return (
        <Image
          source={{uri: this.props.uri}}
          style={{width: this.props.width ? this.props.width : 60,
            height: this.props.height ? this.props.height : 60,
            borderRadius: this.props.circular ? 100 : 0,
            borderWidth: this.props.borderWidth ? this.props.borderWidth : 0,
            borderColor: this.props.borderColor ? this.props.borderColor : null}}
        />
      );
    } else {
      console.log('caiu no else');
      return (
        <Image
          source={require('../../assets/images/mask-solid.png')}
          style={{width: this.props.width ? this.props.width : 60,
            height: this.props.height ? this.props.height : 60,
            borderRadius: this.props.circular ? 100 : 0,
            borderWidth: this.props.borderWidth ? this.props.borderWidth : 0,
            borderColor: this.props.borderColor ? this.props.borderColor : null}}
        />
      );
    }
  }

  render() {
    return (
      <View>
        {this.getImageStructure()}
      </View>
    );
  }
}

