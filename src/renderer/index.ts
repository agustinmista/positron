import alpine from 'alpinejs';

import App from './components/App';
import Modal from './components/Modal';
import BusyButton from './components/BusyButton';
import TwoStepButton from './components/TwoStepButton';

import './css/style.css';

// ----------------------------------------
// Alpine intitialization
// ----------------------------------------

alpine.data('app',           () => { return new App() });
alpine.data('busyButton',    () => { return new BusyButton() });
alpine.data('twoStepButton', () => { return new TwoStepButton() });

alpine.store('settingsModal', new Modal());
alpine.store('aboutModal',    new Modal());
alpine.store('responseModal', new Modal());

alpine.start();