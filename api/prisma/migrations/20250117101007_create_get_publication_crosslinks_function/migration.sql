CREATE FUNCTION get_publication_crosslinks (
  publication_id text,
  user_id_filter text DEFAULT null,
  search text DEFAULT null,
  excluded_publication_ids text[] DEFAULT array[]::text[],
  order_on text DEFAULT null,
  limit_to integer DEFAULT null,
  offset_by integer DEFAULT 0
)
RETURNS TABLE (
  id text,
  linked_publication_id text,
  created_by text,
  created_at timestamp with time zone,
  score integer,
  linked_publication_latest_live_version_id text,
  linked_publication_title text,
  linked_publication_published_date timestamp with time zone,
  linked_publication_author_id text,
  linked_publication_author_first_name text,
  linked_publication_author_last_name text
)
LANGUAGE SQL AS $func$
SELECT
  *
FROM
  (
    SELECT
      c.id,
      c."publicationToId" AS linked_publication_id,
      c."createdBy" AS created_by,
      c."createdAt" AS created_at,
      c.score,
      pv.id AS linked_publication_latest_live_version_id,
      pv.title AS linked_publication_title,
      pv."publishedDate" AS linked_publication_published_date,
      pvu.id AS linked_publication_author_id,
      pvu."firstName" AS linked_publication_author_first_name,
      pvu."lastName" AS linked_publication_author_last_name
    FROM
      "Crosslink" AS c
      JOIN "PublicationVersion" AS pv ON c."publicationToId" = pv."versionOf"
      JOIN "User" AS pvu ON pvu.id = pv."createdBy"
    WHERE
      c."publicationFromId" = publication_id
      AND pv."isLatestLiveVersion"
      --- Conditional WHERE clauses - only apply if param is not empty/null
      AND (
        user_id_filter IS NULL
        OR c."createdBy" = user_id_filter
      )
      AND (
        search IS NULL
        OR to_tsvector('english', pv.title) @@ to_tsquery('english', search)
      )
      AND (
        NOT (array_length(excluded_publication_ids, 1) > 0)
        OR NOT (c."publicationToId" = ANY (excluded_publication_ids))
      )
    UNION
    SELECT
      c.id,
      c."publicationFromId" AS linked_publication_id,
      c."createdBy" AS created_by,
      c."createdAt" AS created_at,
      c.score,
      pv.id AS linked_publication_latest_live_version_id,
      pv.title AS linked_publication_title,
      pv."publishedDate" AS linked_publication_published_date,
      pvu.id AS linked_publication_author_id,
      pvu."firstName" AS linked_publication_author_first_name,
      pvu."lastName" AS linked_publication_author_last_name
    FROM
      "Crosslink" AS c
      JOIN "PublicationVersion" AS pv ON c."publicationFromId" = pv."versionOf"
      JOIN "User" AS pvu ON pvu.id = pv."createdBy"
    WHERE
      c."publicationToId" = publication_id
      AND pv."isLatestLiveVersion"
      --- Conditional WHERE clauses - only apply if param is not empty/null
      AND (
        user_id_filter IS NULL
        OR c."createdBy" = user_id_filter
      )
      AND (
        search IS NULL
        OR to_tsvector('english', pv.title) @@ to_tsquery('english', search)
      )
      AND (
        NOT (array_length(excluded_publication_ids, 1) > 0)
        OR NOT (c."publicationFromId" = ANY (excluded_publication_ids))
      )
  ) AS crosslinks
  --- Recency order is default and also used to order results with the same score when
  --- sorting by relevance.
ORDER BY
  (
    CASE
      WHEN order_on = 'relevant' THEN score
    END
  ) DESC,
  created_at DESC
LIMIT
  limit_to
OFFSET
  offset_by;
$func$;