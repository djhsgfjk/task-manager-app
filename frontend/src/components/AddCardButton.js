import React from "react";
import {Component} from "react";
import {Icon} from "@mui/material";
import "./styles.css"
import {connect} from "react-redux";

class AddCardButton extends Component {

	openAddCardFrom = () => {
		this.props.openForm(this.props.listId)
	}

	renderAddButton = () => {
		const buttonText = "Add another card";

		return (
			<div
				className="cardOpenFormButton"
				onClick={this.openAddCardFrom}
			>
				<Icon>+</Icon>
				<p>{buttonText}</p>
			</div>
		);
	}

	render = () => {
		return (this.props.addFormIndex === this.props.listId) ? <div/> : this.renderAddButton();
	}
}


const mapStateToProps = state => {return {addFormIndex: state.addFormIndex}}
const mapDispatchToProps = (dispatch) => {
	return {
		openForm: (payload) => dispatch({ type: 'OPEN_FORM' , payload: payload}),
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(AddCardButton);