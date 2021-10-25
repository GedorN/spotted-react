import React from 'react';
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated, StatusBar,
} from 'react-native';

import {ProgressBar, Text} from "react-native-paper";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../../components/General/Theme";
import FatBottomedButton from "../buttons/FatBottomedButton";
import UserImgProfile from "../../../../../components/General/UserImgProfile";

export default class BoardCommentaryWriter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			postText: '',
			activity: false,
      allUsers: null,
      filteredUsers: null,
      searchingForUser: false,
      formattedText: '',
      taggedUsers: [],
      taggedUserNames: [],
      currentUserSearch: null,
      cursor: 0,
      startEditingIndex: null,
      endEditingIndex: null,

      textInputHeight: new Animated.Value(theme.height * 0.69),
      userTagInputHeight: new Animated.Value(0)
		}
	}

  componentDidMount(): void {
    this.state.allUsers = heimdallr.getCollection('user');
  }

	async savePost() {

		heimdallr.sendEvent('commentary_board_write')
		const params = {};
    if (this.state.taggedUsers.length > 0) {
      const taggedUsers = []
      for (let i = 0; i < this.state.taggedUsers.length; i++) {
        let taggedUser = {}
        taggedUser.name = this.state.taggedUsers[i].data().name;
        taggedUser.uid = this.state.taggedUsers[i].data().uid;

        taggedUsers.push(taggedUser);
      }

      params.taggedUsers = taggedUsers;

    } else {
      params.taggedUsers = false;
    }

		params.comment = this.state.postText;
		params.date = await heimdallr.getServerTime();
		params.user_image = heimdallr.user_image;
		params.user_name =  heimdallr.user_name;
		params.id_user = heimdallr.user_id;
		params.pid = this.props.pid;

		heimdallr.getUID().then((uuid) => {
			params.cid = uuid;
			this.props.saveComment(params);
		});

	}


  doPost = () =>{
    if(this.state.postText){
      this.props.close();
        this.savePost();
    } else {
      return;
    }
  }

  closeTagUser () {
    if (!this.state.searchingForUser) {
      return ;
    }
    Animated.timing(
      this.state.textInputHeight,
      {
        toValue: theme.height * 0.69,
        duration: 400,
        useNativeDriver: false
      }
    ).start();
    Animated.timing(
      this.state.userTagInputHeight,
      {
        toValue: (0),
        duration: 400,
        useNativeDriver: false
      }
    ).start();
    this.state.searchingForUser = false;
    this.setState({ searchingForUser: false, currentUserSearch: null, filteredUsers: null})
  }

  async openTagUser() {
    this.state.searchingForUser = true;
    this.state.startEditingIndex = this.state.cursor;
    this.state.endEditingIndex = this.state.cursor;
    await this.searchToTagUser(null);
    Animated.timing(
      this.state.textInputHeight,
      {
        toValue: theme.height * 0.47,
        duration: 400,
        useNativeDriver: false
      }
    ).start();
    Animated.timing(
      this.state.userTagInputHeight,
      {
        toValue: (theme.height * 0.22),
        duration: 400,
        useNativeDriver: false
      }
    ).start();
  }

  _onTextChange(text) {
    // Não foi utilizado "OnKeyPress" porquê ele estva duplicando entradas aleatóriamente
    try {
      let postText = this.state.postText;
      let key = null;
      let deletedKey = null;
      // substitui usuários marcados com @% em ambos os textos
      for (let i = 0; i < this.state.taggedUserNames.length; i++) {
        if (text.indexOf('@' + this.state.taggedUserNames[i]) >= 0) {
          text = text.replace('@' + this.state.taggedUserNames[i], '@%');
        } else {
          this.state.taggedUsers.splice(i, 1);
          this.state.taggedUserNames.splice(i, 1);
          this.setState({});

        }

        if (postText.indexOf('@' + this.state.taggedUserNames[i]) >= 0) {
          postText = postText.replace('@' + this.state.taggedUserNames[i], '@%');
        }
      }

      // Verifica qual caracter foi digitado
      if (text.length > postText.length) {
        key = text.replace(postText, '');
      } else {
        key = "Backspace";
        deletedKey = postText.replace(text, '');
      }
      this.state.postText = text;
      if (this.state.searchingForUser && key !== '@' && key !== 'Enter' && deletedKey !== '@') {
        if (key === ' ' && (this.state.cursor - 1) === this.state.startEditingIndex) {
          this.closeTagUser();
        }
        this.state.endEditingIndex = this.state.cursor;

        this.searchToTagUser(text.substring(this.state.startEditingIndex + 1, this.state.endEditingIndex + 1));


      } else if (key === '@') {
        this.state.cursor = text.length - 1;
        if (this.state.cursor === 0 || text[this.state.cursor - 1] == ' ') {
          this.openTagUser();
        }
      } else {
        this.closeTagUser();

      }

    } catch (e) {
      console.log("Erro: ", e)
    }
  }


  async searchToTagUser (text) {
    const filteredUsers = await this.state.allUsers;
    if (!text) {
      this.setState({ filteredUsers: filteredUsers.slice(0, 5) })
      this.state.cursor--;
      this.renderText(this.state.cursor - 1);
    } else {
      this.setState({ filteredUsers: filteredUsers.filter((u) => u.data().name.toLowerCase().includes(text.toLowerCase())).slice(0, 5), searchingForUser: true }, () => {
        this.renderText();
      })
    }
  }

  tagUser(user) {
    this.state.taggedUsers.push(user);
    this.state.taggedUserNames.push(user.data().name)
    this.closeTagUser();

    for (let i = 0; i < this.state.taggedUserNames.length; i++) {
      if (this.state.postText.indexOf('@' + this.state.taggedUserNames[i]) >= 0) {
        this.state.postText = this.state.postText.replace('@' + this.state.taggedUserNames[i], '@%');
      }
    }
    this.state.cursor = this.state.postText.length;
    for (let i = this.state.cursor; i >= 0; i--) {
      this.state.postText = [this.state.postText.slice(0, i), this.state.postText.slice(i + 1)].join('');
      if(this.state.postText[i - 1] === '@') {
        this.setState({ postText: [this.state.postText.slice(0, i - 1), '@% ', this.state.postText.slice(i)].join('')})
        break;
      }
      if (!this.state.postText[i - 1]) {
        this.setState({ postText: '@% ' })
        break;
      }
    }
  }

  renderText () {
    if (this.state.postText.indexOf('@%') === -1) {
      for (let i = 0; i < this.state.taggedUserNames.length; i++) {
        if (this.state.postText.indexOf('@' + this.state.taggedUserNames[i]) >= 0) {
          this.state.postText = this.state.postText.replace('@' + this.state.taggedUserNames[i], '@%');
        } else {
          this.state.taggedUserNames.splice(i, 1);
        }
      }

    }
    if (this.state.searchingForUser) {
      let c_index = 0;
      const letters = this.state.postText.split('');
      let element =  <Text>{letters.map((letter, index) => {
        if (letter === '%' && this.state.postText[index - 1] && this.state.postText[index - 1] === '@') {
          return <Text style={{ color: theme.primary, fontWeight: 'bold' }}>{this.state.taggedUserNames[c_index++]}</Text>
        } else if (( letter === '@' && (this.state.postText[index - 1] || index === 0) && this.state.postText[index + 1] === '%' ) ) {
          return <Text style={{ color: theme.primary, fontWeight: 'bold' }}>@</Text>
        } else if (index >= this.state.startEditingIndex && index <= this.state.cursor) {
          return <Text style={{ color: theme.primary, fontWeight: 'bold' }}>{letter}</Text>
        } else {
          return letter
        }
      })
      }</Text>
      return (
        element
      )
    } else {
      let c_index = 0;
      const letters = this.state.postText.split('');
      let element =  <Text>{letters.map((letter, index) => {
        if (letter === '%' && this.state.postText[index - 1] && this.state.postText[index - 1] === '@') {
          return <Text style={{ color: theme.primary, fontWeight: 'bold' }}>{this.state.taggedUserNames[c_index++]}</Text>
        } else if (( letter === '@' && (this.state.postText[index - 1] || index === 0) && this.state.postText[index + 1] === '%' ) ) {
          return <Text style={{ color: theme.primary, fontWeight: 'bold' }}>@</Text>
        } else {
          return letter
        }
      })
      }</Text>
      return (
        element
      )
    }
  }
  _handleCursor(event) {
    event.preventDefault();
    const cursor = event.nativeEvent.selection;
    if (cursor.end != cursor.start) {
      Animated.timing(
        this.state.textInputHeight,
        {
          toValue: (theme.height * 0.69),
          duration: 200,
          useNativeDriver: false
        }
      ).start();
      Animated.timing(
        this.state.userTagInputHeight,
        {
          toValue: (0),
          duration: 200,
          useNativeDriver: false
        }
      ).start();
      this.setState({ searchingForUser: false, currentUserSearch: null, filteredUsers: null})
    } else {
      this.state.cursor = cursor.end;
    }
  }

    render() {
        return (
          <View style={styles.container}>
				<View style = {{ width: theme.width }}>
					<ProgressBar size="large" visible={this.state.activity} indeterminate color={theme.primary}/>
					<View style = {styles.headerView}>
						<View style={styles.header}>
							<TouchableOpacity onPress={this.props.close}>
								<Image
									source={require('../../../../../assets/images/times-solid.png')}
									style={styles.solid}
								/>
							</TouchableOpacity>
						</View>
					</View>
          <View style={styles.tagUserView}>
            <Animated.ScrollView
              style={{
                height: this.state.userTagInputHeight,
                borderWidth: this.state.filteredUsers ? 0.2 : 0,
                borderTopRightRadius: 5,
                borderTopLeftRadius: 5
              }}
              keyboardShouldPersistTaps={'always'}>
              {
                this.state.filteredUsers &&
                this.state.filteredUsers.map((user) =>
                  <TouchableOpacity onPress={() => {this.tagUser(user)}} >
                    <View style={styles.userViewContainer}>
                      <UserImgProfile circular height={25} width={25} uri={user.data().user_image} />
                      <View style={styles.info}>
                        <Text>
                          {user.data().name}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }
            </Animated.ScrollView>
            {
              <Animated.View style={{
                width: theme.width * 0.9,
                alignSelf:'center',
                height: this.state.textInputHeight,
              }}>
                <TextInput
                  onChangeText={text => {this._onTextChange(text)}}
                  autoCapitalize="sentences"
                  multiline
                  textAlignVertical="top"
                  placeholder="O que você deseja comentar?"
                  ref={input => (this.postText = input)}
                  onSelectionChange={(cursorEvent) => this._handleCursor(cursorEvent)}
                >
                  { this.renderText() }
                </TextInput>
              </Animated.View>
            }
          </View>
					<View style={styles.button}>
						<FatBottomedButton backgroundColor = {theme.primary} color={'white'} text={'Comentar'} onTap={this.doPost.bind(this)}/>
					</View>
				</View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: theme.height,
		alignItems: 'center',
		alignContent: 'center',
		position: 'absolute',
		backgroundColor: 'white',
		zIndex: 99999
    },
    header: {
		width: theme.width * 0.2,
		height: 20,
		alignSelf:'flex-end',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		alignContent: 'center',
		padding: 4,
		marginTop: 10,
	},
	button: {
		marginTop:5,
		width: theme.width * 0.9,
		alignSelf: 'center'
	},
	solid: {
		width: 20,
		height: 20,
		marginRight:5
	},
	headerView: {
		width: theme.width * 0.98,
		alignSelf: 'center'
	},
  userViewContainer: {
    flexDirection: 'row',
    padding: 5,
    borderTopWidth: 0.2,
    borderColor: 'rgba(59, 56, 50, 0.2)', //rgba(59, 56, 50, 0.2)
    borderRadius: 10,
    zIndex: 1,
  },
  info: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  textFieldContainer: {
    borderWidth: 1,
  },
  tagUserView: {
    borderColor: '#f2f2f2',
    borderBottomWidth: 2,
    marginTop: theme.height * 0.02,
  }
})
