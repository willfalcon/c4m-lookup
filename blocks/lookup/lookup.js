// (async () => {
//   const lookupBlocks = document.querySelectorAll('.c4m-lookup');
//   if (lookupBlocks) {
//     const { initLookup } = await import('./app');
//     lookupBlocks.forEach(block => {
//       initLookup(block);
//     });
//   }
// })();

import { initLookup } from './app';
const lookupBlocks = document.querySelectorAll('.c4m-lookup');
lookupBlocks.forEach(block => {
  initLookup(block);
});
