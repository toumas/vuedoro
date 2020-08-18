/* eslint-disable no-undef */
import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import App, { states } from "./App.vue";
import EditableText from "./components/EditableText.vue";
import Entry from "./components/Entry.vue";

const buttons = {
  play: "▶",
  pause: "⏸️"
};

const defaultProps = {
  activeEntry: "entry1",
  entries: { entry1: { id: "entry1", title: "foo", timeSpent: 0 } }
};

describe("App", () => {
  /* it("should render without errors", () => {
    const wrapper = mount(App);
    expect(wrapper.element).toMatchSnapshot();
  }); */
  beforeEach(() => {
    global.localStorage.clear();
    jest.useFakeTimers();
  });
  it("should add new entry", () => {
    const wrapper = shallowMount(App);
    wrapper.vm.addNewEntry("foo");
    const entry = Object.values(wrapper.vm.$data.entries).find(
      (value) => value.title === "foo"
    );
    expect(entry).toBeTruthy();
  });
  it("should update existing entry", () => {
    const wrapper = shallowMount(App, {
      data() {
        return {
          entries: { entry1: { id: "entry1", title: "foo", timeSpent: 0 } }
        };
      }
    });
    wrapper.findComponent(Entry).vm.$props.onUpdate("entry1", "bar");
    expect(wrapper.vm.$data.entries.entry1.title).toBe("bar");
  });
  it("should delete entry", () => {
    const wrapper = shallowMount(App, {
      data() {
        return { entries: { entry1: { id: "entry1", title: "foo" } } };
      }
    });
    wrapper.vm.deleteEntry("entry1");
    expect(wrapper.vm.$data.entries).toEqual({});
  });
  it("should stop timer when entry becomes inactive", async () => {
    const wrapper = shallowMount(App, { data: () => ({ ...defaultProps }) });
    const button = wrapper.get(".toggle");
    await button.trigger("click");
    jest.advanceTimersByTime(1000);
    wrapper.vm.onActivate("entry1");
    // there shouldn't be any pending timers, if there are expect should fail
    jest.runOnlyPendingTimers();
    expect(wrapper.vm.$data.time).toBe(1000);
  });
  it("should stop timer", async () => {
    const wrapper = shallowMount(App, { data: () => ({ ...defaultProps }) });
    const button = wrapper.get(".toggle");
    await button.trigger("click");
    jest.advanceTimersByTime(1000);
    await button.trigger("click");
    // there shouldn't be any pending timers, if there are expect should fail
    jest.runOnlyPendingTimers();
    expect(wrapper.vm.$data.time).toBe(1000);
  });
  it("should track time spent", async () => {
    const wrapper = shallowMount(App, { data: () => ({ ...defaultProps }) });
    const button = wrapper.get(".toggle");
    await button.trigger("click");
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.time).toBe(1000);
  });
  it("should go from working to break state backwards", async () => {
    const wrapper = shallowMount(App);
    wrapper.setData({
      state: states.working,
      counters: { working: 1, break: 1 }
    });
    await wrapper.get(".previous").trigger("click");
    expect(wrapper.vm.$data.state).toBe(states.break);
    expect(wrapper.get(".toggle").text()).toBe(buttons.play);
  });
  it("should go back from break to working state", async () => {
    const wrapper = shallowMount(App);
    wrapper.setData({
      state: states.break,
      counters: { working: 1, break: 0 }
    });
    await wrapper.get(".previous").trigger("click");
    expect(wrapper.vm.$data.state).toBe(states.working);
    expect(wrapper.get(".toggle").text()).toBe(buttons.play);
  });
  it("should go back from working to bigBreak state", async () => {
    const wrapper = shallowMount(App);
    wrapper.setData({
      state: states.working,
      counters: { working: 4, bigBreak: 1 }
    });
    await wrapper.get(".previous").trigger("click");
    expect(wrapper.vm.$data.state).toBe(states.bigBreak);
    expect(wrapper.get(".toggle").text()).toBe(buttons.play);
  });
  it("should go from bigBreak to working state", async () => {
    const wrapper = shallowMount(App);
    wrapper.setData({
      state: states.bigBreak,
      counters: { working: 4, bigBreak: 0 }
    });
    await wrapper.get(".previous").trigger("click");
    expect(wrapper.vm.$data.state).toBe(states.working);
    expect(wrapper.get(".toggle").text()).toBe(buttons.play);
  });
  it("should go from break to working state", async () => {
    const wrapper = shallowMount(App);
    wrapper.setData({ state: states.break });
    await wrapper.get(".next").trigger("click");
    expect(wrapper.vm.$data.state).toBe(states.working);
    expect(wrapper.get(".toggle").text()).toBe(buttons.play);
  });
  it("should go from working to bigBreak state", async () => {
    const wrapper = shallowMount(App);
    wrapper.setData({ state: states.working, counters: { working: 3 } });
    await wrapper.get(".next").trigger("click");
    expect(wrapper.vm.$data.state).toBe(states.bigBreak);
    expect(wrapper.get(".toggle").text()).toBe(buttons.play);
  });
  it("should go from working to break state", async () => {
    const wrapper = shallowMount(App);
    await wrapper.get(".next").trigger("click");
    expect(wrapper.vm.$data.state).toBe(states.break);
    expect(wrapper.get(".toggle").text()).toBe(buttons.play);
  });
  it("should prompt for break after working session", async () => {
    const wrapper = shallowMount(App, {
      data: () => ({ ...defaultProps }),
      sync: false
    });
    const button = wrapper.get(".toggle");
    await button.trigger("click");
    jest.runAllTimers();
    await Vue.nextTick();
    expect(wrapper.vm.$data.state).toBe(states.break);
    expect(button.text()).toBe(buttons.play);
  });
  it("should render pause button when timer is running", async () => {
    const wrapper = shallowMount(App, { data: () => ({ running: true }) });
    const button = wrapper.get(".toggle");
    await button.trigger("click");
    expect(button.text()).toBe(buttons.pause);
  });
});
