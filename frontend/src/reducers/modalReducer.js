const modalReducer = (state, action) => {
	switch (action.type) {
		case 'SHOW_MODAL':
			return {modalOn: true, card: action.payload};
		case 'HIDE_MODAL':
			return {modalOn: false, card: null};
		case "LOGOUT":
			return {};
		default:
			return {modalOn: false, card: null};
	}
}

export default modalReducer;