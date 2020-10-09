import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';

import theme from "../../../../components/General/Theme";


export default class AboutUs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}


	render () {
		return (
			<View style={styles.container}>
				<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
								<View style={{flexDirection: 'row', marginTop: 7,  paddingLeft: 10,width:theme.width * 0.2,height:theme.height * 0.04}}>
									<Image
										style={{ width: 30, height: 30, marginTop:4, opacity: 0.6 }}
										source={require('../../../../assets/images/chevron-circle-left-solid-white.png')}
									/>
								</View>
				</TouchableOpacity>
				<View style={styles.header}>
					<Image
						style={styles.headerImage}
						source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/app-icons%2Fname.png?alt=media&token=48124908-21cf-4f9d-9832-2245297842c7' }}
					/>
				</View>
				<View style={styles.body}>
					<Text style= {{textAlign:'justify'}}>
						Somos alunos do Curso de Sistemas de Informação da UTFPR. Desenvolvemos o Spotted como um meio melhor para conectar a universidade e deixar seus serviços mais acessíveis. Esperamos que estejam gostando ;)
					</Text>
					<Text style={{marginTop: theme.height * 0.025,fontWeight:'bold',marginBottom:theme.height * 0.02 ,alignSelf:'center'}}>
						Desenvolvedores e responsáveis pelo Spotted:
					</Text>
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
						<View style={{padding: 5, alignItems: 'center', justifyContent: 'center', width: theme.width * 0.5}} >
							<Text style={{fontWeight: 'bold'}}>
								Camila Antiqueira
							</Text>
							<Image style={styles.devImage} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/app-icons%2Fela.png?alt=media&token=70d6617d-f004-4617-811f-3d565b171fb2' }}/>
							<Text style = {{marginTop:theme.height * 0.005}}>
								Reclamações e elogios
							</Text>
							<Text style={{fontWeight: 'bold'}}>
								Contato:
							</Text>
							<Text style={{fontSize: 11}}>
								contato@camilaantiqueira.dev
							</Text>
							<Text style = {{marginTop:theme.height * 0.004}}>
								(41) 98450-5660
							</Text>

						</View>
						<View style={{padding: 5, alignItems: 'center', justifyContent: 'center', width: theme.width * 0.5}} >
							<Text style={{fontWeight: 'bold'}}>
								Gedor Neto
							</Text>
							<Image style={styles.devImage} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/app-icons%2Feu.png?alt=media&token=fdb00e1b-9d94-47e2-9b6b-5e4687526d76' }}/>
							<Text style = {{marginTop:theme.height * 0.005}}>
								Críticas e sugestões
							</Text>
							<Text style={{fontWeight: 'bold'}}>
								Contato:
							</Text>
							<Text style={{fontSize: 12}}>
								contato@gedor.dev
							</Text>
							<Text style = {{marginTop:theme.height * 0.004}}>
								(41) 99804-6357
							</Text>

						</View>
					</View>
						<Text style = {{ marginTop:theme.height * 0.03,alignSelf:'center'}}>
							Agradecimentos especiais:
						</Text>
						<Text style = {{alignSelf:'center',marginTop:theme.height * 0.01}}>
							Anderson Candido: Idealização conjunta
						</Text>
						<Text style = {{alignSelf:'center',marginTop:theme.height * 0.01}}>
							Mariana Borges: Artes de divulgação
						</Text>

				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 5,
	},
	header: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	body: {
		flexDirection: 'column',
		margin:theme.width * 0.02,
		marginTop:theme.height * 0.03
	},
	devImage: {
		width: 50,
		height: 50,
		borderRadius: 100,
		marginTop: 10,
	},
	headerImage: {
		width: 120,
		height: 40,
	},
})
