import React from "react";
import {Component} from "react";
import {Button, Icon} from "@mui/material";
import {Close} from "@mui/icons-material";
import Card from "@mui/material/Card";
import {TextareaAutosize} from "@mui/material";
import "./styles.css"
import axios from "axios";
import {connect} from "react-redux";
import "./styles.css"

class ActionButton extends Component {

	constructor(props) {
		super(props);
		this.state = {formOpen: false};
		this.formRef = React.createRef();
		this.passClick = true;
	}

	openForm = async () => {
		await this.setState({formOpen: true});
		const e = document.getElementById(`cardsContainer_${this.props.listId}`)
		e.scrollTo(null, e.scrollHeight);
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
		const {list} = this.props;
		const buttonText = list ? "Add another list" : "Add another card";

		return (
			<div
				className={list ? "listOpenFormButton": "cardOpenFormButton"}
				onClick={this.openForm}
			>
				<Icon>+</Icon>
				<p>{buttonText}</p>
			</div>
		);
	}
	handleInputChange = event => {
		this.setState({input: event.target.value})
		//console.log(this.state.input)
	}

	handleSubmit = () => {
		const {input} = this.state
		if (typeof input != "string" || input === '')
			return
		const {list} = this.props
		const {index} = this.props
		const {listId} = list ? {listId: null} : this.props


		const url = list ? "http://localhost:8000/api/lists/" : "http://localhost:8000/api/cards/"
		const data = list ?
			{
				index: index,
				title: input,
			} : {
				listId: listId,
				index: index,
				text: input
			}

		axios.post(url, data)
			.then(res => {
				console.log(res);
				console.log(res.data);
				this.refreshProject()
				this.setState({input: undefined})
			})
			.catch(err => console.log(err))
	}

	refreshProject = async () => {
		const res = await axios
			.get('http://localhost:8000/api/lists/')
			.catch(err => console.log(err))
		this.props.refresh(res.data)
		this.closeForm()
	}

	renderForm = () => {
		const {list} = this.props;
		const placeHolder = list ? "Enter list title..." : "Enter the text of the card...";
		const buttonTitle = list ? "Add list" : "Add card";

		return (
			<div className={list ? "listContainer" : null} ref={this.formRef}>
				<div id="actionButtonContainer">
					<Card style={{
						minHeight: list ? 30 : 80,
						padding: '6px 8px 2px',
					}} >
						<TextareaAutosize
							className="textArea"
							placeholder={placeHolder}
							autoFocus={true}
							value={this.state.input}
							onChange={this.handleInputChange}
						/>
					</Card>
					<div className="formButtonGroup">
						<Button
							variant="contained"
							style={{
								color: "white",
								backgroundColor: "#1E90FF",
							}}
							onClick={this.handleSubmit}
						>
							{buttonTitle}
						</Button>
						<Close
							style={{marginLeft: 8, cursor: "pointer",}}
							onClick={()=>{this.closeForm(); this.setState({input: undefined});}}/>
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
		refresh: (payload) => dispatch({ type: 'REFRESH' , payload: payload}),
	}
}

export default connect(null, mapDispatchToProps)(ActionButton);