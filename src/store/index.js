import { createStore } from 'vuex'
import modules from "@/store/modules";

export default createStore({
  modules, strict: process.env.NODE_ENV !== 'production'
})
