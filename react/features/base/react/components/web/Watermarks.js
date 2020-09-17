/* @flow */

import React, { Component } from 'react';

import { isVpaasMeeting } from '../../../../billing-counter/functions';
import { translate } from '../../../i18n';
import { connect } from '../../../redux';


declare var interfaceConfig: Object;

/**
 * The CSS style of the element with CSS class {@code rightwatermark}.
 *
 * @private
 */
const _RIGHT_WATERMARK_STYLE = {
    backgroundImage: 'url(images/rightwatermark.png)'
};

/**
 * The type of the React {@code Component} props of {@link Watermarks}.
 */
type Props = {

    /**
     * The user selected url used to navigate to on logo click.
     */
    _customLogoLink: string,

    /**
     * The url of the user selected logo.
     */
    _customLogoUrl: string,

    /**
     * Whether or not the current user is logged in through a JWT.
     */
    _isGuest: boolean,

    /**
     * Whether or not the current meeting is a vpaas one.
     */
    _isVpaas: boolean,

    /**
     * Flag used to signal that the logo can be displayed.
     * It becomes true after the user customization options are fetched.
     */
    _readyToDisplayJitsiWatermark: boolean,

    /**
     * Returns true if welcome page is visible at the moment.
     */
    _welcomePageIsVisible: boolean,

    /**
     * The default value for the Jitsi logo URL.
     */
    defaultJitsiLogoURL: ?string,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * The type of the React {@code Component} state of {@link Watermarks}.
 */
type State = {

    /**
     * The url to open when clicking the brand watermark.
     */
    brandWatermarkLink: string,

    /**
     * The url to open when clicking the Jitsi watermark.
     */
    jitsiWatermarkLink: string,

    /**
     * Whether or not the brand watermark should be displayed.
     */
    showBrandWatermark: boolean,

    /**
     * Whether or not the Jitsi watermark should be displayed.
     */
    showJitsiWatermark: boolean,

    /**
     * Whether or not the Jitsi watermark should be displayed for users not
     * logged in through a JWT.
     */
    showJitsiWatermarkForGuests: boolean,

    /**
     * Whether or not the show the "powered by Jitsi.org" link.
     */
    showPoweredBy: boolean
};

/**
 * A Web Component which renders watermarks such as Jits, brand, powered by,
 * etc.
 */
class Watermarks extends Component<Props, State> {
    /**
     * Initializes a new Watermarks instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        let showBrandWatermark;
        let showJitsiWatermark;
        let showJitsiWatermarkForGuests;

        if (interfaceConfig.filmStripOnly) {
            showBrandWatermark = false;
            showJitsiWatermark = false;
            showJitsiWatermarkForGuests = false;
        } else {
            showBrandWatermark = interfaceConfig.SHOW_BRAND_WATERMARK;
            showJitsiWatermark = interfaceConfig.SHOW_JITSI_WATERMARK;
            showJitsiWatermarkForGuests
                = interfaceConfig.SHOW_WATERMARK_FOR_GUESTS;
        }

        this.state = {
            brandWatermarkLink:
                showBrandWatermark ? interfaceConfig.BRAND_WATERMARK_LINK : '',
            jitsiWatermarkLink:
                showJitsiWatermark || showJitsiWatermarkForGuests
                    ? interfaceConfig.JITSI_WATERMARK_LINK : '',
            showBrandWatermark,
            showJitsiWatermark,
            showJitsiWatermarkForGuests,
            showPoweredBy: interfaceConfig.SHOW_POWERED_BY
        };
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <div>
                {
                    this._renderJitsiWatermark()
                }
                {
                    this._renderBrandWatermark()
                }
                {
                    this._renderPoweredBy()
                }
            </div>
        );
    }

    /**
     * Returns true if the watermark is ready to be displayed.
     *
     * @private
     * @returns {boolean}
     */
    _canDisplayJitsiWatermark() {
        const {
            showJitsiWatermark,
            showJitsiWatermarkForGuests
        } = this.state;
        const {
            _isGuest,
            _readyToDisplayJitsiWatermark,
            _welcomePageIsVisible
        } = this.props;

        return (_readyToDisplayJitsiWatermark
            && (showJitsiWatermark || (_isGuest && showJitsiWatermarkForGuests)))
            || _welcomePageIsVisible;
    }

    /**
     * Returns the background image style.
     *
     * @private
     * @returns {string}
     */
    _getBackgroundImageStyle() {
        const {
            _customLogoUrl,
            _isVpaas,
            defaultJitsiLogoURL
        } = this.props;
        let style = 'none';

        if (_isVpaas) {
            if (_customLogoUrl) {
                style = `url(${_customLogoUrl})`;
            }
        } else {
            style = `url(${_customLogoUrl
                || defaultJitsiLogoURL
                || interfaceConfig.DEFAULT_LOGO_URL})`;
        }

        return style;
    }

    /**
     * Renders a brand watermark if it is enabled.
     *
     * @private
     * @returns {ReactElement|null} Watermark element or null.
     */
    _renderBrandWatermark() {
        let reactElement = null;

        if (this.state.showBrandWatermark) {
            reactElement = (
                <div
                    className = 'watermark rightwatermark'
                    style = { _RIGHT_WATERMARK_STYLE } />
            );

            const { brandWatermarkLink } = this.state;

            if (brandWatermarkLink) {
                reactElement = (
                    <a
                        href = { brandWatermarkLink }
                        target = '_new'>
                        { reactElement }
                    </a>
                );
            }
        }

        return reactElement;
    }

    /**
     * Renders a Jitsi watermark if it is enabled.
     *
     * @private
     * @returns {ReactElement|null}
     */
    _renderJitsiWatermark() {
        let reactElement = null;

        if (this._canDisplayJitsiWatermark()) {
            const backgroundImage = this._getBackgroundImageStyle();
            const link = this.props._customLogoLink || this.state.jitsiWatermarkLink;
            const additionalStyles = {};

            if (backgroundImage === 'none') {
                additionalStyles.height = 0;
                additionalStyles.width = 0;
            }

            const style = {
                backgroundImage,
                maxWidth: 140,
                maxHeight: 70,
                ...additionalStyles
            };

            reactElement = (<div
                className = 'watermark leftwatermark'
                style = { style } />);

            if (link) {
                reactElement = (
                    <a
                        href = { link }
                        target = '_new'>
                        { reactElement }
                    </a>
                );
            }
        }

        return reactElement;
    }

    /**
     * Renders a powered by block if it is enabled.
     *
     * @private
     * @returns {ReactElement|null}
     */
    _renderPoweredBy() {
        if (this.state.showPoweredBy) {
            const { t } = this.props;

            return (
                <a
                    className = 'poweredby'
                    href = 'http://jitsi.org'
                    target = '_new'>
                    <span>{ t('poweredby') } jitsi.org</span>
                </a>
            );
        }

        return null;
    }
}

/**
 * Maps parts of Redux store to component prop types.
 *
 * @param {Object} state - Snapshot of Redux store.
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const { isGuest } = state['features/base/jwt'];
    const { customizationReady, logoClickUrl, logoImageUrl } = state['features/dynamic-branding'];
    const { room } = state['features/base/conference'];

    return {
        /**
         * The indicator which determines whether the local participant is a
         * guest in the conference.
         *
         * @private
         * @type {boolean}
         */
        _customLogoLink: logoClickUrl,
        _customLogoUrl: logoImageUrl,
        _isGuest: isGuest,
        _isVpaas: isVpaasMeeting(state),
        _readyToDisplayJitsiWatermark: customizationReady,
        _welcomePageIsVisible: !room
    };
}

export default connect(_mapStateToProps)(translate(Watermarks));
