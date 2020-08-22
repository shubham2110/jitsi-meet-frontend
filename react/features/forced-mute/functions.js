// @flow

import { toState } from '../base/redux';

/**
 * Returns true if forced mute is active and false otherwise.
 *
 * @param {Object|Function} stateful - Object or function that can be resolved
 * to the Redux state.
 * @returns {boolean} - True if forced mute is active and false otherwise.
 */
export function isForcedMuteActive(stateful: Object | Function) {
    const state = toState(stateful);

    return Boolean(state['features/forced-mute'].moderator);
}
