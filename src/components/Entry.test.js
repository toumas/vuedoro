import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import Entry, { states } from "./Entry.vue";

describe("Entry", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  })
  it("should render without errors", () => {
    const wrapper = shallowMount(Entry);
    expect(wrapper.text()).toBeDefined();
  });
  it("should render pause button when timer is running", async () => {
    const wrapper = shallowMount(Entry);
    const button = wrapper.get("button");
    await button.trigger("click");
    expect(button.text()).toBe("Pause working");
  });
  /* it("should prompt for break after working session", async () => {
    const wrapper = shallowMount(Entry, {sync: false});
    await wrapper.get("button").trigger("click");
    jest.runAllTimers();
    await Vue.nextTick();
    expect(wrapper.text()).toBe("Start break");
  }); */
  it("should go from working to break state", async () => {
    const wrapper = shallowMount(Entry);
    await wrapper.get(".next").trigger("click");
    expect(wrapper.get(".toggle").text()).toBe("Start break");
  });
  it("should go from working to bigBreak state", async () => {
    const wrapper = shallowMount(Entry);
    wrapper.setData({ state: states.working, counters: { working: 3 } });
    await wrapper.get(".next").trigger("click");
    expect(wrapper.get(".toggle").text()).toBe("Start bigBreak");
  });
  it("should go from break to working state", async () => {
    const wrapper = shallowMount(Entry);
    wrapper.setData({ state: states.break });
    await wrapper.get(".next").trigger("click");
    expect(wrapper.get(".toggle").text()).toBe("Start working");
  });
  it("should go from bigBreak to working state", async () => {
    const wrapper = shallowMount(Entry);
    wrapper.setData({
      state: states.bigBreak,
      counters: { working: 4, bigBreak: 0 },
    });
    await wrapper.get(".previous").trigger("click");
    expect(wrapper.get(".toggle").text()).toBe("Start working");
  });
  it("should go from working to bigBreak state", async () => {
    const wrapper = shallowMount(Entry);
    wrapper.setData({
      state: states.working,
      counters: { working: 4, bigBreak: 1 },
    });
    await wrapper.get(".previous").trigger("click");
    expect(wrapper.get(".toggle").text()).toBe("Start bigBreak");
  });
  it("should go from break to working state", async () => {
    const wrapper = shallowMount(Entry);
    wrapper.setData({
      state: states.break,
      counters: { working: 1, break: 0 },
    });
    await wrapper.get(".previous").trigger("click");
    expect(wrapper.get(".toggle").text()).toBe("Start working");
  });
  it("should go from working to break state", async () => {
    const wrapper = shallowMount(Entry);
    wrapper.setData({
      state: states.working,
      counters: { working: 1, break: 1 },
    });
    await wrapper.get(".previous").trigger("click");
    expect(wrapper.get(".toggle").text()).toBe("Start break");
  });
  it("should track time spent", async () => {
    const wrapper = shallowMount(Entry);
    const button = wrapper.get(".toggle");
    await button.trigger("click");
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.time).toBe(1000);
  });
  /* it("should stop timer", async () => {
    jest.useFakeTimers("modern");
    const wrapper = shallowMount(Entry);
    const button = wrapper.get(".toggle");
    await button.trigger("click");
    jest.advanceTimersByTime(1000);
    await button.trigger("click");
    // there shouldn't be any pending timers, if there are expect should fail
    jest.runOnlyPendingTimers();
    expect(wrapper.vm.$data.time).toBe(1000);
  }); */
});
