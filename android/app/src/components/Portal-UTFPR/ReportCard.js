import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import theme from "../../../../../components/General/Theme";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ClassReportCard from "./components/ClassReportCard";

export default class ReportCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      courses: [],
    }
  }

  componentDidMount() {
    heimdallr.getStudentReportCard().then(
      (resolve) => {
        this.setState({ courses: resolve, loaded: true });
      },
      (err) => {
        console.error('[ReportCard] error: ', err)
      }
    )
  }

  render() {
    return (
      <View>
        <View style = { styles.header }>
          <TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
            <View style={{ flexDirection: 'row', width: theme.width * 0.2, height:theme.height * 0.04 }}>
              <Image
                style={ styles.arrowImage }
                source={require('../../../../../assets/images/chevron-circle-left-solid-white.png')}
              />
            </View>
          </TouchableOpacity>
          <Text style = { styles.headerText }>Boletim</Text>
        </View>
        {
          this.state.loaded ?
            <View style={ styles.body }>
              <FlatList
                // showsVerticalScrollIndicator={false}
                // showsVerticalScrollIndicator={false}
                keyExtractor={ (item, index) => index }
                data={ this.state.courses }
                renderItem={ ({ item }) =>
                  <ClassReportCard class={ item } />
                }
              />
            </View>
          :
            <SkeletonPlaceholder>
              <SkeletonPlaceholder style={{ marginTop: 25, justifyContent: 'space-evenly', alignItems: 'center'}}>
                <SkeletonPlaceholder.Item width={ theme.width * 0.93 } height={ theme.height * 0.17 } borderRadius={20}>
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={ theme.width * 0.93 } height={ theme.height * 0.17 } borderRadius={20} marginTop={10}>
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={ theme.width * 0.93 } height={ theme.height * 0.17 } borderRadius={20} marginTop={10}>
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={ theme.width * 0.93 } height={ theme.height * 0.17 } borderRadius={20} marginTop={10}>
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={ theme.width * 0.93 } height={ theme.height * 0.17 } borderRadius={20} marginTop={10}>
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            </SkeletonPlaceholder>
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F6C500',
    paddingTop: 10,
    paddingBottom: 20
  },
  body: {
    marginTop: 10,
    height: theme.height * 0.79,
  },
  headerText: {
    fontSize: 20,
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  arrowImage: {
    width: 30,
    height: 30,
    opacity: 0.6,
    position: 'absolute',
    marginLeft: 8,
    marginTop: 8
  }
})
