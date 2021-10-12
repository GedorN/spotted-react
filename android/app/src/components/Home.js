import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    ActivityIndicator,
    RefreshControl, StatusBar, TouchableOpacity,
} from 'react-native';


import PostViewer from "../../../../components/General/PostViewer";
import heimdallr from '../../../../components/Heimdallr/Heimdallr';
import moment from "moment";
import AwesomeAlert from "react-native-awesome-alerts";
import theme from "../../../../components/General/Theme";
import RUMineTextInput from "./Inputs/RUMineTextInput";
import schedule from "../../../../components/Heimdallr/UTFPRSchedule";

const PULL_QUANTITY = 100;


export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        posts: null,
        pulledPosts: PULL_QUANTITY,
        loading: true,
	    pulling: false,
	    endPulling: false,
	    isRefreshing: false,
	    scrolling: false,
		showAlert: false,
		deletePost: '',
		showDeleteAlert: false,
        nextClass: null,
    };
  }

  componentDidMount = async () => {
  	heimdallr.refreshKey = new Date();
  	this.props.navigation.addListener('willFocus', () => {
  		StatusBar.setBackgroundColor('white');
  		StatusBar.setBarStyle('dark-content');
  	});
  	  this.getStudentInfo();
      let result = heimdallr.getCollection('post', this.state.pulledPosts);
  	result.then( (resolve) => {
        if (resolve.length === 0 ) {
  			this.setState({ endPulling: true })
	    }

        resolve.forEach((doc) => {
		    const time = moment(doc.data().date).fromNow();
		    doc._data.elapsed_time = heimdallr.getElapsedTime(time);
	    })

  		this.setState({ posts: resolve }, () => {
        });
  	});
  }

  scrollToTop = () => {
	  this.flatList.scrollToIndex({index: 0, animated: true});
  }

  setRefreshing = () => {
	  this.setState({ isRefreshing: true });
  }

  pullMorePosts = (distanceFromEnd) => {
  	if (!this.state.endPulling) {
	    if (!this.state.pulling) {
	    	heimdallr.sendEvent('pulling_more_posts');
	        this.setState({ pulling: true });
		    let n = this.state.pulledPosts;
		    n = PULL_QUANTITY + n;
		    let result = heimdallr.getCollection('post', n);
		    result.then((resolve) => {
			    resolve.forEach((doc) => {
			    	if (!doc.elapsed_time) {
					    const time = moment(doc.data().date).fromNow();
					    doc._data.elapsed_time = heimdallr.getElapsedTime(time);
				    }
			    });
			    if (resolve.length === this.state.posts.length) {
				    this.setState({ endPulling: true });
			    }
		        this.setState({posts: resolve, pulledPosts: n, pulling: false});
		    });
	    }
    }
  }

  addItem = (post) => {
  	let posts = this.state.posts;
  	posts.unshift({_data: post, _ref: {id: post.pid}});
  	this.setState({ posts: posts });
  }


  onRefresh = () => {
	  this.setState({ isRefreshing: true });
	  let result = heimdallr.getCollection('post', PULL_QUANTITY);
	  if (heimdallr.UTFPRToken) {
	    this.getStudentInfo();
      }
	  result.then( (resolve) => {
	  	resolve.forEach((doc) => {
		    const time = moment(doc.data().date).fromNow();
		   doc._data.elapsed_time = heimdallr.getElapsedTime(time);
	    });
	  	this.setState({ posts: [] });
	  	this.setState({ posts: resolve, isRefreshing: false });
	  });
  }

  renderFooter = () =>  {
	  if (!this.state.endPulling) {
		  return (
			  <View style={{marginBottom: 70}}>
				  <ActivityIndicator size="large" color={theme.primary} />
			  </View>
		  );
	  }
	  return (
	  	<View style={{
	  		flex: 1,
		    height: 50,
		    flexDirection: 'row',
		    backgroundColor: theme.primary,
		    padding: 10,
		    shadowColor: "#000",
		    shadowOffset: {
			    width: 0,
			    height: 2,
		    },
		    shadowOpacity: 0.23,
		    shadowRadius: 2.62,
		    elevation: 4,
		    alignItems: 'center',
		    justifyContent: 'center'
	  	}}>
		    <Image source={require('../../../../assets/images/warning.png') } style={{height: 20, width: 25, tintColor: '#FFFFFF'}}/>
		    <Text style={{marginLeft: 5, color: '#FFFFFF'}}>Não há mais postagens para serem vistas</Text>
	    </View>
	  )
  };

  confirmPostRm =(pid) => {
	  this.setState({ showDeleteAlert: true, deletePost: pid });
  }


	confirmReport = () => {
			this.setState({ showAlert: true});
	}

	deletePost = () => {
		this.setState({ isRefreshing: true });
		heimdallr.deletePost(this.state.deletePost).then(
			() => {
				this.onRefresh();
			},
			() => {
				this.setState({ isRefreshing: false });
			}
		);
		this.setState({ showDeleteAlert: false});
	}
    getStudentInfo = () => {
        return new Promise((resolve, reject) => {
            this.setState({ loading: true })

            heimdallr.getClassSchedule().then(
                async (resolve) => {
                    let time = new Date(await heimdallr.getServerTime());
                    let date_with_tolerance = time
                    date_with_tolerance.setMinutes(date_with_tolerance.getMinutes() - 15)
                    let today = time.getDay() + 1
                    // Pega todas as aulas no dia
                    let todayClass = resolve.filter((aula) => (aula.horarios.filter((horario) => horario.horaDescrVc[0] == today).length > 0))
                    // Vê quais horários ainda estão disponíveis
                    let todaySchedule = schedule.filter((h) => parseInt(h.begin.substring(0,2)) > parseInt(date_with_tolerance.getHours()) || (parseInt(h.begin.substring(0,2)) === parseInt(date_with_tolerance.getHours()) && parseInt(h.begin.substring(3, 6)) >= parseInt(date_with_tolerance.getMinutes())))
                    let schedules = Object.keys(todaySchedule)
                    let nextClass = []

                    for (let i = 0; i < schedules.length; i++) {
                        nextClass = todayClass.filter((clss) => (clss.horarios.filter((h) => h.horaDescrVc === `${today}${todaySchedule[i].name}` )).length > 0)
                        if (nextClass.length > 0) {
                            nextClass = nextClass[0]
                            nextClass.schedule = `${today}${todaySchedule[i].name}`
                            nextClass.begin = schedule.filter((s) =>  nextClass.schedule.includes(s.name) )[0].begin
                            this.setState({ nextClass: nextClass, loading: false })
                            break;
                        }
                    }
                    if (schedules.length === 0) {
                        this.setState({ nextClass: null, loading: false })
                    }
                    resolve();
                },
                () => {
                    heimdallr.renewStudentAuthentication().then(
                        async () => {
                            this.getStudentInfo();
                        },
                        () => {
                            if (!heimdallr.deviceToken) {
                              let self = this;
                              setTimeout(function () {
                                self.getStudentInfo();

                              }, 500)

                            } else {
                              this.setState({ loading: false});
                            }
                            resolve();

                        }
                    )
                }
            )
        })

    }

    getHeader () {
      if (!this.state.loading) {
          if (this.state.nextClass) {
              return (
                  <View style = { styles.UTFPRPortalContainer }>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('PortalUTFPR')}>
                          <View style={{ flexDirection: 'row' }}>
                              <View style={{ backgroundColor: 'black', width: '10%', justifyContent: 'center', alignItems: 'center', borderBottomRightRadius: 10, borderTopRightRadius: 10 }}>
                                  <Image source={require('../../../../assets/images/PORTAL-UTFPR/clock-regular.png')} style={{ width: 30, height: 30, tintColor: 'white' }}/>
                              </View>
                              <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>
                                  <View style={{ flex: 1, maxWidth: '90%', flexDirection: 'row', textAlign: 'center' , justifyContent: 'center' }}>
                                      <Text style={{ fontWeight: 'bold' }}>Próxima aula:</Text>
                                  </View>
                                  <View style={{flex: 1, maxWidth: '90%', flexWrap: 'wrap', wordWrap: 'wrap', flexDirection: 'column', marginLeft: 10 }}>
                                      <View style={{ flexDirection: 'row' }}>
                                        <Text style={{flex: 1, flexWrap: 'wrap', wordWrap: 'wrap' }}>{ this.state.nextClass.discNomeVc } - { this.state.nextClass.begin }h</Text>
                                      </View>
                                      <Text>Prof(a): { this.state.nextClass.professores[0].pessNomeVc.split(' ').splice(0, 2).join(' ') } </Text>
                                      <Text>Sala: { this.state.nextClass.horarios.filter((h) => h.horaDescrVc === this.state.nextClass.schedule)[0].ambienteNomeVc }</Text>
                                  </View>
                              </View>
                          </View>
                      </TouchableOpacity>
                  </View>
              )
          } else if (heimdallr.UTFPRToken) {
              return ;
          } else {
              return (
                  <View style = { styles.UTFPRPortalContainer }>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('PortalUTFPR')}>
                          <View style={{ flexDirection: 'row' }}>
                              <View style={{ backgroundColor: 'black', width: '15%', justifyContent: 'center', alignItems: 'center', borderBottomRightRadius: 10, borderTopRightRadius: 10 }}>
                                  <Image source={require('../../../../assets/images/PORTAL-UTFPR/clock-regular.png')} style={{ width: 30, height: 30, tintColor: 'white' }}/>
                              </View>
                              <View style={{ maxWidth: '80%', flex: 1, flexDirection: 'column', padding: 10 }}>
                                  <View style={{ flex: 1, flexDirection: 'row', textAlign: 'center' , justifyContent: 'center' }}>
                                      <Text style={{ fontWeight: 'bold' }}>Próxima aula:</Text>
                                  </View>
                                  <View style={{ flexDirection: 'row' }}>
                                      <View style={{flexWrap: 'wrap', wordWrap: 'wrap', flexDirection: 'row', marginLeft: 10}}>
                                          <Text style={{ flexWrap: 'wrap' }}>Para ver suas próximas aulas entre no portal do aluno </Text>
                                      </View>
                                  </View>
                              </View>
                          </View>
                      </TouchableOpacity>
                  </View>
              )
          }
      } else {
          return ;
      }
    }


  render() {
    return (
      <View style={{}}>
	      <FlatList
              data = {this.state.posts}
              ref={flatList => {this.flatList = flatList}}
              onScrollEndDrag={() => this.setState({ scrolling: false })}
              onScrollBeginDrag={() => this.setState({ scrolling: true })}
              ListHeaderComponent = { this.getHeader() }
              renderItem={ ({item}) =>
							<PostViewer
									text={item._data.text}
									anonymous = {item._data.anonymous?item._data.anonymous:'0'}
									pid={item._data.pid} uid={item._data.uid}
									images={item._data.images}
									user={item._data.anonymous ?(item._data.anonymous == '0'?item._data.user_name:'Anônimo'):item._data.user_name}
									userImage={item._data.anonymous?(item._data.anonymous == '0'?item._data.user_image:null):item._data.user_image}
									elapsed_time={item._data.elapsed_time}
									navigation={this.props.navigation}
									scrolling={this.state.scrolling}
									video={item._data.video ? true : false}
						            gif={item._data.gif ? true : false}
								    closeAlert={this.confirmReport.bind(this)}
						            confirmPostRm={this.confirmPostRm.bind(this)}
									likes={item._data.likes}
									liked_by={item._data.liked_by}
									comments={item._data.comments}
									new_post={item._data.newPost}
							/>
              }
              refreshControl={
	              <RefreshControl
		              refreshing={this.state.isRefreshing}
		              onRefresh={this.onRefresh.bind(this)}
	              />
              }
              keyExtractor={item => item._ref.id}
              onEndReachedThreshold={0.3}
              onEndReached={({ distanceFromEnd }) => {
                  this.pullMorePosts(distanceFromEnd);
              }}
              ListFooterComponent={ this.renderFooter.bind(this)}

          />

			<AwesomeAlert
				show={this.state.showDeleteAlert}
				showProgress={false}
				title= {"Tem certeza que deseja excluir ? "}
				titleStyle = {{fontSize: 15, justifyContent: 'center'}}
				message= {"Após confirmada essa ação não poderá ser desfeita."}
				messageStyle = {{fontSize: 13}}
				closeOnTouchOutside={true}
				closeOnHardwareBackPress={false}
				showCancelButton = {true}
				cancelText = {"Não"}
				showConfirmButton={true}
				confirmText= {"Sim"}
				confirmButtonColor={'green'}
				onConfirmPressed={() => {
						this.deletePost();
				}}
				onCancelPressed={() => {
					this.setState({ showDeleteAlert: false })
				}}

			/>
	      <AwesomeAlert
				show={this.state.showAlert}
				showProgress={false}
				title= {"Denúncia realizada"}
				message= {"Nossos criadores irão analisar a postagem denunciada"}
				closeOnTouchOutside={true}
				closeOnHardwareBackPress={false}
				showConfirmButton={true}
				confirmText= {"OK"}
				confirmButtonColor={'green'}
				onConfirmPressed={() => {
					this.setState({ showAlert: false })
				}}
	      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    UTFPRPortalContainer: {
        flex: 1,
        flexDirection: 'column',
        borderTopWidth: 0.2,
        borderColor: 'rgba(246, 197, 0, 0.5)',
        backgroundColor: 'rgba(246, 197, 0, 1)',
    }
});
