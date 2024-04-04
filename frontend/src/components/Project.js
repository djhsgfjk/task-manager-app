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
import Card from "@mui/material/Card";
import {Button, TextareaAutosize} from "@mui/material";

class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {formOpen: false}
    }


    uploadCardChanges = async (card) => {
        axios
            .put(`http://185.124.109.30:8000/api/cards/${card.id}/`, card)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => console.log(err))
    }

    uploadListChanges = async (list) => {
        const id = this.props.currentProject.id;
        axios
            .put(`http://185.124.109.30:8000/api/lists/${list.id}/`, {projectId: id, index: list.index, title: list.title})
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

    openForm = async () => {
        const {currentProject} = this.props;
        const title = this.props.projects.find((project) => (project.id === currentProject.id)).title;
        await this.setState({formOpen: true, input: title});
        const e = document.getElementById("updateFormTextArea")
        e.select()

        document.addEventListener('click', this.handleClickOutside);

    }

    closeForm = () => {
        document.removeEventListener('click', this.handleClickOutside);
        this.setState({formOpen: false, input: this.props.title});
    }

    handleClickOutside = (e) => {
        console.log('outside')
        const elem = document.querySelector('.projectTitleEditForm')
        console.log()
        if (!(elem.contains(e.target)) && !Array.from(e.target.classList).includes('projectTitle')) {
            this.closeForm()
        }
    }

    handleKeyPress = (e) => {
        if (e.key === "Enter")
            this.handleSubmit()
    }

    handleInputChange = (e) => {
        const input = e.target.value
        const max_len = 15
        if (input.indexOf('\n') < 0 && input.length < max_len)
            this.setState({input: input})
    }

    handleSubmit = () => {
        const input = this.state.input.trim()
        if (typeof input != "string" || input === '') {
            return
        }
        if (input === this.props.text) {
            this.closeForm()
            return
        }

        const {currentProject} = this.props;

        const url = `http://185.124.109.30:8000/api/projects/${currentProject.id}/`
        const data =
            {
                projectId: currentProject.id,
                title: input,
            }

        axios.put(url, data)
            .then(res => {
                console.log(res.data);
                this.props.updateProjectTitle({projectId: res.data.id, title: res.data.title})
                this.closeForm()
            })
            .catch(err => console.log(err))
    }


    renderForm = () => {
        const placeHolder = "Enter project title...";
        const buttonTitle = "Save";

        return (
            <div className={'projectTitleEditForm'} style={{display: "flex",}}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'}}>
                    <Card
                        sx={{
                            border: 1,
                            borderColor: "#3498DB",
                            borderWidth: 2.6,
                            boxShadow: 0,
                            width: "280px",
                        }}
                        style={{
                            minHeight: 30,
                            padding: '6px 8px 2px',
                        }}>
                        <TextareaAutosize
                            className="textArea"
                            placeholder={placeHolder}
                            autoFocus={true}
                            value={this.state.input}
                            onChange={this.handleInputChange}
                            onKeyPress={(e) => {
                                return this.handleKeyPress(e)
                            }}
                            id="updateFormTextArea"
                            style={{fontSize: "1.17em", fontWeight: "bolder",}}
                        />
                    </Card>
                    <div style={{
                        marginLeft: '8px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Button
                            variant="contained"
                            style={{
                                color: "white",
                                backgroundColor: "#3498DB",
                            }}
                            onClick={this.handleSubmit}
                        >
                            {buttonTitle}
                        </Button>
                        <Close
                            style={{marginLeft: 8, cursor: "pointer",}}
                            onClick={this.closeForm}/>
                    </div>
                </div>
            </div>);
    }

    render() {
        const {user} = this.props;
        const {currentProject} = this.props;
        const title = this.props.projects.find((project) => (project.id === currentProject.id)).title;
        const lists = this.props.projects.find((project) => (project.id === currentProject.id)).lists;
        const users = this.props.projects.find((project) => (project.id === currentProject.id)).users;
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

                    {this.state.formOpen ? <div className="projectHead"> {this.renderForm()} </div> :
                        <div className="projectHead">
                                <h2 className={'projectTitle'} onClick={this.openForm}>{title}</h2>
                            <ProjectUsers
                                userId={user.id}
                                users={users}
                                projectId={currentProject.id}
                                title={title}
                            />
                        </div>}

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
        updateProjectTitle: (payload) => dispatch({type: 'UPDATE_TITLE', payload: payload}),
        updateListAndCards: (payload) => dispatch({type: 'UPDATE_LIST_AND_CARDS', payload: payload}),
        deleteCard: (payload) => dispatch({type: 'DELETE_CARD', payload: payload}),
        hideModal: () => dispatch({type: 'HIDE_MODAL'}),

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Project);