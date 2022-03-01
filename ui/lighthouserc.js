module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run start',
            url: [
                'http://localhost:3000/',
                'http://localhost:3000/browse',
                'http://localhost:3000/about',
                'http://localhost:3000/legal',
                'http://localhost:3000/privacy',
                'http://localhost:3000/search'
            ]
        },
        assert: {
            assertions: {
                'categories:accessibility': ['error', { minScore: 0.95 }]
            }
        },
        upload: {
            target: 'temporary-public-storage'
        }
    }
};
