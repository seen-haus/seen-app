<template>
    <div class="user-badge flex items-center rounded-full p-1.5 font-semibold shadow-lifted-sm cursor-pointer" :class="typeStyles" @click="navigateToArtist">
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
        artistId: Number,
    },
    setup(props) {
        const router = useRouter();

        const typeStyles = computed(() => props.type && props.type === 'light'
        ? 'text-black bg-white'
        : 'text-white bg-hero-gray');

        const navigateToArtist = () => {
            router.push({
                name: "artistProfile",
                params: { artistId: props.artistId },
            });
            };

        return {
            typeStyles,
            navigateToArtist,
        };
    }
}
</script>