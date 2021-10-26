export default {
    data() {
        return {
            menu:
                [
                    {
                        title: 'Drops',
                        url: 'drops',
                        icon: 'icon-fire.svg'
                    },
                    {
                        title: 'Creators',
                        url: 'artists'
                    },
                    {
                        title: 'Stake',
                        url: 'stake',
                    },
                    {
                        title: 'Create',
                        url: 'create',
                    },
                    {
                        title: 'Press',
                        url: [
                            {
                                title: 'Podcasts',
                                url: 'https://anchor.fm/seenhaus'
                            },
                            {
                                title: 'Newsletters',
                                url: 'https://seen-haus.medium.com/'
                            }
                        ]
                    }
                ],
                mobileOnlyItems: [
                    {
                        title: 'Notifications',
                        url: 'notifications'
                    },
                ]
        }
    }
}