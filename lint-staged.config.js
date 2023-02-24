module.exports = {
    '**/*.(js|ts|tsx)?(x)': (filenames) =>
      filenames.length > 10 ? 'npm run lint:fix' : `eslint --fix ${filenames.join(' ')}`,
  }
