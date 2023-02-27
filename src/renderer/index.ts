import alpine from 'alpinejs';
import { app } from './components/app';

import './css/style.css';

// Initialize Alpine
alpine.data('app', () => app);
alpine.start();