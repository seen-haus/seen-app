<template>
    <div class="faq-list gap-12 py-6">
            <span class="title-text font-title text-4xl font-bold">FAQs</span>
            <template v-for="question in faq" :key="question">
              <collapsible-tile class="mx-auto mb-6" :title="question.question">
                  <span v-html="question.answer"></span>
              </collapsible-tile>
            </template>
      </div>
</template>

<script>
    import CollapsibleTile from "@/views/faq/components/CollapsibleTile.vue"

    export default {
        name: "FAQ",
        components: {
            CollapsibleTile
        },
        props: {
            faq: {
                type: Object,
                required: true
            }
        }
    }
</script>

<style scoped>

</style>