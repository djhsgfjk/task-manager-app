import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import "./styles.css"

function TaskCard({text}) {
	return (
			<div id="cardContainer">
				<Card>
					<CardContent>
						<Typography variant="body2">{text}</Typography>
					</CardContent>
				</Card>
			</div>
	);
}

export default TaskCard;