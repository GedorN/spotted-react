import React from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
} from 'react-native';

import UserImgProfile from "../../../../components/General/UserImgProfile";
import theme from "../../../../components/General/Theme";


export default class Notification extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
		};
    }

    return = () => {
		this.props.navigation.goBack();
    }

    goToUserProfile = () => {
		if (this.props.origin === 'spotted') {
			return ;
		}
		 this.props.navigation.push('UserProfile', {
			userId: this.props.uid_notification,
		});

    }

    goToPostDetails = () => {
        this.props.navigation.push('PostDetails',{
            pid:this.props.eid,
        })
    }

    goToBoardItemDetails = () => {
        this.props.navigation.push('BoardItemDetails',{
            pid:this.props.eid,
            origin: this.props.origin,
            docName: this.props.docName,
        })
    }

    goToDetails = () => {
      if (this.props.origin) {
        switch (this.props.origin) {
          case 0:
            this.goToPostDetails();
            break;
          case 1:
            this.goToBoardItemDetails();
            break;
          default:
            break;
        }
      } else {
        this.goToPostDetails();
      }
    }

  redirectToTaggedUser (user) {
    this.props.navigation.navigate('UserProfile', {
      userId: user.uid,
    });
  }

  renderPostText (text) {
    try {
      if (this.props.taggedUsers) {
        let words = text.split(' ');
        let p_index= 0;
        let element = <Text style={{ flexWrap: 'wrap', marginLeft: 4 }} > {words.map((w) => {
          if (w !== '@%') {
            return  <Text style = {{ marginBottom: 0 }}>{w} </Text>
          } else {
            if (this.props.taggedUsers[p_index]) {
              const user = this.props.taggedUsers[p_index]
              return (
                <Text
                  style = {{ flexWrap: 'wrap', marginBottom: 0, color: theme.primary, fontWeight: "bold", zIndex: 10}}
                  onPress={() => this.redirectToTaggedUser(user)}
                >
                  @{this.props.taggedUsers[p_index++].name}
                </Text>
              )
            } else {
              return  <Text style = {{marginBottom: 0}}>{w} </Text>
            }
          }
        })} </Text>
        return (
          element
        )
      }
      return (
        <Text style={{ flexWrap: 'wrap', marginLeft: 4 }} >
          {text}
        </Text>
      );
    } catch (e) {
      console.log(e);
      return (
        <Text style={{ flexWrap: 'wrap', marginLeft: 4 }} >
          {text}
        </Text>
      )
    }

  }


    render = () => {
		return (
            <View style = {this.props.visualized > 0 ? styles.postVisualized : styles.noVisualized}>
                <TouchableOpacity  onPress={this.props.anonymous == '0'?this.goToUserProfile.bind(this):null}>
                    <UserImgProfile circular height={45} width={45}  uri={this.props.anonymous == '0'?this.props.image_uri:null}/>
                </TouchableOpacity>
                <TouchableOpacity  onPress={this.goToDetails.bind(this)}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: theme.width * 0.82,
                        marginTop: 7,
                        marginLeft: 7,
                      }}>
	                    {
	                    	this.props.entity === 'commentary' &&
			                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
	                            <Text style={{fontWeight: 'bold', flexWrap: 'wrap'}}>{this.props.anonymous == '0'?this.props.user_name:'Anônimo'}</Text>
			                    <Text style={{flexWrap: 'wrap', marginLeft: 4}}>comentou na sua postagem:</Text>
                            { this.renderPostText(this.props.notification_text) }
			                </View>
	                    }
	                    {
		                    this.props.entity === 'like' &&
		                    <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
			                    <Text style={{fontWeight: 'bold', flexWrap: 'wrap'}}>{this.props.anonymous == '0'?this.props.user_name:'Anônimo'}</Text>
			                    <Text style={{flexWrap: 'wrap', marginLeft: 4}}>{this.props.notification_text}</Text>
		                    </View>
	                    }
                      {
                        this.props.entity === 'generic' &&
                        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                          <Text style={{fontWeight: 'bold', flexWrap: 'wrap'}}>{this.props.anonymous == '0'?this.props.user_name:'Anônimo'}</Text>
                          { this.renderPostText(this.props.notification_text) }
                        </View>
                      }

                    </View>
                </TouchableOpacity>
            </View>
		);
	}
}

const styles = StyleSheet.create({
    postVisualized: {
      alignSelf: 'flex-start',
      alignContent: 'flex-start',
      justifyContent: 'flex-start',
	    flex: 1,
      width: theme.width + 4,
      padding: 8,
      paddingLeft: 15,
      // paddingTop: 15,
      paddingRight: 10,
      paddingBottom: 15,
      color: 'black',
      flexDirection: 'row',
      borderWidth: 0.2,
      borderColor: 'rgba(59, 56, 50, 0.2)',
    },
    noVisualized: {
        backgroundColor: '#e0e0eb',
        alignSelf: 'flex-start',
	    flex: 1,
	    width: theme.width + 4,
        paddingLeft:15,
        paddingTop: 15,
        paddingRight:10,
        paddingBottom:15,
        color: 'black',
        flexDirection: 'row',
        borderWidth:0.2,
        borderColor: 'rgba(59, 56, 50, 0.2)',
    },

})
