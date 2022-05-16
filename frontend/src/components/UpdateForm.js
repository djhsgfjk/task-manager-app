import React from "react";
import {Component} from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import {TextareaAutosize} from "@mui/material";
import Typography from '@mui/material/Typography';
import {connect} from "react-redux";


class UpdateForm extends Component {
	constructor(props) {
		super(props);
		this.state = {formOpen: false, input: this.props.text}
	}

	openForm = async () => {
		await this.setState({formOpen: true});
		const e = document.getElementById("updateFormTextArea")
		e.select()

	}

	closeForm = () => {
		this.setState({formOpen: false, input: this.props.text});
	}

	handleKeyPress = (e) => {
		if (e.key === "Enter")
			this.handleSubmit()
	}

	handleInputChange = (e) => {
		const input = e.target.value
		if (input.indexOf('\n') < 0)
			this.setState({input: input})
	}

	handleSubmit = () => {
		const input = this.state.input.trim()
		if (typeof input != "string" || input === '' || input === this.props.text) {
			this.closeForm()
			return
		}
		const {list} = this.props
		const {id} = this.props
		const {listId} = this.props
		const {index} = this.props
		const {done} = this.props

		const url = list ? `http://localhost:8000/api/lists/${id}/` : `http://localhost:8000/api/cards/${id}/`
		const data = list ?
			{
				index: index,
				title: input,
			} : {
				listId: listId,
				index: index,
				text: input,
				done: done
			}

		axios.put(url, data)
			.then(res => {
				console.log(res.data);
				list ? this.props.updateList(res.data) : this.props.updateCard(res.data)
				this.closeForm()
			})
			.catch(err => console.log(err))
	}

	renderForm = () => {
		const {list} = this.props;
		const placeholder = list ? "Enter the new title..." : "Enter the new text..."

		return (
				<div id = {list ? "updateListFormContainer" : "updateCardFormContainer"} style={{width: "100%"}}>
					<Card
						sx={list ? {
							border: 1,
							borderColor: "#3498DB",
							borderWidth: 2.6,
							boxShadow: 0,
						} : {boxShadow: 0}}>
						<TextareaAutosize
							className="textArea"
							style={list ? {fontSize:"1.17em", fontWeight: "bolder"} : {padding:4.5, width:"90%"}}
							placeholder={placeholder}
							autoFocus={true}
							value={this.state.input}
							onChange={this.handleInputChange}
							onKeyPress={(e) => {return this.handleKeyPress(e)}}
							id="updateFormTextArea"
							onBlur={this.closeForm}
						/>
					</Card>
				</div>);
	}

	renderTitle = () => {
		return (
			<div id="listTitleContainer" onClick={this.openForm}>
				<h3>{this.props.text}</h3>
			</div>);
	}

	renderCard = () => {
		return (
				<div id="cardTextContainer" onClick={this.openForm}>
					<Typography variant="body2" style={{padding:10, wordWrap: "break-word"}}>{this.props.text}</Typography>
				</div>
		);
	}

	render = () => {
		const {list} = this.props;
		return this.state.formOpen ? this.renderForm() : list ? this.renderTitle() : this.renderCard()
	}

}

const mapDispatchToProps = (dispatch) => {
	return {
		updateList: (payload) => dispatch({ type: 'UPDATE_LIST' , payload: payload}),
		updateCard: (payload) => dispatch({ type: 'UPDATE_CARD' , payload: payload}),
	}
}

export default connect(null, mapDispatchToProps)(UpdateForm)