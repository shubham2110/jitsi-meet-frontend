import {
    ReducerRegistry
} from '../base/redux';


ReducerRegistry.register('features/virtualB', (state = {}, action) => {

    console.log("before state", state, ' action', action);
    switch (action.type) {
        case 'V_ENABLED': {
            return {
                ...state,
                virtualB: true
            };
        }
        case 'V_DISABLED': {
            return {
                ...state,
                virtualB: false
            };
        }
    }

    console.log("after state", state, ' action', action);

    return state;
});