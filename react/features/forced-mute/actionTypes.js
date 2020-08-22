// @flow

/**
 * The id of the Forced Mute moderator.
 *
 * {
 *     type: SET_FORCED_MUTE_MODERATOR,
 *     id: boolean
 * }
 */
export const SET_FORCED_MUTE_MODERATOR = 'SET_FORCED_MUTE_MODERATOR';

/**
 * The type of (redux) action which updates the current known state of the
 * Forced Mute feature.
 *
 *
 * {
 *     type: SET_FORCED_MUTE_STATE,
 *     state: boolean
 * }
 */
export const SET_FORCED_MUTE_STATE = 'SET_FORCED_MUTE_STATE';



/**
 * The type of the action which signals the forced mute dialog should
 * be displayed.
 *
 * {
 *     type: OPEN_FORCED_MUTE_DIALOG
 * }
 */
export const OPEN_FORCED_MUTE_DIALOG
    = 'OPEN_FORCED_MUTE_DIALOG';

