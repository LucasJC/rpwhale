import "declarations.d.ts";
import App from "./components/App.svelte";
import Footer from "./components/Footer.svelte";
import "./styles.css";

const app = new App({
  target: document.querySelector("#content")!,
  props: {},
});

const footer = new Footer({
  target: document.querySelector("#footer")!,
  props: {},
});

export default app;
