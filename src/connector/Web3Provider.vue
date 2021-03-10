<template>
  <slot></slot>
</template>

<script>
import connector from "@/connectors/connector";

export default {
  name: 'Web3Provider',
  setup() {
    // Try to connect automatically
    const {eagerConnect} = connector;
    eagerConnect();
  }
}
</script>
