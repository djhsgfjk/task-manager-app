import {combineReducers} from "redux";
import userReducer from "./userReducer";
import currentProjectReducer from "./currentProjectReducer";
import listsReducer from "./listsReducer";
import modalReducer from "./modalReducer";
import projectsReducer from "./projectsReducer";

export default combineReducers({
	user:userReducer,
	projects: projectsReducer,
	currentProject: currentProjectReducer,
	modal:modalReducer,
})