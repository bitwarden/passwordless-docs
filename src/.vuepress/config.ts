import { defaultTheme } from 'vuepress';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';
import { palettePlugin } from '@vuepress/plugin-palette';
import { docsearchPlugin } from '@vuepress/plugin-docsearch';

const { description } = require('../../package');

export default {
  title: 'Passwordless.dev Documentation',
  base: '/',
  description: description,
  head: [
    ['link', { rel: 'icon', href: '/icon.svg' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    [
      'script',
      { 'src': 'https://plausible.io/js/script.js', 'data-domain': 'docs.passwordless.dev' }
    ]
  ],

  theme: defaultTheme({
    colorMode: 'light',
    colorModeSwitch: false,
    contributors: false,
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

  plugins: [
    backToTopPlugin(),
    docsearchPlugin({
      apiKey: '76fc9fe901fe62268368f74e492ccbd0',
      indexName: 'passwordless',
      appId: 'H4XQ4LY5NY'
    }),
    mdEnhancePlugin({
      breaks: true,
      codetabs: true
    }),
    mediumZoomPlugin(),
    palettePlugin({
      preset: 'sass'
    }),
    'check-md'
  ]
};
