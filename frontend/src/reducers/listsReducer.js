// const newState =[
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

const listsReducer = (state = initialState, action) => {
	switch (action.type) {
		case "REFRESH":
			return action.payload
		default:
			return state
	}
};

export default listsReducer