import React from 'react';
import {StyleSheet, Platform, Image, Text, View, ScrollView, Dimensions, FlatList, TouchableOpacity, TextInput} from 'react-native';

const width = Dimensions.get('screen').width;
import firebase from 'react-native-firebase';

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foto: {...this.props.foto, likers: [{}]},
      valorComentario: ''
    }
  }

  async componentDidMount() {
    // TODO: You: Do firebase things
    // const { user } = await firebase.auth().signInAnonymously();
    // console.warn('User -> ', user.toJSON());

    // await firebase.analytics().logEvent('foo', { bar: '123'});
  }

  loadIcon(likeada) {
    return likeada ?  require('../../../../assets/images/s2-checked.png') : require('../../../../assets/images/s2.png');
  }

  like() {
    const {foto} = this.state;
    let newList = [];
    if (!foto.likeada) {
      // newList = foto.likers.concat({login: 'meuUsuario'});
      newList =[
        ...foto.likers,
          {login: 'meuUsuario'},
      ]
    } else {
      newList = foto.likers.filter(liker => {
        return liker.login != 'meuUsuario'
      })
    }
    const image = {
      ...foto,
      likeada: !this.state.foto.likeada,
      likers: newList
    }
    this.setState({foto: image});
  }

  showLikes (likers) {
    if (likers.length <= 0) {
      return ;
    }
    return (
        <Text style={styles.likes}> {likers.length} {likers.length > 1 ? 'curtidas' : 'curtida'}</Text>
      );

  }

  showComments (foto) {
    if (foto.comentario === '') {
      return ;
    }
    return (
      <View style={styles.commentary}>
        <Text style={styles.commentTitle}> {foto.loginUsuario} </Text>
        <Text>{foto.comentario}</Text>
      </View>
    )
  }

  addComment () {
    // this.inputComment.value();
    // console.warn(this.state.valorComentario);
    const newList = [
      ...this.state.foto.comentarios,
      {id: this.state.valorComentario, login: 'meuUsuario', texto: this.state.valorComentario}
    ]

    const c = {
      ...this.state.foto,
      comentarios: newList
    }

    this.setState({foto: c});
    this.inputComment.clear();
  }

  render() {
    const { foto } = this.state;
    return (
      <View>
        <View style={styles.header}>
          <Image source={{uri: foto.urlPerfil}}
                 style={styles.profileImg}
          />
          <Text>
            {foto.loginUsuario}
          </Text>
        </View>
        < Image source={{uri: foto.urlFoto}}
                style={styles.image}/>
        <View style={styles.footer}>
          <TouchableOpacity onPress={this.like.bind(this)}>
            <Image source={this.loadIcon(foto.likeada)}
              style={styles.likeButtom}/>
          </TouchableOpacity>
          {this.showLikes(foto.likers)}
          {this.showComments(foto)}
          <View style={styles.newComment}>
            <TextInput style={styles.input}
            placeholder="Add a comment..."
             ref={input => this.inputComment = input}
             onChangeText = {text => this.setState({valorComentario: text})}
            />
            <TouchableOpacity onPress={this.addComment.bind(this)}>
              <Image source={require('../../../../assets/images/send.png')} style={styles.icon}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  header: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImg: {
    borderRadius: 20,
    marginRight: 10,
    width: 40,
    height: 40
  },
  image: {
    width: width,
    height: width
  },
  likeButtom: {
    height: 40,
    width: 40
  },
  footer: {
    margin: 10
  },
  likes: {
    fontWeight: 'bold'
  },
  commentary: {
    flexDirection: 'row'
  },
  commentTitle: {
    fontWeight: 'bold',
    marginRight: 5
  },
  input: {
    height: 40,
    flex: 1
  },
  icon: {
    width: 30,
    height: 30,
  },
  newComment: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
