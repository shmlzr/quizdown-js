import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import license from 'rollup-plugin-license';
import path from 'path';

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require('child_process').spawn(
                'npm',
                ['run', 'start', '--', '--dev'],
                {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true,
                }
            );

            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        },
    };
}

export default {
    input: 'src/quizdown.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'quizdown',
        file: 'dist/quizdown.js',
    },
    plugins: [
        svelte({
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production,
            },
        }),

        // we'll extract any component CSS out into
        // a separate file - better for performance
        css({ output: 'quizdown.css' }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
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
        production &&
            license({
                sourcemap: true,

                banner: {
                    commentStyle: 'regular', // The default

                    content: {
                        file: path.join(__dirname, 'LICENSE'),
                        encoding: 'utf-8', // Default is utf-8
                    },
                },

                thirdParty: {
                    output: {
                        file: path.join(__dirname, 'dist', 'dependencies.txt'),
                        encoding: 'utf-8', // Default is utf-8.
                    },
                },
            }),
    ],
    watch: {
        clearScreen: false,
    },
};