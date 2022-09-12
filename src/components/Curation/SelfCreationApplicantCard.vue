<template>
  <Dialog header="Cast Your Vote" v-model:visible="displayModal" :style="{maxWidth: '32rem', width: '100%'}" :modal="true" :closable="true">
    <div style="position: relative">
      <div v-if="!userVotingPower" style="display: flex; justify-content: center">
        <ProgressSpinner />
      </div>
      <div v-else class="">
        <div class="vote-container">
            <div class="vote-item-outer">
                <div class="vote-item-inner py-4">
                  <sub-title
                      class="hidden lg:flex"
                      text-align="center"
                      font-size="14px"
                  >
                    Total Voting Power
                  </sub-title>
                  <sub-title
                      class="disable-text-transform light-mode-text-washed property-value-text hidden lg:flex mt-1"
                      text-align="center"
                      font-size="18px"
                      font-weight="300"
                  >
                    {{userVotingPower.total_voting_power}}
                  </sub-title>
                </div>
            </div>
            <div class="vote-item-outer">
              <div class="vote-item-inner py-4">
                <sub-title
                    class="hidden lg:flex"
                    text-align="center"
                    font-size="14px"
                >
                  Allocated Voting Power
                </sub-title>
                <sub-title
                    class="disable-text-transform light-mode-text-washed property-value-text hidden lg:flex mt-1"
                    text-align="center"
                    font-size="18px"
                    font-weight="300"
                >
                  {{userVotingPower.allocated_voting_power}}
                </sub-title>
              </div>
            </div>
            <div class="vote-item-outer">
              <div class="vote-item-inner py-4">
                <sub-title
                    class="hidden lg:flex"
                    text-align="center"
                    font-size="14px"
                >
                  Unallocated Voting Power
                </sub-title>
                <sub-title
                    class="disable-text-transform light-mode-text-washed property-value-text hidden lg:flex mt-1"
                    text-align="center"
                    font-size="18px"
                    font-weight="300"
                >
                  {{userVotingPower.unallocated_voting_power}}
                </sub-title>
              </div>
            </div>
        </div>
        <div class="vote-slider-container">
          <label for="winner-state" class="mt-4">{{userExistingVote ? `Reallocate Voting Power` : `Allocate Voting Power`}}</label>
          <input
              type="number"
              id="units"
              @wheel="$event.target.blur()"
              class="w-full outlined-input mt-1"
              placeholder="How much of your voting power would you like to use?"
              :class="votePowerField.errors[0] && 'invalid-outline'"
              v-model="votePowerField.value"
          />
          <span v-if="votePowerField.errors[0]" class="error-notice mb-4">{{ votePowerField.errors[0]}}</span>
          <span v-if="!votePowerField.errors[0]" class="input-helper mb-4 flex-space-between">{{`A minimum of zero, up to ${maxAllocation}`}}<div><span @click="votePowerField.value = 0" style="cursor:pointer" class="green-link">MIN</span> | <span @click="votePowerField.value = maxAllocation" style="cursor:pointer" class="green-link">MAX</span></div></span>
          <div class="selection-container mb-6">
            <div class="selection-option-wrapper" :class="selectedVoteType === 'yes' ? 'active-selection-option-yes' : 'inactive-selection-option'">
                <div
                    class="selection-option cursor-pointer"
                    @click="selectedVoteType = 'yes'"
                >
                    <div class="selection-option-text-container">
                        <sub-title
                            class="text-black hidden uppercase lg:flex"
                            text-align="center"
                            font-size="15px"
                        >
                            Yes
                        </sub-title>
                    </div>
                </div>
            </div>
            <div class="selection-option-wrapper" :class="selectedVoteType === 'no' ? 'active-selection-option-no' : 'inactive-selection-option'">
                <div 
                    class="selection-option cursor-pointer"
                    @click="selectedVoteType = 'no'"
                >
                    <div class="selection-option-text-container">
                        <sub-title
                            class="text-black hidden uppercase lg:flex"
                            text-align="center"
                            font-size="15px"
                        >
                            No
                        </sub-title>
                    </div>
                </div>
            </div>
          </div>
          <button v-if="isVotingClosed" class="button primary mt-1 disabled opacity-50 w-full">
            <span>Voting Closed</span>
          </button>
          <button v-else-if="isVotingOpeningSoon" class="button primary mt-1 disabled opacity-50 w-full">
            <span>Voting Opening Soon</span>
          </button>
          <button
            v-else
            @click="castVote"
            :class="
              (
                (userExistingVote?.id && 
                  (
                    (selectedVoteTypeSaved === selectedVoteType) 
                    && (selectedVoteTypeSaved !== null)
                  ) 
                  && 
                  (
                    (
                      Number(votePowerField.value) === Number(userExistingVote.yes) 
                      && (userExistingVote.yes > 0)
                    )
                    || 
                    (
                      Number(votePowerField.value) === Number(userExistingVote.no) && (userExistingVote.no > 0)
                    )
                  )
                )
                || (votePowerField.errors.length > 0)
                || (!votePowerField.meta.valid)
                || (['yes', 'no'].indexOf(selectedVoteType) === -1)
              )
              && 'disabled opacity-50'"
            class="button primary mt-4 w-full"
          >
            <span>{{userExistingVote ? `Modify Vote` : `Cast Vote`}}</span>
          </button>
        </div>
      </div>
    </div>
  </Dialog>
  <div 
      class="drop-card-container-border" 
      :class="{
        'auto-margins': autoMargins,
      }"
  >
    <div class="drop-card-preview-container">
      <div class="drop-card-inner-padding-top">
        <div class="drop-card-media-container flex-center placeholder-light-grey">
            <img v-if="!applicant.previewImage && !tempProfileImages[applicant.id]" src="@/assets/icons/media-icon.svg" style="opacity: 0.6" alt="Media Icon">
            <media-loader
                :key="applicant.previewImage ? applicant.previewImage : tempProfileImages[applicant.id]"
                v-if="applicant.previewImage || tempProfileImages[applicant.id]"
                :src="applicant.previewImage ? applicant.previewImage : tempProfileImages[applicant.id]"
                ignoreAspectRatioPadding
                muted
                loop
                autoplay
                maxWidthAndHeight
                fillHeight
                fillWidthAndHeight
            />
        </div>
        <div class="drop-card-middle">
          <div class="drop-card-title mt-3 mb-3">
              <div v-if="!applicant.name" class="title-placeholder-container mt-4">
                  <div class="placeholder-light-grey text-placeholder"></div>
              </div>
              <sub-title
                  v-if="applicant.name"
                  class="text-black hidden lg:flex"
                  text-align="left"
                  font-size="24px"
                  line-height="30px"
                  :overflowEllipsis="true"
              >
                  {{applicant.name}}
              </sub-title>
              <div v-if="applicantSocials">
                <SocialLineFaultTolerant
                  class="my-1"
                  :isVertical="false"
                  :iconOnly="true"
                  v-for="social in applicantSocials"
                  :social="social"
                  :key="social?.url"
                />
              </div>
              <div v-else>User has no socials yet</div>
          </div>
        </div>
        <div 
          class="divider-line-active mt-3 bg-black"
        >
          <div class="bg-progress-bar-red-vibrant mini-progress-bar" :style="`width:${noPercentage}%`"/>
          <div class="bg-progress-bar-green-vibrant mini-progress-bar" :style="`width:${yesPercentage}%`"/>
        </div>
        <div class="drop-card-inner-padding-bottom pt-3 bg-black">
          <div class="flex-space-between">
            <div>
              <div class="mr-6">
                <light-typography 
                    textAlign="left"
                    fontSize="14px"
                    fontWeight="700"
                    lineHeight="16px"
                    paddingBottom="6px"
                    :upperCase="true"
                >
                  VOTES <span style="color: #3fff00">YES</span>
                </light-typography>
                <sub-title
                    class="lg:flex text-white"
                    text-align="left"
                    fontSize="24px"
                    line-height="30px"
                    :overflowEllipsis="true"
                >
                  {{yesVotes}}
                </sub-title>
              </div>
            </div>
            <div>
              <div>
                <light-typography 
                    textAlign="right"
                    fontSize="14px"
                    fontWeight="700"
                    lineHeight="16px"
                    paddingBottom="6px"
                    :upperCase="true"
                >
                  VOTES <span style="color: red">NO</span>
                </light-typography>
                <sub-title
                    class="lg:flex text-white"
                    text-align="right"
                    fontSize="24px"
                    line-height="30px"
                    :overflowEllipsis="true"
                >
                  {{noVotes}}
                </sub-title>
              </div>
            </div>
          </div>
          <button
            v-if="!account"
            class="cursor-pointer mt-1 button primary w-full flex-shrink-0"
            @click="openWalletModal"
          >
            <i class="fas fa-wallet mr-2 transform rotate-12"></i> Connect wallet
          </button>
          <button v-else @click="displayModal = true" class="button primary mt-1 w-full">
            <span>{{isVotingClosed ? `Voting Closed` : `Vote`}}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { ref, reactive, watchEffect, watch, computed } from "vue";
