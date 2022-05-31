<template>
  <container>
    <div class="loading-mask" v-if="!isLoading">
      <Dialog class="ticket-modal" v-model:visible="displayTicketModal" :style="{maxWidth: '50rem', width: '100%'}" :modal="true" :closable="true">
        <div>
          <common-title
              class="flex-grow mr-0 mb-2 mt-6 lg:mr-6 hidden lg:flex"
              color="fence-light"
              textAlign="left"
              :closed="false"
          >
            Ticket Manager
          </common-title>
          <light-typography class="description" textAlign="left" fontSize="18px">Each "buy" transaction on the original sale corresponds to a separate batch of tickets. These ticket batches can be burnt in order to entitle your shipping info (linked to your Ethereum address) to physical units of this piece.</light-typography>
          <light-typography v-if="(claimedTicketCount > 0) || (holdingTickets.length > 0)" class="description" textAlign="left" fontSize="18px"><br/>Please contact SEEN support via <a href="https://t.me/seenhaus" class="external-link" target="_blank" rel="noopener noreferrer">Telegram</a> or <a href="https://discord.gg/STUD5ssDgK" class="external-link" target="_blank" rel="noopener noreferrer">Discord</a> if you require assistance or have any questions.</light-typography>
        </div>
        <div v-if="loadingTicketData">
          <light-typography class="description mt-6" textAlign="left" fontSize="18px">Loading ticket data...</light-typography>
        </div>
        <div v-else>
          <div v-if="(claimedTicketCount === 0) && (holdingTickets.length === 0)">
            <common-title
                class="flex-grow mr-0 mb-2 mt-6 lg:mr-6 hidden lg:flex"
                color="fence-light"
                textAlign="left"
                :closed="false"
            >
              No Tickets Found
            </common-title>
            <light-typography class="description" textAlign="left" fontSize="18px">Your address does not appear to be holding any tickets and also does not appear to have made any claims against tickets, please contact SEEN support via <a href="https://t.me/seenhaus" class="external-link" target="_blank" rel="noopener noreferrer">Telegram</a> or <a href="https://discord.gg/STUD5ssDgK" class="external-link" target="_blank" rel="noopener noreferrer">Discord</a> if you require assistance.</light-typography>
          </div>
          <div v-if="claimedTicketCount > 0">
            <common-title
                class="flex-grow mr-0 mb-2 mt-6 lg:mr-6 hidden lg:flex"
                color="fence-light"
                textAlign="left"
                :closed="false"
            >
              {{claimedTicketCount}} {{claimedTicketCount > 1 ? `Units` : `Unit`}} Claimed
            </common-title>
            <light-typography class="description" textAlign="left" fontSize="18px">Your address has burnt a total of {{claimedTicketCount}} tickets, therefore your shipping information is entitled to {{claimedTicketCount}} physical units of this piece. <strong>Please don't forget to submit your shipping information.</strong></light-typography>
          </div>
          <div v-if="holdingTickets.length > 0">
            <common-title
                class="flex-grow mr-0 mb-2 mt-6 lg:mr-6 hidden lg:flex"
                color="fence-light"
                textAlign="left"
                :closed="false"
            >
              Owned Ticket Batches
            </common-title>
            <light-typography class="description" textAlign="left" fontSize="18px">Clicking on a batch of tickets will burn the batch and entitle your shipping info to a corresponding number of physical units of this piece, your Ethereum address will also receive the NFT associated with this piece in exchange for the burnt tickets (one NFT per burnt ticket). <strong>Burning a batch of tickets can not be reversed.</strong></light-typography>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div class="cursor-pointer w-full primary button burnable-ticket-batch-outer" :style="{'background-image': `url('${ticket.metadata.image}')`}" v-for="ticket in holdingTickets" :key="ticket.id" @click="burnTicketsHeld(ticket.token_id)">
                
                <div class="burnable-ticket-overlay">
                  <img src="@/assets/icons/orange-flame.svg" class="burn-icon"/>
                  <div class="burnable-ticket-batch-inner">
                    {{ticket.token_balance}}<br/>
                    {{ticket.token_balance === 1 ? `Ticket` : `Tickets`}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10">
        <div>
          <common-title
              class="flex-grow mr-0 mb-6 mt-12 lg:mr-6 hidden lg:flex"
              color="fence-light"
              textAlign="left"
              :closed="false"
          >
            Claim Physical
          </common-title>
          <template v-if="claim.contract_address">
            <button
              class="button dark mt-20 mx-auto w-full md:w-96"
              @click="onClaim"
            >
              Claim
            </button>
          </template>
          <template v-else>
            <form
              @submit="onSubmit"
              class="font-semibold uppercase text-md text-black"
            >
              <div v-if="!hasSubmittedShipping">
                <div class="fc mb-4">
                  <label for="winner-email">Email</label>
                  <input
                    type="email"
                    id="winner-email"
                    class="w-full outlined-input mt-2"
                    autocomplete="email"
                    v-model="emailField.value"
                  />
                  <span class="error-notice">{{ emailField.errors[0] }}</span>
                </div>
                <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div class="fc mb-4">
                    <label for="winner-name">Name</label>
                    <input
                      type="text"
                      id="winner-name"
                      class="w-full outlined-input mt-2"
                      autocomplete="given-name"
                      v-model="firstNameField.value"
                    />
                    <span class="error-notice">{{ firstNameField.errors[0] }}</span>
                  </div>
                  <div class="fc mb-4">
                    <label for="winner-last-name">Last name</label>
                    <input
                      type="text"
                      id="winner-last-name"
                      class="w-full outlined-input mt-2"
                      autocomplete="family-name"
                      v-model="lastNameField.value"
                    />
                    <span class="error-notice">{{ lastNameField.errors[0] }}</span>
                  </div>
                </div>
                <div class="fc mb-4">
                  <label for="winner-phone">Phone</label>
                  <input
                    type="phone"
                    id="winner-phone"
                    class="w-full outlined-input mt-2"
                    autocomplete="tel"
                    v-model="phoneField.value"
                  />
                  <span class="error-notice">{{ phoneField.errors[0] }}</span>
                </div>
                <div class="fc mb-4">
                  <label for="winner-telegram">Telegram Username (optional)</label>
                  <input
                    type="text"
                    id="winner-telegram"
                    class="w-full outlined-input mt-2"
                    autocomplete="new-password"
                    v-model="telegramUsernameField.value"
                  />
                  <span class="error-notice">{{
                    telegramUsernameField.errors[0]
                  }}</span>
                </div>
                <div class="fc mb-4">
                  <label for="winner-address">Address</label>
                  <input
                    type="text"
                    id="winner-address"
                    class="w-full outlined-input mt-2"
                    autocomplete="street-address"
                    v-model="addressField.value"
                  />
                  <span class="error-notice">{{ addressField.errors[0] }}</span>
                </div>
                <div class="fc mb-4">
                  <label for="winner-city">City</label>
                  <input
                    type="text"
                    id="winner-city"
                    class="w-full outlined-input mt-2"
                    autocomplete="address-level2"
                    v-model="cityField.value"
                  />
                  <span class="error-notice">{{ cityField.errors[0] }}</span>
                </div>
                <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div class="fc mb-4">
                    <label for="winner-state">State / Province</label>
                    <input
                      type="text"
                      id="winner-state"
                      class="w-full outlined-input mt-2"
                      autocomplete="address-level1"
                      v-model="provinceField.value"
                    />
                    <span class="error-notice">{{ provinceField.errors[0] }}</span>
                  </div>
                  <div class="fc mb-4">
                    <label for="winner-zip">ZIP</label>
                    <input
                      type="text"
                      id="winner-zip"
                      class="w-full outlined-input mt-2"
                      autocomplete="postal-code"
                      v-model="zipField.value"
                    />
                    <span class="error-notice">{{ zipField.errors[0] }}</span>
                  </div>
                </div>
                <div class="fc mb-4">
                  <label for="winner-country">Country</label>
                  <select
                    v-model="countryField.value"
                    name="winner-country"
                    id="winner-country"
                    autocomplete="country-name"
                    class="w-full outlined-input mt-2"
                  >
                    <option
                      :value="country"
                      v-for="country in countries"
                      :key="country"
                    >
                      {{ country }}
                    </option>
                  </select>
                  <span class="error-notice">{{ countryField.errors[0] }}</span>
                </div>

                <div class="fc mb-4">
                  <label for="claim-message">Message/Instructions <span v-if="state.messageHelper" style="opacity: 0.5"> - {{state.messageHelper}}</span></label>
                  <textarea name="claim-message" id="claim-message" class="w-full outlined-input mt-2" :required="state.requiresMessage ? true : false" v-model="messageField.value"></textarea>
                  <span class="error-notice">{{ messageField.errors[0] }}</span>
                </div>

                <div class="fc mb-4">
                  <div :style="{'display': 'flex', 'justify-content': 'space-between'}">
                    <input
                      v-model="understandsClaimQuantityField.value"
                      type="checkbox"
                      placeholder="Understands Claim Quantity"
                      :style="{'display': 'inline-block', height: '30px'}"
                    />
                    <label :style="{'display': 'inline-block', width: 'calc(100% - 30px)', 'padding-left': '10px'}">I acknowledge that this claim submission will be considered as a physical claim for all the units of this NFT that are owned by my Ethereum address (based off how many tickets I have burnt).</label>
                  </div>
                  <span class="error-notice">{{ understandsClaimQuantityField.errors[0] }}</span>
                </div>
              </div>
              <div v-if="hasSubmittedShipping">
                <light-typography class="description mb-8" textAlign="left" fontSize="18px">Your shipping information has been successfully submitted, you may resubmit your shipping information if you wish to update it.<br/><br/>You can also continue to manage your tickets if you would like to attach more physical claims to your submission by burning more tickets.<br/><br/>Please contact SEEN support via <a href="https://t.me/seenhaus" class="external-link" target="_blank" rel="noopener noreferrer">Telegram</a> or <a href="https://discord.gg/STUD5ssDgK" class="external-link" target="_blank" rel="noopener noreferrer">Discord</a> if you require assistance or have any questions.</light-typography>
                <div class="flex items-center w-full justify-center mb-4 mt-4">
                  <button
                    type="button"
                    class="cursor-pointer w-full primary button mt-3 md:mt-0"
                    @click="hasSubmittedShipping = false"
                  >
                    Replace Shipping Info
                  </button>
                </div>
              </div>
              <div class="flex items-center w-full justify-center mb-4 mt-4">
                <button
                  type="button"
                  class="cursor-pointer w-full primary button mt-3 md:mt-0"
                  @click="displayTicketModal = true"
                >
                  Manage Ticket(s)
                </button>
              </div>
              <div class="flex items-center w-full justify-center mb-4" v-if="!hasSubmittedShipping">
                <button
                  type="submit"
                  class="cursor-pointer w-full primary button mt-3 md:mt-0"
                  :class="{
                    'disabled opacity-50': claimedTicketCount === 0
                  }"
                  :disabled="claimedTicketCount === 0"
                >
                  Submit Shipping Info
                </button>
              </div>
              <div v-if="(claimedTicketCount === 0) && !hasSubmittedShipping" class="mb-4 error-text">
                <label>Shipping info can only be submitted once you have burnt some tickets relevant to this drop</label>
              </div>
            </form></template
          >
        </div>
        <div>
          <div v-if="media?.url" class="mt-16 mb-6 media-container">
            <router-link v-if="collectableLink?.name"
              :to="{ name: collectableLink?.name, ...(collectableLink?.params && {params: collectableLink?.params}) }"
              class="routing-link opacity-100 hover:opacity-80"
            >
              <media-loader
                ref="mediaRef"
                :src="media?.url"
                aspectRatio="100%"
                :loop="true"
                :autoplay="true"
                :declaredMediaType="false"
                :muted="true"
                :fillHeight="true"
                :class="darkMode ? 'dark-mode-background dark-mode-slide' : 'light-mode-background light-mode-slide'"
                class="overflow-hidden rounded-lg flex-1 media-loader-active"
              />
            </router-link>
          </div>
          <common-title
              class="flex-grow mr-0 mb-6 lg:mr-6 hidden lg:flex"
              color="fence-light"
              textAlign="left"
              :closed="false"
          >
            {{ title }}
          </common-title>
          <div class="flex-left mb-8">
            <div class="button shortened shadow-lifted">
              <user-or-artist-badge
                :creatorAccount="creatorInfo.creatorAccount"
                :creatorUsername="creatorInfo.creatorUsername"
                :creatorSlug="creatorInfo.creatorSlug"
                :creatorProfilePicture="creatorInfo.creatorProfilePicture"
                :creatorType="creatorInfo.creatorType"
                :disableLinkGrow="true"
              />
            </div>
          </div>
          <light-typography class="description mb-8" textAlign="left" fontSize="18px">{{description}}</light-typography>
        </div>
      </div>
    </div>
  </container>
