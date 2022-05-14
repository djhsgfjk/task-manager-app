import React from "react";
import {Component} from "react";
import TasksList from "./TasksList";
import {connect} from "react-redux";
import axios from "axios";
import ActionButton from "./ActionButton";
import * as binClosed from '../icons/bin_closed.png';
import * as binOpened from '../icons/bin_opened.png';

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {bin: binClosed.default}
    }

    componentDidMount() {
        this.refreshProject()
    }

    refreshProject = async () => {
        const res = await axios
            .get('http://localhost:8000/api/lists/')
            .catch(err => console.log(err))
        this.props.refresh(res.data)
    }

    openBin = () => {
        this.setState({bin: binOpened.default})
    }

    closeBin = () => {
        this.setState({bin: binClosed.default})
    }

    onDragEnd = (res) => {

    }


    render () {
        const {lists} = this.props;
        const newListIndex = lists.length > 0 ? +lists[lists.length-1].index + 1 : 1
        const {bin} = this.state
        return (
            <div id="app">
                <div id="project">
                    <div id="projectTitleContainer">
                        <h2>My project</h2>
                    </div>
                        <div id="listsContainer">
                            {lists.sort((a, b) => (
                                a.index - b.index)
                            ).map(list =>
                                (<TasksList
                                    key={list.id}
                                    listId={list.id}
                                    listIndex={list.index}
                                    title={list.title}
                                    cards={list.cards}/>)
                            )}
                            <ActionButton list index={newListIndex}/>
                        </div>
                </div>
                <div id="binContainer" onPointerEnter={this.openBin} onPointerLeave={this.closeBin}>
                    <img src={bin} alt="bin_closed" style={{width:'8vh'}} />
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