import {useField} from "vee-validate";
import {useStore} from "vuex";
import { useToast } from "primevue/usetoast";
import axios from "axios";

import useWeb3 from "@/connectors/hooks";

import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import SocialLineFaultTolerant from "@/components/PillsAndTags/SocialLineFaultTolerant.vue";
import { CurationService } from "@/services/apiService"

import useUserVotingPower from "@/hooks/useUserVotingPower";
import useUserExistingVote from "@/hooks/useUserExistingVote";
import useSigner from "@/hooks/useSigner";
import useApplicantVoteOverview from "@/hooks/useApplicantVoteOverview";

export default {
    name: "DropCardPreview",
    props: {
      autoMargins: Boolean,
      mediaUrl: String,
      titleText: String,
      applicant: Object,
      roundDeclarationId: Number,
      votingClosed: Boolean,
      votingState: String
    },
    components: {
      SubTitle,
      MediaLoader,
      LightTypography,
      SocialLineFaultTolerant,
    },
    setup(props) {

      const store = useStore();
      const toast = useToast();

      const maxAllocation = ref(false);

      const openWalletModal = () => {
        store.dispatch('application/openModal', 'WalletModalConnectOnly')
      };

      const isVotingClosed = ref(false);
      const isVotingOpeningSoon = ref(false);

      const fieldValidatorVotingPower = (value) => {
        console.log({value})
        if (value !== undefined && value !== '' && userVotingPower.value) {
          if((value % 1) > 0) {
            return 'Integers only';
          }
          if(value < 0) {
            let minVote = userVotingPower.value.unallocated_voting_power * -1;
            if(value < minVote) {
              return 'Insufficient unallocated voting power';
            }
          } else {
            let maxVote = Number(userVotingPower.value.unallocated_voting_power);
            console.log('userExistingVote?.value?.data?.id', userExistingVote?.value?.id)
            if(userExistingVote?.value?.id) {
              if(userExistingVote?.value?.yes) {
                maxVote += userExistingVote?.value?.yes;
              } else if (userExistingVote?.value?.no) {
                maxVote += userExistingVote?.value?.no;
              }
            }
            if(value > maxVote) {
              return 'Insufficient unallocated voting power';
            }
          }
          return true;
        } else {
          return 'Required';
        }
      }

      const votePowerField = reactive(useField("voting-power", (val) => fieldValidatorVotingPower(val)));
      
      const selectedVoteType = ref(null);
      const selectedVoteTypeSaved = ref(null);

      const { userVotingPower, loadUserVotingPower } = useUserVotingPower();
      const { userExistingVote, loadUserExistingVote } = useUserExistingVote('self_minting_applicants', props.applicant.id, props.roundDeclarationId);
      const { applicantVoteOverview, loadApplicantVoteOverview } = useApplicantVoteOverview('self_minting_applicants', props.applicant.id, props.roundDeclarationId);

      const displayModal = ref(false);
      const isLoading = ref(false);

      watchEffect(async () => {
        console.log("Reloading voting power");
        if(displayModal.value === true) {
          loadApplicantVoteOverview();
          loadUserVotingPower();
          loadUserExistingVote();
        } else {
          // Reset input fields
          // selectedVoteType.value = null;
          // votePowerField.value = null;
        }
      })

      watchEffect(() => {
        let setMaxAllocation = 0;
        if(userExistingVote?.value?.id && userVotingPower?.value?.unallocated_voting_power) {
          if(userExistingVote?.value?.yes) {
            setMaxAllocation = Number(userVotingPower?.value?.unallocated_voting_power) + Number(userExistingVote?.value?.yes);
          } else if (userExistingVote?.value?.no) {
            setMaxAllocation = Number(userVotingPower?.value?.unallocated_voting_power) + Number(userExistingVote?.value?.no);
          } else {
            setMaxAllocation = Number(userVotingPower?.value?.unallocated_voting_power);
          }
        } else if (userVotingPower?.value?.unallocated_voting_power) {
          setMaxAllocation = Number(userVotingPower?.value?.unallocated_voting_power);
        }
        maxAllocation.value = setMaxAllocation;
      });

      watchEffect(() => {
        if(props.votingClosed) {
          isVotingClosed.value = true;
        } else {
          isVotingClosed.value = false;
        }
      })

      watchEffect(() => {
        if(props.votingState === 'WAITING') {
          isVotingOpeningSoon.value = true;
        } else {
          isVotingOpeningSoon.value = false;
        }
      })

      const {account} = useWeb3();

      const applicantSocials = computed(
        () => {
          let socials = [];
          let entries = Object.entries(props.applicant.socials);
          for(let [network, username] of entries) {
            let social = {};
            social['type'] = network;
            social['handle'] = username;
            socials.push(social)
          }
          return socials;
        }
      );

      const tempProfileImages = {
        1:'https://pbs.twimg.com/media/FURHMLOXsAI-SYt?format=jpg&name=small',
        2:'https://miro.medium.com/max/369/1*22Z9sG04XwyXctB2yHvOtg.png',
        3:'https://pbs.twimg.com/media/FX6rSh_WQAEeT8F?format=png&name=small',
        4:'https://wgmis.mypinata.cloud/ipfs/QmYzoDjM3EDGz6VoQwJLmQEfBFxQkrBFeTNnsw2tzuLjBt/8888.gif',
        5:'',
        6:'https://pbs.twimg.com/profile_banners/1498777857761452032/1647704311/1500x500',
        7:'https://lh3.googleusercontent.com/d2CdFkFp9hSviR_7Bk_P_zKhrWTJs7lnZIbb3G9Ty3NvypCcdhXQqk7EXKgZLm1Rc5uwum0OzmAas-lDQjyVgSI5ZIXgGhk7yWqXLw=h600',
        8:'https://pbs.twimg.com/profile_banners/1368077535032999943/1657340017/1500x500',
        9:'https://lh3.googleusercontent.com/ZOHoZY48rONLv24P4Ls-tpRBMwXuLjI1rWrIq0TL6bex3Sa2g50Be0s7znkavTlTkdMg1yh2Dr4kY2DYzNFzoS3S0n73uwWaBujcf30=s0',
        10:'https://pbs.twimg.com/profile_banners/15414239/1659044636/1500x500',
        11:'https://pbs.twimg.com/profile_banners/1009087669928906756/1658035180/1500x500',
        12:'https://lh3.googleusercontent.com/-JE0FSzvxgy2dKwsmDMGZJKJLh5GSrtVGlbOwW7kr7GVk4Ju0JW6AU6FnotmolUEqQxNc8AJIc6tn7IE1UniNVZmiO007_KSOjJVYQ=w400',
        13:'https://pbs.twimg.com/profile_banners/1454968604961787904/1652709159/1500x500',
        14:'https://seenhaus.mypinata.cloud/ipfs/QmVWGqrgrHPb76eXsFKUbHQA9U3v8FS3VYXSQRDssnTRK4',
        15:'',
        16:'https://pbs.twimg.com/media/FTOG0WFVUAAjx-c?format=jpg&name=large',
        17:'https://seenhaus.mypinata.cloud/ipfs/QmRGd2d1VmRt8s7xi97S9Xpo1QvpSsiKH6xDaDH4vyK3Wi',
        18:'https://pbs.twimg.com/media/FZFyTrqUUAAZJCb?format=jpg&name=medium',
        19:'https://pbs.twimg.com/media/FZq3kIRWYAMxejW?format=jpg&name=large',
        20:'https://pbs.twimg.com/profile_banners/2685357499/1616977947/1500x500',
        21:'',
        22:'',
        23: 'https://seenhaus.mypinata.cloud/ipfs/QmeCakj5pFnoWpKp4msA2Qd9eb8XgTEAyK2FuXodroRMV1',
        24: 'https://seenhaus.mypinata.cloud/ipfs/QmXjsX8tJ3JK7gF1r5qGB8Z6MFyXWvtLQdtZez7vE64qNf'
      }

      const castVote = async () => {
        const signer = useSigner();
        const msg = `{"reason":"Cast minting curation vote", "vote power":"${votePowerField.value}", "vote type":"${selectedVoteType.value}", "applicant ID": ${props.applicant.id}, "round declaration ID": ${props.roundDeclarationId}, "account":"${account.value}", "timestamp":${Math.floor(new Date().getTime() / 1000)}}`

        if (signer) {
            const signature = await signer
            .signMessage(msg)
            .catch((e) => {
                toast.add({severity:'error', summary:'Error', detail:'Message signing failed.', life: 3000});
                return e;
            });

            console.log({signature})

            CurationService.castCurationVote({signature, msg})
              .then(res => {
                displayModal.value = false;
                console.log({res})
                toast.add({severity:'info', summary:'Success', detail:'Vote cast successfully.', life: 5000});
                loadApplicantVoteOverview();
              })
              .catch(e => {
                console.error(e)
                displayModal.value = false;
                toast.add({severity:'error', summary:'Error', detail:`Failed to cast vote ${e.data.message && `(${e.data.message})`}`, life: 5000});
              });

        }
      }

      const yesVotes = ref((props.applicant.curation_round_overview && props.applicant.curation_round_overview.total_yes) ? props.applicant.curation_round_overview.total_yes : 0);
      const noVotes = ref((props.applicant.curation_round_overview && props.applicant.curation_round_overview.total_no) ? props.applicant.curation_round_overview.total_no : 0);

      const yesPercentage = ref(0);
      const noPercentage = ref(0);

      watch(userExistingVote, () => {
        votePowerField.value = userExistingVote?.value?.yes || userExistingVote?.value?.no;
        if(userExistingVote?.value?.yes || userExistingVote?.value?.no) {
          selectedVoteTypeSaved.value = (userExistingVote?.value?.yes > 0) ? 'yes' : 'no';
          selectedVoteType.value = (userExistingVote?.value?.yes > 0) ? 'yes' : 'no';
        }
      })

      watchEffect(() => {
        console.log("Updating vote values", props.applicant, applicantVoteOverview);
        if(applicantVoteOverview && applicantVoteOverview.value) {
          yesVotes.value = applicantVoteOverview.value.total_yes;
          noVotes.value = applicantVoteOverview.value.total_no;
        }
        let totalVotes = yesVotes.value + noVotes.value;
        let percentageYes = (yesVotes.value > 0) ? ((yesVotes.value * 100) / totalVotes) : 0;
        let percentageNo = (noVotes.value > 0) ? (100 - percentageYes) : 0;
        yesPercentage.value = percentageYes;
        noPercentage.value = percentageNo;
      })

      return {
        tempProfileImages,
        applicantSocials,
        openWalletModal,
        // openVotingModal,
        account,
        displayModal,
        isLoading,
        userVotingPower,
        votePowerField,
        castVote,
        userExistingVote,
        maxAllocation,
        yesPercentage,
        noPercentage,
        yesVotes,
        noVotes,
        selectedVoteType,
        selectedVoteTypeSaved,
        isVotingClosed,
        isVotingOpeningSoon,
      }
    }
};
</script>

