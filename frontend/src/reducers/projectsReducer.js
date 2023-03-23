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

const projectsReducer = (state = [], action) => {
	switch (action.type) {
		case "UPLOAD_PROJECTS":
			return action.payload.map(
				(project) => {
					return {...project, lists: sortListsAndCards(project.lists)};
				})
		case "ADD_PROJECT":
			return [...state, action.payload.project]
		case "UPDATE_USERS":
			return state.map(
				(project) => {
					if (project.id === action.payload.projectId)
						return {...project, users: action.payload.users};
					else
						return project;
				})
		case "UPDATE_TITLE":
			return state.map(
				(project) => {
					if (project.id === action.payload.projectId)
						return {...project, title: action.payload.title};
					else
						return project;
				})
		case "UPDATE_PROJECT":
			return state.map(
				(project) => {
					if (project.id === action.payload.projectId)
						return {...project, lists: action.payload.lists};
					else
						return project;
				})
		case "UPDATE_LIST":
			return state.map(
				(project) => {
					if (project.id === action.payload.projectId) {
						return {...project, lists: project.lists.map((list) => {
							if (list.id === action.payload.list.id)
								return {...action.payload.list, cards:list.cards}
							else
								return list
						})};
					}
					else
						return project;
				})
		case "SORT_LIST_BY_DUE":
			return state.map(
				(project) => {
					if (project.id === action.payload.projectId) {
						return {...project, lists: project.lists.map((list) => {
								if (list.id === action.payload.listId)
									return {...list, cards: action.payload.listCards}
								else
									return list
							})}
					}
					else
						return project;
				})
		case "UPDATE_LIST_AND_CARDS":
			return state.map(
				(project) => {
					if (project.id === action.payload.projectId) {
						return {...project, lists: project.lists.map((list) => {
								if (list.id === action.payload.list.id)
									return action.payload.list
								else
									return list
							})}
					}
					else
						return project;
				})
		case "ADD_LIST":
			return state.map(
				(project) => {
					if (project.id === action.payload.projectId) {
						return {...project, lists: [...project.lists, action.payload.list]}
					}
					else
						return project;
				})
		case "DELETE_LIST":
			return state.map(
				(project) => {
					if (project.id === action.payload.projectId) {
						return {...project, lists: project.lists.filter((list) => (!(list.id === action.payload.listId)))}
					}
					else
						return project;
				})
		case "UPDATE_CARD":
			return state.map(
				(project) => {
					if (project.id === action.payload.projectId) {
						return {...project, lists: project.lists.map((list) => {
								if (list.id === action.payload.listId)
									return {...list, cards:list.cards.map((card) => {
											if (card.id === action.payload.card.id)
												return action.payload.card
											else
												return card
										})}
								else
									return list
							})}
					}
					else
						return project;
				})
		case "ADD_CARD":
			return state.map(
				(project) => {
					if (project.id === action.payload.projectId) {
						return {...project, lists: project.lists.map((list) => {
								if (list.id === action.payload.listId)
									return {...list, cards: [...list.cards, action.payload.card]}
								else
									return list
							})}
					}
					else
						return project;
				})
		case "DELETE_CARD":
			return state.map(
				(project) => {
					if (project.id === action.payload.projectId) {
						return {...project, lists: project.lists.map((list) => {
								if (list.id === action.payload.listId)
									return {...list, cards: list.cards.filter((card) => (
											!(card.id === action.payload.cardId)))}
								else
									return list
							})}
					}
					else
						return project;
				})
		case "LOGOUT":
			return [];
		default:
			return state;
			// return [state.map(
			// 	(project) => {
			// 		return {...project, lists: sortListsAndCards(project.lists)}
			// 	}
			// )];
	}
}

export default projectsReducer;