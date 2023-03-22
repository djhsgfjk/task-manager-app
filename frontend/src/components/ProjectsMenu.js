import React from "react";
import {Component} from 'react';
import {Button} from "@mui/material";
import {connect} from "react-redux";

class ProjectsMenu extends Component {

	openProject = () => {
		const {id} = this.props;
		const {title} = this.props;
		const {users} = this.props;

		this.props.openProject({id: id, title: title, users:users})

		// window.location.assign('http://localhost:3000/project/');
	}

	render = () => {
		const {title} = this.props;
		const buttonTitle = "Открыть проект";

		return (
			<div className="formButtonGroup">
				<h2 style={{marginRight: "8px", width: "200px", wordWrap: "break-word"}}>{title}</h2>
				<Button
					variant="contained"
					style={{
						color: "white",
						backgroundColor: "#3498DB",
					}}
					onClick={this.openProject}
				>
					{buttonTitle}
				</Button>
			</div>
		)

	}

}

const mapDispatchToProps = (dispatch) => {
	return {
		openProject: (payload) => dispatch({type: 'OPEN_PROJECT', payload: payload}),
	}
}

export default connect(null, mapDispatchToProps)(ProjectsMenu);