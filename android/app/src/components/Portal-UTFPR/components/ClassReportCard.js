import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image
} from "react-native";
import theme from "../../../../../../components/General/Theme";

export default class ClassReportCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.className} >{this.props.class.discNomeVc}</Text>
        </View>
        <View style={styles.body}>
          <Text>oi</Text>
        </View>
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: theme.width * 0.93,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 9,
    alignSelf: 'center',
    marginVertical: 7,
  },
  header: {
    backgroundColor: '#F6C500',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    padding: 12
  },
  body: {
    flex: 3
  },
  className: {
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'black',
    fontSize: 16,
  }
})
