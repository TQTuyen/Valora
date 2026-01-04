import { mount } from 'svelte';

import './app.css';
import App from './App.svelte';

mount(App as any, {
  target: document.getElementById('app')!,
});
