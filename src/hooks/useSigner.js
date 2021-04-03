import useWeb3 from "@/connectors/hooks"
import {getSigner} from "@/services/utils"
import {Web3Provider} from "@ethersproject/providers";
import {ref, watchEffect} from "vue";

export default function useSigner() {
  const {account, provider} = useWeb3();
  
  if (provider.value && account.value) {
    const library = new Web3Provider(provider.value)
    return getSigner(library, account.value)
  } else {
    return null;
  }
}
