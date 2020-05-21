/* @flow */

import React, { Component } from 'react';

import { Dialog } from '../../base/dialog';


/**
 * Implements a React {@link Component} which displays a dialog describing
 * registered keyboard shortcuts.
 *
 * @extends Component
 */
class ForcedMuteDialog extends Component<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Dialog
                cancelKey = { 'dialog.close' }
                submitDisabled = { true }
                titleKey = 'forcedMute.forcedMute'
                width = 'small'>
                <div
                    id = 'forced-mute'>
                    Moderator has set to forced mute.
                </div>
            </Dialog>
        );
    }
}

export default translate(ForcedMuteDialog);
