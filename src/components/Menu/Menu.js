export default {
    data() {
        return {
            menu:
                [
                    {
                        title: 'Drops',
                        url: 'drops',
                    },
                    {
                        title: 'Creators',
                        url: 'artists'
                    },
                    {
                        title: 'Curate',
                        url: 'curateSelfMinters',
                    },
                ],
            mobileOnlyItems: [
                {
                    title: 'Roadmap',
                    url: 'roadmap',
                },
                {
                    title: 'Notifications',
                    url: 'notifications'
                },
            ],
            desktopOnlyItems: [
                {
                    title: 'Create',
                    url: 'create',
                },
                {
                    title: 'Roadmap',
                    url: 'roadmap',
                },
            ]
        }
    }
}