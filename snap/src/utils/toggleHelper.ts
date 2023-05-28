export const popupToggle= async () => {
    let persistedData = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
    });

    let popuptoggle = !persistedData.popuptoggle;

    const data = {
        addresses: persistedData.addresses,
        popuptoggle: popuptoggle,
    };
    await snap.request({
        method: 'snap_manageState',
        params: { operation: 'update', newState:data },
    });
};