import "declarations.d.ts";
import App from "./components/App.svelte";
import "./styles.css";

const app = new App({
  target: document.body,
  props: {},
});

export default app;
