import { CollectablesService } from "@/services/apiService";
import { computed, reactive } from "vue";

export default function useHeroCollectable() {
  const state = reactive({
    item: null,
  });

  async function load() {

    state.items = null;

    const { data } = await CollectablesService.hero();

    state.item = data;
  }

  const heroCollectable = computed(() => state.item);

  return {
    heroCollectable,
    load,
  };
}