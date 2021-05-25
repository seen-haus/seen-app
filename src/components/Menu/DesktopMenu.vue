<template>
  <nav v-if="menu">
      <template v-for="item in menu" :key="item && item.title">
        <router-link v-if="typeof item.url === 'string'"
            :to="{ name: item.url }"
            v-slot="{ isActive }"
            class="routing-link mr-8 xl:mr-12 opacity-50 hover:opacity-100"
        >
        <img  v-if="item.icon != null"
            :src="require('@/assets/icons/' + item.icon)"
            :class="isActive ? 'active-green-icon' : ''"
            class="cursor-pointer mr-2 inline-flex icon-fire"
        />
        <span
            class="font-bold py-0.5"
            :class="{ active: isActive }"
        >{{ item.title }}</span>
        </router-link>

        <span v-else>

            <ul class="w-full">
              <li class="dropdown inline cursor-pointer font-bold text-base tracking-wide relative opacity-50 hover:opacity-100">
                <a class="py-3 pr-12">
                    <img v-if="item.icon != null"
                        :src="require('@/assets/icons/' + item.icon)"
                        :class="isActive ? 'active-green-icon' : ''"
                        class="cursor-pointer mr-2 inline-flex icon-fire"
                    />
                    <span
                        :class="{ active: isActive }"
                    >{{ item.title }}&nbsp;<i v-if="true" class="fas fa-caret-down"></i></span>
                </a>
                <div class="dropdown-menu top-1 absolute hidden h-auto t-8 pt-1">
                  <ul class="block w-45 bg-white border py-3">
                      <template v-for="(value, name) in item.url" :key="value && name">
                        <li>

                            <router-link v-if="!value.url.includes('http')"
                                :to="{ name: value.url }"
                                v-slot="{ isActive }"
                                class="routing-link py-3 px-6 opacity-50 hover:opacity-100"
                            >
                            <span
                                :class="{ active: isActive }"
                                >{{ value.title }}</span>
                            </router-link>

                            <a v-else target="_blank" :href="value.url" class="py-3 px-6 opacity-50 hover:opacity-100">
                                <span
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
.routing-link {
  display: block;

  &:hover img {
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

.dropdown .dropdown-menu {
  margin-left: -1.5rem;
  top: 1.75rem;

  // Apply border top to third drop down menu item
  li:nth-child(3n) {
    border-top: 1px solid #ccc;
    margin-top: 10px;
    padding-top: 10px;
  }

  a { display: block; }
}

.router-link-active {
  opacity: 1;

  .active {
    border-bottom-width: 3px;
  }
}

</style>