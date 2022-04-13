import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import "./styles.css"

function TaskCard({text}) {
	return (
		<Card className="cardContainer">
			<CardContent>
				<Typography variant="body2">{text}</Typography>
			</CardContent>
		</Card>
	);
}

export default TaskCard;