import firestore from '@react-native-firebase/firestore'

const initialState = {
    count: 0,
    curruser: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'COUNT_INCRESE':
            return {
                ...state,
                count: state.count + 1,
            };
        case 'COUNT_DECRESE':
            return {
                ...state,
                count: state.count - 1,
            };
        case 'SET_USER':
            console.log(" user setting")
            return {
                ...state,
                curruser: action.user
            };
        default:
            return state;
    }
};