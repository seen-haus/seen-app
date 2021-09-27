import { ref } from "vue";

const darkMode = ref(false);

const useDarkMode = () => {
  const setDarkMode = (darkModeEnabled) => {
    darkMode.value = darkModeEnabled || false;
  }

  return { darkMode, setDarkMode }
}

export default useDarkMode;