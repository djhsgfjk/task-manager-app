import React from "react";
import {Component} from "react";
import TasksList from "./TasksList";
import {connect} from "react-redux";
import axios from "axios";
import ActionButton from "./ActionButton";
import UpdateCard from "./UpdateCard";
import {DragDropContext} from "react-beautiful-dnd";
import {Droppable} from "react-beautiful-dnd";
import moveElementInArray from "../additionalFunctions/moveElementInArray";
import {Close} from "@mui/icons-material";
import ProjectUsers from "./ProjectUsers"

class Project extends Component {
    constructor(props) {
        super(props);
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
        const id = this.props.currentProject.id;
        axios
            .put(`http://localhost:8000/api/lists/${list.id}/`, {projectId: id, index: list.index, title: list.title})
            .then(res => {
                console.log(res.data);
            })
            .catch(err => console.log(err))
    }

    onDragEnd = (result) => {
        const {currentProject} = this.props;
        const lists = this.props.projects.find((project) => (project.id === currentProject.id)).lists;


        if (result.destination === null)
            return;
        if (result.type === 'cards') {
            lists.forEach((list) => {
                const e = document.getElementById("cardsContainer_" + list.id);
                e.setAttribute('style', "overflow-y: auto;");
            });

            this.onCardsDragEnd(result);
        } else
            this.onListsDragEnd(result);

    }

    onListsDragEnd = (result) => {
        const {currentProject} = this.props;
        const lists = this.props.projects.find((project) => (project.id === currentProject.id)).lists;

        const pastIndex = result.source.index
        const newIndex = result.destination.index

        if (!(pastIndex === newIndex)) {
            const newLists = moveElementInArray(lists, pastIndex, newIndex);

            this.props.updateProject({
                projectId: currentProject.id,
                lists: newLists.map((list, index) => ({...list, index: index})),
            });

            newLists.forEach((list, index) => {
                if (!(list.index === index))
                    this.uploadListChanges({...list, index: index});
            });

        }
    }

    onCardsDragEnd = (result) => {
        console.log("cards")
        const cardId = +result.draggableId
        const pastIndex = result.source.index
        const pastListId = +result.source.droppableId.slice(5)
        const newIndex = +result.destination.index
        const newListId = +result.destination.droppableId.slice(5)
        const projectId = this.props.currentProject.id


        if (pastListId === newListId) {
            if (!(pastIndex === newIndex)) {
                const {currentProject} = this.props;
                const lists = this.props.projects.find((project) => (project.id === currentProject.id)).lists;
                const list = lists.find((list) => (list.id === pastListId))
                const cards = moveElementInArray(list.cards, pastIndex, newIndex)


                this.props.updateListAndCards({
                    projectId: projectId,
                    list: {...list, cards: cards.map((card, index) => ({...card, index: index}))}
                })
                cards.forEach((card, index) => {
                    if (!(card.index === index))
                        this.uploadCardChanges({...card, listId: list.id, index: index});
                });
            }
        } else {
            const {currentProject} = this.props;
            const lists = this.props.projects.find((project) => (project.id === currentProject.id)).lists;
            const card = lists
                .find((list) => (list.id === pastListId))
                .cards.find((card) => (card.id === cardId));
            const newList = lists.find((list) => (list.id === newListId));
            const newCards = moveElementInArray([...(newList.cards), card], newList.cards.length, newIndex);

            this.props.updateListAndCards({
                projectId: projectId, list: {
                    ...newList,
                    cards: newCards.map((card, index) => ({...card, index: index}))
                }
            });

            newCards.forEach((card, index) => {
                if (!(card.index === index) || card.id === cardId)
                    this.uploadCardChanges({...card, listId: newListId, index: index});
            });

            this.props.deleteCard({projectId: projectId, listId: pastListId, cardId: cardId})
        }
    }

    onDragStart = (start) => {
        if (start.type === 'cards') {
            const {currentProject} = this.props;
            const lists = this.props.projects.find((project) => (project.id === currentProject.id)).lists;
            lists.forEach((list) => {
                const e = document.getElementById("cardsContainer_" + list.id);
                console.log(e.scrollHeight, e.clientHeight)
                if (e.scrollHeight === e.clientHeight)
                    e.setAttribute('style', "overflow-y: hidden;");
            });
        }
    }

    render() {
        const {user} = this.props;
        const {currentProject} = this.props;
        const lists = this.props.projects.find((project) => (project.id === currentProject.id)).lists;
        console.log(lists)

        const newListIndex = lists.length;
        const {modal} = this.props;
        if (modal.modalOn) {
            document.body.setAttribute('class', "overflow");
        } else {
            document.body.setAttribute('class', "");
        }


        return (
            <div id="project">
                <div className="projectTitleContainer">
                    <h2>{currentProject.title}</h2>
                    <ProjectUsers
                        userId = {user.id}
                        users={currentProject.users}
                        projectId={currentProject.id}
                        title={currentProject.title}
                    />
                </div>
                <div className={"lists"}>
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
                                            projectId={currentProject.id}
                                            listId={list.id}
                                            listIndex={index}
                                            title={list.title}
                                            cards={list.cards}/>)
                                    )}
                                    {provided.placeholder}
                                    <ActionButton list userId={user.id} projectId={currentProject.id}
                                                  index={newListIndex}/>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                {modal.modalOn ?
                    <UpdateCard modalOn={modal.modalOn} projectId={currentProject.id} card={modal.card}/> : null}
                {modal.modalOn ? <div className="overlay" onClick={this.props.hideModal}/> : null}
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {user: state.user, projects: state.projects, currentProject: state.currentProject, modal: state.modal}
}
const mapDispatchToProps = (dispatch) => {
    return {
        updateProject: (payload) => dispatch({type: 'UPDATE_PROJECT', payload: payload}),
        updateListAndCards: (payload) => dispatch({type: 'UPDATE_LIST_AND_CARDS', payload: payload}),
        deleteCard: (payload) => dispatch({type: 'DELETE_CARD', payload: payload}),
        hideModal: () => dispatch({type: 'HIDE_MODAL'}),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Project);