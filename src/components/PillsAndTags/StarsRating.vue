<template>
  <div class="stars-rating relative ellipsis">
    <div class="under h-6">
      <i class="fas fa-star text-sm text-white opacity-30 pr-1"></i>
      <i class="fas fa-star text-sm text-white opacity-30 pr-1"></i>
      <i class="fas fa-star text-sm text-white opacity-30 pr-1"></i>
      <i class="fas fa-star text-sm text-white opacity-30 pr-1"></i>
      <i class="fas fa-star text-sm text-white opacity-30"></i>
    </div>
    <div
      class="over absolute top-0 left-0 overflow-hidden h-6"
      :style="{ width: ratingPercent }"
    >
      <i class="fas fa-star text-sm text-star pr-1"></i>
      <i class="fas fa-star text-sm text-star pr-1"></i>
      <i class="fas fa-star text-sm text-star pr-1"></i>
      <i class="fas fa-star text-sm text-star pr-1"></i>
      <i class="fas fa-star text-sm text-star"></i>
    </div>
  </div>
</template>


<script>
export default {
  name: "StarsRating",
  props: {
    rating: Number, // 0.0 -> 1.0
  },
  computed: {
    ratingPercent: function () {
      return (this.rating || 0.5) * 100 + "%";
    },
  },
};
</script>