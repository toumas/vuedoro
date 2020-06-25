import { shallowMount, mount } from "@vue/test-utils";
import App from "./App.vue";
import EditableText from "./components/EditableText.vue";
import Entry from "./components/Entry.vue";

describe("App", () => {
  /* it("should render without errors", () => {
    const wrapper = mount(App);
    expect(wrapper.element).toMatchSnapshot();
  }); */
  it("should add new entry", () => {
    const wrapper = shallowMount(App);
    wrapper.findComponent(EditableText).vm.$props.onUpdate(undefined, "foo");
    const entry = Object.entries(wrapper.vm.$data.entries).find(
      ([key, value]) => value.title === "foo"
    );
    expect(entry).toBeTruthy();
  });
  it("should update existing entry", () => {
    const wrapper = shallowMount(App, {
      data() {
        return { entries: { 'entry1': { id: "entry1", title: "foo" } } };
      },
    });
    wrapper.findComponent(Entry).vm.$props.onUpdate("entry1", "bar");
    expect(wrapper.vm.$data.entries.entry1.title).toBe("bar");
  });
});
