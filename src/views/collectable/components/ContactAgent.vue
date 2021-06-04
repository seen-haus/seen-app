<template>

    <div class="rounded-lg">
        <span class="title-text font-title text-4xl font-bold flex items-center justify-center">Contact {{ artistName ? artistName : 'Artist'}}</span>
        <div class="h-48 flex flex-wrap content-start flex items-center justify-center">
            <a v-for="item in socials" :key="item" :href="item.url">
                <div  class="rounded-full h-12 w-12 flex justify-center bg-grey-lighter" :style="{backgroundColor:socialColor(item)}">
                    <i :class="[socialIcon(item.type), 'fa-lg justify-center text-center']"></i>
                </div>
            </a>
        </div>
    </div>

</template>

<script>
    export default {
        name: "ContactAgent",
        props: {
            artistName: String,
            socials: Object
        },
        methods: {
            socialIcon(type){
                if (type === 'twitter'){return 'fab fa-twitter';}
                else if (type === 'facebook'){return 'fab fa-facebook';}
                else if (type === 'telegram'){return 'fab fa-telegram';}
                else if (type === 'medium'){return 'fab fa-medium';}
                else if (type === 'youtube'){return 'fab fa-youtube';}
                else if (type === 'discord'){return 'fab fa-discord';}
                else if (type === 'linkedin'){return 'fab fa-linkedin';}
                else if (type === 'website'){return 'fa fa-globe';}
                return 'fas fa-link'
            },
            socialColor(type){
                if (type === 'twitter'){return '#16a085';}
                else if (type === 'facebook'){return '#16a085';}
                else if (type === 'telegram'){return '#16a085';}
                else if (type === 'medium'){return '#16a085';}
                else if (type === 'youtube'){return '#16a085';}
                else if (type === 'discord'){return '#16a085';}
                else if (type === 'linkedin'){return '#16a085';}
                else if (type === 'website'){return '#16a085';}
                return '#16a085'
            }
        }
    }
</script>

<style scoped>

</style>