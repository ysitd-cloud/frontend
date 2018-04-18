const shell = require('shelljs');
const webpack = require('webpack');

const outputDir = 'dist';

shell.rm('-rf', outputDir);
shell.mkdir(outputDir);

shell.cp('-R', 'static/*', outputDir);
shell.cp('-R', 'elements', outputDir);

webpack(require('./webpack.prod.conf'), (err, stats) => {
  if (err) throw err;
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n');
});
