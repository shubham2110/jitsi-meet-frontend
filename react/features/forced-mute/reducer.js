// @flow

import {
    SET_FORCED_MUTE_MODERATOR,
    SET_FORCED_MUTE_STATE
} from './actionTypes';
import { ReducerRegistry, set } from '../base/redux';

/**
 * Listen for actions that contain the Forced Mute feature active state, so that it can be stored.
 */
ReducerRegistry.register(
    'features/forced-mute',
    (state = {}, action) => {
        switch (action.type) {

        case SET_FORCED_MUTE_MODERATOR: {
            let newState = set(state, 'moderator', action.id);

            if (!action.id) {
                // clear the state if feature becomes disabled
                newState = set(newState, 'state', undefined);
            }

            return newState;
        }
        case SET_FORCED_MUTE_STATE: {
            return set(state, 'state', action.state);
        }
        }

        return state;
    });
