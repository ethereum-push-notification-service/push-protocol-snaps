export const popupToggle= async (notifcount:number) => {
    let persistedData = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
    });

    let popuptoggle = notifcount;

    const data = {
        addresses: persistedData.addresses,
        popuptoggle: popuptoggle,
    };
    await snap.request({
        method: 'snap_manageState',
        params: { operation: 'update', newState:data },
    });
};