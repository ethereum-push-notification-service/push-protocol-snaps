import { divider, heading, panel, text } from "@metamask/snaps-ui";
import { SnapStorageCheck } from "../helper/snapstoragecheck";
import * as CryptoJS from 'crypto-js';

const { ethers } = require("ethers");

export const addAddress = async (address: string) => {
  const persistedData = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  });

  const isValidAddress = ethers.utils.isAddress(address);

  if (isValidAddress) {
    if (persistedData == null) {
      const data = {
        addresses: [address],
        popuptoggle: 0,
      };
      await snap.request({
        method: "snap_manageState",
        params: { operation: "update", newState: data },
      });
    } else {
      const addrlist = persistedData.addresses;
      const popuptoggle = persistedData.popuptoggle;
      if (addrlist!.includes(address)) {
        return;
      } else {
        addrlist!.push(address);
        const data = {
          addresses: addrlist,
          popuptoggle: popuptoggle,
        };
        await snap.request({
          method: "snap_manageState",
          params: { operation: "update", newState: data },
        });
      }
    }
  } else {
    await snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([
          heading("Error"),
          text("Invalid Ethereum Address address"),
        ]),
      },
    });
  }
};

export const confirmAddress = async () => {
  const persistedData = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  });
  if (persistedData != null) {
    const data = persistedData.addresses;
    let msg = "";
    for (let i = 0; i < data!.length; i++) {
      msg = msg + "🔹" + data![i] + "\n\n";
    }
    if (msg.length > 0) {
      return snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([
            heading("Address added"),
            divider(),
            text(`Congratulations, Your address is now all set to receive notifications. \n\n Opt-in to your favourite channels now.`),
            text("Following addresses will receive notifications:"),
            divider(),
            text(`${msg}`),
          ]),
        },
      });
    } else {
      await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([
            heading("No Active Addresses"),
            divider(),
            text("Start adding addresses to receive notifications"),
          ]),
        },
      });
    }
  } else {
    return snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([heading("Error"), text("No addresses added")]),
      },
    });
  }
};

export const removeAddress = async (address: string) => {
  const persistedData = await SnapStorageCheck();
  let addresslist = persistedData.addresses;
  let popuptoggle = persistedData.popuptoggle;
  if (addresslist.includes(address)) {
    for (var i = addresslist.length - 1; i >= 0; i--) {
      if (addresslist[i] === address) {
        addresslist.splice(i, 1);
      }
    }
  }

  const newData = {
    addresses: addresslist,
    popuptoggle: popuptoggle,
  };

  await snap.request({
    method: "snap_manageState",
    params: { operation: "update", newState: newData },
  });
};

export const fetchAddress = async () => {
  const persistedData = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  });
  if (persistedData != null) {
    const addresses = persistedData!.addresses;
    return addresses;
  } else {
    return [];
  }
};

// function to AES encrypt the PGP Private key
function encryptStringAES(text: string, key: string): string {
  const encrypted = CryptoJS.AES.encrypt(text, key);
  return encrypted.toString();
}

const secretKey = 'push-metamask-snaps';

export const addPGPPvtKey = async (pgpPvtKey: string) => {
  const persistedData = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  });

  const encryptedPGPKey = encryptStringAES(pgpPvtKey, secretKey);

  if (persistedData == null) {
    const data = {
      addresses: [],
      popuptoggle: 0,
      pgpPvtKey: encryptedPGPKey
    };
    await snap.request({
      method: "snap_manageState",
      params: { operation: "update", newState: data },
    });
  } else {
    const addrlist = persistedData.addresses;
    const popuptoggle = persistedData.popuptoggle;
    const pgpPvtKey = persistedData.pgpPvtKey;

    if (pgpPvtKey) {
      return;
    } else {
      const data = {
        addresses: addrlist,
        popuptoggle: popuptoggle,
        pgpPvtKey: encryptedPGPKey
      };
      await snap.request({
        method: "snap_manageState",
        params: { operation: "update", newState: data },
      });
    }
  }
}
