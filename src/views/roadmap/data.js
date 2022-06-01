const roadmap = {
  '2021': {
    'Q4': [
      {
        title: 'Chainlink VRF Support',
        description: 'Added support for randomised drops utilising Chainlink\'s VRF (Verifiably Random Function) toolkit.',
        githubCommits: {
          'api': [
            'https://github.com/seen-haus/seen-api/commit/19e3f5762ac12d6a5309dd181fbdfc1576009eda'
          ],
          'frontend': [
            'https://github.com/seen-haus/seen-app/commit/552cfcd47f1d9854f9c389dc586ef7b382437481'
          ],
          'contracts': [
            'https://github.com/seen-haus/seen-contract-archive/commit/e8b0a04e7c1aa8ca5c770ea0aa04e8a3c0ea1954',
            'https://github.com/seen-haus/seen-contract-archive/commit/62601fe72f68706e9d3e9c09c86ab5a0eddc6bf4',
          ]
        },
        exampleLinks: [
          'https://seen.haus/drops/v2/earthlings',
          'https://seen.haus/drops/v2/pacman-series',
          'https://seen.haus/drops/v2/body-language'
        ],
        status: 'complete'
      }
    ]
  },
  '2022': {
    'Q1': [
      {
        title: 'SEEN HAUS V3',
        description: 'Added support for self-minting for whitelisted artists, reduced gas fees per drop, secondary sales, frontend reskin',
        githubCommits: {
          'api': [
            'https://github.com/seen-haus/seen-api/commit/6a86020407f2456e7dd9039036db13fe849f0d8d'
          ],
          'frontend': [
            'https://github.com/seen-haus/seen-app/commit/66af81a154ed4abfc5410a8a81c0e5bb915a516e'
          ],
          'contracts': [
            'https://github.com/seen-haus/seen-contracts/commits/main',
          ]
        },
        status: 'complete'
      },
      {
        title: 'Roadmap Update',
        description: 'Added this roadmap page to the website as a means to more effectively display progress being made going forward',
        githubCommits: {
          'frontend': [
            'https://github.com/seen-haus/seen-app/commit/d112fedc16a08eae13eed30c7fdb2b7039586b65'
          ],
        },
        status: 'complete'
      },
      {
        title: 'NFT Holder Balance Tracker',
        description: 'Construct internal balance tracker to migrate away from OpenSea API, due to unreliability and difficulty acquiring stable OpenSea API keys.',
        status: 'complete',
        githubCommits: {
          'api': [
            'https://github.com/seen-haus/seen-api/commit/618f56c46555349c7d7900fb70033937cc848dee'
          ],
        },
      },
      {
        title: '0xmons x SEEN HAUS Collab Claim Flow',
        description: 'Construction of claiming flow for 2nd iteration of 0xmons x SEEN HAUS collaboration',
        githubCommits: {
          'api': [
            'https://github.com/seen-haus/seen-api/commit/8d6575a897054303a95add3e340db73974bb374c'
          ],
          'frontend': [
            'https://github.com/seen-haus/seen-app/commits/feat/0xmons-claim'
          ],
          'contracts': [
            'https://github.com/JayWelsh/claim-against-nft/commit/59dd22bedd92a3d4cd4f40503b2feae5df962fbf',
          ]
        },
        status: 'complete'
      },
    ],
    'Q2': [
      {
        title: 'Migrate OpenSea Dependencies Over to SEEN API',
        description: 'Migrates detection of collected SEEN drops on user profiles over to the new SEEN token balance tracker built into the SEEN API, instead of continuing to rely on the OpenSea API (which has proven troublesome).',
        githubCommits: {
          'api': [
            'https://github.com/seen-haus/seen-api/pull/63/files'
          ],
          'frontend': [
            'https://github.com/seen-haus/seen-app/pull/215/files'
          ]
        },
        status: 'complete',
      },
      {
        title: 'Luca Donno x BlockWallet x SEEN HAUS Collab',
        description: 'Implements the next generation of SEEN HAUS\'s VRF process which allows for larger quantities of tokens to be handled within a SEEN HAUS VRF drop, the first use of which is to drop a collab between Luca Donno, BlockWallet & SEEN HAUS.',
        githubCommits: {
          'api': [
            'https://github.com/seen-haus/seen-api/pull/68/files'
          ],
          'frontend': [
            'https://github.com/seen-haus/seen-app/pull/219/files'
          ]
        },
        status: 'complete',
      },
      {
        title: 'Migrate Physical Drops to V3 contracts',
        description: 'Migrates the existing physical drops process and claiming procedure over to the SEEN HAUS V3 contracts',
        githubCommits: {
          'api': [
            'https://github.com/seen-haus/seen-api/pull/76'
          ],
          'frontend': [
            'https://github.com/seen-haus/seen-app/pull/238'
          ]
        },
        exampleLinks: [
          'https://seen.haus/drops/0xmons-collective-poster',
        ],
        status: 'complete',
      },
    ]
  },
  'Upcoming': [
    {
      title: 'Revamp Email Notification System',
      description: 'Add support for bid alerts, rework existing notification system for increased reliability, add VRF drop support for claim alerts & add sale claim alert support',
      status: 'upcoming'
    },
    {
      title: 'Harberger-Tax Featured Listings',
      description: 'Add a featured listing banner which can be controlled via a Harberger-tax system.',
      status: 'upcoming'
    },
    {
      title: 'Daily Snapshot System',
      description: 'Lays groundwork for social & curation features by constructing a daily snapshot system into the SEEN HAUS API',
      status: 'upcoming'
    },
    {
      title: 'Curation',
      description: 'Add support for voting on artist applications for self-minting on SEEN HAUS',
      status: 'upcoming'
    },
    {
      title: 'Social Features',
      description: 'Add support for comments & likes on drops',
      status: 'upcoming'
    },
    {
      title: '[CLASSIFIED]',
      description: 'An experimental new offering for the SEEN HAUS platform.',
      status: 'upcoming'
    }
  ]
}

export {roadmap};