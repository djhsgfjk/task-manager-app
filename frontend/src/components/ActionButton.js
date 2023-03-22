import React from "react";
import {Component} from "react";
import {Button, Icon} from "@mui/material";
import {Close} from "@mui/icons-material";
import Card from "@mui/material/Card";
import {TextareaAutosize} from "@mui/material";
import axios from "axios";
import {connect} from "react-redux";

class ActionButton extends Component {

	constructor(props) {
		super(props);
		this.state = {formOpen: false, input: ''};
		this.formRef = React.createRef();
		this.passClick = true;
	}

	openForm = async () => {
		await this.setState({formOpen: true});

		const a = document.getElementById(`cardsContainer_${this.props.listId}`)
		if (a && a.scrollHeight > a.offsetHeight)
			a.scrollTo(null, a.scrollHeight);

		const e = document.getElementById("addFormTextArea")
		e.select()


		document.addEventListener('click', this.handleClickOutside, false);
	}

	closeForm = () => {
		document.removeEventListener('click', this.handleClickOutside, false);
		this.setState({formOpen: false});
		this.passClick = true
	}

	handleClickOutside = (e) => {
		if (this.passClick) {
			this.passClick = false
			return
		}

		const myRef = this.formRef.current;
		if (!(myRef.contains(e.target))) {
			this.closeForm()
		}
	}

	renderAddButton = () => {
		const {projectButton} = this.props;
		const {list} = this.props;
		const buttonText = projectButton ? "Добавить проект" : list ? "Добавить список" : "Добавить карточку";
		return (
			<div
				className={projectButton ? "projectOpenFormButton" : list ? "listOpenFormButton" : "cardOpenFormButton"}
				onClick={this.openForm}
			>
				<Icon>+</Icon>
				<p style={{font: "caption"}}>{buttonText}</p>
			</div>
		);
	}

	handleKeyPress = (e) => {
		if (e.key === "Enter")
			this.handleSubmit()
	}

	handleInputChange = (e) => {
		const input = e.target.value;
		const max_len = 255
		if (input.indexOf('\n') < 0 && input.length < max_len)
			this.setState({input: input})
	}

	handleSubmit = () => {
		const input = this.state.input.trim()
		if (typeof input != "string" || input === '')
			return

		const {projectButton} = this.props;
		const {list} = this.props;
		const {index} = this.props
		const {listId} = this.props
		const {userId} = this.props;
		const {projectId} = this.props;



		const url = projectButton ? "http://localhost:8000/api/projects/" : list ? "http://localhost:8000/api/lists/" : "http://localhost:8000/api/cards/"
		const data = projectButton ? {
				usersId: [userId],
				title: input,
			} : list ?
			{
				projectId: projectId,
				index: index,
				title: input,
			} : {
				listId: listId,
				index: index,
				text: input
			}

		axios.post(url, data)
			.then(res => {
				console.log(res.data);
				projectButton ? this.props.addProjects({project: {id: res.data.id, title: res.data.title, lists: []}}) : list ? this.props.addList({projectId: projectId, list: res.data}) : this.props.addCard({projectId: projectId, listId: listId, card: res.data})
				this.closeForm()
				this.setState({input: undefined})
			})
			.catch(err => console.log(err))
	}

	renderForm = () => {
		const {projectButton} = this.props;
		const {list} = this.props;
		const placeHolder = projectButton ? "Введите название проекта" : list ? "Введите название списка..." : "Введите описание карточки...";
		const buttonTitle = projectButton ? "Добавить проект" : list ? "Добавить список" : "Добавить карточку";

		return (
			<div className={projectButton ? "projectContainer" : list ? "listContainer" : null} ref={this.formRef}>
				<div id="actionButtonContainer">
					<Card
						sx={projectButton || list ? {
							border: 1,
							borderColor: "#3498DB",
							borderWidth: 2.6,
							boxShadow: 0,
						} : {}}
						style={{
							minHeight: list ? 30 : 80,
							padding: '6px 8px 2px',
						}}>
						<TextareaAutosize
							className="textArea"
							placeholder={placeHolder}
							autoFocus={true}
							value={this.state.input}
							onChange={this.handleInputChange}
							onKeyPress={(e) => {
								return this.handleKeyPress(e)
							}}
							id="addFormTextArea"
							style={projectButton || list ? {fontSize: "1.17em", fontWeight: "bolder"} : {padding: 10, width: "92%"}}
						/>
					</Card>
					<div className="formButtonGroup">
						<Button
							variant="contained"
							style={{
								color: "white",
								backgroundColor: "#3498DB",
							}}
							onClick={this.handleSubmit}
						>
							{buttonTitle}
						</Button>
						<Close
							style={{marginLeft: 8, cursor: "pointer",}}
							onClick={() => {
								this.closeForm();
								this.setState({input: undefined});
							}}/>
					</div>
				</div>
			</div>);
	}
	render = () => {
		return this.state.formOpen ? this.renderForm() : this.renderAddButton();
	}
}



const mapDispatchToProps = (dispatch) => {
	return {
		addProjects: (payload) => dispatch({type: 'ADD_PROJECT', payload: payload}),
		addList: (payload) => dispatch({type: 'ADD_LIST', payload: payload}),
		addCard: (payload) => dispatch({type: 'ADD_CARD', payload: payload}),
	}
}

export default connect(null, mapDispatchToProps)(ActionButton);