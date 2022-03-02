<template>
    <div class="faq-list gap-12 pt-6">
        <span class="title-text font-title text-4xl font-bold">FAQs</span>
        <template v-for="question in faq.slice(0, 3)" :key="question">
            <collapsible-tile class="mx-auto my-3" :title="question.question">
            <span v-html="question.answer"></span>
        </collapsible-tile>
        </template>
        <button v-if="faq && faq.length > 3" class="button dark w-full mt-6" @click="openModal">
            <i class="fas fa-list mr-2 text-xl icon-left text-white"></i> Open full FAQ
            <faq-modal :faq="faq"></faq-modal>
        </button>
    </div>
</template>

<script>
    import CollapsibleTile from "@/views/faq/components/CollapsibleTile.vue";
    import FaqModal from "@/views/collectable/components/FaqModal.vue";
    import emitter from "@/services/utils/emitter"


    export default {
        name: "FAQ",
        components: {
            FaqModal,
            CollapsibleTile
        },
        props: {
            faq: {
                type: Object,
                required: true
            }
        },
        setup(){

            const openModal = () => {
                emitter.emit("openFaqModal");
            };
            return {
                openModal
            }
        }
    }
</script>

<style scoped>

</style>