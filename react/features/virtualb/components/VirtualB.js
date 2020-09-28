// @flow

import type { Dispatch } from 'redux';

import { createToolbarEvent, sendAnalytics } from '../../analytics';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { IconShareDoc } from '../../base/icons';
import { AbstractButton, type AbstractButtonProps } from '../../base/toolbox/components';
import { toggleVirtualBffect } from '../actions';

type Props = AbstractButtonProps & {

    /**
     * Whether the shared document is being edited or not.
     */
    _virtualbEnabled: boolean,

    /**
     * Redux dispatch function.
     */
    dispatch: Dispatch<any>,
};

/**
 * Implements an {@link AbstractButton} to open the chat screen on mobile.
 */
class VirtualB extends AbstractButton<Props, *> {
    accessibilityLabel = 'Enable Virtual Background';
    icon = IconShareDoc;
    label = 'Virtual background';
    toggledLabel = 'Virtual Background';

    /**
  * Helper function to be implemented by subclasses, which returns
  * a React Element to display (a beta tag) at the end of the button.
  *
  * @override
  * @protected
  * @returns {ReactElement}
  */
    _getElementAfter() {
        return <BetaTag />;
    }



    /**
     * Handles clicking / pressing the button, and opens / closes the appropriate dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        console.log("Button Clicked Virtual B");



    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._virtualbEnabled;
    }
}


/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The redux store/state.
 * @param {Object} ownProps - The properties explicitly passed to the component
 * instance.
 * @returns {Object}
 */
function _mapStateToProps(state: Object, ownProps: Object) {
    // const { documentUrl, editing } = state['features/etherpad'];
    // const { visible = Boolean(documentUrl) } = ownProps;

    return {
        _virtualbEnabled: true

        //Boolean(state['features/virtualb'].virtualbEnabled)
    };
}

export default connect(_mapStateToProps)(VirtualB);

