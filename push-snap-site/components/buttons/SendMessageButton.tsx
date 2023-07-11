export default function ReconnectButton() {

  const defaultSnapOrigin = `local:http://localhost:8080`;

  const Toggle = async () => {
    await window.ethereum?.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'pushproto_togglepopup' },
      },
    });
  };

  return (
    <button onClick={()=>Toggle()} className="flex bg-white text-black font-bold text-sm w-max p-2 rounded-lg border-2 border-text-secondary ring-1 ring-white">
      Toggle Popup
    </button>
  )
}
