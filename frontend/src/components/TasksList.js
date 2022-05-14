import React from "react";
import TaskCard from "./TaskCard";
import ActionButton from "./ActionButton";
import UpdateForm from "./UpdateForm";
import {Component} from "react";


class TasksList extends Component{
	render = () => {
		const {listId} = this.props;
		const {listIndex} = this.props;
		const {title} = this.props;
		const {cards} = this.props;
		const newCardIndex = cards.length > 0 ? +cards[cards.length-1].index + 1 : 1

		return (
				<div className="listContainer">
					<div className="listContent">
						<UpdateForm list id={listId} index={listIndex} text={title}/>
							<div className="cardsContainer">
								{cards.sort((a, b) => (
									a.index - b.index)
									).map(card =>
										<TaskCard
											key={card.id}
											cardId={card.id}
											listId={listId}
											cardIndex={card.index}
											text={card.text}
											done={card.done}
										/>
								)}
							</div>
						<ActionButton index={newCardIndex} listId={listId}/>
					</div>
				</div>
		);
	}
}

export default TasksList;