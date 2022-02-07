<template>

    <div class="rounded-lg agent-contact">
        <span class="title-text font-title text-4xl font-bold flex items-center justify-center">Contact {{ artistName ? artistName : 'Artist'}}</span>
        <div class="flex flex-wrap content-start flex items-center justify-center">
            <p class="">Have questions about this property? Reach out to our partner, Propy, for more information:</p>

            <a v-for="item in socials" :key="item" :href="item.url">
                <div  class="agent-social rounded-full h-12 w-12 flex justify-center bg-grey-lighter" :style="{backgroundColor:socialColor(item)}">
                    <i :class="[socialIcon(item.type), 'fa-lg justify-center text-center']" style="padding-top: 1px"></i>
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
                else if (type === 'mail'){return 'far fa-envelope';}
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
                else if (type === 'mail'){return '#16a085';}
                return '#16a085'
            }
        }
    }
</script>

<style scoped>

.agent-contact {
    margin: 30px 0;
    padding: 30px 0 30px;
    border: 1px solid #ccc;
}
p {
    padding: 10px 30px 0;
    text-align: center;
}
.agent-social {
    background-image: linear-gradient(78deg, #34ca98 -3%, #00b97b 99%);
    margin: 20px 10px 0;
    transition: 0.2s ease all;
    opacity: 0.7;
}
.agent-social i {
    line-height: 223%;
    color: #fff;
}
.agent-social:hover {
    transform: scale(1.2);
    opacity: 1;
}

</style>