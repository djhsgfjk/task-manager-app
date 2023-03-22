import React from "react";
import {Component} from "react";
import Project from "./Project";
import Auth from "./Auth";
import Navigation from "./Navigation";
import {connect} from "react-redux";


class App extends Component {


	render = () => {
		const {currentProject} = this.props;
		const {user} = this.props;
		return user.id ? (
			<div className="app" style={{display: "flex",}}>
					<Navigation/>
				{currentProject.id ? <Project/> :  null}
			</div>
		) : (
			<div className={"app"}>
				<Auth/>
			</div>
		);
	}
}


const mapStateToProps = state => {
	return {user: state.user, currentProject: state.currentProject,}
}
export default connect(mapStateToProps, null)(App);