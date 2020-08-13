<template>
  <div>
    <div class="custom-grid grid-rows-2 grid-cols-3 col-gap-2 md:grid-rows-1">
      <div>
        <input
          class=""
          type="checkbox"
          v-bind:checked="active"
          v-on:click="activate"
        />
      </div>
      <EditableText
        class=""
        v-bind:id="id"
        v-bind:value="value"
        v-bind:getInitialValue="getInitialValue"
        v-bind:onUpdate="onUpdate"
        v-bind:key="Date.now()"
      />
      <span
        class="text-left row-start-2 col-start-2 md:row-start-1 md:col-start-3"
        >{{ timeSpent | time(timeSpent, true) }}</span
      >
      <button class="text-right md:col-start-4" v-on:click="deleteEntry(id)">
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

<style>
.custom-grid {
  display: grid;
  grid-template-columns: 16px 1fr 30px;
}
@screen md {
  .custom-grid {
    grid-template-columns: 16px 100fr 1fr 30px;
  }
}
</style>
