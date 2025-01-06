#!/bin/sh
cd /app/api
npm run ariImport -- dryRun=false reportFormat=file
cat ari-import-report.txt