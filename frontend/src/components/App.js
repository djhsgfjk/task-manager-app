import React, {Component} from "react";
import TasksList from "./TasksList";
import axios from "axios";

const styles = {
  listsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
};

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
    this.refreshList()
  }

  refreshList() {
    axios
        .get('http://localhost:8000/api/tasks/')
        .then(res => this.setState({lists:
              [
                  {
                    title: 'TO DO',
                    id: 0,
                    cards: res.data
                  }
              ]
        }))
        .catch(err => console.log(err))
  }

  render () {
    const lists = this.state.lists;
    return (
        <div className="App">
          <h2>My project</h2>
          <div style={styles.listsContainer}>
            {lists.map(list => <TasksList title={list.title} cards={list.cards}/>)}
          </div>
        </div>
    );
  }
}

export default App;