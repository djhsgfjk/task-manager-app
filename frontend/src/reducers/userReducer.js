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



const userReducer = (state = {}, action) => {
	switch (action.type) {
		case "LOGIN":
			return {
				id: action.payload.id,
				username: action.payload.username,
				email: action.payload.email,
				// projects: action.payload.projects,
			};
		// case "ADD_PROJECT":
		// 	return {
		// 		...state,
		// 		projects: [...state.projects, action.payload],
		// 	}
		case "LOGOUT":
			return {};
		default:
			return state;
	}
}

export default userReducer;