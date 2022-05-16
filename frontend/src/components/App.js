import React from "react";
import {Component} from "react";
import TasksList from "./TasksList";
import {connect} from "react-redux";
import axios from "axios";
import ActionButton from "./ActionButton";
import * as binClosed from '../icons/bin_closed.png';
import * as binOpened from '../icons/bin_opened.png';

import {DragDropContext} from "react-beautiful-dnd";
import {Droppable} from "react-beautiful-dnd";

import moveElementInArray from "../additionalFunctions/moveElementInArray";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {bin: binClosed.default}
	}

	componentDidMount() {
		this.refreshProject()
	}

	refreshProject = () => {
		axios
			.get('http://localhost:8000/api/lists/')
			.then(res => {
				console.log(res.data);
				this.props.refresh(res.data);
			})
			.catch(err => console.log(err))
	}

	deleteCardFromList = (listId, cardId, cardIndex) => {
		this.props.deleteCard(listId, cardId, cardIndex);
		axios
			.delete(`http://localhost:8000/api/cards/${cardId}/`)
			.then(res => {
				console.log(res.data);
			})
			.catch(err => console.log(err))
	}

	openBin = () => {
		this.setState({bin: binOpened.default})
	}

	closeBin = () => {
		this.setState({bin: binClosed.default})
	}

	uploadCardChanges = async (card) => {
		axios
			.put(`http://localhost:8000/api/cards/${card.id}/`, card)
			.then(res => {
				console.log(res.data);
			})
			.catch(err => console.log(err))
	}

	uploadListChanges = async (list) => {
		axios
			.put(`http://localhost:8000/api/lists/${list.id}/`, {index: list.index, title: list.title})
			.then(res => {
				console.log(res.data);
			})
			.catch(err => console.log(err))
	}

	onDragEnd = (result) => {
		if (result.destination === null)
			return;
		if (result.type === 'cards')
			this.onCardsDragEnd(result);
		else
			this.onListsDragEnd(result);

	}

	onListsDragEnd = (result) => {
		const pastIndex = result.source.index
		const newIndex = result.destination.index

		if (!(pastIndex === newIndex)) {
			const newLists = moveElementInArray(this.props.lists, pastIndex, newIndex);

			this.props.updateProject(newLists.map((list, index) => ({...list, index:index})));

			newLists.forEach((list, index) => {
				if (!(list.index === index))
					this.uploadListChanges({...list, index: index});
			});

		}
	}

	onCardsDragEnd = (result) => {
		const cardId = +result.draggableId
		const pastIndex = result.source.index
		const pastListId = +result.source.droppableId
		const newIndex = result.destination.index
		const newListId = +result.destination.droppableId

		if (newListId === -1) {
			this.deleteCardFromList(pastListId, cardId, pastIndex);
			// const {lists} = this.props;
			// const list = lists.find((list) => (list.id === pastListId));
			// list.cards.forEach((card, index) => {
			// 	if (!(card.index === index))
			// 		this.uploadCardChanges({...card, listId: list.id, index: index});
			// });
			return;
		}

		if (pastListId === newListId) {
			if (!(pastIndex === newIndex)) {
				const {lists} = this.props;
				const list = lists.find((list) => (list.id === pastListId))
				const cards = moveElementInArray(list.cards, pastIndex, newIndex)

				this.props.updateListAndCards({...list, cards: cards.map((card, index) => ({...card, index:index}))})
				cards.forEach((card, index) => {
					console.log(card, index)
					if (!(card.index === index))
						this.uploadCardChanges({...card, listId: list.id, index: index});
				});
			}
		} else {
			const {lists} = this.props;
			const card = lists
				.find((list) => (list.id === pastListId))
				.cards.find((card) => (card.id === cardId));
			const newList = lists.find((list) => (list.id === newListId));
			const newCards = moveElementInArray([...(newList.cards), card], newList.cards.length, newIndex);

			this.props.deleteCard(pastListId, cardId, pastIndex);
			this.props.updateListAndCards({...newList, cards: newCards.map((card, index) => ({...card, index:index}))});

			newCards.forEach((card, index) => {
				if (!(card.index === index) || card.id === cardId)
					this.uploadCardChanges({...card, listId: newListId, index: index});
			});
		}
	}

	render() {
		const {lists} = this.props;
		const newListIndex = lists.length;
		const {bin} = this.state;

		return (
			<div id="app">
				<div id="project">
					<div id="projectTitleContainer">
						<h2>Task manager</h2>
					</div>
					<DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
						<Droppable droppableId={'all-lists'} direction={'horizontal'} type='lists'>
							{(provided) => (
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
									id="listsContainer"
								>
									{lists.map((list, index) =>
										(<TasksList
											key={list.id}
											listId={list.id}
											listIndex={index}
											title={list.title}
											cards={list.cards}/>)
									)}
									{provided.placeholder}
									<ActionButton list index={newListIndex}/>
								</div>
							)}
						</Droppable>
						<Droppable droppableId={'-1'} isDropDisabled={false} type={'cards'}>
							{(provided) => (
								<div
									id="binContainer"
									onPointerEnter={this.openBin}
									onPointerLeave={this.closeBin}
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									<img
										src={bin}
										alt="bin_closed"
										style={{width: '100%', right: 0, bottom: 0, resize: "none",}}
									/>
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				</div>
			</div>
		);
	}
}


const mapStateToProps = state => {
	return {lists: state.lists}
}
const mapDispatchToProps = (dispatch) => {
	return {
		refresh: (payload) => dispatch({type: 'REFRESH', payload: payload}),
		updateProject: (payload) => dispatch({type: 'UPDATE_PROJECT', payload: payload}),
		updateListAndCards: (payload) => dispatch({type: 'UPDATE_LIST_AND_CARDS', payload: payload}),
		updateCard: (payload) => dispatch({type: 'UPDATE_CARD', payload: payload}),
		deleteCard: (listId, cardId, cardIndex) => dispatch({
			type: 'DELETE_CARD',
			payload: {listId: listId, cardId: cardId, cardIndex: cardIndex}
		}),

	}
}


export default connect(mapStateToProps, mapDispatchToProps)(App);