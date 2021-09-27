<template>
  <div class="spotlight">
    <container class="py-6 mb-52">
      <fenced-title
        class="flex-grow mr-0 mb-2 self-stretch"
        color="fence-gray"
        textAlign="center"
        :closed="true"
        >Spotlight</fenced-title
      >

      <div class="description text-gray-600 mx-auto text-center py-4 text-lg">
        Seen.haus is always looking for new creative talent and collectible
        gems. So if you’re an established artist, emerging artist or you’re in
        possession of a rare collectible item that you’d like to auction on our
        platform then we’d love to hear from you.
      </div>
    </container>

    <div class="pb-28">
      <container class="py-6">
        <div
          class="submission-form bg-white rounded-lg shadow-lifted overflow-hidden px-8 lg:px-14 py-12 mx-auto"
        >
          <div class="text-4xl font-title font-bold mb-4 text-center">
            Submission Form
          </div>

          <div class="text-md text-gray-500 text-center">
            Please fill in the submission form below and one of our team will be
            in contact with you at the earliest convenience.
            <span class="text-primary">#beseen</span>
          </div>

          <div class="divider h-0 border-t-2 border-gray-200 my-9"></div>

          <form ref="form" :class="{ dirty: wasTouched }">
            <div class="flex flex-col lg:flex-row">
              <div class="input-group mr-0 mb-8 lg:mr-5">
                <label>Your Name</label>
                <input
                  v-model.trim="name"
                  type="text"
                  class="outlined-input"
                  placeholder="John Doe"
                  required
                />
                <div class="validation-error text-sm text-red-700 mt-1">
                  This field is required
                </div>
              </div>

              <div class="input-group mb-8">
                <label>Your email</label>
                <input
                  v-model.trim="email"
                  type="email"
                  class="outlined-input"
                  placeholder="john@doe.com"
                  required
                />
                <div class="validation-error text-sm text-red-700 mt-1">
                  Enter a valid email
                </div>
              </div>
            </div>

            <div class="input-group mb-8">
              <label>Tell us something about yourself</label>
              <textarea
                minlength="20"
                v-model.trim="yourself"
                class="outlined-input"
                placeholder="Who your are, what you do, etc."
                required
              ></textarea>
              <div class="validation-error text-sm text-red-700 mt-1">
                This field must be at least 20 characters long
              </div>
            </div>

            <div class="input-group mb-8">
              <label>Show us your work</label>
              <textarea
                minlength="20"
                v-model.trim="work"
                class="outlined-input"
                placeholder="Links to your portfolio"
                required
              ></textarea>
              <div class="validation-error text-sm text-red-700 mt-1">
                This field must be at least 20 characters long
              </div>
            </div>

            <div class="input-group mb-8">
              <label>LINKs to your social networks</label>
              <textarea
                minlength="20"
                v-model.trim="links"
                class="outlined-input"
                placeholder="Don’t be shy!"
                required
              ></textarea>
              <div class="validation-error text-sm text-red-700 mt-1">
                This field must be at least 20 characters long
              </div>
            </div>
          </form>

          <div v-if="success === false" class="text-red-700 text-center">
            There was an error submitting Your information. Please check your
            fields and try again.
          </div>
          <div v-if="success === true" class="text-green-700 text-center">
            We have received your information. Thank You!
          </div>

          <button
            class="button primary mb-4 mt-12 mx-auto w-full"
            @click="submitForm"
          >
            Submit Form
          </button>
        </div>
      </container>
    </div>
  </div>
</template>

<script>
import { useMeta } from "vue-meta";

import FencedTitle from "@/components/FencedTitle.vue";
import Container from "@/components/Container.vue";

import { SpotlightService } from "@/services/apiService";

export default {
  name: "Spotlight",
  components: { FencedTitle, Container },
  setup() {
    const { meta } = useMeta({
      title: "Spotlight",
    });
  },
  data() {
    return {
      name: "",
      email: "",
      yourself: "",
      work: "",
      links: "",
      wasTouched: false,
      submitting: false,
      success: null,
    };
  },
  methods: {
    resetForm() {
      this.wasTouched = false;
      this.$refs.form.reset();

      this.name = "";
      this.email = "";
      this.yourself = "";
      this.work = "";
      this.links = "";
    },
    submitForm: async function () {
      if (this.submitting) return;

      this.wasTouched = true;
      if (!this.$refs.form.checkValidity()) return;

      this.submitting = true;

      try {
        await SpotlightService.submit({
          name: this.name,
          email: this.email,
          info: this.yourself,
          work: this.work,
          socials: this.links,
        });

        this.resetForm();
        this.success = true;
      } catch (e) {
        this.success = false;
      }

      this.submitting = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.submission-form {
  margin-top: -228px;
}

@screen lg {
  .description {
    max-width: 880px;
  }

  .submission-form {
    max-width: 880px;
  }
}

input, textarea {
  box-shadow: none !important;
  &:focus {
    outline: none !important;
  }
  &::-moz-focus-inner {
    outline: none
  }
}
</style>
