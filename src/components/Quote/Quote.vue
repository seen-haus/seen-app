<template>
  <div
    class="quote rounded-3xl p-5 md:px-36 flex flex-col items-center text-white"
  >
    <i
      class="fas fa-quote-left text-3xl text-white opacity-40 block mx-auto"
    ></i>

    <div>
      <div
        class="font-title text-2.5xl p-6 max-w-screen-sm italic sha"
      >
        The quality and attention to detail of my hoodie is crazy good. Love it!
      </div>
      <div class="flex pb-3 self-start pl-5">
        <img src=http://placekitten.com/60/60 alt="" class="rounded-full
        border-white border-3">
        <div class="flex flex-col justify-center items-start ml-5">
          <div class="name font-semibold">
            Mark Suttenburger,
            <span class="font-normal text-white opacity-40">Seen Fanboy</span>
          </div>
          <div class="stars"><stars-rating /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StarsRating from '@/components/PillsAndTags/StarsRating.vue';

export default {
  components: {StarsRating},
  name: "Quote",
};
</script>

<style lang="scss" scoped>
.quote {
  background-image: linear-gradient(74deg, #279671 -3%, #008558 99%);

  .quoted-text {
    text-shadow: 0 0 2px rgba(0,0,0,0.75);
  }
}
</style>

