import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image
} from "react-native";

import theme from "../../../../../../components/General/Theme";

export default class ClassCad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.className} >{this.props.className}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5, flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: "bold", color: 'rgba(125, 125, 125 , 0.7)' }} >Inicio:</Text>
                        <Text style={{ marginLeft: 13, fontWeight: 'bold'  }}>{ this.props.inicio }</Text>
                        <Text style={{ fontWeight: "bold", color: 'rgba(125, 125, 125 , 0.7)' }} >Fim:</Text>
                        <Text style={{ marginLeft: 13, fontWeight: 'bold' }}>{ this.props.fim }</Text>

                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'space-between', flexGrow: 3, flexShrink: 1, flex: 3, padding: 5 }}>
                        <Text style={{ fontSize: 12 }}>{ this.props.professor }</Text>
                        <Text style={{ marginTop: 20 }}>{ this.props.sala }</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Image
                            style={{width: this.props.icon.largura, height: this.props.icon.altura,marginTop:5, tintColor: this.props.icon.cor}}
                            source={this.props.icon.icone} />
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
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        elevation: 9
    },
    className: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#707070',
        fontSize: 16,
    }
})
