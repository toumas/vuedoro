<template>
  <div id="app">
    <Entry
      v-for="entry in entries"
      v-bind:key="entry.id"
      v-bind:id="entry.id"
      v-bind:value="entry.title"
      v-bind:onUpdate="onUpdate"
      v-bind:active="entry.id === activeEntry"
      v-bind:onToggleTimer="onToggleTimer"
      v-bind:config="config"
      v-bind:deleteEntry="deleteEntry"
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
import saveState from "vue-save-state";
import { uuidv4 } from "./uuid";
import EditableText from "./components/EditableText.vue";
import Entry from "./components/Entry.vue";

export default {
  name: "App",
  components: {
    EditableText,
    Entry
  },
  mixins: [saveState],
  data() {
    return {
      entries: {},
      activeEntry: "",
      config: {
        working: 25,
        break: 5,
        bigBreak: 15,
        sessionsBeforeBigBreak: 4
      }
    };
  },
  methods: {
    getSaveStateConfig() {
      return {
        cacheKey: "Vuedoro"
      };
    },
    getInitialValue() {
      return "";
    },
    addNewEntry(_id, title) {
      const id = uuidv4();
      this.entries = { ...this.entries, [id]: { id, title } };
    },
    deleteEntry(id) {
      const result = confirm(
        `Are you sure you want to delete ${this.entries[id].title}?`
      );
      if (result) {
        const copy = Object.assign({}, { ...this.entries });
        delete copy[id];
        localStorage.removeItem(id);
        this.entries = copy;
      }
    },
    onUpdate(id, newValue) {
      this.entries[id].title = newValue;
    },
    onToggleTimer(id, running) {
      if (running) {
        this.activeEntry = id;
      } else {
        this.activeEntry = "";
      }
    }
  }
};
</script>

<style></style>
