import React from 'react';

import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Image,
} from 'react-native'


import theme from "../../../../../components/General/Theme";
import moment from "moment";
import 'moment/locale/pt-br';
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import UserImgProfile from "../../../../../components/General/UserImgProfile";
import PostOptions from "../Inputs/PostOptions";

import RBSheet from "react-native-raw-bottom-sheet"

export default class BoardCommentaryViewer extends React.Component {
	constructor(props) {
		super (props);
		this.state = {
      reportAlert: true,
		}
  }

  componentDidMount = () => {
		if(this.props.commentary.id_user === heimdallr.user_id){
			this.setState({reportAlert: false})
		}
	}

  goToUserProfile = () => {
		this.props.navigation.push('UserProfile', {
			userId: this.props.commentary.id_user,
		});
  }

	reportPost = () => {
		this.RBSheet.close();
		this.props.navigation.navigate('ReportScreen', {
			cid: this.props.commentary.cid,
			pid: this.props.commentary.pid,
			entity: 'board_commentary_report',
		});
	}

    deletePost = (cid) => {
		this.RBSheet.close();
		this.props.deleteCommentary(cid);
    }

    closeAlert = () => {
		this.RBSheet.close();
		this.props.commentaryCallback();
	}

  redirectToTaggedUser (user) {
    this.props.navigation.navigate('UserProfile', {
      userId: user.uid,
    });
  }

  renderPostText (text) {
    try {
      console.log("O que tenho aqui: ", this.props.commentary.taggedUsers)
      if (this.props.commentary.taggedUsers) {
        console.log("Entrei")
        let words = text.split(' ');
        let p_index= 0;
        let element = <Text> {words.map((w) => {
          if (w !== '@%') {
            return  <Text >{w} </Text>
          } else {
            if (this.props.commentary.taggedUsers[p_index]) {
              const user = this.props.commentary.taggedUsers[p_index]
              return (
                <Text
                  style = {{color: theme.primary, fontWeight: "bold", zIndex: 10}}
                  onPress={() => this.redirectToTaggedUser(user)}
                >
                  @{this.props.commentary.taggedUsers[p_index++].name}
                </Text>
              )
            } else {
              return  <Text>{w} </Text>
            }
          }
        })} </Text>
        return (
          element
        )
      }
      return (
        <Text>
          {text}
        </Text>
      );
    } catch (e) {
      console.log(e);
      return (
        <Text>
          {text}
        </Text>
      )
    }

  }

    render(){
      return(
        <View style={styles.container}>
          <View style={styles.body}>
            <View style = {{flexDirection:'row'}}>
              <TouchableOpacity  onPress={this.goToUserProfile.bind(this)}>
                <UserImgProfile circular marginBottom={5} height={45} width={45} uri={this.props.commentary.user_image? this.props.commentary.user_image : null}/>
              </TouchableOpacity>
              <View style={styles.commentaryHeader}>
                <View style = {styles.userHeader}>
                  <Text style={styles.userNameText}>
                    {this.props.commentary.user_name}
                  </Text>
                  {this.props.commentary.elapsed_time &&
                    <Image style={styles.circleSolid}
                        source={require('../../../../../assets/images/circle-solid.png') }
                    />
                  }
                  <Text style= {{flexWrap: 'wrap'}}>
                    { this.props.commentary.elapsed_time }
                  </Text>
                </View>
                <TouchableOpacity style = {styles.report} onPress={() => this.RBSheet.open()}>
                  <View style={styles.reportView}>
                    <Image
                      style={styles.ellipsis}
                      source={require('../../../../../assets/images/ellipsis-h-solid.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.comment}>
              { this.renderPostText(this.props.commentary.comment) }
            </View>
          </View>
          <RBSheet
            ref={ref => {
                this.RBSheet = ref;
            }}
            height={150}
            animationType={'slide'}
            duration={250}
          >
            <PostOptions  deletePost={this.deletePost.bind(this)} close={this.closeAlert.bind(this)} idEntity = {this.props.commentary.cid} typeEntity = {'comentario'} pid = {this.props.commentary.pid} userId = {this.props.commentary.id_user} report={this.reportPost.bind(this)}/>
          </RBSheet>
        </View>
      )
    }
}

const styles  = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 5,
		paddingBottom: 5,
		borderColor: 'rgba(59, 56, 50, 0.2)',
		borderBottomWidth: 0.18,
        backgroundColor: 'white',
	},
	body: {
		flexDirection: 'column',
        marginBottom:theme.height * 0.02,
        width: theme.width * 0.94
	},
	userNameText: {
		fontWeight: 'bold',
        marginLeft: 16,
    },
    comment: {
        width: theme.width * 0.75,
        flexWrap:'wrap',
        alignItems:'flex-start',
        alignSelf:'flex-end',
        marginRight: theme.width * 0.03
    },
    report: {
        justifyContent:'center',
        width:theme.width * 0.1,
        height:theme.height * 0.07
    },
    reportView: {
        width: 40,
        height: 20,
        zIndex: 9999,
        alignItems: 'flex-end',
        marginRight:theme.width*0.010,
        alignSelf:'flex-end'
    },
    circleSolid: {
        width: 4,
        height: 4,
        marginLeft: 4,
        marginRight: 4,
        opacity:0.7
    },
    ellipsis: {
        width: 20,
        height: 12,
        marginTop:5
    },
    userHeader: {
        flexDirection:'row',
        alignItems: 'center'
    },
    commentaryHeader: {
        width: theme.width * 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between'
    }
});
