import { watchEffect, ref } from 'vue';
import { CurationService } from "@/services/apiService"
import useWeb3 from "@/connectors/hooks"

const userVotingPower = ref(null);

export default function useUserVotingPower() {
    const { account } = useWeb3();

    const loadUserVotingPower = async () => {
        try {
            const { data } = await CurationService.userVotingPower(account.value);

            setUserVotingPower(data);
        } catch (err) {
          return;
        }
    }

    const setUserVotingPower = (userData) => {
        userVotingPower.value = userData || null;
    }

    watchEffect(() => {
        if (account.value) {
            // loadUserVotingPower();
        } else {
            setUserVotingPower(null)
        }
    })

    return {
        userVotingPower,
        loadUserVotingPower,
        setUserVotingPower,
    };
}
