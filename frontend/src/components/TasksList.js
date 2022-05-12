import React from "react";
import TaskCard from "./TaskCard";
import ActionButton from "./ActionButton";
import "./styles.css"

function TasksList({listId, title, cards}) {
	const newCardIndex = cards.length > 0 ? +cards[cards.length-1].index + 1 : 1

	return (
		<div className="listContainer">
			<div className="listContent">
				<div id="listTitleContainer">
					<h3>{title}</h3>
				</div>
				<div className="cardsContainer" id={`cardsContainer_${listId}`}>
					{cards.map(card => <TaskCard key={card.id} text={card.text}/>)}
				</div>
				<div id="actionButtonContainer">
					<ActionButton index={newCardIndex} listId={listId}/>
				</div>
			</div>
		</div>
	);
}

export default TasksList;