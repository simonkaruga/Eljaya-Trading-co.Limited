const { generate } = require('critical');

generate({
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
}).then(() => {
  console.log('Critical CSS generated');
}).catch(err => {
  console.error(err.message);
});
