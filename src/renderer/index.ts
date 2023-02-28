import alpine from 'alpinejs';
import App from './components/App';

import './css/style.css';

// ----------------------------------------
// Alpine intitialization
// ----------------------------------------

alpine.data('app', () => { return Object.assign(new App()) });
alpine.start();