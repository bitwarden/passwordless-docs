import prettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.temp/**',
      '.cache/**',
      'src/.vuepress/dist/**',
      'src/.vuepress/.temp/**',
      'src/.vuepress/.cache/**',
      '**/*.min.js'
    ]
  },
  ...pluginVue.configs['flat/recommended'],
  prettier
];
