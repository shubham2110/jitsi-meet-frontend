// @flow

import React, { Component } from 'react';

import { Icon, IconMenuThumb } from '../../../base/icons';
import { MEDIA_TYPE } from '../../../base/media';
import { getLocalParticipant, getParticipantById, PARTICIPANT_ROLE } from '../../../base/participants';
import { Popover } from '../../../base/popover';
import { connect } from '../../../base/redux';
import { isRemoteTrackMuted } from '../../../base/tracks';
import { requestRemoteControl, stopController } from '../../../remote-control';
import { getCurrentLayout, LAYOUTS } from '../../../video-layout';

import MuteEveryoneElseButton from './MuteEveryoneElseButton';
import { REMOTE_CONTROL_MENU_STATES } from './RemoteControlButton';

import {
    GrantModeratorButton,
    MuteButton,
    KickButton,
    PrivateMessageMenuButton,
    RemoteControlButton,
    RemoteVideoMenu,
    VolumeSlider
} from './';

declare var $: Object;
declare var interfaceConfig: Object;

/**
 * The type of the React {@code Component} props of
 * {@link RemoteVideoMenuTriggerButton}.
 */
type Props = {

    /**
     * Whether or not to display the kick button.
     */
    _disableKick: boolean,

    /**
     * Whether or not to display the remote mute buttons.
     */
    _disableRemoteMute: Boolean,

    /**
     * Whether or not the participant is currently muted.
     */
    _isAudioMuted: boolean,

    /**
     * Whether or not the participant is a conference moderator.
     */
    _isModerator: boolean,

    /**
     * The position relative to the trigger the remote menu should display
     * from. Valid values are those supported by AtlasKit
     * {@code InlineDialog}.
     */
    _menuPosition: string,

    /**
     * The current state of the participant's remote control session.
     */
    _remoteControlState: number,


    /**
     * The redux dispatch function.
     */
    dispatch: Function,

    /**
     * A value between 0 and 1 indicating the volume of the participant's
     * audio element.
     */
    initialVolumeValue: number,

    /**
     * Callback to invoke when the popover has been displayed.
     */
    onMenuDisplay: Function,

    /**
     * Callback to invoke when changing the level of the participant's
     * audio element.
     */
    onVolumeChange: Function,

    /**
     * The ID for the participant on which the remote video menu will act.
     */
    participantID: string,
};

/**
 * React {@code Component} for displaying an icon associated with opening the
 * the {@code RemoteVideoMenu}.
 *
 * @extends {Component}
 */
class RemoteVideoMenuTriggerButton extends Component<Props> {
    /**
     * The internal reference to topmost DOM/HTML element backing the React
     * {@code Component}. Accessed directly for associating an element as
     * the trigger for a popover.
     *
     * @private
     * @type {HTMLDivElement}
     */
    _rootElement = null;

    /**
     * Initializes a new {#@code RemoteVideoMenuTriggerButton} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Object) {
        super(props);

        // Bind event handler so it is only bound once for every instance.
        this._onShowRemoteMenu = this._onShowRemoteMenu.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const content = this._renderRemoteVideoMenu();

        if (!content) {
            return null;
        }

        return (
            <Popover
                content = { content }
                onPopoverOpen = { this._onShowRemoteMenu }
                position = { this.props._menuPosition }>
                <span
                    className = 'popover-trigger remote-video-menu-trigger'>
                    <Icon
                        size = '1em'
                        src = { IconMenuThumb }
                        title = 'Remote user controls' />
                </span>
            </Popover>
        );
    }

    _onShowRemoteMenu: () => void;

    /**
     * Opens the {@code RemoteVideoMenu}.
     *
     * @private
     * @returns {void}
     */
    _onShowRemoteMenu() {
        this.props.onMenuDisplay();
    }

