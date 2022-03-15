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

  getPercentage(a, b) {
    return Math.trunc( ((a - b) / a) * 100 );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.className} >{this.props.class.discNomeVc}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.classInfoRow}>
            <Text style={styles.classInfoTitle} > Aulas: </Text>
            {
              this.props.class.aulasPrevistas ?
                <Text style={ styles.classInfoData } >
                  {this.props.class.aulasDadas} de {this.props.class.aulasPrevistas} previstas
                </Text>
              :
                <Text>Não informado</Text>
            }
          </View>
          <View style={styles.classInfoRow}>
            <Text style={styles.classInfoTitle} > Faltas: </Text>
            {
              this.props.class.aulasPrevistas ?
                <Text style={ styles.classInfoData } >
                  {this.props.class.faltas} de {Math.trunc(this.props.class.aulasPrevistas * 0.25)} permitidas
                </Text>
              :
                <Text>Não informado</Text>
            }
          </View>
          <View style={styles.classInfoRow}>
            <View style={{flexDirection: 'row', width: '50%', flexWrap: 'wrap', wordWrap: 'break-word'}}>
              <Text style={styles.classInfoTitle} > Frequência: </Text>
              {
                this.props.class.aulasDadas > 0 ?
                  <Text style={ styles.classInfoData } >
                    {this.getPercentage(this.props.class.aulasDadas, this.props.class.faltas)}%
                  </Text>
                  :
                  <Text style={{  }}>Aulas não lançadas</Text>
              }
            </View>
            <View style={{ flexDirection: 'row', width: '50%' }} >
              <Text style={styles.classInfoTitle} > Nota: </Text>
              <Text style={ styles.classInfoData } > Indisponível </Text>
            </View>
          </View>
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
    flex: 3,
    padding: 10
  },
  className: {
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'black',
    fontSize: 16,
  },
  classInfoTitle: {
    fontWeight: 'bold'
  },
  classInfoData: {

  },
  classInfoRow: {
    flexDirection: 'row',
    padding: 5
  }

})
