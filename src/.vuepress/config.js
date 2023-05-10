const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Passwordless.dev Documentation',

  base: "/",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: true,
    docsRepo: 'passwordless/docs',
    docsDir: 'src',
    docsBranch: 'main',
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: false,
    nav: [
      {
        text: 'Documentation',
        link: '/guide/',
      },
      {
        text: 'Sign Up',
        link: 'https://admin.passwordless.dev/signup'
      },
      {
        text: 'Home',
        link: 'https://www.passwordless.dev/'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Home',
          collapsable: false,
          children: [
            'releasenotes',
            '',
            'get-started',
            'api',
            'backend',
            'js-client',
            'frontend',
            'errors',
            'admin-console',
            'concepts'
          ]
        }
      ],
    },
    algolia: {
      apiKey: '667aee5054356705f2a71ecff6ce867e',
      indexName: 'passwordless'
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    'code-switcher'
  ]
}
