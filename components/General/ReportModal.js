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

    makeReport = (idReport) => {
        console.warn('reporting: ', idReport);
        const params = {};
        params.date = new Date();
        params.solved = -1;
        params.report_category = idReport;
        params.author = heimdallr.user_id;
        let result = heimdallr.saveCollection('report', params);
        result.then(
        	(resolve) => {
	            console.warn('report has been done!');
	            this.props.close();
            },
	        (reject) => {
        		console.log('rejecrtado: ', reject);
	        }
        );

    }

    render() {
        return (
            <View style={styles.container}>
	            <View style={{
		            backgroundColor: 'white',
		            zIndex: 100,
		            height: 40,
		            width: 600,
		            paddingLeft: 25,
		            borderBottomWidth: 0.5,
	            }}>
	                <Text style={{fontWeight: 'bold'}}>Nos ajude a entender o problema</Text>
	            </View>
                <TouchableOpacity onPress={this.makeReport.bind(this, 1)}>
                    <View style={styles.option}>
                        <Text>Violência</Text>
                    </View>
                </TouchableOpacity >
                <TouchableOpacity onPress={this.makeReport.bind(this, 2)}>
                    <View style={styles.option}>
                        <Text>Nudez</Text>
                    </View >
                </TouchableOpacity>
                <TouchableOpacity onPress={this.makeReport.bind(this, 3)}>
                    <View style={styles.option}>
                        <Text>Ofencivo</Text>
                    </View>
                </TouchableOpacity >
                <TouchableOpacity onPress={this.makeReport.bind(this, 4)}>
                    <View style={styles.option}>
                        <Text>Outros...</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 3,
		width: 600
	},
    option: {
        backgroundColor: 'white',
	    zIndex: 100,
	    height: 20,
	    width: 600,
        padding: 25,
    }
});