</template>

<script>
import { Web3Provider } from "@ethersproject/providers";
import { computed, ref, reactive, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import orderBy from "lodash/orderBy";
import Dialog from 'primevue/dialog';

import Container from "@/components/Container.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue"
import UserOrArtistBadge from "@/components/PillsAndTags/UserOrArtistBadge.vue";
import CommonTitle from "@/components/CommonTitle.vue";
import LightTypography from "@/components/LightTypography.vue";

import {
  useV3MarketConfigContract,
  useV3ItemsTicketerContract,
} from "@/hooks/useContract";

import { ClaimsService, TokenCacheService, TicketCacheService } from "@/services/apiService";

import useWeb3 from "@/connectors/hooks";
import useSigner from "@/hooks/useSigner";
import { useStore } from "vuex"
import { useClaimContract, useV3ItemsTicketerClaimHelper } from "@/hooks/useContract";
import { useField, useForm } from "vee-validate";
import { useToast } from "primevue/usetoast";
import { useMeta } from "vue-meta";
import { countryList } from "@/connectors/constants";
import parseError from "@/services/utils/parseError";

import {
  COLLECTABLE_TYPE
} from "@/constants/Collectables";
import MARKET_HANDLER_TYPES from "@/constants/MarketHandlerTypes.js";

export default {
  name: "Collectable",
  components: {
    Container,
    MediaLoader,
    UserOrArtistBadge,
    CommonTitle,
    LightTypography,
    Dialog,
  },
  setup() {
    
    const store = useStore();
    const toast = useToast();
    const route = useRoute();
    const router = useRouter();
    const claim = ref({});
    const title = ref("Claim");
    const description = ref("");
    const displayTicketModal = ref(false);
    const loadingTicketData = ref(true);
    const hasSubmittedShipping = ref(false);
    const refreshTicketDataIndex = ref(1);
    const media = ref(false);
    const isCurrentAccountEntitledToPhysical = ref(false);
    const claimedTicketCount = ref(0);
    const claimedTickets = ref([]);
    const holdingTicketCount = ref(0);
    const holdingTickets = ref([]);
    const creatorInfo = ref(false);
    const collectableLink = ref(false);
    const collectableData = ref(false);
    const state = reactive({
      loading: true,
      claimId: null,
      requiresMessage: false,
      messageHelper: null,
    });
    const countries = countryList;
    const { account, provider } = useWeb3();
    const { meta } = useMeta({
      title: title.value,
    });

    const form = useForm({
      initialValues: {
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        telegram_username: "",
        address: "",
        city: "",
        province: "",
        zip: "",
        country: "",
        message: "",
        understands_claim_quantity: false,
      },
    });

    const emailField = reactive(useField("email", "email"));
    const firstNameField = reactive(useField("first_name", "required|min:3"));
    const lastNameField = reactive(useField("last_name", "required|min:3"));
    const phoneField = reactive(useField("phone", "required|min:6"));
    const telegramUsernameField = reactive(useField("telegram_username"));
    const addressField = reactive(useField("address", "required|min:3"));
    const cityField = reactive(useField("city", "required|min:2"));
    const provinceField = reactive(useField("province"));
    const zipField = reactive(useField("zip", "required"));
    const countryField = reactive(useField("country", "required"));
    const messageField = reactive(useField("message"));
    const understandsClaimQuantityField = reactive(useField("claim quantity acknowledgement", inputValue => !!inputValue));

    const burnTicketsHeld = async (tokenId) => {

      store.dispatch('application/openModal', 'TransactionModal')

      const temporaryProvider = new Web3Provider(provider.value);
      const gasPrice = await temporaryProvider.getGasPrice().catch(() => {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: `You may be out of ETH`,
          life: 3000,
        });
      });

      const ticketBurnHelperContract = await useV3ItemsTicketerContract(true);

      console.log({holdingTickets: holdingTickets.value})

      const tx = await ticketBurnHelperContract
        .claim(tokenId, {
          gasPrice: gasPrice.toString(),
          from: account.value,
        })
        .catch((e) => {
          store.dispatch('application/closeModal')
          let message = parseError(e.message);
          toast.add({
            severity: "error",
            summary: "Error",
            detail: message ? message : e.message,
            life: 3000,
          });
          return false;
        });

      if (!tx) {
        store.dispatch('application/closeModal')
        return;
      }

      if(tx.hash) {
        store.dispatch('application/setPendingTransactionHash', tx.hash)
      }

      return tx
        .wait()
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail:
              "Ticket batch successfully burnt, your address is now entitled to these physical units.",
            life: 3000,
          });
          refreshTicketDataIndex.value = refreshTicketDataIndex.value + 1;
          store.dispatch('application/closeModal')
        })
        .catch((e) => {
          let message = parseError(e.message);
          toast.add({
            severity: "error",
            summary: "Error",
            detail: `${message}`,
            life: 3000,
          });
          console.error(e);
          state.approving = false;
          store.dispatch('application/closeModal')
        });
    }

    const onClaim = async () => {
      console.log(provider.value);
      const temporaryProvider = new Web3Provider(provider.value);
      const gasPrice = await temporaryProvider.getGasPrice().catch(() => {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: `You may be out of ETH`,
          life: 3000,
        });
      });

      const claimContract = useClaimContract(claim.value.contract_address);
      const tx = await claimContract
        .claim({
          gasPrice: gasPrice.toString(),
          from: account.value,
        })
        .catch((e) => {
          let message = parseError(e.message);
          toast.add({
            severity: "error",
            summary: "Error",
            detail: message ? message : e.message,
            life: 3000,
          });
          return false;
        });

      if (!tx) {
        return;
      }

      return tx
        .wait()
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Success",
            detail:
              "Claim was successful. Please contact us if you do not receive your NFTs within 24 hours.",
            life: 3000,
          });
        })
        .catch((e) => {
          let message = parseError(e.message);
          toast.add({
            severity: "error",
            summary: "Error",
            detail: `${message}`,
            life: 3000,
          });
          console.error(e);
          state.approving = false;
        });
    };



    const onSubmit = form.handleSubmit(async (values) => {
      const msg = `I would like to save my shipping information for claim ${claim.value.id} associated with wallet address ${account.value.toLowerCase()}.`;
      const signer = useSigner();

      if (signer) {
        const sig = await signer.signMessage(msg).catch((e) => {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Message signing failed.",
            life: 3000,
          });
          // let msg = 'Error has occurred. Try again later.';
          // if (e.code === 4001) {
          //     msg = 'Request was rejected.';
          // }
          // ToastifyService.fail(msg);
          //this.submitting = false;
          return e;
        });

        ClaimsService.claimV3(claim.value.id, {
          ...values,
          sig,
          wallet_address: account.value,
        })
          .then(() => {
            let message =
              "Your artwork will be delivered within 4 - 6 weeks, keep in mind it may take longer due to COVID restrictions in certain countries";
            hasSubmittedShipping.value = true;
            toast.add({
              severity: "success",
              summary: "Success",
              detail: message,
              life: 10000,
            });
          })
          .catch((e) => {
              let message = e?.data?.message ? parseError(e?.data?.message) : e;
              if(!message) {
                message = "Could not submit your details. Please try to enter them later.";
              }
              toast.add({
                severity: "error",
                summary: "Error",
                detail: message,
                life: 10000,
              })
            }
          );
      } else {
        // toastr to login
      }
    });

    const isLoading = computed(() => state.loading);

    (async function loadClaim() {
      state.loading = true;
      const claimId = route.params["claimId"];

      const { data } = await ClaimsService.show(claimId);
      if (!data) {
        router.push({
          name: "home",
        });

        return;
      }

      if(data?.collectable) {
        collectableData.value = data?.collectable;
      }

      if(data?.collectable?.description) {
        description.value = data.collectable.description;
      }

      if (data.title) {
        title.value = data.title;
      } else if (data.collectable) {
        title.value = data.collectable.title;

        if(data.collectable.media) {
          const firstMedia = computed(() => { // Use preview image or first
              if (!data.collectable.media) return '';
              const found = data.collectable.media.find(v => v.is_preview);

              if (found) {
                  return found.url;
              }
              let orderedMedia = orderBy(data.collectable.media, 'position', "asc")
              return orderedMedia[0].url || '';
          });

          media.value = {
            url: firstMedia,
          }
        }

        if(data.collectable.artist) {
          let {
            slug,
            name,
            avatar
          } = data.collectable.artist;
          creatorInfo.value = {
            creatorAccount: false,
            creatorUsername: name,
            creatorSlug: slug,
            creatorProfilePicture: avatar,
            creatorType: 'artist',
          }
        }

        if(data.collectable.user) {
          let {
            username,
            wallet,
            avatar_image,
          } = data.collectable.user;
          creatorInfo.value = {
            creatorAccount: wallet,
            creatorUsername: username,
            creatorSlug: username,
            creatorProfilePicture: avatar_image,
            creatorType: 'user',
          }
        }

        if(data.collectable?.is_slug_full_route) {
          collectableLink.value = {
            name: data.collectable.slug
          };
        } else if(data.collectable?.version === 1 || data.collectable?.version === 2) {
          collectableLink.value = {
            name: 'collectableDropV2',
            params: {
              slug: data.collectable.slug
            }
          };
        } else if(data.collectable?.version === 3) {
          collectableLink.value = {
            name: 'collectableDropV3',
            params: {
              slug: data.collectable.slug
            }
          };
        }
      }

      state.loading = false;
      state.claimId = claimId;
      state.requiresMessage = data.requires_message;
      state.messageHelper = data.message_helper;
      claim.value = data;
    })();

    watchEffect(async () => {
      if(account?.value && collectableData?.value?.contract_address && collectableData.value.nft_token_id && collectableData?.value?.type === COLLECTABLE_TYPE.TANGIBLE_NFT && refreshTicketDataIndex.value) {
        // Cover sale scenarios
        if(collectableData.value.market_handler_type === MARKET_HANDLER_TYPES.SALE) {
          loadingTicketData.value = true;
          holdingTickets.value = [];
          claimedTickets.value = [];
          hasSubmittedShipping.value = false;
          // Check if shipping info has already been submitted
          let checkHasSubmittedShipping = await ClaimsService.claimCheckHasSubmittedShipping(state.claimId, account?.value);
          if(checkHasSubmittedShipping && checkHasSubmittedShipping.data) {
            hasSubmittedShipping.value = checkHasSubmittedShipping.data.hasSubmittedShipping ? true : false;
          }
          // event TicketIssued(uint256 ticketId, uint256 indexed consignmentId, address indexed buyer, uint256 amount);
          const marketConfigContract = await useV3MarketConfigContract();
          let ticketer = await marketConfigContract.getEscrowTicketer(collectableData.value.consignment_id);
          // Get all relevant tokens owned by account
          let result = await TokenCacheService.syncAndFetchTokenCacheByHolderOrClaimantWithConsignmentId({
            token_address: ticketer,
            holder_or_claimant_address: account.value,
            consignment_id: collectableData.value.consignment_id
          });
          let ticketBalance = 0;
          console.log({'result.data': result.data})
          if(result && result.data && result.data.holder) {
            for(let ticket of result.data.holder) {
              holdingTickets.value.push(ticket);
              ticketBalance += ticket.token_balance;
            }
          }
          holdingTicketCount.value = ticketBalance;

          let ticketsClaimedBalance = 0;
          if(result && result.data && result.data.claimant) {
            for(let ticket of result.data.claimant) {
              claimedTickets.value.push(ticket);
              ticketsClaimedBalance++;
            }
          }
          claimedTicketCount.value = ticketsClaimedBalance;

          console.log("Has claimed tickets:", ticketsClaimedBalance);
          // const ticketerContract = await useV3TicketerContract(false, ticketer);
          // // event TicketClaimed(uint256 ticketId, address indexed claimant, uint256 amount);
          // let filter = ticketerContract.filters.TicketClaimed(null, collectableData.value.consignment_id, account.value, null);
          // const claimedTickets = await ticketerContract.queryFilter(filter);
          // burntTicketCount.value = claimedTickets.length;
          if(ticketBalance > 0) {
            isCurrentAccountEntitledToPhysical.value = true;
          } else {
            isCurrentAccountEntitledToPhysical.value = false;
          }
          loadingTicketData.value = false;
        }
      }
    })

    return {
      title,
      description,
      claim,
      isLoading,
      onClaim,
      onSubmit,
      emailField,
      firstNameField,
      lastNameField,
      phoneField,
      telegramUsernameField,
      addressField,
      cityField,
      provinceField,
      zipField,
      countryField,
      countries,
      messageField,
      understandsClaimQuantityField,
      state,
      media,
      creatorInfo,
      collectableLink,
      claimedTicketCount,
      claimedTickets,
      holdingTicketCount,
      holdingTickets,
      burnTicketsHeld,
      displayTicketModal,
      loadingTicketData,
      hasSubmittedShipping,
    };
  },
};
</script>

<style lang="scss" scoped>
.description {
  p {
    margin-bottom: 1rem;
  }
  text-transform: none;
}
.media-container {
  max-width: 500px;
}
.burn-icon {
  width: 100%;
  padding: 30px;
  opacity: 0;
  transition: all 0.3s ease-in-out;
}
.burnable-ticket-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-color: #000000a8;
  &:hover {
    .burn-icon {
      transition: all 0.3s ease-in-out;
      opacity: 0.8;
    }
  }
}
.burnable-ticket-batch-outer {
  overflow: hidden;
  min-height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 100%;
  position: relative;
  background-size: contain;
}
.burnable-ticket-batch-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%)translateX(-50%);
  text-shadow: rgb(0, 0, 0) 0px 2px 6px;
  font-size: 30px;
  text-align: center;
}
.external-link {
  color: #1e90ff;
  font-weight: bold;
}
</style>
