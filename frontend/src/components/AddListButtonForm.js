import React from "react";
import {Component} from "react";
import {Button, Icon} from "@mui/material";
import {Close} from "@mui/icons-material";
import Card from "@mui/material/Card";
import {TextareaAutosize} from "@mui/material";
import "./styles.css"
import axios from "axios";
import "./styles.css"

class AddListButtonForm extends Component {

	constructor(props) {
		super(props);
		this.state = {formOpen: false};
	}

	openForm = () => {
		this.setState({formOpen: true});
	}

	closeForm = () => {
		this.setState({input: undefined})
		this.setState({formOpen: false});
	}

	renderAddButton = () => {
		const buttonText = "Add another list";

		return (
			<div
				className="listOpenFormButton"
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
		const {index} = this.props
		const url = "http://localhost:8000/api/lists/"
		const data = {
			index: index,
			title: input,
		}
		console.log(data)

		axios.post(url, data)
			.then(res => {
				console.log(res);
				console.log(res.data);
				this.closeForm()
			})
			.catch(err => console.log(err))
	}

	renderForm = () => {
		const placeHolder = "Enter list title...";
		const buttonTitle = "Add list";

		return (
			<div className="listContainer">
				<Card style={{
					minHeight: 30,
					padding: '6px 8px 2px',
				}}>
					<TextareaAutosize
						className="textArea"
						placeholder={placeHolder}
						autoFocus={true}
						value={this.state.input}
						onChange={this.handleInputChange}
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
						onClick={this.closeForm}/>
				</div>
			</div>
		);
	}

	render = () => {
		return this.state.formOpen ? this.renderForm() : this.renderAddButton();
	}
}

export default AddListButtonForm;