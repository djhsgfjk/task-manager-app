import React from "react";
import {Component} from "react";
import UpdateForm from "./UpdateForm";
import CardContent from '@mui/material/CardContent';
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import {connect} from "react-redux";

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
			<div className="cardContainer" id={cardId} ref={this.props.innerRef}>
				<Card>
					<CardContent className="cardAndCheckBox">
						<Checkbox sx={{padding:0, color:"#3498DB", '&.Mui-checked': {color: "#3498DB",},}} checked={done} onChange={this.handeCheckChange}/>
						<UpdateForm id={cardId} listId={listId} index={cardIndex} text={text} done={done}/>
					</CardContent>
				</Card>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateCard: (payload) => dispatch({ type: 'UPDATE_CARD' , payload: payload}),
	}
}

export default connect(null, mapDispatchToProps)(TaskCard);