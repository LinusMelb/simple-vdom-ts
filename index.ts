import {vEl} from './src/element';

const result = vEl('div', {id: 'container'}, [
    vEl('p', {style: 'color: red'}, ['This is a <p> tag']),
    vEl('h1', {}, ['simple virtal dom']),
]);

const renderedHtml = result.render();

document.getElementById('app').append(renderedHtml);
