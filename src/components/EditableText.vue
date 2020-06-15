<template>
  <div>
    <form v-if="editing" v-on:submit.prevent="update">
      <input type="text" ref="input" v-on:blur="update" v-model="newValue" required/>
    </form>
    <button v-else v-on:click="edit">{{value}}</button>
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
      /* When form is submitted the input is blurred so with this if block we
       * prevent double update
       */
      if (this.editing) {
        this.editing = false;
        this.onUpdate(this.id, this.newValue);
      }
    }
  }
};
</script>

<style>
</style>
