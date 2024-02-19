const { readdir } = require('fs/promises');
const fs = require('fs');
const livereload = require('gulp-livereload');
const styleScript = require('./styleScript');
const { src, watch } = require('gulp');
const blockJsScript = require('./blockJsScript');
const argv = require('yargs').argv;

function refresh() {
  return src('index.php').pipe(livereload());
}

async function developBlocks() {
  const blocks = await readdir('blocks/');
  const exclude = ['blocks.php', '_block-import.scss', '.DS_Store'];
  const blockNames = blocks.filter(block => !exclude.includes(block));

  livereload.listen();

  const styleWatcher = watch(['blocks/**/*.scss']);
  function runStyleScript(path) {
    const block = blockNames.filter(name => path.includes(name))[0];
    console.log(`building ${block} styles`);
    styleScript(`blocks/${block}/${block}.scss`, `./dist/${block}`, true);
  }
  styleWatcher.on('change', runStyleScript);

  const jsWatcher = watch(['blocks/**/*.js']);
  function runJsScript(path) {
    const block = blockNames.filter(name => path.includes(name))[0];
    console.log(`building ${block} script`);
    blockJsScript(`blocks/${block}/${block}.js`, block, true);
  }
  jsWatcher.on('change', runJsScript);

  watch(['blocks/**/*.json|php'], refresh);
}

async function buildBlocks() {
  const dev = !!argv.D;
  const blocks = await readdir('blocks/');
  const exclude = ['blocks.php', '_block-import.scss', '.DS_Store'];
  const blockNames = blocks.filter(block => !exclude.includes(block));

  await Promise.all(
    blockNames.map(async block => {
      const styleSource = `blocks/${block}/${block}.scss`;
      const editorStyleSource = `blocks/${block}/${block}-editor.scss`;
      const styleDest = `./dist/${block}`;
      const scriptSource = `blocks/${block}/${block}.js`;
      const editorScriptSource = `blocks/${block}/${block}-editor.js`;
      console.log(`building ${block}`);
      await fs.access(styleSource, err => {
        if (err) {
          console.log('no default styles');
          return;
        } else {
          return styleScript(styleSource, styleDest, dev);
        }
      });
      await fs.access(editorStyleSource, err => {
        if (err) {
          console.log('no editor styles');
          return;
        } else {
          return styleScript(editorStyleSource, styleDest, dev);
        }
      });
      await fs.access(scriptSource, err => {
        if (err) {
          console.log('no default script');
          return;
        } else {
          return blockJsScript(scriptSource, block, dev);
        }
      });
      await fs.access(editorScriptSource, err => {
        if (err) {
          console.log('no editor script');
          return;
        } else {
          return blockJsScript(editorScriptSource, block, dev);
        }
      });
    })
  );
}
exports.developBlocks = developBlocks;
exports.buildBlocks = buildBlocks;
