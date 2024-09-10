import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const baseJSONResponse = (statusCode, body) => ({
  body: JSON.stringify(body),
  headers: {
    "Content-Type": "application/json",
  },
  statusCode,
});

const publicationTypePrefix = "Octopus article; ";

// When a PDF is put into the S3 bucket, take the publication ID from the PDF filename, get the latest live
// version of that publication, and format its metadata into a specific JSON format before sending that to pubrouter.
export const handler = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  // Whether we are validating our metadata (using the pubrouter validate endpoint), as opposed to sending it for real.
  // As of OC-898 we are using the real (notification) endpoint on int and prod.
  const validate = false;

  const pdfUrl = `https://${bucket}.s3.amazonaws.com/${key}`;

  const publicationId = key.replace(/\.pdf$/, "");

  try {
    const publicationVersionResponse = await fetch(
      `https://${process.env.ENVIRONMENT}.api.octopus.ac/v1/publications/${publicationId}/publication-versions/latestLive`,
      { method: "GET" }
    );
    const publicationVersion = await publicationVersionResponse.json();

    console.log(
      "Fetched publication version: ",
      JSON.stringify(publicationVersion)
    );

    // If publication was written by Science Octopus (seed data), don't send.
    if (publicationVersion.user && publicationVersion.user.id === "octopus") {
      console.log("Publication author is Octopus user, ignoring");
      return baseJSONResponse(
        200,
        "Publication author is Octopus user, ignoring"
      );
    }

    const pdfMetadata = mapPublicationVersionToMetadata(
      publicationVersion,
      pdfUrl
    );

    console.log("PDF metadata: ", JSON.stringify(pdfMetadata));

    const apiResponse = await postToPubrouter(pdfMetadata, validate);
    const apiResponseJSON = await apiResponse.json();

    console.log("Pubrouter response JSON: ", apiResponseJSON);

    // Check the API response and handle failures
    // If validating, don't retry on a validation failure.
    if (
      apiResponse.ok ||
      (validate && apiResponseJSON.summary.startsWith("Validation failed"))
    ) {
      return baseJSONResponse(
        200,
        "Successfully submitted to publication router"
      );
    } else {
      // Retry once
      console.log("First attempt failed; retrying");
      const retry = await postToPubrouter(pdfMetadata, validate);
      if (retry.ok) {
        return baseJSONResponse(
          200,
          "Successfully submitted to publication router"
        );
      } else {
        const retryJSON = await retry.json();
        await sendFailureEmail(JSON.stringify(retryJSON), event, publicationId);
        return baseJSONResponse(500, "Failed to submit to publication router");
      }
    }
  } catch (error) {
    console.log("Error uploading to pubrouter: ", error.message);
    await sendFailureEmail(error, event, publicationId);
    return baseJSONResponse(500, "Error submitting to publication router");
  }
};

const postToPubrouter = async (pdfMetadata, validate = false) => {
  const publicationType = pdfMetadata.metadata.article.type.replace(
    publicationTypePrefix,
    ""
  );
  // We use a different API key per publication type.
  const apiKeys = JSON.parse(process.env.PUBROUTER_API_KEYS);
  if (!Object.keys(apiKeys).includes(publicationType)) {
    throw new Error(
      `Publication type "${publicationType}" not found in API keys object`
    );
  } else {
    const apiKey = apiKeys[publicationType];
    // Temporarily using the validation endpoint, instead of the notification one
    const apiEndpoint = validate
      ? `https://uat.pubrouter.jisc.ac.uk/api/v4/validate?api_key=${apiKey}`
      : `https://uat.pubrouter.jisc.ac.uk/api/v4/notification?api_key=${apiKey}`;

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pdfMetadata),
    });

    return response;
  }
};

const sendFailureEmail = async (error, event, publicationId) => {
  const client = new SESClient({ region: "eu-west-1" });

  const emailParams = {
    Destination: {
      ToAddresses: [process.env.EMAIL_RECIPIENT],
    },
    Message: {
      Body: {
        Text: {
          Data: `Publication Id: ${publicationId}, Error: ${error}, Event: ${event}`,
        },
      },
      Subject: {
        Data: "A PubRouter delivery has failed.",
      },
    },
    Source: "octopus@mail.octopus.ac",
  };

  const command = new SendEmailCommand(emailParams);

  return client.send(command);
};

const mapPublicationVersionToMetadata = (publicationVersion, pdfUrl) => {
  const formatAuthor = (author) => {
    return {
      type:
        author.linkedUser === publicationVersion.user.id ? "corresp" : "author",
      name: {
        firstname: author.user.firstName,
        surname: author.user.lastName || "",
        fullname: `${author.user.lastName && author.user.lastName + ", "}${
          author.user.firstName
        }`,
      },
      identifier: [
        {
          type: "orcid",
          id: author.user.orcid,
        },
      ],
      affiliations: author.affiliations?.map((affiliation) => ({
        identifier: [
          ...(affiliation.organization["disambiguated-organization"] &&
          affiliation.organization["disambiguated-organization"][
            "disambiguation-source"
          ] === "ROR"
            ? [
                {
                  type: "ROR",
                  id: affiliation.organization["disambiguated-organization"][
                    "disambiguated-organization-identifier"
                  ],
                },
              ]
            : []),
          ...(affiliation.url
            ? [
                {
                  type: "Link",
                  id: affiliation.url,
                },
              ]
            : []),
        ],
        org: affiliation.organization.name,
        city: affiliation.organization.address.city,
        country: affiliation.organization.address.country,
      })),
    };
  };

  const formattedPublicationDate = publicationVersion.createdAt.slice(0, 10);
  const publication = publicationVersion.publication;

  return {
    provider: {
      agent: "Octopus",
    },
    links: [
      {
        format: "application/pdf",
        url: pdfUrl,
      },
    ],
    metadata: {
      journal: {
        title: "Octopus",
        publisher: ["Octopus"],
        identifier: [
          {
            type: "doi",
            id: "https://doi.org/10.57874/OCTOPUS",
          },
        ],
      },
      article: {
        title: publicationVersion.title,
        abstract: publicationVersion.description,
        type: `${publicationTypePrefix}${publicationVersion.publication.type}`,
        version: "SMUR",
        language: [publicationVersion.language],
        identifier: [
          {
            type: "doi",
            id: publication.doi,
          },
        ],
        e_num: publication.id, // DOI suffix e.g. "abcd-efgh"
      },
      author: publicationVersion.coAuthors?.map((author) =>
        formatAuthor(author)
      ),
      publication_date: {
        date: formattedPublicationDate,
        year: formattedPublicationDate.slice(0, 4),
        month: formattedPublicationDate.slice(5, 7),
        day: formattedPublicationDate.slice(8, 10),
      },
      accepted_date: formattedPublicationDate,
      publication_status: "Published",
      funding: publicationVersion.funders?.map((funder) => ({
        name: funder.name,
        ...(funder.ror && {
          identifier: [
            {
              type: "ror",
              id: funder.ror,
            },
          ],
        }),
        ...(funder.grantId && { grant_numbers: [funder.grantId] }),
      })),
      license_ref: [
        {
          title: "CC-BY 4.0",
          type: "CC-BY 4.0",
          url: "https://creativecommons.org/licenses/by/4.0/",
        },
      ],
      peer_reviewed: false,
    },
  };
};
