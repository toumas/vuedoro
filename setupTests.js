import "regenerator-runtime/runtime";
import Vue from "vue";
import { time } from "./src/main";

global.confirm = () => true;
global.alert = () => {};

Vue.filter("time", time);
