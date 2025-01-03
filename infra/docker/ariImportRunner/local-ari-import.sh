#!/bin/sh
cd /app/api
npm run ariImport -- dryRun=true reportFormat=file
cat ari-import-report.txt