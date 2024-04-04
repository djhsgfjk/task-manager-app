import React, { Component } from "react";
import { Button } from "@mui/material";
import { connect } from "react-redux";

class ProjectsMenu extends Component {
	openProject = () => {
		const { id, title, users } = this.props;
		this.props.openProject({ id: id, title: title, users: users });
	};

	render = () => {
		const { title } = this.props;
		const buttonTitle = "Open Project";

		return (
			<div className="formButtonGroup">
				<h2 style={{ marginRight: "8px", width: "200px", wordWrap: "break-word" }}>
					{title}
				</h2>
				<Button
					variant="contained"
					style={{
						color: "white",
						backgroundColor: "#3498DB"
					}}
					onClick={this.openProject}
				>
					{buttonTitle}
				</Button>
			</div>
		);
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		openProject: (payload) => dispatch({ type: "OPEN_PROJECT", payload: payload })
	};
};

export default connect(null, mapDispatchToProps)(ProjectsMenu);
