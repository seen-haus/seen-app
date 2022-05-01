<template>
  <container>
    <div class="loading-mask" v-if="!isLoading">
      <div v-if="media?.url" class="mt-12 mb-8 media-container">
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
      <div class="flex-center mb-8">
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
      <h3
        class="font-bold text-3xl text-black text-center block w-full cursor-pointer"
        @click="navigateToCollectable"
      >
        {{ title }}
      </h3>
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
              <label :style="{'display': 'inline-block', width: 'calc(100% - 30px)', 'padding-left': '10px'}">By ticking this checkbox, you acknowledge that this claim submission will be considered as a physical claim for all the units of this NFT that are owned by your Ethereum address (e.g. if your Ethereum address owns 2 copies of this NFT, and each is redeeemable for a physical item, this submission will be considered as a claim for 2 physical copies of this NFT to be sent to the address provided above).</label>
            </div>
            <span class="error-notice">{{ understandsClaimQuantityField.errors[0] }}</span>
          </div>

          <div class="flex items-center justify-center mb-4 mt-8">
            <button
              type="submit"
              class="cursor-pointer primary button mt-3 md:mt-0"
            >
              Submit
            </button>
          </div>
        </form></template
      >
    </div>
  </container>
</template>

<script>
import { Web3Provider } from "@ethersproject/providers";
import { computed, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import orderBy from "lodash/orderBy";

import Container from "@/components/Container.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue"
import UserOrArtistBadge from "@/components/PillsAndTags/UserOrArtistBadge.vue";

import { ClaimsService } from "@/services/apiService";

import useWeb3 from "@/connectors/hooks";
import useSigner from "@/hooks/useSigner";
import { useClaimContract } from "@/hooks/useContract";
import { useField, useForm } from "vee-validate";
import { useToast } from "primevue/usetoast";
import { useMeta } from "vue-meta";
import { countryList } from "@/connectors/constants";
import parseError from "@/services/utils/parseError";

export default {
  name: "Collectable",
  components: {
    Container,
    MediaLoader,
    UserOrArtistBadge,
  },
  setup() {
    // TODO:
    // 1. add Title column
    // 2. test wiring

    const toast = useToast();
    const route = useRoute();
    const router = useRouter();
    const claim = ref({});
    const title = ref("Claim");
    const media = ref(false);
    const creatorInfo = ref(false);
    const collectableLink = ref(false);
    const state = reactive({
      loading: true,
      contractAddress: null,
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
      const msg = `I would like to save my shipping information for wallet address ${account.value.toLowerCase()}.`;
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

        ClaimsService.claim(claim.value.collectable.contract_address, {
          ...values,
          sig,
          wallet_address: account.value,
        })
          .then(() => {
            let message =
              "Your artwork will be delivered within 3 - 4 weeks, keep in mind it may take longer due to COVID restrictions in certain countries";
            if(claim?.value?.collectable?.is_slug_full_route && claim?.value?.collectable?.slug) {
              router.push({
                name: claim?.value?.collectable?.slug,
              });
            } else {
              router.push({
                name: "collectableAuction",
                params: { slug: claim?.value?.collectable?.slug },
              });
            }
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
              if(message.indexOf('already submitted a claim') > -1) {
                if(claim?.value?.collectable?.is_slug_full_route && claim?.value?.collectable?.slug) {
                  router.push({
                    name: claim?.value?.collectable?.slug,
                  });
                } else {
                  router.push({
                    name: "collectableAuction",
                    params: { slug: claim?.value?.collectable?.slug },
                  });
                }
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
      const contractAddress = route.params["contractAddress"];

      const { data } = await ClaimsService.show(contractAddress);
      if (!data) {
        router.push({
          name: "home",
        });

        return;
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
            avatar_image,
          } = data.collectable.user;
          creatorInfo.value = {
            creatorAccount: false,
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
      state.contractAddress = contractAddress;
      state.requiresMessage = data.requires_message;
      state.messageHelper = data.message_helper;
      claim.value = data;
    })();

    return {
      title,
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
    };
  },
};
</script>

<style lang="scss" scoped>
.description {
  p {
    margin-bottom: 1rem;
  }
}
.media-container {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
</style>