    /**
     * Creates a new {@code RemoteVideoMenu} with buttons for interacting with
     * the remote participant.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderRemoteVideoMenu() {
        const {
            _disableKick,
            _disableRemoteMute,
            _isAudioMuted,
            _isModerator,
            dispatch,
            initialVolumeValue,
            onVolumeChange,
            _remoteControlState,
            participantID
        } = this.props;

        const buttons = [];

        if (_isModerator) {
            if (!_disableRemoteMute) {
                buttons.push(
                    <MuteButton
                        isAudioMuted = { _isAudioMuted }
                        key = 'mute'
                        participantID = { participantID } />
                );
                buttons.push(
                    <MuteEveryoneElseButton
                        key = 'mute-others'
                        participantID = { participantID } />
                );
            }

            buttons.push(
                <GrantModeratorButton
                    key = 'grant-moderator'
                    participantID = { participantID } />
            );

            if (!_disableKick) {
                buttons.push(
                    <KickButton
                        key = 'kick'
                        participantID = { participantID } />
                );
            }
        }

        if (_remoteControlState) {
            let onRemoteControlToggle = null;

            if (_remoteControlState === REMOTE_CONTROL_MENU_STATES.STARTED) {
                onRemoteControlToggle = () => dispatch(stopController(true));
            } else if (_remoteControlState === REMOTE_CONTROL_MENU_STATES.NOT_STARTED) {
                onRemoteControlToggle = () => dispatch(requestRemoteControl(participantID));
            }

            buttons.push(
                <RemoteControlButton
                    key = 'remote-control'
                    onClick = { onRemoteControlToggle }
                    participantID = { participantID }
                    remoteControlState = { _remoteControlState } />
            );
        }

        buttons.push(
            <PrivateMessageMenuButton
                key = 'privateMessage'
                participantID = { participantID } />
        );

        if (onVolumeChange) {
            buttons.push(
                <VolumeSlider
                    initialValue = { initialVolumeValue }
                    key = 'volume-slider'
                    onChange = { onVolumeChange } />
            );
        }

        if (buttons.length > 0) {
            return (
                <RemoteVideoMenu id = { participantID }>
                    { buttons }
                </RemoteVideoMenu>
            );
        }

        return null;
    }
}

/**
 * Maps (parts of) the Redux state to the associated {@code RemoteVideoMenuTriggerButton}'s props.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The own props of the component.
 * @private
 * @returns {{
 *     _isAudioMuted: boolean,
 *     _isModerator: boolean,
 *     _disableKick: boolean,
 *     _disableRemoteMute: boolean,
 *     _menuPosition: string,
 *     _remoteControlState: number
 * }}
 */
function _mapStateToProps(state, ownProps) {
    const { participantID } = ownProps;
    const tracks = state['features/base/tracks'];
    const localParticipant = getLocalParticipant(state);
    const { remoteVideoMenu = {}, disableRemoteMute } = state['features/base/config'];
    const { disableKick } = remoteVideoMenu;
    let _remoteControlState = null;
    const participant = getParticipantById(state, participantID);
    const _isRemoteControlSessionActive = participant?.remoteControlSessionStatus ?? false;
    const _supportsRemoteControl = participant?.supportsRemoteControl ?? false;
    const { active, controller } = state['features/remote-control'];
    const { requestedParticipant, controlled } = controller;
    const activeParticipant = requestedParticipant || controlled;

    if (_supportsRemoteControl
            && ((!active && !_isRemoteControlSessionActive) || activeParticipant === participantID)) {
        if (requestedParticipant === participantID) {
            _remoteControlState = REMOTE_CONTROL_MENU_STATES.REQUESTING;
        } else if (controlled) {
            _remoteControlState = REMOTE_CONTROL_MENU_STATES.STARTED;
        } else {
            _remoteControlState = REMOTE_CONTROL_MENU_STATES.NOT_STARTED;
        }
    }

    const currentLayout = getCurrentLayout(state);
    let _menuPosition;

    switch (currentLayout) {
    case LAYOUTS.TILE_VIEW:
        _menuPosition = 'left top';
        break;
    case LAYOUTS.VERTICAL_FILMSTRIP_VIEW:
        _menuPosition = 'left bottom';
        break;
    default:
        _menuPosition = 'top center';
    }

    return {
        _isAudioMuted: isRemoteTrackMuted(tracks, MEDIA_TYPE.AUDIO, participantID) || false,
        _isModerator: Boolean(localParticipant?.role === PARTICIPANT_ROLE.MODERATOR),
        _disableKick: Boolean(disableKick),
        _disableRemoteMute: Boolean(disableRemoteMute),
        _remoteControlState,
        _menuPosition
    };
}

export default connect(_mapStateToProps)(RemoteVideoMenuTriggerButton);
