import React from "react";
import {Component} from "react";
import TasksList from "./TasksList";
import "./styles.css"


import {connect} from "react-redux";
import axios from "axios";
import AddListButtonForm from "./AddListButtonForm";


class App extends Component{
    componentDidMount() {
        this.refreshProject()
    }

    refreshProject = async () => {
        const res = await axios
            .get('http://localhost:8000/api/lists/')
            .catch(err => console.log(err))
        this.props.refresh(res.data)
    }

    render () {
        const lists = this.props.lists;
        const newListIndex = lists.length > 0 ? +lists[lists.length-1].index + 1 : 1
        return (
            <div id="project">
                <div id="projectTitleContainer">
                    <h2>My project</h2>
                </div>
                <div id="listsContainer">
                    {lists.map(list => <TasksList key={list.id} listId={list.id} title={list.title} cards={list.cards}/>)}
                    <AddListButtonForm index={newListIndex}/>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {return {lists: state.lists}}
const mapDispatchToProps = (dispatch) => {
    return {
        refresh: (payload) => dispatch({ type: 'REFRESH' , payload: payload}),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);