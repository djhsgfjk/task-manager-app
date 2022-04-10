import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const styles = {
	cardContainer: {
		marginBottom: 8,
	}
};

function TaskCard({text}) {
	return (
		<Card style={styles.cardContainer}>
			<CardContent>
				<Typography variant="body2">{text}</Typography>
			</CardContent>
		</Card>
	);
}

export default TaskCard;