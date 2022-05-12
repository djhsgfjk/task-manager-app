import React from "react";
import TaskCard from "./TaskCard";
import AddCardButton from "./AddCardButton";
import AddCardForm from "./AddCardForm";
import "./styles.css"

function TasksList({listId, title, cards}) {
	const newCardIndex = cards.length > 0 ? +cards[cards.length-1].index + 1 : 1

	return (
		<div className="listContainer">
			<div className="listContent">
				<div id="listTitleContainer">
					<h3>{title}</h3>
				</div>
				<div id="cardsContainer">
					{cards.map(card => <TaskCard key={card.id} text={card.text}/>)}
					<AddCardForm listId={listId} index={newCardIndex}/>
				</div>
				<div id="actionButtonContainer">
					<AddCardButton listId={listId}/>
				</div>
			</div>
		</div>
	);
}

export default TasksList;