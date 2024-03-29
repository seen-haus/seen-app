<template>
    <div
        class="flex-align-center"
        :style="{
          ...(padding && {'padding': padding}),
          ...(width && {'width': width}),
          ...(height && {'height': height}),
        }"
        :class="{'disable-grow': disableLinkGrow}" 
        @click="navigateToArtistOrUser"
    >
        <div v-if="!data.creatorAccount && !data.creatorProfilePicture" class="artist-pic-placeholder mr-2 placeholder-light-grey"></div>
        <div v-if="data.creatorAccount || data.creatorProfilePicture" class="artist-avatar mr-2" :style="{ backgroundImage: `url(${data.creatorProfilePicture})` }">
            <identicon :size="34" :address="data.creatorAccount" v-if="!data.creatorProfilePicture && data.creatorAccount"/>
        </div>
        <div v-if="!data.creatorUsername && !data.creatorAccount" class="artist-name-placeholder placeholder-light-grey"></div>
        <sub-title
            v-if="data.creatorUsername || data.creatorAccount"
            class="text-black hidden lg:flex mb-1 mt-1"
            :class="{
              'text-white': darkMode
            }"
            text-align="center"
            font-size="15px"
        >
            {{(data.creatorUsername && `@${data.creatorUsername}`) || data.creatorAccount && shortenAddress(data.creatorAccount)}}
        </sub-title>
    </div>
</template>


<script>
import { computed, reactive } from 'vue';
import { useRouter } from "vue-router";

import { shortenAddress } from "@/services/utils/index";
import Identicon from "@/components/Identicon/Identicon";
import SubTitle from "@/components/SubTitle.vue";

import useDarkMode from '@/hooks/useDarkMode';

export default {
    name: 'UserBadge',
    props: {
      creatorAccount: {
        type: String
      },
      creatorUsername: {
        type: String
      },
      creatorProfilePicture: {
        type: String
      },
      creatorType: {
        type: String
      },
      creatorSlug: {
        type: String
      },
      disableLinkGrow: {
        type: Boolean,
        default: false,
      },
      padding: {
        type: [String, Boolean],
        default: false,
      },
      height: {
        type: [String, Boolean],
        default: false,
      },
      width: {
        type: [String, Boolean],
        default: false, 
      }
    },
    components: {
      Identicon,
      SubTitle,
    },
    setup(props) {
        const router = useRouter();

        const { darkMode } = useDarkMode();

        const data = reactive({
            creatorAccount: props.creatorAccount,
            creatorUsername: props.creatorUsername,
            creatorProfilePicture: props.creatorProfilePicture,
        })

        const typeStyles = computed(() => props.type && props.type === 'light'
        ? 'text-black bg-white'
        : 'text-white bg-hero-gray');

        const navigateToArtistOrUser = (e) => {
            e.stopImmediatePropagation();
            if(props.creatorType == 'artist') {
                router.push({
                    name: "legacyArtistProfile",
                    params: { artistSlug: props.creatorSlug },
                });
            } else {
                router.push({
                    name: "profileWithAddress",
                    params: { userAddressOrUsername: props.creatorSlug },
                });
            }
        };

        return {
            typeStyles,
            darkMode,
            navigateToArtistOrUser,
            data,
            shortenAddress,
        };
    }
}
</script>

<style lang="scss" scoped>
    .artist-pic-placeholder {
        width: 32px;
        height: 32px;
        border-radius: 32px;
    }
    .artist-name-placeholder {
        width: 100px;
        height: 24px;
        border-radius: 10px;
    }
    .artist-avatar {
        width: 34px;
        height: 34px;
        border-radius: 2rem;
        background-size: cover;
    }
    .disable-grow {
        flex-grow: 0;
    }
</style>