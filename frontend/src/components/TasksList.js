import React from "react";
import TaskCard from "./TaskCard";

const styles = {
	container: {
		backgroundColor: '#B0E0E6',
		borderRadius: 3,
		width: 300,
		padding: 8,
		marginRight: 8,
		marginBottom: 8,
	}
}

function TasksList({title, cards}) {
	return (
		<div style={styles.container}>
			<h3>{title}</h3>
			{cards.map(card => <TaskCard text={card.text}/>)}
		</div>
	);
}

export default TasksList;