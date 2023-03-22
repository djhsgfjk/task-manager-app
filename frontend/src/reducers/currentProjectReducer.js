const currentProjectReducer = (state = {navOpened: true}, action) => {
	switch (action.type) {
		case "OPEN_PROJECT":
			return {
				id: action.payload.id,
				users: action.payload.users,
				title: action.payload.title,
				navOpened: true,
			}
		case "LOGOUT":
			return {navOpened: true};
		case "CHANGE_NAV":
			return {...state, navOpened: action.payload}
 		default:
			return state;
	}
}

export default currentProjectReducer;