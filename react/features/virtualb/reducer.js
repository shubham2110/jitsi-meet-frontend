// @flow

import { ReducerRegistry } from "../base/redux";

import { VIRTUALB_ENABLED, VIRTUALB_DISABLED } from "./actionTypes";

ReducerRegistry.register("features/virtualb", (state = {}, action) => {
    switch (action.type) {
        case VIRTUALB_ENABLED: {
            return {
                ...state,
                virtualbEnabled: true,
            };
        }
        case VIRTUALB_DISABLED: {
            return {
                ...state,
                virtualbEnabled: false,
            };
        }
    }

    return state;
});
