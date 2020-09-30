import {
    ReducerRegistry
} from '../base/redux';


ReducerRegistry.register('features/virtualB', (state = {}, action) => {
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

    return state;
});