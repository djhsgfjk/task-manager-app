import React, {Component} from "react";
import TasksList from "./TasksList";
import axios from "axios";
import ActionButton from "./ActionButton";
import "./styles.css"

// const initialState =[
//   {
//     title: 'TO DO',
//     id: 0,
//     cards: [
//       {
//         id: 0,
//         text: 'Watch all the videos',
//       },
//       {
//         id: 1,
//         text: 'Learn reducers',
//       }
//     ]
//
//   },
//   {
//     title: 'IN PROGRESS',
//     id: 1,
//     cards: [
//       {
//         id: 0,
//         text: 'Learn js',
//       },
//       {
//         id: 1,
//         text: 'Learn react',
//       },
//       {
//         id: 2,
//         text: 'Build your task manager!',
//       }
//     ]
//
//   }
// ];

const initialState = []

class App extends Component{
    constructor(props) {
      super(props);
      this.state = {lists: initialState}
    }

  componentDidMount() {
    this.refreshProject()
  }

  refreshProject() {
    axios
        .get('http://localhost:8000/api/lists/')
        .then(res => this.setState({lists: res.data}))
        .catch(err => console.log(err))
  }

  render () {
    const {lists} = this.state;
    const newListIndex = lists.length > 0 ? +lists[lists.length-1].index + 1 : 1
    return (
        <div className="App">
          <h2>My project</h2>
          <div className="listsContainer">
            {lists.map(list => <TasksList key={list.id} listId={list.id} title={list.title} cards={list.cards}/>)}
            <ActionButton list index={newListIndex}/>
          </div>
        </div>
    );
  }
}

export default App;