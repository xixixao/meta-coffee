require({
  paths: {
    'cs':            './vendor/cs',
    'coffee-script': './vendor/coffee-script',
    'jquery':        './vendor/jquery.min.js'
  },
  modules: [
    {
      exclude: ["jquery"]
    }
  ]
}, [
  'cs!workspace'
]);