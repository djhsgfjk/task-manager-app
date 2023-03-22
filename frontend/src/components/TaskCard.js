import React from "react";
import {Component} from "react";
import {connect} from "react-redux";
import {Draggable} from "react-beautiful-dnd";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Button, TextareaAutosize} from "@mui/material";
import Typography from "@mui/material/Typography";
import calendarImg from "../images/calendar.png"
import calendar2Img from "../images/calendar2.png"


class TaskCard extends Component {

	constructor(props) {
		super(props);
	}

	openForm = async () => {
		const {id} = this.props;
		const {listId} = this.props;
		const {index} = this.props;
		const {text} = this.props;
		const {done} = this.props;
		const {due} = this.props;
		await this.props.showModal({id: id, listId: listId, index: index, text: text, done: done, due: due});
		const e = document.getElementById("updateFormTextArea")
		e.select()
	}

	render = () => {
		const {done} = this.props;
		const {id} = this.props;
		const {index} = this.props;
		const {text} = this.props;
		const {due} = this.props;

		return (
			<Draggable draggableId={''+id} index={index} type='cards'>
				{(provided) => (
					<div
						className="cardContainer"
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
					>
						<div className="cardContainer">
							<Card sx={{cursor: "default"}}>
								<CardContent>
									<div id="cardTextContainer" onClick={this.openForm}>
										<Typography variant="body2" style={done ? {
											padding: 10,
											wordWrap: "break-word",
											textDecoration: "line-through",
											color: "#767678",
										} : {padding: 10, wordWrap: "break-word"}}>{text}</Typography>
									</div>
									{due ? <div className={"dueContainer"} style={{alignItems:"center", display:"flex"}}><img src={calendarImg} alt={""} width={"18px"}/>{due.slice(8,10)}.{due.slice(5,7)}</div> : null}
								</CardContent>
							</Card>
						</div>
					</div>
				)}
			</Draggable>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		showModal: (payload) => dispatch({type: 'SHOW_MODAL', payload: payload}),
		hideModal: () => dispatch({type: 'HIDE_MODAL'}),
	}
}

export default connect(null, mapDispatchToProps)(TaskCard);