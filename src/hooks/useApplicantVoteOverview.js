import { watchEffect, ref } from 'vue';
import { CurationService } from "@/services/apiService"

export default function useUserExistingVote(curationType, applicantId, roundDeclarationId) {

    const applicantVoteOverview = ref(null);

    const loadApplicantVoteOverview = async () => {
        try {
            const { data } = await CurationService.applicantVoteOverview(curationType, applicantId, roundDeclarationId);

            setApplicantVoteOverview(data);
        } catch (err) {
          return;
        }
    }

    const setApplicantVoteOverview = (userExistingVoteData) => {
      applicantVoteOverview.value = userExistingVoteData || null;
    }

    return {
        applicantVoteOverview,
        loadApplicantVoteOverview,
        setApplicantVoteOverview,
    };
}
