const AWS = require("aws-sdk");
const fetch = require("node-fetch");

AWS.config.update({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    const pdfUrl = `https://${bucket}.s3.amazonaws.com/${key}`;

    const publicationId = key.replace(/\.pdf$/, "");

    const publication = await fetch(
      `https://${process.env.ENVIRONMENT}.api.octopus.ac/v1/publications/${publicationId}`,
      { method: "GET" }
    );

    const pdfMetadata = mapPublicationToMetadata(publication, pdfUrl);

    const apiResponse = await postToPubrouter(pdfMetadata);

    // Check the API response and handle failures
    if (apiResponse.status !== "success") {
      await retryPostingPublication(pdfMetadata);
    }
  } catch (error) {
    await sendFailureEmail(error, event, publicationId);
  }
};

const postToPubrouter = async (pdfMetadata) => {
  const apiEndpoint = `https://pubrouter.jisc.ac.uk/api/v4/notification?api_key=${process.env.PUBROUTER_API_KEY}`;

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pdfMetadata),
  });

  return response.json();
};

const retryPostingPublication = async (pdfMetadata) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return postToPubrouter(pdfMetadata);
};

const sendFailureEmail = async (error, event, publicationId) => {
  const ses = new AWS.SES();

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

  return ses.sendEmail(emailParams).promise();
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
      affiliations: author.affiliations.map((affiliation) => ({
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
    event: "Published",
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
        identifier: [
          {
            type: "doi",
            id: "https://doi.org/10.57874/OCTOPUS",
          },
        ],
      },
      article: {
        title: publication.title,
        type: publication.type,
        version: "VoR",
        language: publication.language,
        identifier: {
          type: "doi",
          id: publication.doi,
          subject: publication.keywords,
        },
      },
      author: publication.coAuthors
        .map((author) => formatAuthor(author, true))
        .push(formatAuthor(publication.user, false)),
      publication_date: {
        date: publication.createdAt,
      },
      publication_status: "Published",
      funding: publication.funders.map((funder) => ({
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
