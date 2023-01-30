const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Passwordless documentation',

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
        text: 'Passwordless Guide',
        link: '/guide/',
      },
      {
        text: 'fido2-net-lib',
        link: '/fido2-net-lib/'
      },
      {
        text: 'Passwordless homepage',
        link: 'https://beta.passwordless.dev'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: true,
          children: [
            '',
            'demo-and-examples',
            'getting-started',
            'operations',
            'passwordless-js-client',
            'what-is-webauthn-and-fido2',
            
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
