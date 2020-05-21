// @flow

import {
	SET_FORCED_MUTE_MODERATOR,
	SET_FORCED_MUTE_STATE,
} from './actionTypes';

import { OPEN_FORCED_MUTE_DIALOG } from './actionTypes';

/**
 * Sets the current moderator id or clears it.
 *
 * @param {?string} id - The Forced Mute moderator participant id.
 * @returns {{
 *     type: SET_FORCED_MUTE_MODERATOR,
 *     id, string
 * }}
 */
export function setForcedMuteModerator(id: ?string) {
    return {
        type: SET_FORCED_MUTE_MODERATOR,
        id
    };
}

/**
 * Sets the Forced Mute feature state.
 *
 * @param {?Object} state - The current state.
 * @returns {{
 *     type: SET_FORCED_MUTE_STATE,
 *     state: Object
 * }}
 */
export function setForcedMuteState(state: ?Object) {
    return {
        type: SET_FORCED_MUTE_STATE,
        state
    };
}


/**
 * Opens the dialog showing available keyboard shortcuts.
 *
 * @returns {{
 *     type: OPEN_FORCED_MUTE_DIALOG
 * }}
 */
export function OpenForcedMuteDialog() {
    return {
        type: OPEN_FORCED_MUTE_DIALOG
    };
}
