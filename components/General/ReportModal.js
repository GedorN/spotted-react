import React from'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import heimdallr from "../Heimdallr/Heimdallr";

export default class ReportModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    makeReport (idReport) {
        console.warn('reporting: ', idReport);
        const params = {};
        params.date = new Date();
        params.solved = -1;
        params.report_category = idReport;
        params.author = heimdallr.user_id;
        let result = heimdallr.saveCollection('report', params);
        result.then(function (resolve) {
            console.warn('report has been done!');
            // this.props.disableModal();
        });

    }

    render() {
        return (
            <View style={{backgroundColor: 'white', height: 200, flexDirection: 'column', justifyContent: 'space-between', padding: 3 }}>
                <View style={styles.option}>
                    <TouchableOpacity style={{flex: 1}} onPress={this.makeReport.bind(this, 1)}>
                        <Text>Violência</Text>
                    </TouchableOpacity >
                </View>
                <View style={styles.option}>
                    <TouchableOpacity style={{flex: 1}} onPress={this.makeReport.bind(this, 2)}>
                        <Text>Nudez</Text>
                    </TouchableOpacity>
                </View >
                <View style={styles.option}>
                    <TouchableOpacity style={{flex: 1}} onPress={this.makeReport.bind(this, 3)}>
                        <Text>Ofencivo</Text>
                    </TouchableOpacity >
                </View>
                <View style={styles.option}>
                    <TouchableOpacity style={{flex: 1}} onPress={this.makeReport.bind(this, 4)}>
                        <Text>Outros...</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    option: {
        backgroundColor: 'red',
        flex: 1,
        padding: 5
    }
});
