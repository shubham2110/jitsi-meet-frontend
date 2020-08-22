// @flow

import {
    setForcedMuteModerator,
    setForcedMuteState
} from './actions';
import { CONFERENCE_WILL_JOIN } from '../base/conference';
import {
    getParticipantById,
    getPinnedParticipant,
    PARTICIPANT_LEFT,
    pinParticipant
} from '../base/participants';
import { MiddlewareRegistry } from '../base/redux';
import { setFilmstripVisible } from '../filmstrip';
import { setTileView } from '../video-layout';

import { FORCED_MUTE_COMMAND } from './constants';
import { isForcedMuteActive } from './functions';
import logger from './logger';

import { OPEN_FORCED_MUTE_DIALOG } from './actionTypes';

declare var APP: Object;

/**
 * The timeout after which a forced-mute command that has been received will be
 * ignored if not consumed.
 *
 * @type {number} in seconds
 * @private
 */
const _FORCED_MUTE_RECEIVED_TIMEOUT = 30;

/**
 * An instance of a timeout used as a workaround when attempting to pin a
 * non-existent particapant, which may be caused by participant join information
 * not being received yet.
 *
 * @type {TimeoutID}
 */
let nextOnStageTimeout;

/**
 * A count of how many seconds the nextOnStageTimeout has ticked while waiting
 * for a participant to be discovered that should be pinned. This variable
 * works in conjunction with {@code _FORCED_MUTE_RECEIVED_TIMEOUT} and
 * {@code nextOnStageTimeout}.
 *
 * @type {number}
 */
let nextOnStageTimer = 0;


/**
 * Represents "Forced Mute" feature which enables a moderator to (partially)
 * control the user experience/interface (e.g. filmstrip visibility) of (other)
 * non-moderator participant.
 */
MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case CONFERENCE_WILL_JOIN: {
        const { conference } = action;

        conference.addCommandListener(
            FORCED_MUTE_COMMAND, ({ attributes }, id) => {
                _onForcedMuteCommand(attributes, id, store);
            });
        break;
    }
    case PARTICIPANT_LEFT:
        if (store.getState()['features/forced-mute'].moderator === action.participant.id) {
            store.dispatch(setForcedMuteModerator());
        }
        break;
    }

    return next(action);
});

/**
 * Notifies this instance about a "Forced Mute" command received by the Jitsi
 * conference.
 *
 * @param {Object} attributes - The attributes carried by the command.
 * @param {string} id - The identifier of the participant who issuing the
 * command. A notable idiosyncrasy to be mindful of here is that the command
 * may be issued by the local participant.
 * @param {Object} store - The redux store. Used to calculate and dispatch
 * updates.
 * @private
 * @returns {void}
 */
function _onForcedMuteCommand(attributes = {}, id, store) {
	//alert("_onForcedMuteCommand1")
	
    const state = store.getState();

    // We require to know who issued the command because (1) only a
    // moderator is allowed to send commands and (2) a command MUST be
    // issued by a defined commander.
    if (typeof id === 'undefined') {
        return;
    }
	
    const participantSendingCommand = getParticipantById(state, id);
	
    // The Command(s) API will send us our own commands and we don't want
    // to act upon them.
    if (participantSendingCommand.local) {
        return;
    }
	
    if (participantSendingCommand.role !== 'moderator') {
        logger.warn('Received forced-mute command not from moderator');
        return;
    }
	
	//isMuteForced = !isForcedMuteActive(state)
    if (!isForcedMuteActive(state)) {
        store.dispatch(setForcedMuteModerator(id));
    }
	
    // just a command that forced mute was turned off
    if (attributes.off) {
        store.dispatch(setForcedMuteModerator());
        return;
    }
	
    const oldState = state['features/forced-mute'].state || {};

    store.dispatch(setForcedMuteState(attributes));
	
    // XMPP will translate all booleans to strings, so explicitly check against
    // the string form of the boolean {@code true}.
    /*if (oldState.filmstripVisible !== attributes.filmstripVisible) {
        store.dispatch(setFilmstripVisible(attributes.filmstripVisible === 'true'));
    }

    if (oldState.tileViewEnabled !== attributes.tileViewEnabled) {
        store.dispatch(setTileView(attributes.tileViewEnabled === 'true'));
    }*/

    // For now gate etherpad checks behind a web-app check to be extra safe
    // against calling a web-app global.
    if (typeof APP !== 'undefined'
        && oldState.sharedDocumentVisible !== attributes.sharedDocumentVisible) {
        const isEtherpadVisible = attributes.sharedDocumentVisible === 'true';
        const documentManager = APP.UI.getSharedDocumentManager();
        /*if (documentManager
                && isEtherpadVisible !== state['features/etherpad'].editing) {
            documentManager.toggleEtherpad();
        }*/
    }
	
	
	/*
    const pinnedParticipant
        = getPinnedParticipant(state, attributes.nextOnStage);
    const idOfParticipantToPin = attributes.nextOnStage;
	
	if (typeof idOfParticipantToPin !== 'undefined'
            && (!pinnedParticipant
                || idOfParticipantToPin !== pinnedParticipant.id)
            && oldState.nextOnStage !== attributes.nextOnStage) {
        //_pinVideoThumbnailById(store, idOfParticipantToPin);
		alert("_onForcedMuteCommand12")
		alert("Hello")
    } else if (typeof idOfParticipantToPin === 'undefined'
            && pinnedParticipant) {
		alert("_onForcedMuteCommand13")
        //store.dispatch(pinParticipant(null));
    }*/
}

/**
 * Pins the video thumbnail given by clickId.
 *
 * @param {Object} store - The redux store.
 * @param {string} clickId - The identifier of the participant to pin.
 * @private
 * @returns {void}
 */
function _pinVideoThumbnailById(store, clickId) {
    if (getParticipantById(store.getState(), clickId)) {
        clearTimeout(nextOnStageTimeout);
        nextOnStageTimer = 0;

        store.dispatch(pinParticipant(clickId));
    } else {
        nextOnStageTimeout = setTimeout(() => {
            if (nextOnStageTimer > _FORCED_MUTE_RECEIVED_TIMEOUT) {
                nextOnStageTimer = 0;

                return;
            }

            nextOnStageTimer++;

            _pinVideoThumbnailById(store, clickId);
        }, 1000);
    }
}

/**
 * Implements the middleware of the feature forced mute
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case OPEN_FORCED_MUTE_DIALOG:
        if (typeof APP === 'object') {
            APP.forcedmute.openDialog();
        }
        break;
    }

    return next(action);
});
