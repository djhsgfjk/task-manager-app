import React from "react";
import TaskCard from "./TaskCard";
import ActionButton from "./ActionButton";
import "./styles.css"

function TasksList({listId, title, cards}) {
	const newCardIndex = cards.length > 0 ? +cards[cards.length-1].index + 1 : 1

	return (
		<div className="listContainer">
			<h3>{title}</h3>
			{cards.map(card => <TaskCard key={card.id} text={card.text}/>)}
			<ActionButton listId={listId} index={newCardIndex}/>
		</div>
	);
}

export default TasksList;