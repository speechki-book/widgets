import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import legacy from '@vitejs/plugin-legacy';
import sveltePreprocess from 'svelte-preprocess';
import path from 'path';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

const widgetConfig = {
    plugins: [
        svelte({
            preprocess: sveltePreprocess({
                postcss: {
                    scss: true,
                    plugins: [autoprefixer()]
                }
            }),
            
        }),
        legacy({
            targets: ['defaults'],
        }),
    ],
};

const libraryConfig = {
    build: {
        emptyOutDir: false,
        lib: {
            entry: path.resolve(__dirname, 'src/widget.js'),
            name: 'Speechki',
            formats: ['iife', 'es'],
            fileName: (format, alias) => {
                return `${alias}${format === 'iife' ? '.js' : '.esm.js'}`;
            }
        },
    }
}

const configs = {
    widget: widgetConfig,
    library: libraryConfig
}

const configToBuild = configs[process.env.APP]

export default defineConfig(configToBuild);
