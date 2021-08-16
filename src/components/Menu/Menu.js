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
                        title: 'Gallery',
                        url: [
                            {
                                title: 'Top Collectors',
                                url: 'collectors'
                            },
                            {
                                title: 'VR Gallery',
                                url: 'https://www.cryptovoxels.com/play?coords=S@105W,125N'
                            }
                        ]
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