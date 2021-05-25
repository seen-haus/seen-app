<template>
  <nav v-if="menu">
      <template v-for="item in menu" :key="item && item.title">
        <router-link v-if="typeof item.url === 'string'"
            :to="{ name: item.url }"
            v-slot="{ isActive }"
            class="routing-link mr-8 xl:mr-12"
        >
        <img  v-if="item.icon != null"
            :src="require('@/assets/icons/' + item.icon)"
            :class="isActive ? 'active-green-icon' : ''"
            class="cursor-pointer mr-2 inline-flex icon-fire"
        />
        <span
            class="opacity-50 font-bold py-0.5 hover:opacity-100"
            :class="{ active: isActive }"
        >{{ item.title }}</span>
        </router-link>

        <span v-else>

            <ul class="w-full">
              <li class="dropdown inline px-4 cursor-pointer font-bold text-base tracking-wide relative">
                <a>
                    <img v-if="item.icon != null"
                        :src="require('@/assets/icons/' + item.icon)"
                        :class="isActive ? 'active-green-icon' : ''"
                        class="cursor-pointer mr-2 inline-flex icon-fire"
                    />
                    <span
                        class="opacity-50 hover:opacity-100"
                        :class="{ active: isActive }"
                    >{{ item.title }}&nbsp;<i v-if="true" class="fas fa-caret-down"></i></span>
                </a>
                <div class="dropdown-menu top-1 absolute hidden h-auto pt-8">
                  <ul class="block w-50 bg-white border p-8">
                      <template v-for="(value, name) in item.url" :key="value && name">
                        <li class="py-1">

                            <router-link v-if="!value.url.includes('http')"
                                :to="{ name: value.url }"
                                v-slot="{ isActive }"
                                class="routing-link"
                            >
                            <span
                                class="opacity-50 hover:opacity-100"
                                :class="{ active: isActive }"
                            >{{ value.title }}</span>
                            </router-link>

                            <a v-else target="_blank" :href="value.url">
                                <span
                                class="opacity-50 hover:opacity-100"
                                :class="{ active: isActive }"
                                >{{ value.title }}<sup>&nbsp;<i class="fa fa-external-link"></i></sup></span>
                            </a>

                        </li>
                      </template>
                  </ul>
                </div>
              </li>
            </ul>

        </span>
      </template>

  </nav>
</template>

<script>

import Menu from "@/components/Menu/Menu.js";

export default {
    name: "DesktopMenu",
    mixins: [Menu]
};
</script>

<style scoped lang="scss">
.routing-link:hover {
  img {
    filter: brightness(0) saturate(100%);
  }
}

.icon-fire {
  height: 22px;
  filter: brightness(0) saturate(100%) opacity(0.4);
}

.dropdown:hover .dropdown-menu {
  display: block;
  z-index: 1;
}

</style>

