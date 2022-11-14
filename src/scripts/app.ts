import '../styles/app.scss';

import { Greeter } from './greeter';

const greeter: Greeter = new Greeter('ts');
const app = document.getElementById('app');
if (app) {
  greeter.start(app);
}

