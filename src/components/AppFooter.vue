<template>
  <div class="footer-background text-black pt-6 pb-6">
    <container>
      <div class="grid-cols-1 lg:grid-cols-2 lg:grid mt-12 mb-10">
        <div class="w-full inline-flex flex-col">
          <p class="text-xl font-bold mb-1">Be the first to to hear about upcoming drops!</p>
          <p class="color-white opacity-50 text-md">Join our newsletter TODAY!</p>
          <div class="w-full py-4 md:inline-flex">
            <input type="text" class="mr-3 text-black w-full h-12 text-md pl-4 mb-2 rounded inline-flex flex-grow" placeholder="Your e-mail">
            <gradient-outline-button class="footer-button"></gradient-outline-button>
          </div>
        </div>
          <div class="links lg:mb-0 sm:mt-12">
            <div class="first-link-column">
              <p class="text-grey-9 font-bold text-xl mb-3">Offerings</p>
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
            <div class="inner-link-column">
              <p class="text-grey-9 font-bold text-xl mb-3">Support</p>
              <div class="font-bold text-md leading-loose">
                <router-link :to="{ name: 'profileWithAddress', params: { userAddressOrUsername: userLocal?.username ? userLocal.username : account }}" class="block">
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
            <div class="last-link-column">
              <p class="text-grey-9 font-bold text-xl mb-3">Community</p>
              <div>
                <div class="flex">
                  <div class="icon text-grey-9">
                    <i class="fab fa-telegram text-lg"></i>
                  </div>
                  <div class="font-bold text-md ml-2 leading-loose">
                    <a href="https://t.me/seenhaus"
                      target="_blank"
                      class="block">
                      Telegram
                    </a>
                  </div>
                </div>
                <div class="flex">
                  <div class="icon text-grey-9">
                    <i class="fab fa-discord text-lg"></i>
                  </div>
                  <div class="font-bold text-md ml-2 leading-loose">
                    <a href="https://discord.com/invite/dad8J4f"
                      target="_blank"
                      class="block">
                      Discord
                    </a>
                  </div>
                </div>
                <div class="flex">
                  <div class="icon text-grey-9">
                    <i class="fab fa-instagram-square text-lg"></i>
                  </div>
                  <div class="font-bold text-md ml-2 leading-loose">
                    <a href="https://www.instagram.com/seen.haus/"
                      target="_blank"
                      class="block">
                      Instagram
                    </a>
                  </div>
                </div>
                <div class="flex">
                  <div class="icon text-grey-9">
                    <i class="fab fa-twitter text-lg"></i>
                  </div>
                  <div class="font-bold text-md ml-2 leading-loose">
                    <a href="https://twitter.com/seen_haus"
                      target="_blank"
                      class="block">
                      Twitter
                    </a>
                  </div>
                </div>
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
import {computed} from 'vue'
import Container from "@/components/Container";
import GradientOutlineButton from "@/components/GradientOutlineButton";
import {useStore} from "vuex"

export default {
  name: 'AppFooter',
  components: {
    Container,
    GradientOutlineButton
  },
  setup() {
    const store = useStore();
    const userLocal = computed(() => store.getters['user/user']);
    return {
      userLocal,
    }
  }
}
</script>

<style lang="scss" scoped>

.footer-background {
  background-color: #EBEEF2;
}

.footer-border {
  border-top: 2px solid #DFE4E9;
}

.links {
  @screen sm {
    margin-top: 0px;
    display: flex;
    justify-content: space-between;
  }
  @screen md {
    margin-top: 10px;
  }
  @screen lg {
    @apply pl-12;
    margin-top: 0px;
  }
  @screen xl {
    @apply pl-24;
  }
}
.first-link-column {
  @apply mt-4 mb-3;
  @screen sm {
    @apply mt-0 mb-0;
  }
}
.inner-link-column {
  @apply mt-6 mb-3;
  @screen sm {
    @apply mt-0 mb-0;
  }
}
.last-link-column {
  @apply mt-6;
  @screen sm {
    @apply mt-0;
  }
}

.footer-button {
  @screen md {
    white-space: nowrap;
  }
}

.footer-logo {
  height: 39px;
}

.icon {
  width: 23px;
  text-align: center;
}
</style>
