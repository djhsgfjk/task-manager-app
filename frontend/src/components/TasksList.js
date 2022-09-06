import React from "react";
import TaskCard from "./TaskCard";
import ActionButton from "./ActionButton";
// import UpdateForm from "./UpdateForm";
import {Component} from "react";
import {connect} from "react-redux";

import {Droppable} from "react-beautiful-dnd";
import {Draggable} from "react-beautiful-dnd";

import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Button, TextareaAutosize} from "@mui/material";
import {Close} from "@mui/icons-material";
import deleteImg from "../delete.png";
import sortImg from "../sort.png"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


class TasksList extends Component {
	constructor(props) {
		super(props);
		this.state = {formOpen: false, input: this.props.title, actionsOpen: false};
		this.formRef = React.createRef();
		this.passClick = true;
	}

	deleteList = () => {
		const {listId} = this.props;
		const {projectId} = this.props;

		this.props.deleteList({projectId: projectId, listId: listId});

		axios
			.delete(`http://localhost:8000/api/lists/${listId}/`)
			.then(res => {
				console.log(res.data);
				this.closeActions();
			})
			.catch(err => console.log(err))
	}

	openForm = async () => {
		await this.setState({formOpen: true});
		const e = document.getElementById("updateFormTextArea")
		e.select()

		document.addEventListener('click', this.handleClickOutside, false);

	}

