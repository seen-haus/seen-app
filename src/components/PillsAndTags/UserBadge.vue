<template>
    <div class="user-badge flex items-center rounded-full p-1.5 font-semibold shadow-lifted-sm" :class="typeStyles">
        <img class="user-img rounded-full mr-2 h-6 w-6" :src="url" />
        <span class="text-sm mr-1.5">{{username}}</span>
    </div>
</template>


<script>
import {computed} from 'vue';

export default {
    name: 'UserBadge',
    props: {
        type: { type: String, default:'light' },
        url: { type: String, default:'http://placekitten.com/24/24' },
        username: { type: String, default:'username' },
    },
    setup(props) {
        const typeStyles = computed(() => props.type && props.type === 'light'
        ? 'text-black bg-white'
        : 'text-white bg-hero-gray');

        return {
            typeStyles
        };
    }
}
</script>