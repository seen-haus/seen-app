<template>
  <div
    class="team-member-card overflow-hidden rounded-lg custom-shadow cursor-pointer"
  >
    <div class="description flex flex-col p-6 relative">
      <div class="bg-header absolute left-0 top-0 w-full" style="height: 83px; z-index: -1;"
      :class="headerColor"></div>
      <img
        :src="teamMember.avatar"
        alt=""
        class="rounded-full border-white border-3 left-6 -top-12.5 w-25 h-25"
      />

      <div class="flex flex-col items-start mt-4">
        <div class="text-title font-bold text-2.5xl ellipsis mb-2">
          {{ teamMember.name }}
        </div>
        <tag class="bg-fence-light text-gray-400 font-semibold text-11px"
        >{{ teamMember.title.toUpperCase() }}
        </tag>
      </div>

      <div class="h-0.5 mt-6 mb-4 w-full rounded-full bg-gray-200"></div>

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
</template>


<script>
import Tag from "@/components/PillsAndTags/Tag.vue";
import SocialLine from "@/components/PillsAndTags/SocialLine.vue";

export default {
  name: 'TeamMemberCard',
  props: {
    teamMember: Object,
    headerColor: { 
      type: String,
      default: 'transparent'
    }
  },
  components: { SocialLine, Tag, },
  setup() {
    
  },
}
</script>

<style lang="scss" scoped>
  .custom-shadow {
    box-shadow: 0px 3px 15px rgba(0,0,0,.1);
  }
</style>
