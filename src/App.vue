<template>
  <div id="app">
    <Entry
      v-for="entry in entries"
      v-bind:key="entry.id"
      v-bind:id="entry.id"
      v-bind:value="entry.title"
      v-bind:onUpdate="onUpdate"
    />
    <EditableText
      value="Click here to add new entry"
      v-bind:getInitialValue="getInitialValue"
      v-bind:onUpdate="addNewEntry"
      v-bind:key="Date.now()"
    />
  </div>
</template>

<script>
import { uuidv4 } from "./uuid";
import EditableText from "./components/EditableText.vue";
import Entry from "./components/Entry.vue";

export default {
  name: "App",
  components: {
    EditableText,
    Entry,
  },
  data() {
    return { entries: {} };
  },
  methods: {
    getInitialValue() {
      return "";
    },
    addNewEntry(_id, title) {
      const id = uuidv4();
      this.entries = { ...this.entries, [id]: { id, title } };
    },
    onUpdate(id, newValue) {
      this.entries[id].title = newValue;
    }
  }
};
</script>

<style>
</style>
