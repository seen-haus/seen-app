<template>
  <div class="py-3 relative pl-8 pl-md-0">
    <div v-if="!account" class="wallet-button-container">
      <button class="cursor-pointer button primary flex-shrink-0 wallet" @click="openWalletModal"><i
          class="fas fa-wallet mr-2 transform rotate-12"></i> Connect wallet
      </button>
    </div>

    <div @click="toggle" class="pr-4 md:pr-0">
      <div v-if="account" class="wallet-button-container">
        <button class="cursor-pointer button primary flex items-center wallet">
          <div class="profile-avatar wallet-button-avatar" :style="{ backgroundImage: `url(${userLocal?.image})` }">
            <identicon :size="32" :address="account" v-if="!userLocal?.image"/>
          </div>
          <div class="ml-2 flex flex-col items-start disable-text-transform">
            <span class="addressText" v-if="!userLocal?.username">{{ shortenAddress(account) }}</span>
            <span class="usernameText" v-if="userLocal?.username">{{ userLocal.username }}</span>
            <span class="block balanceText">{{ balanceFormatted ? balanceFormatted.substring(0, 8) : 'Fetching balance' }} ETH</span>
          </div>
          <div class="mr-4 ml-4 ml-md-12">
            <i class="fas fa-caret-down" v-if="!isOpen"></i>
            <i class="fas fa-caret-up" v-if="isOpen"></i>
          </div>
        </button>
      </div>
    </div>
    <OverlayPanel ref="op" appendTo="body" @hide="close" :showCloseIcon="false" id="overlay_panel" :breakpoints="{'960px': '75vw'}">
      <div class="dropdown-menu">
        <div class="arrow-up"></div>
        <div class="py-6 px-8 bg-background-gray lg:rounded-t-lg">
          <p class="text-xs font-bold text-grey-9">YOUR WALLET BALANCE</p>
          <p class="text-3xl font-bold text-black"><span v-if="balance">{{ balanceFormatted }}</span><i v-if="!balance"
                                                                                                        class="fas fa-spinner fa-spin text-gray-400 text-3xl"></i>
            <span class="text-lg font-normal"> ETH</span></p>
          <p class="text-sm text-grey-9"><span v-if="dollarValue">{{ dollarValue }}</span><i v-if="!dollarValue"
                                                                                             class="fas fa-spinner fa-spin text-gray-400 text-3xl"></i>
          </p>
        </div>
        <div class="lg:bg-white lg:rounded-b-lg">
          <a class="button dropdown-btn" :href="etherscanLink" target="_blank">
            <div class="flex justify-between flex-grow">
              <div class="flex flex-grow normal-text">
                <img src="@/assets/icons/icon--seen.svg" class="cursor-pointer mr-2" alt="SEEN">
                <i class="fas fa-spinner fa-spin" v-if="!seenBalance"></i>
                {{ seenBalance ? `${formatCrypto(seenBalance, true)} SEEN` : '' }}</div>
              <div class="text-grey-9 font-normal">{{ seenBalanceUSD }}</div>
            </div>
          </a>
          <div class="mx-8 h-0.5 bg-background-gray"></div>
          <router-link :to="{ name: 'stake'}">
            <button class="button dropdown-btn" @click="close">
              <div class="flex justify-between flex-grow">
                <div class="flex flex-grow normal-text">
                  <img src="@/assets/icons/icon--seen-green.svg" class="cursor-pointer mr-2" alt="xSEEN">
                  <i class="fas fa-spinner fa-spin" v-if="!xSeenBalance"></i>
                  {{ xSeenBalance ? `${formatCrypto(xSeenBalance, true)} xSEEN` : '' }}</div>
                <div class="text-grey-9 font-normal">{{ xSeenBalanceUSD }}</div>
              </div>
            </button>
          </router-link>
          <div class="mx-8 h-0.5 bg-background-gray"></div>
          <span>
            <button class="button dropdown-btn" @click="openWalletModal">
              <i class="gray fas fa-user cursor-pointer mr-2" alt="SEEN"></i> Edit Profile
            </button>
          </span>
          <div class="mx-8 h-0.5 bg-background-gray"></div>
          <span>
            <button class="button dropdown-btn" @click="openNotificationsModal">
              <i class="gray fas fa-bell cursor-pointer mr-2" alt="Notification Manager"></i> Notification Manager
            </button>
          </span>
          <div class="mx-8 h-0.5 bg-background-gray"></div>
          <router-link :to="{ name: 'profile'}">
            <button class="button dropdown-btn" @click="close">
              <i class="gray far fa-clone cursor-pointer mr-2" alt="SEEN"></i> My Collection
            </button>
          </router-link>
          <div class="mx-8 h-0.5 bg-background-gray"></div>
          <button class="button dropdown-btn" @click="handleDisconnect">
            <i class="gray fas fa-power-off cursor-pointer mr-2" alt="SEEN"></i> Disconnect
          </button>
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script>
import useWeb3 from "@/connectors/hooks"
import {useStore} from "vuex"
import Identicon from "@/components/Identicon/Identicon"
import {shortenAddress} from "@/services/utils/index"
import {ref, watchEffect, computed} from 'vue'
import {formatEther} from "@ethersproject/units";
import useSigner from "@/hooks/useSigner";
import useExchangeRate from "@/hooks/useExchangeRate.js";
import OverlayPanel from 'primevue/overlaypanel';

