import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
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
				<View style={styles.header}>
					<Image
						style={styles.headerImage}
						source={require('../../../../assets/images/name.png')}
					/>
				</View>
				<View style={styles.body}>
					<Text>
						Somos alunos do Curso de Sistemas de Informação. Desenvolvemos o Spotted como um meio melhor para conecatar a universidade e deixar seus serviços mais acessíveis. Esperamos que estajam gostando ;)
					</Text>
					<View style={{width: theme.width, alignItems: 'center', justifyContent: 'center'}}>
						<Text style={{marginTop: 15}}>
							Desenvolvedores/gerenciadores:
						</Text>
					</View>
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
						<View style={{padding: 5, alignItems: 'center', justifyContent: 'center', width: theme.width * 0.5}} >
							<Text style={{fontWeight: 'bold'}}>
								Camila Antiqueira
							</Text>
							<Image style={styles.devImage} source={require('../../../../assets/images/ela.png')}/>
							<Text>
								Reclamações e críticas
							</Text>
							<Text style={{fontWeight: 'bold'}}>
								Contato:
							</Text>
							<Text style={{fontSize: 11}}>
								camilaantiqueira93@gmail.com
							</Text>
							<Text>
								(41) 98450-5660
							</Text>

						</View>
						<View style={{padding: 5, alignItems: 'center', justifyContent: 'center', width: theme.width * 0.5}} >
							<Text style={{fontWeight: 'bold'}}>
								Gedor Neto
							</Text>
							<Image style={styles.devImage} source={require('../../../../assets/images/eu.png')}/>
							<Text>
								Elogios e sugestões para o Spotted
							</Text>
							<Text style={{fontWeight: 'bold'}}>
								Contato:
							</Text>
							<Text style={{fontSize: 12}}>
								contato@gedor.dev
							</Text>
							<Text>
								(41) 99804-6357
							</Text>

						</View>
					</View>
					<View style={{width: theme.width, alignItems: 'center', justifyContent: 'center', marginTop: 16}}>
						<Text>
							Agradecimentos especiais:
						</Text>
					</View>
					<View style={{padding: 5}}>
						<Text>
							Anderson Candido: Idealização conjunta
						</Text>
					</View>
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
