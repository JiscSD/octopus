const AWS = require("@aws-sdk/client-ses");

const postToPubrouter = async (pdfMetadata) => {
  const apiEndpoint = `https://uat.pubrouter.jisc.ac.uk/api/v4/validate?api_key=${process.env.PUBROUTER_API_KEY}`;

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pdfMetadata),
  });

  return response.json();
};

const retryPostingPublication = async (pdfMetadata, publicationId) => {
  const apiResponse = await postToPubrouter(pdfMetadata);

  if (apiResponse.status !== "200") {
    await sendFailureEmail(
      apiResponse,
      "PubRouter delivery has failed",
      publicationId
    );
  } else {
    return;
  }
};

const sendFailureEmail = async (error, reason, publicationId) => {
  const ses = new AWS.SES();

  const emailParams = {
    Destination: {
      ToAddresses: [process.env.EMAIL_RECIPIENT],
    },
    Message: {
      Body: {
        Text: {
          Data: `Publication Id: ${publicationId}, Reason: ${reason}, Error Message: ${JSON.stringify(
            error
          )}`,
        },
      },
      Subject: {
        Data: "A PubRouter delivery has failed.",
      },
    },
    Source: "octopus@mail.octopus.ac",
  };

  return ses.sendEmail(emailParams);
};

const mapPublicationToMetadata = (publication, pdfUrl) => {
  const formatAuthor = (author, coAuthor) => {
    return {
      type: coAuthor ? "author" : "corresp",
      name: {
        firstname: author.firstName,
        surname: author.lastName,
        fullname: `${author.lastName && author.lastName + ", "}${
          author.firstName
        }`,
      },
      identifier: [
        {
          type: "orcid",
          id: author.orcid,
        },
      ],
      affiliations: author.affiliations?.map((affiliation) => ({
        identifier: [
          {
            type: affiliation.ror ? "ROR" : "Link",
            id: affiliation.link,
          },
        ],
        org: affiliation.name,
        city: affiliation.city,
        country: affiliation.country,
      })),
    };
  };

  return {
    event: "submitted",
    provider: {
      agent: "Octopus",
    },
    content: {
      packaging_format: publication.doi,
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
        volume: "<Number of a journal (or other document) within a series>",
        identifier: [
          {
            type: "doi",
            id: "https://doi.org/10.57874/OCTOPUS",
          },
        ],
      },
      publication_status: "Published",
      article: {
        title: publication.title,
        type: publication.type,
        version: "VOR",
        language: publication.language,
        e_num:
          "<Electronic article number - an alternative to page_range / start_page / end_page>",
        identifier: {
          type: "doi",
          id: publication.doi,
          subject: publication.keywords,
        },
      },
      author: publication.coAuthors
        ?.map((author) => formatAuthor(author, true))
        .push(formatAuthor(publication.user, false)),
      publication_date: {
        date: publication.createdAt,
        year: "2023",
        month: "01",
        day: "01",
      },
      publication_status: "Published",
      accepted_date: "2023-01-01",
      funding: publication.funders?.map((funder) => ({
        name: funder.name,
        identifier: [
          {
            type: "ror",
            id: funder.ror,
          },
        ],
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

exports.handler = async (event) => {
  const key = event.Records[0].s3.object.key;
  const publicationId = key.replace(/\.pdf$/, "");
  const bucket = event.Records[0].s3.bucket.name;

  const pdfUrl = `https:/.s3.eu-west-1.amazonaws.com/${bucket}/${key}`;

  const publication = await fetch(
    `https://${process.env.ENVIRONMENT}.api.octopus.ac/v1/publications/${publicationId}`
  );

  if (publication.ok) {
    const pdfMetadata = mapPublicationToMetadata(publication, pdfUrl);

    const apiResponse = await postToPubrouter(pdfMetadata);

    // Check the API response and handle failures
    if (apiResponse.status !== "200") {
      await retryPostingPublication(pdfMetadata, publicationId);
    }
  } else {
    await sendFailureEmail(
      publication.error,
      "Publication could not be retrieved from the Octopus API",
      publicationId
    );
  }
};
