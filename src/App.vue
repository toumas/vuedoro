<template>
  <div id="app" class="text-xl max-w-4xl">
    <Entry
      v-for="entry in entries"
      v-bind:key="entry.id"
      v-bind:active="entry.id === activeEntry"
      v-bind:deleteEntry="deleteEntry"
      v-bind:id="entry.id"
      v-bind:onActivate="onActivate"
      v-bind:onUpdate="onUpdate"
      v-bind:timeSpent="entry.timeSpent"
      v-bind:value="entry.title"
    />
    <EditableText
      value="Click here to add new entry"
      v-bind:getInitialValue="getInitialValue"
      v-bind:onUpdate="addNewEntry"
      v-bind:key="Date.now()"
    />
    <footer
      class="fixed bottom-0 p-4 w-full max-w-4xl grid grid-rows-3 grid-cols-5 lg:grid-rows-1 lg:grid-cols-8"
    >
      <span class="col-start-1">{{ state }}</span>
      <span class="col-start-4 col-span-2 text-right lg:col-start-7">
        Sessions left:
        {{
          state === "bigBreak"
            ? 0
            : config.sessionsBeforeBigBreak -
              (counters.working % config.sessionsBeforeBigBreak)
        }}
      </span>
      <span class="row-start-2 lg:row-start-1 lg:col-start-2">{{
        timeLeft | time
      }}</span>
      <span
        class="row-start-2 col-start-4 col-span-2 text-right lg:row-start-1 lg:col-start-6 lg:col-span-1"
        >{{ totalTime | time(totalTime, true) }}</span
      >
      <button
        class="row-start-3 col-start-2 lg:row-start-1 lg:col-start-3"
        v-on:click="proceedToPreviousState"
      >
        &#9198;&#65039;
      </button>
      <button
        class="row-start-3 col-start-3 lg:row-start-1 lg:col-start-4"
        v-on:click="toggleTimer"
      >
        {{ this.running ? "&#9208;&#65039;" : "&#9654;" }}
      </button>
      <button
        class="row-start-3 col-start-4 lg:row-start-1 lg:col-start-5"
        v-on:click="proceedToNextState"
      >
        &#9197;&#65039;
      </button>
    </footer>
  </div>
</template>

<script>
import saveState from "vue-save-state";
import { uuidv4 } from "./uuid";
import EditableText from "./components/EditableText.vue";
import Entry from "./components/Entry.vue";

export const states = {
  bigBreak: "bigBreak",
  break: "break",
  working: "working"
};

export const messages = {
  [states.bigBreak]: "Time for a refreshment! Long break starting now",
  [states.break]: "It's time for a short break",
  [states.working]: "Time to work"
};

function minutesToMilliseconds(minutes) {
  return minutes * 60 * 1000;
}

export default {
  name: "App",
  components: {
    EditableText,
    Entry
  },
  mixins: [saveState],
  created() {
    this.interval = undefined;
  },
  beforeDestroy() {
    this.stopTimer();
  },
  data() {
    return {
      activeEntry: "",
      config: {
        bigBreak: 15,
        break: 5,
        sessionsBeforeBigBreak: 4,
        working: 25
      },
      counters: {
        [states.working]: 0,
        [states.break]: 0,
        [states.bigBreak]: 0
      },
      entries: {},
      notification: undefined,
      pristine: true,
      running: false,
      state: "working",
      time: 0
    };
  },
  computed: {
    timeLeft: function() {
      return minutesToMilliseconds(this.config[this.state]) - this.time;
    },
    totalTime: function() {
      return (
        minutesToMilliseconds(this.config[states.working]) *
          this.counters.working +
        minutesToMilliseconds(this.config[states.break]) *
          this.counters[states.break] +
        minutesToMilliseconds(this.config[states.bigBreak]) *
          this.counters[states.bigBreak] +
        this.time
      );
    }
  },
  methods: {
    addNewEntry(_id, title) {
      const id = uuidv4();
      this.entries = { ...this.entries, [id]: { id, title, timeSpent: 0 } };
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
        if (this.activeEntry === id) {
          this.stopTimer();
          this.activeEntry = "";
        }
      }
    },
    getInitialValue() {
      return "";
    },
    getSaveStateConfig() {
      return {
        cacheKey: "Vuedoro"
      };
    },
    async notify() {
      this.notification?.close();
      const result = await Notification.requestPermission();
      if (result === "granted") {
        const body = messages[this.state];
        this.notification = new Notification("Vuedoro", { body });
      }
    },
    onActivate(id) {
      this.activeEntry = id;
    },
    onUpdate(id, newValue) {
      this.entries[id].title = newValue;
    },
    proceedToNextState() {
      this.counters[this.state] = this.counters[this.state] + 1;

      if (
        this.counters[states.working] % this.config.sessionsBeforeBigBreak ===
          0 &&
        this.counters[states.working] > 0 &&
        this.state !== states.bigBreak
      ) {
        this.state = states.bigBreak;
      } else if (this.state === states.working) {
        this.state = states.break;
      } else {
        this.state = states.working;
      }

      this.time = 0;
      this.stopTimer();
      this.notify();
    },
    proceedToPreviousState() {
      let previousState;
      if (this.state === states.bigBreak || this.state === states.break) {
        previousState = states.working;
      } else if (
        this.counters[states.working] % this.config.sessionsBeforeBigBreak ===
          0 &&
        this.counters[states.working] > 0 &&
        this.state === states.working
      ) {
        previousState = states.bigBreak;
      } else {
        previousState = states.break;
      }

      if (this.counters[previousState] > 0) {
        this.counters[previousState] = this.counters[previousState] - 1;
        this.state = previousState;
        this.time = 0;
        this.stopTimer();
      }
    },
    stopTimer() {
      this.running = false;
      clearInterval(this.interval);
      this.interval = undefined;
    },
    toggleTimer() {
      if (this.activeEntry.length === 0) {
        alert(
          "No entry selected. To start the timer you must select an entry first."
        );
        return;
      }
      this.running = !this.running;
    }
  },
  watch: {
    running: function() {
      if (typeof this.interval === "undefined" && this.running) {
        this.interval = setInterval(() => {
          if (this.time < minutesToMilliseconds(this.config[this.state])) {
            this.time = this.time + 1000;

            if (this.timeLeft <= 0) {
              this.proceedToNextState();
            }
          }
        }, 1000);
      } else if (typeof this.interval === "number" && !this.running) {
        this.stopTimer();
      }
    },
    time: function() {
      this.entries[this.activeEntry].timeSpent += 1000;
    }
  }
};
</script>