export default {
  name: 'WalletButton',
  components: {Identicon, OverlayPanel},
  setup() {
    const store = useStore();
    const op = ref();
    const {error, account, deactivate, provider} = useWeb3();
    const {formatCrypto, convertEthToUSDAndFormat, convertSeenToUSDAndFormat} = useExchangeRate();
    const balance = ref(null);
    const balanceFormatted = computed(() => formatCrypto(balance.value));
    const dollarValue = computed(() => balance.value === null ? '' : convertEthToUSDAndFormat(balance.value));
    const seenBalance = computed(() => {
      const seenBalance = store.getters['application/balance'].seen
      return seenBalance
    });
    const seenBalanceUSD = computed(() => seenBalance.value ? convertSeenToUSDAndFormat(seenBalance.value) : '');

    const xSeenBalance = computed(() => {
      const xSeenBalance = store.getters['application/balance'].xSeen
      return xSeenBalance
    });
    const xSeenToSeenRatio = computed(() => {
      const xSeenToSeenRatio = store.getters['application/balance'].xSeenToSeenRatio
      return xSeenToSeenRatio
    });
    const xSeenBalanceUSD = computed(() => xSeenBalance.value && xSeenToSeenRatio.value ? convertSeenToUSDAndFormat(xSeenBalance.value * xSeenToSeenRatio.value) : '');
    const etherscanLink = computed(() => account.value ? `https://etherscan.io/address/${account.value}` : 'https://etherscan.io/token/0xCa3FE04C7Ee111F0bbb02C328c699226aCf9Fd33');
    let isInitialOpen = true;

    watchEffect(async () => {
      if (provider.value) {
        const signer = useSigner();
        const balanceEncoded = await signer.getBalance();
        balance.value = formatEther(balanceEncoded);
      }
    })

    const userLocal = computed(() => store.getters['user/user']);

    let isOpen = ref(false);
    const openWalletModal = () => {
      op.value.hide();
      isOpen.value = false;
      store.dispatch('application/openModal', 'WalletModalConnectOnly')
    };
    const openNotificationsModal = () => {
      op.value.hide();
      isOpen.value = false;
      store.dispatch('application/openModal', 'NotificationsModal')
    };
    const handleDisconnect = () => {
      close();
      store.dispatch('user/setUser', null);
      deactivate();
    };

    var overlay;

    const toggleFlag = (ev) => {
      if (overlay) {
        isOpen.value = false;
        overlay = document.getElementsByTagName('body')[0];
        overlay.removeEventListener('click', toggleFlag);
      }
    }

    const toggle = (event) => {
      op.value.toggle(event);
      isOpen.value = !isOpen.value;
      if (isOpen.value) {
        overlay = document.getElementsByTagName('body')[0];
        setTimeout(() => overlay.addEventListener('click', toggleFlag), 10)
      }

      if (isInitialOpen) {
        isInitialOpen = false;
        const menuEl = op.value;
        const oldAlignOverlay = menuEl.alignOverlay;
        menuEl.popup = true;
        menuEl.alignOverlay = function () {
          oldAlignOverlay();
          const targetRect = this.target.getBoundingClientRect();
          const parentNode = this.container.parentNode;
          this.container.style.left = '';
          this.container.style.right = (parentNode.clientWidth - targetRect.right) + 'px';
        }
      }
    }

    const close = () => {
      op.value.hide();
      isOpen.value = false
    }

    return {
      error,
      account,
      openWalletModal,
      openNotificationsModal,
      formatCrypto,
      shortenAddress,
      handleDisconnect,
      isOpen,
      balance,
      balanceFormatted,
      dollarValue,
      seenBalance,
      seenBalanceUSD,
      xSeenBalance,
      xSeenBalanceUSD,
      xSeenToSeenRatio,
      etherscanLink,
      toggle,
      close,
      op,
      userLocal,
    }
  }
}
</script>

<style scoped lang="scss">
.dropdown-menu {
  @apply absolute w-64 lg:w-80 lg:rounded-lg mt-5 z-10 right-0;
  box-shadow: 0 2px 36px 0 rgba(0, 0, 0, 0.24);
}

.arrow-up {
  @apply hidden lg:block -top-2 absolute w-0 h-0 right-20;
  border-left: .5rem solid transparent;
  border-right: .5rem solid transparent;
  border-bottom: .5rem solid #F5F4F3;
}

.wallet {
  padding: 0 .75rem !important;
}
.balanceText {
  font-size: 13px;
  margin-top: -.25rem;
}
.addressText {
  color: #b8ffe8;
  font-size: 13px;
  font-weight: 400;
  // margin-top: .25rem;
}
.usernameText {
  color: #b8ffe8;
  font-size: 14px;
  font-weight: 400;
  width: 100px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.normal-text {
  text-transform: none !important;
}

.gray {
  color: #999999;
}

.wallet-button-avatar {
  width: 34px;
  height: 34px;
  border: 1px solid white;
  border-radius: 2rem;
}
.wallet-button-container {
  @apply rounded-5sm;
  padding: 1px;
  background: linear-gradient(94.05deg, #11998e80 1.74%, #38ef7d80 100%);
}
</style>
