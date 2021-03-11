<template>
  <div class="artist-card overflow-hidden rounded-lg shadow-lg">
    <div class="media flex justify-center bg-black h-32">
      <img src="http://placekitten.com/128/128" alt="" />
    </div>
    <div class="description flex flex-col relative p-6">
      <img src=http://placekitten.com/100/100 alt="" class="rounded-full
      border-white border-3 absolute left-6 -top-13">

      <div
        class="rounded-sm bg-fence-light self-end text-xs px-2 py-1 font-bold text-gray-400"
      >
        18 CREATIONS
      </div>

      <div class="text-title font-bold text-2.5xl mt-6">Mark Kitty</div>
      <div class="mt-2 text-gray-600">
        Thrsty Bstrd is an internationally recognized multidisciplinary artist
        whose work has been featured in TIME, WIRED, Harper's BAZAAR and more.
      </div>

      <div class="h-0.5 my-4 w-full rounded-full bg-gray-200"></div>

      <div class="flex justify-start items-center text-xs text-gray-400">
        <span class="mr-8"><i class="fas fa-link mr-2 text-sm"></i>markwagnerinc.com</span>
        <span><i class="fas fa-envelope mr-2 text-sm"></i>Veloux</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArtistCard",
};
</script>