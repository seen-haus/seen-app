<template>
  <div class="bg-black text-white pt-12 pb-6 lg:pb-4">
    <container>
      <div class="newsletter rounded-lg py-4 bg-newsletter px-8 lg:flex align-center">
        <div class="w-full lg:w-1/2 py-4 inline-flex flex-col justify-center">
          <p class="text-xl mb-1">Be the first to to hear about upcoming drops!</p>
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
        <div class="about sm:w-88">
          <div id="logo" class="flex items-center mb-6">
            <img src="@/assets/images/logo--white.png"  class="mr-4 footer-logo" alt="seen logo">
          </div>
          <p class="opacity-70 text-md mb-3">SEEN HAUS is the innovative auction house of the future, merging the physical and digital worlds of art built upon blockchain technology. </p>
          <p class="opacity-70 text-md">Our platform offers a curated NFT marketplace, hosting creators and artists whilst showcasing exclusive and unique artworks to collectors.</p>
        </div>
        <div class="links grid-cols-3 grid row-start-1 lg:row-auto mb-12 lg:mb-0">
          <div>
            <p class="text-grey-9 font-bold text-xl mb-6">Offerings</p>
            <div class="font-bold text-md leading-loose">
              <router-link :to="{ name: 'drops'}" class="block">
                <span class="font-bold">Drops</span>
              </router-link>
              <router-link :to="{ name: 'stake'}" class="block">
                <span class="font-bold">Stake</span>
              </router-link>
              <router-link :to="{ name: 'artists'}" class="block">
                <span class="font-bold">Artists</span>
              </router-link>
            </div>
          </div>
          <div>
            <p class="text-grey-9 font-bold text-xl mb-6">Support</p>
            <div class="font-bold text-md leading-loose">
              <router-link :to="{ name: 'profile'}" class="block">
                Account
              </router-link>
              <router-link :to="{ name: 'about'}" class="block">
                About Us
              </router-link>
              <router-link :to="{ name: 'team'}" class="block">
                Team
              </router-link>
              <a href="https://seen-haus.medium.com" class="block" target="_blank">Blog</a>
              <router-link :to="{ name: 'faq'}" class="block">
                FAQs
              </router-link>
            </div>
          </div>
          <div>
            <p class="text-grey-9 font-bold text-xl mb-6">Community</p>
            <div class="font-bold text-md leading-loose">
              <a href="https://t.me/seenhaus"
                target="_blank"
                class="block">
                Telegram
              </a>
              <a href="https://discord.com/invite/dad8J4f"
                target="_blank"
                class="block">
                Discord
              </a>
              <a href="https://www.instagram.com/seen.haus/"
                target="_blank"
                class="block">
                Instagram
              </a>
              <a href="https://twitter.com/seen_haus"
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
        <p class="text-grey-9 text-sm">© Seen.haus 2021, All rights reserved.</p>
        <div>
<!--           <a href="#"-->
<!--            target="_blank"-->
<!--            class="text-grey-9 text-sm mr-4 inline-block">-->
<!--            Privacy Policy-->
<!--          </a>-->
<!--          <a href="#"-->
<!--            target="_blank"-->
<!--            class="text-grey-9 text-sm inline-block">-->
<!--            Terms of Use-->
<!--          </a>-->
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
