module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run start',
            url: [
                'http://localhost:3000/',
                'http://localhost:3000/browse',
                'http://localhost:3000/about',
                'http://localhost:3000/create',
                'http://localhost:3000/feedback',
                'http://localhost:3000/legal',
                'http://localhost:3000/privacy',
                'http://localhost:3000/search'
            ]
        },
        upload: {
            target: 'temporary-public-storage'
        }
    }
};
