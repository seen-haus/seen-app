<template>
    <div class="user-badge flex-shrink-0 flex items-center rounded-full p-1.5 font-semibold shadow-lifted-sm cursor-pointer" :class="typeStyles" @click="navigateToArtist($event)">
        <img class="user-img rounded-full mr-2 h-6 w-6" :src="url" />
        <span class="text-sm mr-1.5">{{username}}</span>
    </div>
</template>


<script>
import {computed} from 'vue';
import { useRouter } from "vue-router";

export default {
    name: 'UserBadge',
    props: {
        type: { type: String, default:'light' },
        url: { type: String, default:'http://placekitten.com/24/24' },
        username: { type: String, default:'username' },
        artistSlug: String,
    },
    setup(props) {
        const router = useRouter();

        const typeStyles = computed(() => props.type && props.type === 'light'
        ? 'text-black bg-white'
        : 'text-white bg-hero-gray');

        const navigateToArtist = (e) => {
            e.stopImmediatePropagation();
            router.push({
                name: "artistProfile",
                params: { artistSlug: props.artistSlug },
            });
        };

        return {
            typeStyles,
            navigateToArtist,
        };
    }
}
</script>
