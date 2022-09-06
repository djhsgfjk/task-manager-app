import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "../reducers/index"

const loadState = () => {
	try {
		// Load the data saved in localStorage, against the key 'app_state'
		const serialisedState = window.localStorage.getItem('app_state');

		// Passing undefined to createStore will result in our app getting the default state
		// If no data is saved, return undefined
		if (!serialisedState) return undefined;

		// De-serialise the saved state, and return it.
		return JSON.parse(serialisedState);
	} catch (err) {
		console.log(err)
		return undefined;
	}
};

const saveState = (state) => {
	try {
		// Convert the state to a JSON string
		const serialisedState = JSON.stringify(state);

		// Save the serialised state to localStorage against the key 'app_state'
		window.localStorage.setItem('app_state', serialisedState);
	}
	catch (err) {
		console.log(err)
	}
};


const oldState = loadState();
console.log("loadstate", oldState);

const store = configureStore({ reducer: rootReducer, preloadedState: oldState});


store.subscribe(() => {
	const currentState = store.getState();
		saveState(currentState);
});

// const store = configureStore({ reducer: rootReducer,})

export default store;