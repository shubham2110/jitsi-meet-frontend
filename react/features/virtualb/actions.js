// @flow

import { getLocalVideoTrack } from "../../features/base/tracks";

import { VIRTUALB_ENABLED, VIRTUALB_DISABLED } from "./actionTypes";
import { getBlurEffect } from "./functions";
import logger from "./logger";

/**
 * Signals the local participant is switching between blurred or non blurred video.
 *
 * @param {boolean} enabled - If true enables video blur, false otherwise.
 * @returns {Promise}
 */
export function toggleVirtualBffect(enabled: boolean) {
    return function (dispatch: (Object) => Object, getState: () => any) {
        const state = getState();

        if (state["features/virtualb"].virtualbEnabled !== enabled) {
            const { jitsiTrack } = getLocalVideoTrack(
                state["features/base/tracks"]
            );

            return getVirtualBackground()
                .then((blurEffectInstance) =>
                    jitsiTrack
                        .setEffect(enabled ? blurEffectInstance : undefined)
                        .then(() => {
                            enabled
                                ? dispatch(virtualbEnabled())
                                : dispatch(virtualbDisabled());
                        })
                        .catch((error) => {
                            enabled
                                ? dispatch(virtualbDisabled())
                                : dispatch(virtualbEnabled());
                            logger.error("setEffect failed with error:", error);
                        })
                )
                .catch((error) => {
                    dispatch(virtualbDisabled());
                    logger.error("getBlurEffect failed with error:", error);
                });
        }

        return Promise.resolve();
    };
}

/**
 * Signals the local participant that the blur has been enabled.
 *
 * @returns {{
 *      type: BLUR_ENABLED
 * }}
 */
export function virtualbEnabled() {
    return {
        type: VIRTUALB_ENABLED,
    };
}

/**
 * Signals the local participant that the blur has been disabled.
 *
 * @returns {{
 *      type: BLUR_DISABLED
 * }}
 */
export function virtualbDisabled() {
    return {
        type: VIRTUALB_DISABLED,
    };
}
