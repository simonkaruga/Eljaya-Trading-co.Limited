import { generate } from 'critical';

await generate({
  base: './',
  src: 'index.html',
  target: {
    css: 'critical.css',
    uncritical: 'style.deferred.css',
  },
  width: 1300,
  height: 900,
  inline: false,
  extract: true,
});
console.log('Critical CSS generated');
