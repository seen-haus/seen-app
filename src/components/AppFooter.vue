<template>
  <div class="bg-black text-white pt-12 pb-6 lg:pb-4">
    <container>
      <div class="newsletter rounded-lg py-4 bg-newsletter px-8 lg:flex align-center">
        <div class="w-full lg:w-1/2 py-4 inline-flex flex-col justify-center">
          <p class="text-2xl mb-1">Be the first to to hear about upcoming drops!</p>
          <p class="color-white opacity-50 text-md">Join our newsletter TODAY!</p>
        </div>
        <div class="w-full lg:w-1/2 py-4 md:inline-flex">
          <input type="text" class="mr-3 text-black w-full h-13 text-md pl-4 rounded inline-flex flex-grow" placeholder="Your e-mail">
          <button class="cursor-pointer primary button mt-3 md:mt-0">
            Join&nbsp;Newsletter
          </button>
        </div>
      </div>
      <div class="grid-cols-1 lg:grid-cols-2 grid mt-12 mb-10">
        <div class="about w-88">
          <div id="logo" class="flex items-center mb-6">
            <img src="@/assets/images/logo--white.png"  class="mr-4 footer-logo" alt="seen logo">
          </div>
          <p class="opacity-70 text-md">Seen.haus is an innovative auction house of the future merging the physical and digital worlds of art. Each physical collectible sold through our platform is paired with a digital version that provides an exclusive record of ownership.</p>
        </div>
        <div class="links grid-cols-3 grid row-start-1 lg:row-auto mb-12 lg:mb-0">
          <div>
            <p class="text-footer-grey font-bold text-xl mb-6">Offerings</p>
            <div class="font-bold text-md leading-loose">
              <router-link :to="{ name: 'auctions'}" class="block">
                <span class="font-bold">Auctions</span>
              </router-link>
              <router-link :to="{ name: 'editions'}" class="block">
                <span class="font-bold">Editions</span>
              </router-link>
              <router-link :to="{ name: 'artists'}" class="block">
                <span class="font-bold">Artists</span>
              </router-link>
              <router-link :to="{ name: 'leaderboard'}" class="block">
                <span class="font-bold">Leaderboard</span>
              </router-link>
            </div>
          </div>
          <div>
            <p class="text-footer-grey font-bold text-xl mb-6">Support</p>
            <div class="font-bold text-md leading-loose">
              <a href="#"
                target="_blank"
                class="block">
                Account
              </a>
              <a href="#"
                target="_blank"
                class="block">
                About Us
              </a>
              <a href="#"
                target="_blank"
                class="block">
                FAQs
              </a>
            </div>
          </div>
          <div>
            <p class="text-footer-grey font-bold text-xl mb-6">Community</p>
            <div class="font-bold text-md leading-loose">
              <a href="#"
                target="_blank"
                class="block">
                Telegram
              </a>
              <a href="#"
                target="_blank"
                class="block">
                Discord
              </a>
              <a href="#"
                target="_blank"
                class="block">
                Instagram
              </a>
              <a href="#"
                target="_blank"
                class="block">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </container>
  </div>
   <div class="bg-black text-white footer-border py-4">
    <container>
      <div class="flex justify-between">
        <p class="text-footer-grey text-sm">© Seen.haus 2021, All rights reserved.</p>
        <div>
           <a href="#"
            target="_blank"
            class="text-footer-grey text-sm mr-4 inline-block">
            Privacy Policy
          </a>
          <a href="#"
            target="_blank"
            class="text-footer-grey text-sm inline-block">
            Terms of Use
          </a>
        </div>
      </div>
    </container>
   </div>
</template>

<script>
import Container from "@/components/Container";

export default {
  name: 'AppFooter',
  components: {Container},
}
</script>

<style lang="scss" scoped>
.footer-border {
  border-top: 2px solid rgba(255,255,255,.2);
}
</style>
