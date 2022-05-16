import React from "react";
import {Component} from "react";
import UpdateForm from "./UpdateForm";
import CardContent from '@mui/material/CardContent';
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import {connect} from "react-redux";
import {Draggable} from "react-beautiful-dnd";

class TaskCard extends Component{

	handeCheckChange = (e) => {
		const {cardId} = this.props;
		const {listId} = this.props;
		const {cardIndex} = this.props;
		const {text} = this.props;
		const done = e.target.checked;

		const url = `http://localhost:8000/api/cards/${cardId}/`
		const data = {
			listId: listId,
			index: cardIndex,
			text: text,
			done: done,
		}

		axios.put(url, data)
			.then(res => {
				console.log(res.data);
				this.props.updateCard(res.data)
			})
			.catch(err => console.log(err))

	}

	render = () => {
		const {cardId} = this.props;
		const {listId} = this.props;
		const {cardIndex} = this.props;
		const {text} = this.props;
		const {done} = this.props;

		return (
			<Draggable draggableId={''+cardId} index={cardIndex} type='cards'>
				{(provided) => (
					<div
						className="cardContainer"
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
					>
						<Card sx={{cursor: "default"}}>
							<CardContent className="cardAndCheckBox">
								<UpdateForm
									id={cardId}
									listId={listId}
									index={cardIndex}
									text={text}
									done={done}/>
								<Checkbox
									sx={{padding:0, color:"#3498DB", '&.Mui-checked': {color: "#3498DB",},}}
									checked={done}
									onChange={this.handeCheckChange}/>
							</CardContent>
						</Card>
					</div>
				)}
			</Draggable>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateCard: (payload) => dispatch({ type: 'UPDATE_CARD' , payload: payload}),
	}
}

export default connect(null, mapDispatchToProps)(TaskCard);