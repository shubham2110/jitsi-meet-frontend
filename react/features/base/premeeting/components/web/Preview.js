// @flow

import React from 'react';

import { Video } from '../../../media';
import { connect } from '../../../redux';
import { getLocalVideoTrack } from '../../../tracks';

import PreviewAvatar from './Avatar';

export type Props = {

    /**
     * The name of the user that is about to join.
     */
    name: string,

    /**
     * Indicates whether the avatar should be shown when video is off
     */
    showAvatar: boolean,

    /**
     * Flag signaling the visibility of camera preview.
     */
    videoMuted: boolean,

    /**
     * The JitsiLocalTrack to display.
     */
    videoTrack: ?Object,
};

/**
 * Component showing the video preview and device status.
 *
 * @param {Props} props - The props of the component.
 * @returns {ReactElement}
 */
function Preview(props: Props) {
    const { name, showAvatar, videoMuted, videoTrack } = props;

    if (!videoMuted && videoTrack) {
        return (
            <div id = 'preview'>
                <Video
                    className = 'flipVideoX'
                    videoTrack = {{ jitsiTrack: videoTrack }} />
            </div>
        );
    }

    if (showAvatar) {
        return (
            <div
                className = 'no-video'
                id = 'preview'>
                <PreviewAvatar name = { name } />
            </div>
        );
    }

    return null;
}

Preview.defaultProps = {
    showAvatar: true
};

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {Props} ownProps - The own props of the component.
 * @returns {Props}
 */
function _mapStateToProps(state, ownProps) {
    return {
        videoMuted: ownProps.videoTrack ? ownProps.videoMuted : state['features/base/media'].video.muted,
        videoTrack: ownProps.videoTrack || (getLocalVideoTrack(state['features/base/tracks']) || {}).jitsiTrack
    };
}

export default connect(_mapStateToProps)(Preview);
