<template>
    <div class="user-badge flex items-center rounded-full p-1.5 font-semibold" :class="typeStyles">
        <img class="user-img rounded-full mr-2" src="http://placekitten.com/24/24" />
        <span class="text-xs mr-1.5">username</span>
    </div>
</template>


<script>
import {computed} from 'vue';

export default {
    name: 'UserBadge',
    props: {
        type: String,
    },
    setup(props) {
        const typeStyles = computed(() => props.type && props.type === 'light'
        ? 'text-black bg-white'
        : 'text-white bg-gray-800');

        return {
            typeStyles
        };
    }
}
</script>