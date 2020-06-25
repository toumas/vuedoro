<template>
  <div>
    <EditableText
      v-bind:id="id"
      v-bind:value="value"
      v-bind:getInitialValue="getInitialValue"
      v-bind:onUpdate="onUpdate"
      v-bind:key="Date.now()"
    />
    <button class="toggle" v-on:click="toggleTimer">{{this.running ? "Pause" : "Start"}} {{state}}</button>
    <div>Time left: {{timeLeft | time}}</div>
    <div>Sessions left: {{state === 'bigBreak' ? 0 : config.sessionsBeforeBigBreak - counters.working % config.sessionsBeforeBigBreak}}</div>
    <div>Total: {{totalTime | time(totalTime, true)}}</div>
    <button class="previous" v-on:click="proceedToPreviousState">Previous</button>
    <button class="next" v-on:click="proceedToNextState">Next</button>
  </div>
</template>

<script>
import EditableText from "./EditableText.vue";

export const states = {
  working: "working",
  break: "break",
  bigBreak: "bigBreak"
};

export default {
  components: {
    EditableText
  },
  props: {
    id: String,
    getInitialValue: Function,
    onUpdate: Function,
    value: String
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
      config: {
        working: 25,
        break: 5,
        bigBreak: 15,
        sessionsBeforeBigBreak: 4
      }
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
    toggleTimer() {
      this.running = !this.running;
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

<style>
</style>
