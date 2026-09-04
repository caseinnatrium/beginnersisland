import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://caseinnatrium.github.io',
  base: '/beginnersisland',

  vite: {
    resolve: {
      alias: {
        '@components': fileURLToPath(
          new URL('./src/components', import.meta.url)
        ),
      },
    },
  },

  integrations: [
    starlight({
      title: 'Beginners Island',

      customCss: ['./src/styles/custom.css'],

      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/caseinnatrium/beginnersisland',
        },
      ],

      sidebar: [
        {
          label: 'Map',
          link: '/map/',
        },

        {
          label: 'Quests',
          items: [
            {
              autogenerate: {
                directory: 'quests',
              },
            },
          ],
        },

        {
          label: 'Monsters',
          link: '/monsters/',
        },

        {
          label: 'Equipment',
          link: '/equipment/',
        },

        {
          label: 'Hiscores',
          link: '/hiscores/',
        },

        {
          label: 'Helper',
          link: '/helper/',
        },

        {
          label: 'Timeline',
          link: '/timeline/',
        },

        {
          label: 'Systems',
          items: [
            {
              autogenerate: {
                directory: 'systems',
              },
            },
          ],
        },

        {
          label: 'Events',
          items: [
            {
              autogenerate: {
                directory: 'events',
              },
            },
          ],
        },

        {
          label: 'Guides',
          items: [
            {
              autogenerate: {
                directory: 'guides',
              },
            },
          ],
        },

        {
          label: 'Reference',
          items: [
            {
              autogenerate: {
                directory: 'reference',
              },
            },
          ],
        },
      ],
    }),
  ],
});