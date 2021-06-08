<template>
    <Dialog v-model:visible="displayModal" :style="{width: '48rem'}" :modal="true" :closable="true">

        <fenced-title
          class="flex-grow mr-0 mb-4 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >FAQs
        </fenced-title>
        <template v-for="question in faq" :key="question">
            <collapsible-tile class="mx-auto mb-6" :title="question.question">
            <span v-html="question.answer"></span>
        </collapsible-tile>
        </template>

    </Dialog>
</template>

<script>
    import Dialog from 'primevue/dialog';
    import {ref} from 'vue';
    import emitter from "@/services/utils/emitter";
    import CollapsibleTile from "@/views/faq/components/CollapsibleTile.vue";
    import FencedTitle from "@/components/FencedTitle.vue";


    export default {
        name: "FaqModal",
        components: {
            Dialog,
            CollapsibleTile,
            FencedTitle,
        },
        props: {
            faq: Object
        },
        setup() {
            const displayModal = ref(false);

            emitter.on('openFaqModal', payload => {
                displayModal.value = true;
            });

            return {
                displayModal
            };
        },
    };
</script>

<style lang="scss">

</style>
