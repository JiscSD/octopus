## Migrating existing data from non-versioned to versioned

This requires a few more steps than a typical migration in order to preserve existing data. To make sure we don't lose data, the idea for this is as follows:

-   run a migration to add new fields to the database (initially optional), and mark old fields to be deleted as optional (so that we don't run into issues when we delete them)
-   run a script to move existing data from its old place in the database to its new place
-   run a second migration to remove the parts of the database we no longer need and set new fields as mandatory where needed
-   each publication will now be a versioned publication with 1 version

## Before you start

I recommend following this guide outside your IDE, for example on github, so you don't accidentally view an older version of it when checking out different commit hashes.

### Instructions

1. Back up / snapshot the database to be migrated
2. Check out the commit where only the first migration of the two we need to apply (20231013140300_versioning_pre_migration) and the migration script are present
    1. The hash for this commit is: 5c5a92ad5973569197d9435fdbd3bb150954ad52 (`git checkout 5c5a92ad5973569197d9435fdbd3bb150954ad52`)
    2. Prisma does not allow you to apply pending migrations one by one, but we don't want to apply both of our migrations at this stage. So we need to make sure only the first migration is checked out for now
3. Move to the `api` directory
4. Run the first migration - on int/prod, run `npx prisma migrate deploy`. On local env, run `npx prisma migrate dev`
5. Run `npx prisma generate` to generate the types for the migration script to run without errors
6. Run the script to move the data to its new place: `npm run migrateToVersionedPublications`
7. Check out the commit where the second migration (20231013143433_versioning_post_migration) is present
    1. The hash for this commit is: e39ab05720b745cb4ae5bd0e39a02da80a11afa9 (`git checkout e39ab05720b745cb4ae5bd0e39a02da80a11afa9`)
8. Run the second migration by repeating the command you used in step 4
9. Confirm (using e.g. prisma studio) that the migrations worked. For example, there should be the same number of rows in the Publication and PublicationVersion tables, and the fields should be populated where appropriate in the PublicationVersion table
10. Finally, check out the branch itself to make sure you're up to date
