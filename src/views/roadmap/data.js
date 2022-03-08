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
        title: 'ROADMAP UPDATE',
        description: 'Added this roadmap page to the website as a means to more effectively display progress being made going forward',
        githubCommits: {
          'frontend': [
            'https://github.com/seen-haus/seen-app/commit/d112fedc16a08eae13eed30c7fdb2b7039586b65'
          ],
        },
        status: 'complete'
      }
    ]
  },
  'Upcoming': [
    {
      title: '0xmons x SEEN HAUS Collab Claim Flow',
      description: 'Construction of claiming flow for 2nd iteration of 0xmons x SEEN HAUS collaboration',
      githubCommits: {
        'frontend': [
          'https://github.com/seen-haus/seen-app/commits/feat/0xmons-claim'
        ],
        'contracts': [
          'https://github.com/JayWelsh/claim-against-nft/commit/59dd22bedd92a3d4cd4f40503b2feae5df962fbf',
        ]
      },
      status: 'in-progress'
    },
    {
      title: 'Migrate Physical Drops to V3 contracts',
      description: 'Migrates the existing physical drops process and claiming procedure over to the SEEN HAUS V3 contracts',
      status: 'upcoming'
    },
    {
      title: 'Revamp Email Notification System',
      description: 'Add support for bid alerts, rework existing notification system for increased reliability, add VRF drop support for claim alerts & add sale claim alert support',
      status: 'upcoming'
    },
    {
      title: 'Harberger-tax featured listings',
      description: 'Add a featured listing banner which can be controlled via a Harberger-tax system.',
      status: 'upcoming'
    },
    {
      title: 'Daily snapshot system',
      description: 'Lays groundwork for social & curation features by constructing a daily snapshot system into the SEEN HAUS API',
      status: 'upcoming'
    },
    {
      title: 'Curation',
      description: 'Add support for voting on artist applications for self-minting on SEEN HAUS',
      status: 'upcoming'
    },
    {
      title: 'Social features',
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