import { shallowMount } from "@vue/test-utils";
import EditableText from "./EditableText.vue";

describe("EditableText", () => {
  it("should render without errors", () => {
    const wrapper = shallowMount(EditableText, {
      propsData: {
        value: "foo",
      },
    });
    expect(wrapper.text()).toBe("foo");
  });
  it("should invoke onUpdate callback on form submit", async () => {
    const onUpdate = jest.fn();
    const wrapper = shallowMount(EditableText, {
      propsData: {
        value: "foo",
        onUpdate,
      },
    });
    const button = wrapper.find("button");
    await button.trigger("click");
    expect(wrapper.get("input"));
    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });
});
