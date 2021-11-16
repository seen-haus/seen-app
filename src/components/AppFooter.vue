<template>
  <div class="footer-background text-black pt-6 pb-6">
    <container>
      <div class="grid-cols-1 lg:grid-cols-2 lg:grid mt-12 mb-10">
        <div class="w-full inline-flex flex-col">
          <p class="text-xl font-bold mb-1">Be the first to to hear about upcoming drops!</p>
          <p class="color-white opacity-50 text-md">Join our newsletter TODAY!</p>
          <div class="w-full py-4 md:inline-flex">
            <input type="text" class="mr-3 text-black w-full h-12 text-md pl-4 rounded inline-flex flex-grow" placeholder="Your e-mail">
            <gradient-outline-button class="footer-button"></gradient-outline-button>
          </div>
        </div>
          <div class="links grid-cols-3 grid row-start-1 lg:row-auto mb-12 lg:mb-0 sm:mt-12">
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
                <!-- <router-link :to="{ name: 'privacy'}" class="block">
                  Privacy
                </router-link> -->
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
  <div class="footer-background text-white footer-border py-4">
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
import GradientOutlineButton from "@/components/GradientOutlineButton";

export default {
  name: 'AppFooter',
  components: {
    Container,
    GradientOutlineButton
  }
}
</script>

<style lang="scss" scoped>

.footer-background{
  background-color: #EBEEF2;

  @screen sm {
    padding: 1px;
  }
  @screen md {
    padding: 6px;
  }
  @screen lg {
    padding: 24px;
  }
}

.footer-border {
  border-top: 2px solid #DFE4E9;
}

.links {
  @screen sm {
    justify-items: left;
    margin-top: 20px;
  }
  @screen md {
    justify-items: left;
    margin-top: 20px;
  }
  @screen lg {
    justify-items: flex-end;
    margin-top: 0px;
  }
}

.footer-button {
  @screen sm {
    padding-bottom: 35px;
    padding-top: 10px
  }
  @screen md {
    padding-bottom: 0px;
    padding-top: 0px
  }
  @screen lg {
    padding-bottom: 0px;
    padding-top: 0px
  }
}

.footer-logo {
  height: 39px;
}

</style>
