import { defaultTheme } from 'vuepress';

const { description } = require('../../package');

export default {
  algolia: {
    apiKey: '76fc9fe901fe62268368f74e492ccbd0',
    indexName: 'passwordless',
    appId: 'H4XQ4LY5NY'
  },

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

  theme: defaultTheme({
    docsBranch: 'main',
    docsDir: 'src',
    docsRepo: 'passwordless/docs',
    editLink: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: true,
    navbar: [
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
    repo: '',
    sidebar: [
      {
        text: 'Home',
        link: '/guide/',
        children: [
          {
            link: '/guide/releasenotes',
            text: 'Release Notes'
          },
          {
            link: '/guide/get-started',
            text: 'Get Started'
          },
          {
            link: '/guide/api',
            text: 'API'
          },
          {
            collapsible: true,
            link: '/guide/backend',
            text: 'Backend',
            children: [
              {
                link: '/guide/backend/dotnet',
                text: '.NET'
              },
              {
                link: '/guide/backend/java',
                text: 'Java'
              },
              {
                link: '/guide/backend/nodejs',
                text: 'Node.js'
              },
              {
                link: '/guide/backend/php',
                text: 'PHP'
              },
              {
                link: '/guide/backend/python2',
                text: 'Python 2'
              },
              {
                link: '/guide/backend/python3',
                text: 'Python 3'
              },
              {
                link: '/guide/backend/create-a-sdk',
                text: 'Create a SDK'
              }
            ]
          },
          {
            collapsible: true,
            link: '/guide/frontend',
            text: 'Frontend',
            children: [
              {
                link: '/guide/frontend/javascript',
                text: 'JavaScript Client'
              },
              {
                link: '/guide/frontend/aspnet',
                text: 'ASP.NET'
              },
              {
                link: '/guide/frontend/react',
                text: 'React'
              }
            ]
          },
          {
            collapsible: true,
            link: '/guide/self-hosting',
            text: 'Self-hosting',
            children: [
              {
                link: '/guide/self-hosting/configuration',
                text: 'Configuration'
              },
              {
                link: '/guide/self-hosting/running-locally',
                text: 'Running Locally'
              },
              {
                link: '/guide/self-hosting/health-checks',
                text: 'Health-checks'
              },
              {
                link: '/guide/self-hosting/advanced',
                text: 'Advanced'
              }
            ]
          },
          {
            link: '/guide/errors',
            text: 'Errors'
          },
          {
            collapsible: true,
            link: '/guide/admin-console',
            text: 'Admin Console',
            children: [
              {
                link: '/guide/admin-console/applications',
                text: 'Applications'
              },
              {
                link: '/guide/admin-console/billing',
                text: 'Billing'
              },
              {
                link: '/guide/admin-console/admins',
                text: 'Admins'
              }
            ]
          },
          {
            link: '/guide/concepts',
            text: 'Concepts'
          }
        ]
      }
    ]
  }),

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