<style lang="scss" scoped>
    .drop-card-container-border {
        // This class is just here for if we ever want to add a border that can support gradients
        height: 415px;
        width: 100%;
        background: #FFFFFF;
        box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.4);
        border-radius: 10px;
        position: relative;
        transition: all 0.2s ease-out;
        cursor: pointer;
        &:hover {
            box-shadow: 0px 6px 30px rgba(142, 152, 160, 0.6);
            transform: translateY(-2px);
        }
        &:active {
            box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.3);
            transform: translateY(2px);
        }
    }
    .drop-card-preview-container {
        height: 415px;
        width: 100%;
        background: #FFFFFF;
        border-radius: 10px;
        overflow: hidden;
    }
    .creation-step-sticky {
        position: sticky;
        top: 20px;
    }
    .drop-card-inner-padding-top {
        max-width: 100%;
        padding-bottom: 0px;
    }
    .drop-card-middle {
        padding-left: 14px;
        padding-right: 14px;
    }
    .drop-card-inner-padding-bottom {
        padding: 14px;
    }
    .drop-card-media-container {
        width: 100%;
        height: 200px;
        border-radius: 6px;
        position: relative;
    }
    .text-placeholder {
        width: 100%;
        height: 100%;
        border-radius: 15px;
    }
    .title-placeholder-container {
        width: 215px;
        height: 30px;
        padding-bottom: 6px;
    }
    .price-helper-placeholder-container {
        width: 90px;
        height: 22px;
        padding-bottom: 6px;
    }
    .price-placeholder-container {
        width: 90px;
        height: 28px;
    }
    .timer-helper-placeholder-container {
        width: 120px;
        height: 22px;
        padding-bottom: 6px;
    }
    .timer-placeholder-container {
        width: 120px;
        height: 28px;
    }
    .drop-card-artist {
        display: flex;
    }
    .artist-pic-placeholder {
        width: 32px;
        height: 32px;
        border-radius: 32px;
    }
    .artist-name-placeholder {
        width: 100px;
        height: 24px;
        border-radius: 10px;
    }
    .artist-avatar {
        width: 34px;
        height: 34px;
        border-radius: 2rem;
        background-size: cover;
    }
    .tangibility-container {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
    }
    .tag-container {
        position: absolute;
        bottom: 10px;
        left: 10px;
        display: flex;
    }
    .status-container {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
    }
    .divider-line-inactive {
        width: 100%;
        height: 2px;
        background-color: #DFE4E9;
    }
    .divider-line-awaiting-reserve {
        width: 100%;
        height: 3px;
    }
    .divider-line-active {
        height: 3px;
    }
    .mini-progress-bar {
        height: 100%;
        float: right;
        transition: all 0.2s ease-out;
    }
    .vote-slider-container {
      margin-left: 5px;
      margin-right: 5px;
      margin-top: 15px;
    }
    .selection-container {
        display: flex;
        justify-content: space-between;
    }
    .selection-option-wrapper {
        width: calc(50% - 8px);
    }
    .section-description {
        display: flex;
        max-width: 600px;
    }
    .selection-option {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        padding-top: 15px;
        padding-bottom: 15px;
        border-radius: 8px;
        box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.2);
        background-color: white;
    }
    .selection-option-text-container {
        max-width: calc(100% - 88px);
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .active-selection-option-yes {
        background: linear-gradient(to right, #11998E, #38EF7D);
        border-radius: 10px;
        padding: 2px;
        .selection-option {
            background: #eafbf3;
        }
    }
    .active-selection-option-no {
        background: linear-gradient(to right, #991111, #ef3838);
        border-radius: 10px;
        padding: 2px;
        .selection-option {
            background: #fbeaea;
        }
    }
    .inactive-selection-option {
        background-color: white;
        border-radius: 10px;
        padding: 2px;
    }
</style>
