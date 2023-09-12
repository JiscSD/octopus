import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const baseJSONResponse = (statusCode, body) => ({
  body: JSON.stringify(body),
  headers: {
      'Content-Type': 'application/json'
  },
  statusCode
});

export const handler = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  const pdfUrl = `https://${bucket}.s3.amazonaws.com/${key}`;

  const publicationId = key.replace(/\.pdf$/, "");

  try {
    const publicationResponse = await fetch(
      `https://${process.env.ENVIRONMENT}.api.octopus.ac/v1/publications/${publicationId}`,
      { method: "GET" }
    );
    const publication = await publicationResponse.json();

    console.log('Fetched publication: ', JSON.stringify(publication));

    const pdfMetadata = mapPublicationToMetadata(publication, pdfUrl);

    console.log('PDF metadata: ', JSON.stringify(pdfMetadata));

    const apiResponse = await postToPubrouter(pdfMetadata);

    console.log('Pubrouter response: ', apiResponse);

    // Check the API response and handle failures
    if (apiResponse.status === "success") {
      return baseJSONResponse(200, "Successfully submitted to publication router");
    } else {
      // Retry once
      console.log('First attempt failed; retrying');
      const retry = await postToPubrouter(pdfMetadata);
      if (retry.status === "success") {
        return baseJSONResponse(200, "Successfully submitted to publication router");
      } else {
        await sendFailureEmail(JSON.stringify(retry), event, publicationId);
        return baseJSONResponse(500, "Failed to submit to publication router");
      }
    }
  } catch (error) {
    console.log('Error uploading to pubrouter: ', error.message);
    await sendFailureEmail(error, event, publicationId);
    return baseJSONResponse(500, "Error submitting to publication router");
  }
};

const postToPubrouter = async (pdfMetadata) => {
  // We use a different API key per publication type.
  const apiKeys = JSON.parse(process.env.PUBROUTER_API_KEYS);
  if (!Object.keys(apiKeys).includes(pdfMetadata.metadata.article.type)) {
    throw new Error(`Publication type "${pdfMetadata.metadata.article.type}" not found in API keys object`);
  } else {
    const apiKey = apiKeys[pdfMetadata.metadata.article.type];
    // Temporarily using the validation endpoint, instead of the notification one
    const apiEndpoint = `https://uat.pubrouter.jisc.ac.uk/api/v4/validate?api_key=${apiKey}`;
    // const apiEndpoint = `https://uat.pubrouter.jisc.ac.uk/api/v4/notification?api_key=${apiKey}`;
  
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pdfMetadata),
    });
  
    return response.json();
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

const mapPublicationToMetadata = (publication, pdfUrl) => {
  const formatAuthor = (author) => {
    return {
      type: (author.linkedUser === publication.user.id) ? "corresp" : "author",
      name: {
        firstname: author.user.firstName,
        surname: author.user.lastName || '',
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
          ...(
            affiliation.organization['disambiguated-organization'] &&
            affiliation.organization['disambiguated-organization']['disambiguation-source'] === 'ROR'
          ) ? [{
            type: "ROR",
            id: affiliation.organization['disambiguated-organization']['disambiguated-organization-identifier']
          }] : [],
          ...affiliation.url ? [{
            type: "Link",
            id: affiliation.url
          }] : [],
        ],
        org: affiliation.organization.name,
        city: affiliation.organization.address.city,
        country: affiliation.organization.address.country,
      })),
    };
  };

  const formattedPublicationDate = publication.createdAt.slice(0, 10);

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
        title: publication.title,
        type: publication.type,
        version: "VOR",
        language: [publication.language],
        identifier: [{
          type: "doi",
          id: publication.doi
        }],
      },
      author: publication.coAuthors?.map((author) => formatAuthor(author)),
      publication_date: {
        date: formattedPublicationDate,
        year: formattedPublicationDate.slice(0, 4),
        month: formattedPublicationDate.slice(5, 7),
        day: formattedPublicationDate.slice(8, 10),
      },
      accepted_date: formattedPublicationDate,
      publication_status: "Published",
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
