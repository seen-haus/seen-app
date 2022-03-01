<template>
  <div class="team-member-card">
    <div class="flex items-center">
      <img
        :src="teamMember.avatar"
        :alt="teamMember.name"
        class="rounded-full w-25 h-25 flex-shrink-0 mr-6"
      />

      <div class="flex flex-col items-start">
        <div class="text-title font-bold text-xl md:text-2xl ellipsis mb-2">
          {{ teamMember.name }}
        </div>

        <tag class="bg-fence-light text-gray-400 font-semibold text-11px mb-2 pl-3 pr-3"
          >{{ teamMember.title.toUpperCase() }}
        </tag>

        <div
          class="flex flex-wrap justify-start items-center text-xs text-gray-400"
        >
          <social-line
            v-for="social in teamMember.socials"
            :social="social"
            :key="social.url"
          />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Tag from "@/components/PillsAndTags/Tag.vue";
import SocialLine from "@/components/PillsAndTags/SocialLine.vue";

export default {
  name: "TeamMemberCard",
  props: {
    teamMember: Object,
    headerColor: {
      type: String,
      default: "transparent",
    },
  },
  components: { SocialLine, Tag },
  setup() {},
};
</script>

<style lang="scss" scoped>
.custom-shadow {
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);
}
</style>
