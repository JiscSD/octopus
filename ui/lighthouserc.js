module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run start',
            url: ['http://localhost:3000/', 'http://localhost:3000/browse']
        },
        upload: {
            target: 'temporary-public-storage'
        }
    }
};
