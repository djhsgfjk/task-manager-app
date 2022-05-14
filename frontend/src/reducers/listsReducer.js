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
		case "UPDATE_LIST":
			return [...state].map((list) => {
				if (list.id === action.payload.id)
					return action.payload
				else
					return list
			})
		case "ADD_LIST":
			return [...state, action.payload]
		case "UPDATE_CARD":
			return [...state].map((list) => {
				if (list.id === action.payload.listId)
					return {...list, cards:list.cards.map((card) => {
							if (card.id === action.payload.id)
								return action.payload
							else
								return card
						})}
				else
					return list
			})
		case "ADD_CARD":
			return [...state].map((list) => {
				if (list.id === action.payload.listId)
					return {...list, cards: [...list.cards, action.payload]}
				else
					return list
			})
		default:
			return state
	}
};

export default listsReducer