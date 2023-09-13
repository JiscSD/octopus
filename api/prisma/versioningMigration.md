## Migrating existing data from non-versioned to versioned

This requires a few more steps than a typical migration in order to preserve existing data. To make sure we don't lose data, the idea for this is as follows:
 - run a migration to add new fields to the database (initially optional), and mark old fields to be deleted as optional (so that we don't run into issues when we delete them)
 - run a script to move existing data from its old place in the database to its new place
 - run a second migration to remove the parts of the database we no longer need and set new fields as mandatory where needed
 - each publication will now be a versioned publication with 1 version

### Instructions
1. Back up / snapshot the database to be migrated
2. Check out the commit where only the first migration of the two we need to apply (20230907140932_versioning_pre_migration) is present
    1. The hash for this commit is: 62608fb320a45708f0a61d2e0d33ac73677079a6 (`git checkout 62608fb320a45708f0a61d2e0d33ac73677079a6`)
    2. Prisma does not allow you to apply pending migrations one by one, but we don't want to apply both of our migrations at this stage. So we need to make sure only the first migration is checked out for now
3. Move to the `api` directory
4. Run the first migration - on int/prod, run `npx prisma migrate deploy`. On local env, run `npx prisma migrate dev`
5. Check out the commit where the second migration (20230907143139_versioning_post_migration) and latest version of the migration script are both present
    1. The hash for this commit is: 381f14e8d981e3aa738451f16469df525284b657 (`git checkout 381f14e8d981e3aa738451f16469df525284b657`)
6. Run the script to move the data to its new place: `npm run migrateToVersionedPublications`
7. Run the second migration by repeating the command you used in step 4
8. Confirm (using e.g. prisma studio) that the migrations worked. For example, there should be the same number of rows in the Publication and PublicationVersion tables, and the fields should be populated where appropriate in the PublicationVersion table
9. Finally, check out the branch itself to make sure you're up to date, then repeat the command from step 4 one more time to apply any further prisma migrations (these don't require running any more scripts in between)

### Further note
Once this process has been done successfully on prod, this .md file, the migrateToVersionedPublications.ts script, and the line to call it in package.json can be removed.