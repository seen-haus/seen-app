<template>
  <div class="container">
    <div
      class="footer-button-outline"
        :style="{
          'background-image': 'linear-gradient(94.05deg, #11998E 1.74%, #38EF7D 100%)',
          'border-radius': '0.25rem',
          'padding': '3px',
          'height': '48px',
          'width': '100%'
        }"
    >
      <div
        class="footer-button"
          :style="{
            'background-color': '#EBEEF2',
            'border-radius': '0.15rem',
            'height': '100%',
            'width': '100%'
          }"
      >
        <div
          class="gradient-outline-button"
            :style="{
              'background-image': 'linear-gradient(94.05deg, #11998E 1.74%, #38EF7D 100%)',
              '-webkit-background-clip': 'text',
              '-webkit-text-fill-color': 'transparent',
              'height': '100%',
              'width': '100%'
            }"
        >
          <button
            class="justify-center cursor-pointer rounded-5sm px-8 font-semibold uppercase"
              :style="{
                'height': '100%',
                'width': '100%'
              }"
          >
            <slot> Title</slot>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
</style>

