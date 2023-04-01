import React from "react";
import {Component} from 'react';
import {connect} from "react-redux";
import {Button} from "@mui/material";
import axios from "axios";
import TextField from '@mui/material/TextField';

class Auth extends Component {
	constructor(props) {
		super(props);
		this.state = {signUp: false, error: null, loading: false, formUsername: "", formEmail: "", formPassword: "", formPassword2: ""}
	}

	componentDidMount() {
		const token = window.localStorage.getItem('key');
		if (token)
			this.getUser(token);
	}

	getUser = (token) => {
		if (token) {
			fetch(
				'/api/user',
				{
					headers: {
						'Authorization': `Token ${token}`,
					},
				})
				.then(response => {
					if (response.ok) {
						return response.json()
					} else {
						throw Error(`Something went wrong: code ${response.status}`)
					}

				})
				.then((res) => {
					this.props.loginUser({
						id: res.data.id,
						username: res.data.username,
						email: res.data.email,
					});
					console.log(res.data.projects)
					this.props.uploadProjects(res.data.projects);
					this.setState({signIn: false})
				})
				.catch(error => {
					console.log(error)
					this.setState({error: 'Ошибка',})
				})
				.finally(() => {
						this.setState({loading: false,})
					}
				)
		}
	}

	EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

	isEmailValid = (value) => {
		return this.EMAIL_REGEXP.test(value);
	}

	signUp = (e) => {
		e.preventDefault();

		const {formUsername} = this.state;
		const {formEmail} = this.state;
		const {formPassword} = this.state;
		const {formPassword2} = this.state;

		if (formPassword !== formPassword2) {
			this.setState({error: 'Ошибка: пароли не совпадают'})
			return
		}

		if (!this.isEmailValid(formEmail)) {
			this.setState({error: 'Ошибка: проверьте правильность введенного адреса почты'})
			return
		}

		this.setState({loading: true});

		axios
			.post(
				'http://localhost:8000/api/signup',
				{
					username: formUsername,
					email: formEmail,
					password: formPassword,
				},
			)
			.then(response => {
				console.log(response)
				if (response) {
					return response.data
				} else {
					throw Error(`Something went wrong: code ${response.status}`)
				}
			})
			.then((data) => {
				if (data.ok) {
					this.logIn(e)
					this.setState({signUp: false, loading: true})
				}
			})
			.catch(error => {
				console.log(error)
				this.setState({error: 'Ошибка: логин и(или) почта уже используются другим пользователем'})
			})
	}


	logIn = (e) => {
		e.preventDefault();

		axios
			.post(
				'http://localhost:8000/api/login',
				{
					username: this.state.formUsername,
					password: this.state.formPassword,
				},
			)
			.then(response => {
				console.log(response)
				if (response) {
					return response.data
				} else {
					throw Error(`Something went wrong: code ${response.status}`)
				}
			})
			.then(data => {
				console.log(data);
				window.localStorage.setItem('key', data.key);
				this.setState({error: null, loading: true})
				this.getUser(data.key);
			})
			.catch(error => {
				console.log(error)
				this.setState({error: 'Ошибка: неверный логин или пароль'})
			})
	}

	renderRegisterForm = () => {
		const {error} = this.state;

			const {formUsername} = this.state;
			const {formEmail} = this.state;
			const {formPassword} = this.state;
			const {formPassword2} = this.state;
			const logInButton = "Войти"

			return (
				<div className="login">
					<form className="signupForm" onSubmit={this.signUp}>
						<TextField
							type="text" name="username" value={formUsername}
							onChange={e => this.setState({formUsername: e.target.value})}
							placeholder="Имя пользователя"
							formControlProps={{
								fullWidth: true
							}}
							variant="outlined"
							style={{margin: 8}}
							required
						/>
						<TextField
							type="text" name="email" value={formEmail}
							onChange={e => this.setState({formEmail: e.target.value})}
							placeholder="Электронная почта"
							formControlProps={{
								fullWidth: true
							}}
							variant="outlined"
							style={{margin: 8}}
							required
						/>
						<TextField
							type="password" name="password" value={formPassword}
							onChange={e => this.setState({formPassword: e.target.value})}
							placeholder="Пароль"
							formControlProps={{
								fullWidth: true
							}}
							variant="outlined"
							style={{margin: 8}}
							required
						/>
						<TextField
							type="password" name="password2" value={formPassword2}
							onChange={e => this.setState({formPassword2: e.target.value})}
							placeholder="Повторите пароль"
							formControlProps={{
								fullWidth: true
							}}
							variant="outlined"
							style={{margin: 8}}
							required
						/>
						{error ? <div className={'error'}>{error}</div> :null}
						<Button
							variant="contained"
							style={{
								color: "white",
								backgroundColor: "#3498DB",
								height: 36,
								margin: "8px",
								width: 222,
							}}
							type="submit"
						>
							Зарегистрироваться
						</Button>
						<a
							variant="contained"
							onClick={()=>{this.setState({signUp: false, logIn: true, error: null})}}
							style={{margin: "8px",}}
						>
							{logInButton}
						</a>
					</form>
				</div>
			)
	}

	renderAuthForm = () => {
		const {error} = this.state;
		const {loading} = this.state;

		if (loading)
			return <div className="App"><p>Загрузка...</p></div>
		else {
			const {formUsername} = this.state;
			const {formPassword} = this.state;
			const signUpButton = "Зарегистрироваться";

			return (
				<div className="login">
					<form className="loginForm" onSubmit={this.logIn}>
						<TextField
							type="text"
							name="username"
							value={formUsername}
							onChange={e => this.setState({formUsername: e.target.value})}
							placeholder="Имя пользователя"
							formControlProps={{
								fullWidth: true
							}}
							variant="outlined"
							style={{margin: 8}}
							required
						/>
						<TextField
							type="password"
							name="password"
							value={formPassword}
							onChange={e => this.setState({formPassword: e.target.value})}
							placeholder="Пароль"
							formControlProps={{
								fullWidth: true
							}}
							variant="outlined"
							style={{margin: 8}}
							required
						/>
						{error ? <div className={'error'}>{error}</div> :null}
						<Button
							variant="contained"
							style={{
								color: "white",
								backgroundColor: "#3498DB",
								height: 36,
								margin: "8px",
								width: 222,
							}}
							type="submit"
						>
							Войти
						</Button>
						<a
							variant="contained"
							onClick={()=>{this.setState({signUp: true, logIn: false, error: null})}}
							style={{margin: "8px",}}
						>
							{signUpButton}
						</a>
					</form>
				</div>
			)
		}
	}

	render = () => {
		const {signUp} = this.state;

		return signUp ? this.renderRegisterForm() : this.renderAuthForm();
	}
}


const mapStateToProps = state => {
	return {user: state.user, projects: state.projects}
}
const mapDispatchToProps = (dispatch) => {
	return {
		loginUser: (payload) => dispatch({type: 'LOGIN', payload: payload}),
		uploadProjects: (payload) => dispatch({type: 'UPLOAD_PROJECTS', payload: payload})
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(Auth);