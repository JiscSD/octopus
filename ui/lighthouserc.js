module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run start',
            url: [
                'http://localhost:3000/',
                'http://localhost:3000/browse',
                'http://localhost:3000/about',
                // 'http://localhost:3000/create', // Cant yet test on create due to login
                'http://localhost:3000/user-terms',
                'http://localhost:3000/privacy',
                'http://localhost:3000/search',
                'http://localhost:3000/accessibility',
                'http://localhost:3000/faq'
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
