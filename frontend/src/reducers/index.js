import {combineReducers} from "redux";
import listsReducer from "./listsReducer";
import addFormReduser from "./addFormReducer";

export default combineReducers({
	lists:listsReducer,
	addFormIndex: addFormReduser,

})