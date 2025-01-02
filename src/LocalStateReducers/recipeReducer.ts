export interface RecipeState {
	page: number;
	totalPages: number;
	loading: boolean;
	error: string;
	search: string;
	difficulty: string;
}

export const initialState: RecipeState = {
	page: 1,
	totalPages: 1,
	loading: false,
	error: '',
	search: '',
	difficulty: '',
};

export const recipeReducer = (state: RecipeState, action: { type: string; payload?: any }): RecipeState => {
	switch (action.type) {
		case 'SET_PAGE':
			return { ...state, page: action.payload };
		case 'SET_TOTAL_PAGES':
			return { ...state, totalPages: action.payload };
		case 'SET_LOADING':
			return { ...state, loading: action.payload };
		case 'SET_SEARCH':
			return { ...state, search: action.payload };
		case 'SET_DIFFICULTY':
			return { ...state, difficulty: action.payload };
		case 'SET_ERROR':
			return { ...state, error: action.payload };
		default:
			return state;
	}
};
