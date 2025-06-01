import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'StimulusListeners',
      formats: ['es', 'umd'],
      fileName: (format) => `stimulus-listeners.${format}.js`
    },
    sourcemap: true,
    rollupOptions: {
      external: ['@hotwired/stimulus'],
      output: {
        globals: {
          '@hotwired/stimulus': 'Stimulus'
        }
      }
    }
  },
  plugins: [dts({
    entryRoot: 'src',
    outputDir: 'dist'
  })],
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts']
  }
});
