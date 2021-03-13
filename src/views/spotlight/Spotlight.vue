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

    <div class="bg-background-gray border-t pb-28">
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

          <form>
            <div class="flex flex-col lg:flex-row">
              <div class="input-group mr-0 mb-8 lg:mr-5">
                <label>Your Name</label>
                <input
                  type="text"
                  class="outlined-input"
                  placeholder="placeholder text"
                />
              </div>

              <div class="input-group mb-8">
                <label>Your email</label>
                <input
                  type="text"
                  class="outlined-input"
                  placeholder="placeholder text"
                />
              </div>
            </div>

            <div class="input-group mb-8">
              <label>Tell us something about yourself</label>
              <textarea
                class="outlined-input"
                placeholder="placeholder text"
              ></textarea>
            </div>

            <div class="input-group mb-8">
              <label>Show us your work</label>
              <textarea
                class="outlined-input"
                placeholder="placeholder text"
              ></textarea>
            </div>

            <div class="input-group mb-8">
              <label>LINKs to your social networks</label>
              <textarea
                class="outlined-input"
                placeholder="placeholder text"
              ></textarea>
            </div>
          </form>

          <button class="button primary mb-4 mt-12 mx-auto w-full">
            Submit Form
          </button>
        </div>
      </container>
    </div>
  </div>
</template>

<script>
import FencedTitle from "@/components/FencedTitle.vue";
import Container from "@/components/Container.vue";

export default {
  name: "Spotlight",
  components: { FencedTitle, Container },
};
</script>

<style scoped>
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
</style>