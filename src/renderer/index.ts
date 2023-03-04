import alpine from 'alpinejs';

import App from './components/App';
import Modal from './components/Modal';

import './css/style.css';

// ----------------------------------------
// Alpine intitialization
// ----------------------------------------

alpine.data('app', () => { return new App() });
alpine.store('settingsModal', new Modal());
alpine.store('aboutModal',    new Modal());
alpine.store('responseModal', new Modal());

alpine.start();