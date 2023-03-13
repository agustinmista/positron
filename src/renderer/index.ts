import alpine from 'alpinejs';

import App from './components/App';
import BusyButton from './components/BusyButton';
import TwoStepButton from './components/TwoStepButton';
import DebouncedButton from './components/DebouncedButton';
import Editor from './components/Editor';
import Modal from './components/Modal';

import './css/style.css';
import icon from '../img/icons/icon.png';

// ----------------------------------------
// Hacky logo image
// ----------------------------------------

document.getElementById('icon').setAttribute('src', icon);
document.getElementById('icon-bigger').setAttribute('src', icon);

// ----------------------------------------
// Alpine intitialization
// ----------------------------------------

alpine.data('app',             () => new App());
alpine.data('busyButton',      () => new BusyButton());
alpine.data('twoStepButton',   () => new TwoStepButton());
alpine.data('debouncedButton', () => new DebouncedButton());
alpine.data('editor',          () => new Editor());
alpine.data('modal',           () => new Modal());
alpine.start();