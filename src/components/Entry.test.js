/* eslint-disable no-undef */
import { shallowMount } from "@vue/test-utils";
import Entry from "./Entry.vue";

const propsData = {
  active: false,
  deleteEntry: jest.fn(),
  getInitialValue: jest.fn(),
  id: "entry1",
  onActivate: jest.fn(),
  onUpdate: jest.fn(),
  timeSpent: 0,
  value: "foo"
};

describe("Entry", () => {
  it("should render without errors", () => {
    const wrapper = shallowMount(Entry, {
      propsData
    });
    expect(wrapper.text()).toBeDefined();
  });
});
