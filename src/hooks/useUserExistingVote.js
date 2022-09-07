import { watchEffect, ref } from 'vue';
import { CurationService } from "@/services/apiService"
import useWeb3 from "@/connectors/hooks"

const userExistingVote = ref(null);

export default function useUserExistingVote(curationType, applicantId, roundDeclarationId) {
    const { account } = useWeb3();

    const loadUserExistingVote = async () => {
        try {
            const { data } = await CurationService.userExistingVote(account.value, curationType, applicantId, roundDeclarationId);

            setUserExistingVote(data);
        } catch (err) {
          return;
        }
    }

    const setUserExistingVote = (userExistingVoteData) => {
      userExistingVote.value = userExistingVoteData || null;
    }

    watchEffect(() => {
        if (account.value) {
          // loadUserExistingVote();
        } else {
          setUserExistingVote(null)
        }
    })

    return {
        userExistingVote,
        loadUserExistingVote,
        setUserExistingVote,
    };
}
