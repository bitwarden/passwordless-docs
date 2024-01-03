const { description } = require('../../package');

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Passwordless.dev Documentation',

  base: '/',
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
    ['link', { rel: 'icon', href: '/icon.svg' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    [
      'script',
      { 'src': 'https://plausible.io/js/script.js', 'data-domain': 'docs.passwordless.dev' }
    ]
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
        link: '/guide/'
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
            {
              title: 'Backend',
              path: '/guide/backend',
              collapsable: true,
              children: [
                ['/guide/backend/dotnet', '.NET'],
                ['/guide/backend/java', 'Java'],
                ['/guide/backend/nodejs', 'Node.js'],
                ['/guide/backend/php', 'PHP'],
                ['/guide/backend/python2', 'Python 2'],
                ['/guide/backend/python3', 'Python 3'],
                ['/guide/backend/create-a-sdk', 'Create a SDK']
              ]
            },
            {
              title: 'Frontend',
              path: '/guide/frontend',
              collapsable: true,
              children: [
                ['/guide/frontend/javascript', 'JavaScript Client'],
                ['/guide/frontend/aspnet', 'ASP.NET'],
                ['/guide/frontend/react', 'React']
              ]
            },
            {
              title: 'Self-hosting',
              path: '/guide/self-hosting',
              collapsable: true,
              children: [
                ['/guide/self-hosting/configuration', 'Configuration'],
                ['/guide/self-hosting/running-locally', 'Running Locally'],
                ['/guide/self-hosting/health-checks', 'Health-checks'],
                ['/guide/self-hosting/advanced', 'Advanced']
              ]
            },
            'errors',
            'admin-console',
            'concepts'
          ]
        }
      ]
    },
    algolia: {
      apiKey: '76fc9fe901fe62268368f74e492ccbd0',
      indexName: 'passwordless',
      appId: 'H4XQ4LY5NY'
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    'code-switcher',
    'check-md'
  ]
};
