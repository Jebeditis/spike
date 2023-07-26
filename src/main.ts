import './app.css';
import App from './App.svelte';
import '@picocss/pico';
import 'notyf/notyf.min.css';

const app = new App({
  target: document.getElementById('app'),
});

export default app;
