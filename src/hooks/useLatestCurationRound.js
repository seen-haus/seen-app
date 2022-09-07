import { CurationService } from "@/services/apiService";
import { COLLECTABLE_TYPE } from "@/constants/Collectables.js";
import PURCHASE_TYPE from "@/constants/PurchaseTypes.js";
import { computed, reactive } from "vue";


export default function useLatestCurationRound(
  curationTopic,
) {
  const state = reactive({
    curationRound: null,
    latestSnapshotSEEN: null,
    latestSnapshotXSEEN: null
  });

  async function load() {

    state.curationRound = null;

    const { data } = await CurationService.latestCurationRound(curationTopic);

    const { data: latestSnapshotData } = await CurationService.snapshotInfo();

    console.log({data, latestSnapshotData})

    state.curationRound = data;

    if(latestSnapshotData && latestSnapshotData.SEEN) {
      state.latestSnapshotSEEN = latestSnapshotData.SEEN;
    }

    if(latestSnapshotData && latestSnapshotData.XSEEN) {
      state.latestSnapshotXSEEN = latestSnapshotData.XSEEN;
    }
  }

  const curationRound = computed(() => state.curationRound);
  const latestSnapshotBlock = computed(() => state.latestSnapshotSEEN);

  return {
    curationRound,
    latestSnapshotBlock,
    load,
  };
}
