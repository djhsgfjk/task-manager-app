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
		const {list} = this.props;
		const buttonText = list ? "Add a list" : "Add a card";
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

	handleKeyPress = (e) => {
		if (e.key === "Enter")
			this.handleSubmit()
	}

	handleInputChange = (e) => {
		const input = e.target.value;
		const {list} = this.props;
		const max_len = list ? 50 : 150
		if (input.indexOf('\n') < 0 && input.length < max_len)
			this.setState({input: input})
	}

	handleSubmit = () => {
		const input = this.state.input.trim()
		if (typeof input != "string" || input === '')
			return
		const {list} = this.props
		const {index} = this.props
		const {listId} = this.props


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
				console.log(res.data);
				list ? this.props.addList(res.data) : this.props.addCard(res.data)
				this.closeForm()
				this.setState({input: undefined})
			})
			.catch(err => console.log(err))
	}

	renderForm = () => {
		const {list} = this.props;
		const placeHolder = list ? "Enter list title..." : "Enter the text of the card...";
		const buttonTitle = list ? "Add list" : "Add card";

		return (
			<div className={list ? "listContainer" : null} ref={this.formRef}>
				<div id="actionButtonContainer">
					<Card
						sx={list ? {
							border: 1,
							borderColor: "#3498DB",
							borderWidth: 2.6,
							boxShadow: 0,
						} : {}}
						style={{
						minHeight: list ? 30 : 80,
						padding: '6px 8px 2px',
					}} >
						<TextareaAutosize
							className="textArea"
							placeholder={placeHolder}
							autoFocus={true}
							value={this.state.input}
							onChange={this.handleInputChange}
							onKeyPress={(e) => {return this.handleKeyPress(e)}}
							id="addFormTextArea"
							style={list? {fontSize:"1.17em"}:{padding:10, width:"92%"}}
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
		addList: (payload) => dispatch({ type: 'ADD_LIST' , payload: payload}),
		addCard: (payload) => dispatch({ type: 'ADD_CARD' , payload: payload}),
	}
}

export default connect(null, mapDispatchToProps)(ActionButton);