<template>
  <div>
    <top-header-bar/>
    <container>
      <header class="py-8">
        <div class="flex items-center">
          <div id="logo" class="flex items-center">
            <img src="@/assets/images/logo--black.png"  class="mr-4" alt="">
          </div>
          <div class="ml-auto flex items-center">
            <desktop-menu/>
            <wallet-button/>
          </div>
        </div>
      </header>
    </container>
  </div>
</template>

<script>
import DesktopMenu from "@/components/Menu/DesktopMenu";
import WalletButton from "@/components/WalletButton";
import Container from "@/components/Container";
import TopHeaderBar from "@/components/TopHeaderBar";

export default {
  name: 'AppHeader',
  components: {TopHeaderBar, Container, WalletButton, DesktopMenu},
}
</script>

<style scoped>

</style>
