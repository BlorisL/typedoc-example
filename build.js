const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/script.js',
    format: 'iife',
    platform: 'browser',
    minify: true,
    alias: {
        '@': './src'  // Definisce l'alias per la root
    },
    loader: { '.json': 'json' },
    banner: {
        js: `// ==Script==
// @name         TypeScript BoilerPlate
// @namespace    <Project>
// @version      1.0
// @description  <Description>
// @author       <NAME>
// @match        Something
// @grant        none
// ==/Script==`
    },
}).catch(() => process.exit(1));
