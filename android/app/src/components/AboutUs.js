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
										style={{width: 12, height: 12, marginTop:4}}
										source={require('../../../../assets/images/arrow-left.png')}
									/>
									<Text style={{marginLeft: 5}}>
										voltar
									</Text>
								</View>
				</TouchableOpacity>
				<View style={styles.header}>
					<Image
						style={styles.headerImage}
						source={require('../../../../assets/images/name.png')}
					/>
				</View>
				<View style={styles.body}>
					<Text style= {{textAlign:'justify'}}>
						Somos alunos do Curso de Sistemas de Informação da UTFPR. Desenvolvemos o Spotted como um meio melhor para conectar a universidade e deixar seus serviços mais acessíveis. Esperamos que estajam gostando ;)
					</Text>
					<Text style={{marginTop: theme.height * 0.025,fontWeight:'bold',marginBottom:theme.height * 0.02 ,alignSelf:'center'}}>
						Desenvolvedores e responsáveis pelo Spotted:
					</Text>
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
						<View style={{padding: 5, alignItems: 'center', justifyContent: 'center', width: theme.width * 0.5}} >
							<Text style={{fontWeight: 'bold'}}>
								Camila Antiqueira
							</Text>
							<Image style={styles.devImage} source={require('../../../../assets/images/ela.png')}/>
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
							<Image style={styles.devImage} source={require('../../../../assets/images/eu.png')}/>
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
