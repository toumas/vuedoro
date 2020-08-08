<template>
  <div>
    <div
      class="grid grid-cols-8 grid-rows-3 grid-flow-row items-center md:grid-rows-1 md:grid-cols-12 md:items-start"
    >
      <EditableText
        class="col-span-8 md:col-span-3"
        v-bind:id="id"
        v-bind:value="value"
        v-bind:getInitialValue="getInitialValue"
        v-bind:onUpdate="onUpdate"
        v-bind:key="Date.now()"
      />
      <button
        class="toggle text-left row-start-2 col-span-2 md:col-span-1 md:row-start-auto md:text-center"
        v-on:click="activate"
      >
        {{ this.active ? "deactivate" : "activate" }}
      </button>
      <span
        class="break-all row-start-3 col-span-3 md:row-start-auto md:col-span-2"
        >Total: {{ timeSpent | time(timeSpent, true) }}</span
      >
      <button
        class="row-start-3 md:row-start-auto"
        v-on:click="deleteEntry(id)"
      >
        &#x1F5D1;
      </button>
    </div>
  </div>
</template>

<script>
import saveState from "vue-save-state";
import EditableText from "./EditableText.vue";

export default {
  components: {
    EditableText
  },
  mixins: [saveState],
  props: {
    active: Boolean,
    deleteEntry: Function,
    getInitialValue: { default: () => {}, type: Function },
    id: String,
    onActivate: Function,
    onUpdate: Function,
    timeSpent: Number,
    value: String
  },
  methods: {
    activate() {
      this.onActivate(this.id);
    },
    getSaveStateConfig() {
      return {
        cacheKey: this.id
      };
    }
  }
};
</script>
