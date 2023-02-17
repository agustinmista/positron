import './index.css';
import Alpine from 'alpinejs'

// Make the Alpine object available globally
declare global {
  interface Window { Alpine: typeof Alpine; }
}
window.Alpine = Alpine;

Alpine.start();