	closeForm = () => {
		document.removeEventListener('click', this.handleClickOutside, false);
		this.setState({formOpen: false, input: this.props.title});
		this.passClick = true;
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

	handleKeyPress = (e) => {
		if (e.key === "Enter")
			this.handleSubmit()
	}

	handleInputChange = (e) => {
		const input = e.target.value
		const max_len = 15
		if (input.indexOf('\n') < 0 && input.length < max_len)
			this.setState({input: input})
	}

	handleSubmit = () => {
		const input = this.state.input.trim()
		if (typeof input != "string" || input === '') {
			return
		}
		if (input === this.props.text) {
			this.closeForm()
			return
		}
		const {listId} = this.props;
		const {listIndex} = this.props;
		const {projectId} = this.props;
		console.log(projectId)

		const url = `http://localhost:8000/api/lists/${listId}/`
		const data =
			{
				projectId: projectId,
				index: listIndex,
				title: input,
			}

		axios.put(url, data)
			.then(res => {
				console.log(res.data);
				this.props.updateList({projectId: projectId, list: res.data})
				this.closeForm()
			})
			.catch(err => console.log(err))
	}

	openActions = async () => {
		await this.setState({actionsOpen: true});
		document.addEventListener('click', this.handleClickOutsideActions, false);
	}

	closeActions = () => {
		document.removeEventListener('click', this.handleClickOutsideActions, false);
		this.setState({actionsOpen: false});
		this.passClick = true;
	}

	handleClickOutsideActions = (e) => {
		if (this.passClick) {
			this.passClick = false
			return
		}

		const myRef = this.formRef.current;

		if (!(myRef.contains(e.target))) {
			this.closeActions();
		}
	}

	handleSortByDue = () => {
		const {listId} = this.props
		const {cards} = this.props
		const {projectId} = this.props

		const newCards = cards.slice().sort((a, b) => {
			if (a.due === null)
				return 1
			else if (b.due === null)
				return -1
			else {
				const yearDiff = +a.due.slice(0, 4) - +b.due.slice(0, 4)
				if (yearDiff !== 0)
					return yearDiff
				const monthDiff = +a.due.slice(5, 7) - +b.due.slice(5, 7)
				if (monthDiff !== 0)
					return monthDiff
				const dayDiff = +a.due.slice(8, 10) - +b.due.slice(8, 10)
				if (dayDiff !== 0)
					return dayDiff
			}
		}).map((card, index) => {
			return {...card, index: index}
		})

		this.props.sortListByDue({projectId: projectId, listId:listId, listCards: newCards})

		newCards.forEach((card) => {
			const url = `http://localhost:8000/api/cards/${card.id}/`;
			const data =
				{
					listId: listId,
					index: card.index,
					text: card.text,
					done: card.done,
					due: card.due,
				}

			axios.put(url, data)
				.then(res => {
					console.log(res.data);

				})
				.catch(err => console.log(err))
		})
	}

	renderActions = () => {
		const {listId} = this.props
		const deleteButton = "Удалить список";
		const sortByDueButton = "Сортировать по сроку";

		return (
			<div className={"listFormButtons"} id="actionsForm" ref={this.formRef}>
				<div style={{marginTop: "8px", color: "#767678", textAlign: "center", fontSize: "1.05rem"}}>Действия со
					списком
				</div>
				<hr style={{width: "90%", backgroundColor: "#767678", color: "#767678"}}/>
				<Button
					variant="contained"
					sx={{boxShadow: 0,}}
					style={{
						// backgroundColor: "rgba(0, 0, 0, 0.7)",
						// color: "black",
						// width: "100%",
						backgroundColor: "inherit",
						color: "#767678",
						marginBottom: "4px",
						// height: "36px",
						// position: "absolute",
					}}
					onClick={this.handleSortByDue}
				>
					<img src={sortImg} alt={""} height={"30px"}/>
					{sortByDueButton}
				</Button>
				<Button
					variant="contained"
					sx={{boxShadow: 0,}}
					style={{
						// backgroundColor: "rgba(0, 0, 0, 0.7)",
						// color: "black",
						// width: "100%",
						backgroundColor: "inherit",
						color: "#767678",
						marginBottom: "4px",
						height: "36px",
						// position: "absolute",
					}}
					onClick={this.deleteList}
				>
					<img src={deleteImg} alt={""} height={"30px"}/>
					{deleteButton}
				</Button>
			</div>
		);

	}

	renderTitle = () => {
		const {title} = this.props;
		return (
			<div className="listTitle">
				<div id="listTitleContainer" style={{width: "270px",}} onClick={this.openForm}>
					<h3>{title}</h3>
				</div>
				<MoreHorizIcon style={{width: "10%", color: "#767678", marginTop: "16px"}} onClick={this.openActions}/>
				{this.state.actionsOpen ? this.renderActions() : null}
			</div>);
	}

	renderForm = () => {
		const placeHolder = "Введите название списка...";
		const buttonTitle = "Сохранить";

		return (
			<div ref={this.formRef} style={{marginBottom: "8px", display: "flex",}}>
				<div style={{display: "block"}}>
					<Card
						sx={{
							border: 1,
							borderColor: "#3498DB",
							borderWidth: 2.6,
							boxShadow: 0,
							width: "280px",
						}}
						style={{
							minHeight: 30,
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
							id="updateFormTextArea"
							style={{fontSize: "1.17em", fontWeight: "bolder",}}
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
							onClick={this.closeForm}/>
					</div>
				</div>
			</div>);
	}

	render = () => {
		const {listId} = this.props;
		const {listIndex} = this.props;
		const {cards} = this.props;
		const newCardIndex = cards.length;
		const {projectId} = this.props;

		return (
			<Draggable draggableId={'list_' + listId} index={listIndex} type='lists'>
				{(provided) => (
					<div className="listContainer"
						 {...provided.draggableProps}
						 {...provided.dragHandleProps}
						 ref={provided.innerRef}
					>
						<div className="listContent">
							<div className="listHead">
								{this.state.formOpen ? this.renderForm() : this.renderTitle()}
							</div>
							<Droppable droppableId={'list_' + listId} type='cards'>
								{(provided) => (
									<div className="listBody"
										 ref={provided.innerRef}
										 {...provided.droppableProps}
										 style={{overflowY: "hidden"}}
									>
										<div
											className="cardsContainer"
											id={`cardsContainer_${listId}`}
										>
											{cards.map((card, index) =>
												<TaskCard
													key={card.id}
													id={card.id}
													listId={listId}
													index={index}
													text={card.text}
													done={card.done}
													due={card.due}
												/>
											)}
											{provided.placeholder}
										</div>
										<ActionButton index={newCardIndex} projectId={projectId} listId={listId}/>
									</div>
								)}
							</Droppable>
						</div>
					</div>
				)}
			</Draggable>

		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateList: (payload) => dispatch({type: 'UPDATE_LIST', payload: payload}),
		sortListByDue: (payload) => dispatch({type: 'SORT_LIST_BY_DUE', payload: payload}),
		deleteList: (payload) => dispatch({type: 'DELETE_LIST', payload: payload}),
		showModal: () => dispatch({type: 'SHOW_MODAL'}),
		hideModal: () => dispatch({type: 'HIDE_MODAL'}),

	}
}

export default connect(null, mapDispatchToProps)(TasksList);