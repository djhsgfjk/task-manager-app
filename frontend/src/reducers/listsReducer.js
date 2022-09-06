const initialState = []

const sortListsAndCards = (lists) => {
	return lists
		.sort((a, b) => (a.index - b.index))
		.map((list) => {
			return {...list, cards: list.cards
					.sort((a, b) => (a.index - b.index))}
		})

}

const sortList = (list) => {
	return {...list, cards: list.cards
		.sort((a, b) => (a.index - b.index))}

}


const listsReducer = (state = initialState, action) => {
	switch (action.type) {
		case "UPLOAD_LISTS":
			return sortListsAndCards(action.payload)
		case "UPDATE_PROJECT":
			return action.payload
		case "UPDATE_LIST":
			return state.map((list) => {
				if (list.id === action.payload.id)
					return {...action.payload, cards:list.cards}
				else
					return list
			})
		case "SORT_LIST_BY_DUE":
			return state.map((list) => {
			if (list.id === action.payload.id)
				return {...list, cards: action.payload.cards}
			else
				return list
		})

		case "UPDATE_LIST_AND_CARDS":
			return state.map((list) => {
				if (list.id === action.payload.id)
					return action.payload
				else
					return list
			})
		case "ADD_LIST":
			return [...state, action.payload]
		case "DELETE_LIST":
			return state.filter((list) => (!(list.id === action.payload)))
		case "UPDATE_CARD":
			return state.map((list) => {
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
			return state.map((list) => {
				if (list.id === action.payload.listId)
					return {...list, cards: [...list.cards, action.payload]}
				else
					return list
			})
		case "DELETE_CARD":
			return state.map((list) => {
				if (list.id === action.payload.listId)
					return {...list, cards: list.cards.filter((card, index) => (
						!(index === action.payload.cardIndex)))}
				else
					return list
			})
		default:
			return sortListsAndCards(state)
	}
};

export default listsReducer