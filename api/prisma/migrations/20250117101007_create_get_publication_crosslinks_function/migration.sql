CREATE FUNCTION get_publication_crosslinks (
  publication_id text,
  user_id_filter text DEFAULT null,
  search text DEFAULT null,
  excluded_publication_ids text[] DEFAULT array[]::text[],
  order_on text DEFAULT null,
  limit_to integer DEFAULT 10,
  offset_by integer DEFAULT 0
)
RETURNS TABLE (
  id text,
  linkedPublicationId text,
  createdBy text,
  createdAt timestamp with time zone,
  score integer,
  linkedPublicationLatestLiveVersionId text,
  linkedPublicationTitle text,
  linkedPublicationPublishedDate timestamp with time zone,
  linkedPublicationAuthorId text,
  linkedPublicationAuthorFirstName text,
  linkedPublicationAuthorLastName text
)
LANGUAGE SQL AS $func$
SELECT
  *
FROM
  (
    SELECT
      c.id,
      c."publicationToId" AS "linkedPublicationId",
      c."createdBy",
      c."createdAt",
      c.score,
      pv.id AS "linkedPublicationLatestLiveVersionId",
      pv.title AS "linkedPublicationTitle",
      pv."publishedDate" AS "linkedPublicationPublishedDate",
      pvu.id AS "linkedPublicationAuthorId",
      pvu."firstName" AS "linkedPublicationAuthorFirstName",
      pvu."lastName" AS "linkedPublicationAuthorLastName"
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
      c."publicationFromId" AS linkedPublicationId,
      c."createdBy",
      c."createdAt",
      c.score,
      pv.id AS "linkedPublicationLatestLiveVersionId",
      pv.title AS linkedPublicationTitle,
      pv."publishedDate" AS "linkedPublicationPublishedDate",
      pvu.id AS "linkedPublicationAuthorId",
      pvu."firstName" AS "linkedPublicationAuthorFirstName",
      pvu."lastName" AS "linkedPublicationAuthorlastName"
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
  "createdAt" DESC
LIMIT
  limit_to
OFFSET
  offset_by;
$func$;