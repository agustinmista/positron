import './index.css';

console.log('Hello from the renderer process!');

const title = document.getElementById('title');
title.onclick = () => alert('Hey!');
