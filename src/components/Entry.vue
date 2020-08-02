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
        v-on:click="toggleTimer"
      >
        {{ this.running ? "&#9208;&#65039;" : "&#9654;" }}
      </button>
      <button
        class="previous text-left row-start-2 col-span-2 md:col-span-1 md:row-start-auto md:text-center"
        v-on:click="proceedToPreviousState"
      >
        &#9198;&#65039;
      </button>
      <span
        class="row-start-2 col-span-3 md:col-span-1 md:row-start-auto md:text-center"
        >{{ timeLeft | time }}</span
      >
      <button
        class="next row-start-2 col-span-2 md:col-span-1 md:row-start-auto"
        v-on:click="proceedToNextState"
      >
        &#9197;&#65039;
      </button>
      <span
        class="break-all row-start-3 col-span-4 md:row-start-auto md:col-span-2"
      >
        Sessions left:
        {{
          state === "bigBreak"
            ? 0
            : config.sessionsBeforeBigBreak -
              (counters.working % config.sessionsBeforeBigBreak)
        }}
      </span>
      <span
        class="break-all row-start-3 col-span-3 md:row-start-auto md:col-span-2"
        >Total: {{ totalTime | time(totalTime, true) }}</span
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

export const states = {
  working: "working",
  break: "break",
  bigBreak: "bigBreak"
};

export const messages = {
  [states.working]: "Time to work",
  [states.break]: "It's time for a short break",
  [states.bigBreak]: "Time for a refreshment! Long break starting now"
};

export default {
  components: {
    EditableText
  },
  mixins: [saveState],
  props: {
    id: String,
    getInitialValue: Function,
    onUpdate: Function,
    deleteEntry: Function,
    value: String,
    active: Boolean,
    config: Object,
    onToggleTimer: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      running: false,
      state: "working",
      time: 0,
      counters: {
        [states.working]: 0,
        [states.break]: 0,
        [states.bigBreak]: 0
      },
      notification: undefined
    };
  },
  created() {
    this.interval = undefined;
  },
  beforeDestroy() {
    this.stopTimer();
  },
  watch: {
    running: function() {
      if (typeof this.interval === "undefined" && this.running) {
        this.interval = setInterval(() => {
          if (this.time < this.minutesToMilliseconds(this.config[this.state])) {
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
    active: function(nextActive, previousActive) {
      if (nextActive !== previousActive) {
        this.running = nextActive;
      }
    }
  },
  computed: {
    timeLeft: function() {
      if (this.time === 0 && this.running === false) {
        return 0;
      }
      return this.minutesToMilliseconds(this.config[this.state]) - this.time;
    },
    totalTime: function() {
      return (
        this.minutesToMilliseconds(this.config[states.working]) *
          this.counters.working +
        this.minutesToMilliseconds(this.config[states.break]) *
          this.counters[states.break] +
        this.minutesToMilliseconds(this.config[states.bigBreak]) *
          this.counters[states.bigBreak] +
        this.time
      );
    }
  },
  methods: {
    getSaveStateConfig() {
      return {
        cacheKey: this.id
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
    toggleTimer() {
      this.running = !this.running;
      this.onToggleTimer(this.id, this.running);
    },
    stopTimer() {
      this.running = false;
      clearInterval(this.interval);
      this.interval = undefined;
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
    minutesToMilliseconds(minutes) {
      return minutes * 60 * 1000;
    }
  },
  filters: {
    time: function(value, hours = false) {
      return new Date(value).toISOString().slice(hours ? 11 : 14, 19);
    }
  }
};
</script>

<style></style>
