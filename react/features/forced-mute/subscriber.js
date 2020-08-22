// @flow

import { StateListenerRegistry } from '../base/redux';
import { getCurrentConference } from '../base/conference';
import {
    getPinnedParticipant,
    isLocalParticipantModerator
} from '../base/participants';

import { FORCED_MUTE_COMMAND } from './constants';

/**
 * Subscribes to changes to the Forced Mute setting for the local participant to
 * notify remote participants of current user interface status.
 * Changing newSelectedValue param to off, when feature is turned of so we can
 * notify all listeners.
 */
StateListenerRegistry.register(
    /* selector */ state => state['features/base/conference'].forcedMuteEnabled,
    /* listener */ (newSelectedValue, store) => _sendForcedMuteCommand(newSelectedValue || 'off', store));

/**
 * Subscribes to changes to the currently pinned participant in the user
 * interface of the local participant.
 */
StateListenerRegistry.register(
    /* selector */ state => {
        const pinnedParticipant = getPinnedParticipant(state);

        return pinnedParticipant ? pinnedParticipant.id : null;
    },
    /* listener */ _sendForcedMuteCommand);

/**
 * Subscribes to changes to the shared document (etherpad) visibility in the
 * user interface of the local participant.
 *
 * @param sharedDocumentVisible {Boolean} {true} if the shared document was
 * shown (as a result of the toggle) or {false} if it was hidden
 */
StateListenerRegistry.register(
    /* selector */ state => state['features/etherpad'].editing,
    /* listener */ _sendForcedMuteCommand);

/**
 * Subscribes to changes to the filmstrip visibility in the user interface of
 * the local participant.
 */
StateListenerRegistry.register(
    /* selector */ state => state['features/filmstrip'].visible,
    /* listener */ _sendForcedMuteCommand);

/**
 * Subscribes to changes to the tile view setting in the user interface of the
 * local participant.
 */
StateListenerRegistry.register(
    /* selector */ state => state['features/video-layout'].tileViewEnabled,
    /* listener */ _sendForcedMuteCommand);

/**
 * Private selector for returning state from redux that should be respected by
 * other participants while forced mute is enabled.
 *
 * @param {Object} state - The redux state.
 * @returns {Object}
 */
function _getForcedMuteState(state) {
    const pinnedParticipant = getPinnedParticipant(state);

    return {
        filmstripVisible: state['features/filmstrip'].visible,
        nextOnStage: pinnedParticipant && pinnedParticipant.id,
        sharedDocumentVisible: state['features/etherpad'].editing,
        tileViewEnabled: state['features/video-layout'].tileViewEnabled
    };
}

/**
 * Sends the forced-mute command, when a local property change occurs.
 *
 * @param {*} newSelectedValue - The changed selected value from the selector.
 * @param {Object} store - The redux store.
 * @private
 * @returns {void}
 */
function _sendForcedMuteCommand(
        newSelectedValue, store) { // eslint-disable-line no-unused-vars
    const state = store.getState();
    const conference = getCurrentConference(state);

	console.log("_sendForcedMuteCommand");
    if (!conference) {
        return;
    }
	
    // Only a moderator is allowed to send commands.
    if (!isLocalParticipantModerator(state)) {
        return;
    }
	
    if (newSelectedValue === 'off') {
        // if the change is to off, local user turned off forced mute and
        // we want to signal this

        conference.sendCommandOnce(
            FORCED_MUTE_COMMAND,
            { attributes: { off: true } }
        );

        return;
    } else if (!state['features/base/conference'].forcedMuteEnabled) {
        return;
    }

    conference.sendCommand(
        FORCED_MUTE_COMMAND,
        { attributes: _getForcedMuteState(state) }
    );
}
