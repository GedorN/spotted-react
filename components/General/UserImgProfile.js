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

  render() {
    return (
      <View>
        <Image
          source={{uri:'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/teste?alt=media&token=69a7d809-ca9f-4b62-870d-3cae93aa98a4'}}
          style={{width: this.props.width ? this.props.width : 60,
                  height: this.props.height ? this.props.height : 60,
                  borderRadius: this.props.circular ? 100 : 0,
                  borderWidth: this.props.borderWidth ? this.props.borderWidth : 0,
                  borderColor: this.props.borderColor ? this.props.borderColor : null}}
        />
      </View>
    );
  }
}

