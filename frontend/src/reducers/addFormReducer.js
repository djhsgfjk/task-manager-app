const initialState = 0

const addFormReduser = (state = initialState, action) => {
	switch (action.type) {
		case "OPEN_FORM":
			return action.payload
		case "CLOSE_FORM":
			return initialState;
		default:
			return state
	}
};

export default addFormReduser