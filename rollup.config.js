import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import replace from 'rollup-plugin-replace';
import { babel } from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import posthtml from 'posthtml';
import { hash } from 'posthtml-hash';
import rimraf from 'rimraf';
import fs from 'fs';
import dontenv from 'dotenv';
import preprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;
const OUT_DIR = 'dist';
const OUT_FILE = `${OUT_DIR}/index.html`;

dontenv.config({ path: `.env.${process.env.MODE}` });

const hashStatic = () => ({
    name: 'hashStatic',
    buildStart: () => rimraf.sync(OUT_DIR),
    writeBundle: () => {
        posthtml([hash({ path: OUT_DIR })])
            .process(fs.readFileSync(OUT_FILE, 'utf-8'))
            .then((result) => fs.writeFileSync(OUT_FILE, result.html))
            .catch((e) => console.log(e));
    },
});

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true,
            });

            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        },
    };
}

export default [
    {
        input: 'src/main.js',
        output: {
            sourcemap: !production,
            format: 'iife',
            name: 'app',
            file: `${OUT_DIR}/bundle.[hash].js`,
        },
        plugins: [
            copy({ targets: [{ src: 'public/*', dest: OUT_DIR }] }),
            svelte({
                preprocess: preprocess({
                    postcss: {
                        scss: true,
                        plugins: [require('autoprefixer')],
                    },
                }),
                compilerOptions: {
                    // enable run-time checks when not in production
                    dev: !production,
                },
            }),
            // we'll extract any component CSS out into
            // a separate file - better for performance
            css({ output: 'bundle.[hash].css' }),

            // If you have external dependencies installed from
            // npm, you'll most likely need these plugins. In
            // some cases you'll need additional configuration -
            // consult the documentation for details:
            // https://github.com/rollup/plugins/tree/master/packages/commonjs
            replace({ 'process.env.API_URL': JSON.stringify(process.env.API_URL) }),
            resolve({
                browser: true,
                dedupe: ['svelte'],
            }),
            commonjs(),

            // In dev mode, call `npm run start` once
            // the bundle has been generated
            !production && serve(),

            // Watch the `dist` directory and refresh the
            // browser on changes when not in production
            !production && livereload('dist'),

            // If we're building for production (npm run build
            // instead of npm run dev), minify
            production && terser(),

            production && hashStatic(),
        ],
        watch: {
            clearScreen: false,
        },
    },
    {
        input: 'src/widget.js',
        output: [
            {
                sourcemap: !production,
                format: 'iife',
                name: 'Speechki',
                file: 'dist/widget.js',
            },
            {
                format: 'esm',
                name: 'Speechki',
                file: 'dist/widget.esm.js',
            },
        ],
        plugins: [
            replace({ 'process.env.WIDGET_URL': JSON.stringify(process.env.WIDGET_URL) }),
            production && terser(),
            production &&
                babel({
                    presets: ['@babel/preset-env'],
                }),
        ],
    },
];
