import React from "react";
import {Component} from "react";
import {Button} from "@mui/material";
import {Close} from "@mui/icons-material";
import Card from "@mui/material/Card";
import {TextareaAutosize} from "@mui/material";
import "./styles.css"
import axios from "axios";
import {connect} from "react-redux";

class AddCardForm extends Component {

	constructor(props) {
		super(props);
		this.state = {input: ''}
	}

	closeAddCardForm = () => {
		this.setState({input: ''})
		this.props.closeForm()
	}

	handleChange = (e) => {
		this.setState({input: e.target.value})
	}

	handleSubmit = () => {
		const {input} = this.state
		const {index} = this.props
		const {listId} = this.props

		if (typeof input != "string" || input === '')
			return

		const url = "http://localhost:8000/api/cards/"
		const data = {
			listId: listId,
			index: index,
			text: input
		}
		console.log(data)

		axios.post(url, data)
			.then(res => {
				console.log(res.data);
				this.refreshProject()
			})
			.catch(err => console.log(err))
	}

	refreshProject = async () => {
		const res = await axios
			.get('http://localhost:8000/api/lists/')
			.catch(err => console.log(err))
		this.props.refresh(res.data)
		this.props.closeForm()
	}


	componentDidMount() {
		if (this.props.addFormIndex === this.props.listId) {
			const e = document.getElementById("cardsContainer");
			console.log(e)
			e.scrollTop = e.scrollHeight;
		}
	}


	renderForm = () => {
		const placeHolder = "Enter the text of the card...";
		const buttonTitle = "Add card";

		return (
			<div>
				<Card style={{
					minHeight: 80,
					padding: '6px 8px 2px',
				}}>
					<TextareaAutosize
						className="textArea"
						placeholder={placeHolder}
						autoFocus={true}
						value={this.state.input}
						onChange={this.handleChange}
					/>
				</Card>
				<div className="formButtonGroup" >
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
						style={{marginLeft: 8, cursor: "pointer", }}
						onClick={this.closeAddCardForm}/>
				</div>
			</div>
		);
	}

	render = () => {
		return (this.props.addFormIndex === this.props.listId) ? this.renderForm() : <div/>;
	}
}

const mapStateToProps = state => {return {addFormIndex: state.addFormIndex}}
const mapDispatchToProps = (dispatch) => {
	return {
		refresh: (payload) => dispatch({ type: 'REFRESH' , payload: payload}),
		closeForm: (payload) => dispatch({ type: 'CLOSE_FORM' , payload: payload}),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCardForm)