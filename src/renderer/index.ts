import alpine from 'alpinejs';

import App from './components/App';
import Modal from './components/Modal';

import './css/style.css';

// ----------------------------------------
// Alpine intitialization
// ----------------------------------------

// We need to use Object.assign because Alpine doesn't quite support dealing
// with class objects. This way we transform a `new App` into a regular object
// that Alpine knows how to instrument. Moreover, for this to work, the class
// methods must be deconstructed and defined using the `function` keyword.

alpine.data('app', () => { return new App() });

alpine.store('settingsModal', new Modal());
alpine.store('aboutModal',    new Modal());
alpine.store('responseModal', new Modal());

alpine.start();