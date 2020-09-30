export function virtualBEnabled() {
    console.log('virtualBEnabled');
    return {
        type: 'V_ENABLED'
    };
}

export function virtualBDisabled() {
    console.log('virtualBDisabled');

    return {
        type: 'V_DISABLED'
    };
}
