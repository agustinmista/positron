import alpine from 'alpinejs';
import { app } from './components/app';

import './css/style.css';

// ----------------------------------------
// Alpine intitialization
// ----------------------------------------

alpine.data('app', () => app);
alpine.start();