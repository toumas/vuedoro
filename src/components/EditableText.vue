<template>
  <div>
    <form ref="form" v-if="editing" v-on:submit.prevent="update">
      <input
        class="bg-teal-900 border-solid border-b-2 border-red-900"
        type="text"
        ref="input"
        v-on:blur="update"
        v-model="newValue"
        required
      />
      <!-- submit is used to trigger native validation messages when input is blurred -->
      <input ref="submit" type="submit" />
    </form>
    <button v-else class="text-left font-semibold" v-on:click="edit">
      {{ value }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    value: String,
    onUpdate: Function,
    getInitialValue: {
      type: Function,
      default: function() {
        return this.value;
      }
    }
  },
  data() {
    return {
      editing: false,
      newValue: this.getInitialValue(this.value)
    };
  },
  methods: {
    edit() {
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    update() {
      if (!this.$refs.form.checkValidity()) {
        this.$refs.submit.click();
        return;
      }
      /* When form is submitted the input is blurred so with this if block we
       * prevent double update
       */
      if (this.editing) {
        this.editing = false;
        if (typeof this.id === "undefined") {
          this.onUpdate(this.newValue);
        } else {
          this.onUpdate(this.id, this.newValue);
        }
      }
    }
  }
};
</script>

<style>
input[type="submit"] {
  display: none;
}
</style>
