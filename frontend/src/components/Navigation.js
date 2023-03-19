import React from "react";
import {Component} from 'react';
import {connect} from "react-redux";
import {Button} from "@mui/material";
import ActionButton from "./ActionButton";
import ProjectsMenu from "./ProjectsMenu";
import DehazeIcon from '@mui/icons-material/Dehaze';

class Auth extends Component {

	logOut = () => {
		//добавить удаление токена на сервере
		window.localStorage.removeItem('key');
		window.localStorage.removeItem('app_state');
		this.props.logOut();
	}

	closeOpenNavigation = () => {
		const {navOpened} = this.props.currentProject;
		this.props.changeNav(!navOpened)
	}

	renderMenu() {
		const {username} = this.props.user;
		const {id} = this.props.user;
		const {projects} = this.props;
		const {navOpened} = this.props.currentProject;
		const logoutButton = "Выйти";

		return (
			<div className="navigation" style={navOpened ? {backgroundColor: "#9CC0D9"} : {}}>
				<DehazeIcon
					style={{position: "absolute", right: 8, top: 20, cursor: "pointer"}}
					onClick={this.closeOpenNavigation}
				/>
				{navOpened ? (
					<div style={{overflow: "hidden",}}>
						<div className="profile"
							 style={{display: "flex", flexDirection: "row", flexShrink: 0, alignItems: "center", overflow: "hidden"}}>
							<h3>Здравствуйте, {username}!</h3>
							<Button
								variant="contained"
								style={{
									color: "white",
									backgroundColor: "#3498DB",
									height: 36,
									margin: "8px",
								}}
								onClick={this.logOut}
							>
								{logoutButton}
							</Button>
						</div>
						<div className={"menuContainer"}>
						<div className={"projectsMenu"} style={{display: "flex", flexDirection: "column", margin: "8px", overflowY: "auto", overflowX: "hidden"}}>
							{projects.map((project) => {
									return (
										<ProjectsMenu
											key={project.id}
											id={project.id}
											title={project.title}
										/>
									)
								}
							)}
						</div>
						<ActionButton projectButton userId={id} />
							</div>
					</div>) : null}
			</div>
		)
	}

	hideMenu = () => {

	}

	render = () => {
		return this.renderMenu();
	}
}


const mapStateToProps = state => {
	return {user: state.user, projects: state.projects, currentProject: state.currentProject}
}
const mapDispatchToProps = (dispatch) => {
	return {
		loginUser: (payload) => dispatch({type: 'LOGIN', payload: payload}),
		uploadProjects: (payload) => dispatch({type: 'UPLOAD_PROJECTS', payload: payload}),
		logOut: () => dispatch({type: 'LOGOUT'}),
		changeNav: (payload) => dispatch({type: 'CHANGE_NAV', payload: payload}),
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(Auth);