import { CONVERSATION_REQUEST, CONVERSATION_RESPONSE } from '../Services/Type';

const initialState = {
    data: null,
};

export const ConversationReducer = (state = initialState, action) => {
    const prevState = { ...state };
    const { type } = action;

    switch (type) {
        case CONVERSATION_REQUEST:
            return {
                ...prevState,
                action: action,
            };
        case CONVERSATION_RESPONSE:
            return {
                ...prevState,
                data: action.payload,
            };
    }
    return prevState;
};
