import useWeb3 from "@/connectors/hooks"
import {getSigner} from "@/services/utils"
import {Web3Provider} from "@ethersproject/providers";
import {ref, watchEffect} from "vue";
import {ethers} from "ethers";

export default function useSigner() {
    const {account, provider} = useWeb3();

    let signer = ref(null);

    watchEffect(() => {
      if (account.value && provider.value) {
        // const library = new Web3Provider(provider.value);
        // signer.value = getSigner(library, account.value);

        const LocalSigner = async (provider) => {
          debugger; //eslint-disable-line
          let accounts = await provider.listAccounts()
          let sig = provider.getSigner(accounts[0])
        
          signer.value = sig
        }
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        LocalSigner(prov);

        // // export const LocalSigner = async (provider) => {
        // //   let accounts = await provider.listAccounts()
        // //   let si = provider.getSigner(accounts[0])
        
        // //   signer.value = si;
        // // }

        

        // // The Metamask plugin also allows signing transactions to
        // // send ether and pay to change state within the blockchain.
        // // For this, you need the account signer...
        // signer.value = prov.getSigner();
      
      }
    })

    return signer;
}
