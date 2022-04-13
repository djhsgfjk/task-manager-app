import React from "react";
import {Component} from "react";
import {Button, Icon} from "@mui/material";
import {Close} from "@mui/icons-material";
import Card from "@mui/material/Card";
import {TextareaAutosize} from "@mui/material";
import "./styles.css"
import axios from "axios";

class ActionButton extends Component {

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
		const {list} = this.props
		const {input} = this.state
		const {index} = this.props
		const {listId} = list ? {listId: null} : this.props


		const url = list ? "http://localhost:8000/api/lists/" : "http://localhost:8000/api/cards/"
		const data = list ? {
			index: index,
			title: input,
		} : {
			listId: listId,
			index: index,
			text: input
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
		const {list} = this.props;
		const placeHolder = list ?  "Enter list title..." : "Enter the text of the card...";
		const buttonTitle = list ? "Add list" : "Add card";

		return (
			<div className={list ? "listContainer": null}>
				<Card style={{
					minHeight: list ? 30 : 80,
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
						backgroundColor: "#008B8B",
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

export default ActionButton;