import Image from 'next/image'
import MetaMask from '../../public/assets/metamask.png'

export default function ReconnectButton() {

  const defaultSnapOrigin = `local:http://localhost:8080`;

  const connectSnap = async (
    snapId = defaultSnapOrigin,
    params = {}
  ) => {
    await window.ethereum?.request({
      method: "wallet_requestSnaps",
      params: {
        [snapId]: params,
      },
    });
  };

  const installSnap=async()=>{
    await connectSnap();
    const res = await window.ethereum?.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: defaultSnapOrigin,
        request: { method: 'pushproto_welcome' },
      },
    });

    if(res){
      //open a new tab
      window.open('https://app.push.org/channels', '_blank');
    }
  }

  return (
    <button className="flex bg-white border text-black font-bold text-sm w-max p-2 rounded-lg" onClick={()=>installSnap()}>
      <Image src={MetaMask} alt='MetaMask Logo' height="20" width="20"/>
      <p className='pl-2'>
        Connect
      </p>
    </button>
  )
}
