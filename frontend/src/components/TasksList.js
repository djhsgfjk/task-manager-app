import React from "react";
import TaskCard from "./TaskCard";
import ActionButton from "./ActionButton";
import UpdateForm from "./UpdateForm";
import {Component} from "react";
import {connect} from "react-redux";

import {Droppable} from "react-beautiful-dnd";
import {Draggable} from "react-beautiful-dnd";

import * as binClosed from '../icons/bin_closed.png';
import axios from "axios";


class TasksList extends Component {
	constructor(props) {
		super(props);
		this.state = {binVisibility: 'hidden'}
	}

	deleteList = () => {
		const {listId} = this.props;
		this.props.deleteList(listId);

		axios
			.delete(`http://localhost:8000/api/lists/${listId}/`)
			.then(res => {
				console.log(res.data);
			})
			.catch(err => console.log(err))
	}

	render = () => {
		const {listId} = this.props;
		const {listIndex} = this.props;
		const {title} = this.props;
		const {cards} = this.props;
		const newCardIndex = cards.length;

		return (
			<Draggable draggableId={'' + listId} index={listIndex} type='lists'>
				{(provided) => (
					<div className="listContainer"
						 {...provided.draggableProps}
						 {...provided.dragHandleProps}
						 ref={provided.innerRef}
					>
						<Droppable droppableId={'' + listId} type='cards'>
							{(provided) => (
								<div className="listContent"
									 ref={provided.innerRef}
									 {...provided.droppableProps}
								>
									<div className="listHead">
										<div className="listTitle">
											<UpdateForm list id={listId} index={listIndex} text={title}/>
										</div>
										<div className="listBin"
											 onPointerEnter={() => {
												 this.setState({binVisibility: "visible"})
											 }}
											 onPointerLeave={() => {
												 this.setState({binVisibility: "hidden"})
											 }}
											 onClick={this.deleteList}
										>
											<img
												src={binClosed.default}
												alt="bin_closed"
												style={{
													width: '100%',
													right: 0, bottom: 0,
													resize: "none",
													visibility: this.state.binVisibility
												}}
											/>
										</div>
									</div>
									<div
										className="cardsContainer"
										id={`cardsContainer_${listId}`}>
										{cards.map((card, index) =>
											<TaskCard
												key={card.id}
												cardId={card.id}
												listId={listId}
												cardIndex={index}
												text={card.text}
												done={card.done}
											/>
										)}
										{provided.placeholder}
									</div>
									<ActionButton index={newCardIndex} listId={listId}/>
								</div>
							)}
						</Droppable>
					</div>
				)}
			</Draggable>
		);
	}
}


const mapDispatchToProps = (dispatch) => {
	return {
		deleteList: (payload) => dispatch({
			type: 'DELETE_LIST',
			payload: payload
		}),

	}
}

export default connect(null, mapDispatchToProps)(TasksList);