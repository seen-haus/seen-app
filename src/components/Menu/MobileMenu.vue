<template>
  <nav id="menu" class="min-h-screen slideout-menu bg-black text-white pt-13">
    <button class="button w-full text-white" @click="closeMobileMenu">CLOSE</button>

    <template v-for="item in [...menu, ...mobileOnlyItems]" :key="item">

      <router-link v-if="typeof item.url === 'string'" :key="item" :to="{ name: item.url }" v-slot="{isActive}" class="routing-link block py-1 px-8" @click="closeMobileMenu">
        <img v-if="item.icon != null" :src="require('@/assets/icons/' + item.icon)" :class="isActive ? 'active-green-icon' : ''" class="cursor-pointer mr-2 inline-flex icon-fire" alt="SEEN">
        <span class="opacity-50 font-bold py-0.5" :class="{'active': isActive}">{{ item.title }}</span>
      </router-link>

      <span v-else>

        <a class="routing-link block py-1 px-8">
            <img v-if="item.icon != null"
                :src="require('@/assets/icons/' + item.icon)"
                :class="isActive ? 'active-green-icon' : ''"
                class="cursor-pointer mr-2 inline-flex icon-fire"
            />
            <span
                class="opacity-50 font-bold py-0.5 hover:opacity-100"
                :class="{ active: isActive }"
            >{{ item.title }}&nbsp;<i v-if="true" class="fas fa-caret-down"></i></span>
        </a>

        <template v-for="(value, name) in item.url" :key="value && name">
              <router-link v-if="!value.url.includes('http')"
                  :to="{ name: value.url }"
                  v-slot="{ isActive }"
                  class="routing-link block py-1 px-10"
                  @click="closeMobileMenu"
              >
              <span
                  class="opacity-50 font-bold py-0.5 hover:opacity-100"
                  :class="{ active: isActive }"
              >{{ value.title }}</span>
              </router-link>
              <a v-else
                :href="value.url"
                target="_blank"
                class="routing-link block py-1 px-10"
                ><span class="opacity-50 font-bold py-0.5 hover:opacity-100"
                  >{{ value.title }}</span>
              </a>
        </template>


      </span>

    </template>

    <wallet-button class="mx-auto block pl-2 sm:pl-8"/>
  </nav>
</template>

<script>
import {useStore} from "vuex";
import {watchEffect, onMounted, ref, computed} from "vue";
import Slideout from "slideout";
import WalletButton from "@/components/WalletButton";
import Menu from "@/components/Menu/Menu.js";

export default {
  name: "MobileMenu",
  mixins: [Menu],
  components: {WalletButton},
  setup() {
    const store = useStore()
    let slideout = ref(null)
    let isOpen = computed(() => {
      return store.getters['application/mobileMenu']
    })

    watchEffect(() => {
      if (!slideout.value) {
        return
      }
      if (isOpen.value && slideout.value) {
        slideout.value.open()
      }
      if (!isOpen.value && slideout.value) {
        slideout.value.close()
      }
    }, {
      flush: 'post'
    })

    onMounted(() => {
      slideout.value = new Slideout({
        panel: document.getElementById('main'),
        menu: document.getElementById('menu'),
        padding: 256,
        tolerance: 70,
        touch: false,
      })
    })

    return {closeMobileMenu: () => store.commit('application/CLOSE_MOBILE_MENU')}
  },
}
</script>

<style scoped lang="scss">
  .routing-link:hover {
    img {
      filter: brightness(0) invert(1) !important;
    }
  }

  .icon-fire {
    height: 22px;
    filter: brightness(100) saturate(100%) opacity(0.4);
  }
</style>
