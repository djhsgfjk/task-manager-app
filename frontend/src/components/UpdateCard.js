import React from "react";
import {Component} from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Button, TextareaAutosize} from "@mui/material";
import {connect} from "react-redux";
import doneImg from "../images/done.png"
import undoneImg from "../images/undone.png"
import deleteImg from "../images/delete.png"
import {Close} from "@mui/icons-material";
import {makeStyles} from "@mui/material";
import {TextField} from "@mui/material";


class UpdateCard extends Component {
	constructor(props) {
		super(props);
		this.state = {input: this.props.card.text, isDone: this.props.card.done, selectedDate: this.props.card.due};
	}

	closeForm = () => {
		this.props.hideModal();
	}

	handleKeyPress = (e) => {
		if (e.key === "Enter")
			this.handleSubmit()
	}

	handleInputChange = (e) => {
		const input = e.target.value
		const max_len = 150
		if (input.indexOf('\n') < 0 && input.length < max_len)
			this.setState({input: input})
	}

	handleDateTimeChange = (e) => {
		console.log(e)
		const dateTime = e.target.value
		this.setState({dateTime: dateTime})
	}


	handleSubmit = () => {
		const input = this.state.input.trim()

		if (typeof input != "string" || input === '') {
			return
		}

		const lastDone = this.props.card.done;
		const done = this.state.isDone;

		const lastDue = this.props.card.due;
		const due = this.state.selectedDate ? this.state.selectedDate : null;

		if (input === this.props.text && lastDone === done && lastDue === due) {
			this.closeForm()
			return
		}

		const {card} = this.props;
		const {id} = card;
		const {listId} = card;
		const {index} = card;

		const url = `http://localhost:8000/api/cards/${id}/`
		const data = {
			listId: listId,
			index: index,
			text: input,
			done: done,
			due: due,
		}

		const {projectId} = this.props;

		axios.put(url, data)
			.then(res => {
				console.log(res.data);
				this.props.updateCard({projectId: projectId, listId: listId, card: res.data})
				this.closeForm()
			})
			.catch(err => console.log(err))
	}

	handeDoneChange = () => {
		const done = this.state.isDone;
		this.setState({isDone: !done});
	}

	renderDatePicker = () => {
		const {selectedDate} = this.state;

		return (
			<form style={{display:"flex", alignItems:"center",}} noValidate>
				<TextField
					id="date"
					label="Срок"
					type="date"
					value={selectedDate ? selectedDate : ""}
					InputLabelProps={{
						shrink: true,
					}}
					onChange={(newValue) => {
						this.setState({selectedDate: newValue.target.value})
					}}
				/>
				<Close
					style={{marginLeft: "8px", cursor: "pointer",}}
					onClick={()=>{this.setState({selectedDate: null})}}/>
			</form>
		);
	}

	renderForm = () => {
		const done = this.state.isDone;
		const placeholder = "Введите описание карточки...";
		const doneButton = "Отметить как выполненное";
		const undoneButton = "Вернуть в выполнение";
		const deleteButton = "Удалить";
		const saveButton = "Сохранить";

		return (
			<div className="cardContainerForm" style={{cursor: "default",}}>
				<div style={{display: "block"}}>
					<Card sx={{boxShadow: 0, width: "300px", marginBottom: "8px", height: "221px",}}>
						<CardContent className="cardAndCheckBox">
							<div className={"updateCardFormContainer"}
								 style={{width: "100%", height: "110px",}}>
								<TextareaAutosize
									className="textArea"
									style={done ? {
										padding: 4.5,
										width: "90%",
										textDecoration: "line-through",
										color: "#767678",
									} : {padding: 4.5, width: "90%"}}
									placeholder={placeholder}
									autoFocus={true}
									value={this.state.input}
									onChange={this.handleInputChange}
									onKeyPress={(e) => {
										return this.handleKeyPress(e)
									}}
									id="updateFormTextArea"
									required={true}
								/>
							</div>
							{this.renderDatePicker()}
						</CardContent>
					</Card>
					<div style={{display: "flex", flexDirection: "row", alignItems: "center",}}>
						<Button
							variant="contained"
							style={{
								color: "white",
								backgroundColor: "#3498DB",
							}}
							onClick={this.handleSubmit}
						>
							{saveButton}
						</Button>
						<Close
							style={{marginLeft: "8px", cursor: "pointer",}}
							onClick={this.closeForm}/>
					</div>
				</div>
				<div className={"cardFormButtons"}>
					<Button
						variant="contained"
						style={{
							backgroundColor: "rgba(0, 0, 0, 0.3)",
							// backgroundColor: "#EBECF0",
							// color: "black",
							// width: "100%",
							marginBottom: "4px",
							height: "72px",
						}}
						onClick={this.handeDoneChange}
					>
						<img src={done ? undoneImg : doneImg} alt={""} height={"30px"}/>
						{done ? undoneButton : doneButton}
					</Button>
					<Button
						variant="contained"
						style={{
							backgroundColor: "rgba(0, 0, 0, 0.3)",
							// color: "black",
							// width: "100%",
							marginBottom: "4px",
							height: "36px",
						}}
						onClick={this.deleteCardFromList}
					>
						<img src={deleteImg} alt={""} height={"30px"}/>
						{deleteButton}
					</Button>
				</div>
			</div>
		);
	}

	render = () => {
		// const {modalOn} = this.props;
		// return modalOn ? this.renderForm() : null;
		return this.renderForm();

	}

	deleteCardFromList = () => {
		const {card} = this.props;
		const {id} = card;
		const {listId} = card;
		const {projectId} = this.props;

		this.props.deleteCard({projectId: projectId, listId: listId, cardId: id});
		axios
			.delete(`http://localhost:8000/api/cards/${id}/`)
			.then(res => {
				console.log(res.data);
			})
			.catch(err => console.log(err))
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateCard: (payload) => dispatch({type: 'UPDATE_CARD', payload: payload}),
		deleteCard: (payload) => dispatch({type: 'DELETE_CARD', payload: payload,}),
		showModal: (payload) => dispatch({type: 'SHOW_MODAL', payload: payload}),
		hideModal: () => dispatch({type: 'HIDE_MODAL'}),

	}
}

export default connect(null, mapDispatchToProps)(UpdateCard);