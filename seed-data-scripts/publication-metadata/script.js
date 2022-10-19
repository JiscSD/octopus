/**
 * PUBLICATION METADATA
 *
 * This script extracts all the DOI URLs from a given txt file and fetches the corresponding metadata for each
 *
 * After fetching all the DOI URLs it will output the results into a [file_name]_references.json file as follows:
 * [
 *  {
 *    "https://doi.org/10.1109/ISE.2011.6084970": "P. V. Menezes, J. Martin, M. Schäfer and K. . -M. Weitzel, "Bombardment induced ion transport through an ion-conducting Ca30 glass," 2011 - 14th International Symposium on Electrets, 2011, pp. 37-38. https://doi.org/10.1109/ISE.2011.6084970"
 *  }
 * ]
 *
 * To run the script:
 * - install all the required npm modules with 'npm i'
 * - run the script with the following command: 'node script.js [file_name].txt'
 */

import axios from "axios";
import axiosRetry from "axios-retry";
import fs from "fs";

// Make sure we got the filename on the command line.
if (process.argv.length < 3) {
  console.log("PLEASE PROVIDE THE SEED DATA FILE NAME!");
  process.exit(1);
}

const FILE_NAME = process.argv[2];
const LOGS_FILE = "logs.txt";
const CHUNK_SIZE = 10;

const getURLsFromText = (text) =>
  text.match(
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:()<>;\/~+#-]*[\w@?^=%&\/~+#-])/g
  ) || [];

const validateDOI = (value) =>
  /(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b/.test(value);

const createLogsFile = (logsArray) => {
  fs.writeFile(LOGS_FILE, logsArray.join("\n"), (error) => {
    if (error) {
      console.log(error.message);
    }
  });
};

const getMetadata = async () => {
  const fetchedDOIs = [];
  const logs = [];

  const addToLogs = (text) => {
    const timestamp = new Date().toLocaleTimeString();
    const message = `${timestamp}\t${text}`;
    console.log(message);
    logs.push(message);
  };

  try {
    fs.readFile(FILE_NAME, "utf8", async (error, data) => {
      if (error) throw error;

      // extract doi urls as a Set from the entire seed data file
      const doiUrls = [
        ...new Set(getURLsFromText(data).filter((url) => validateDOI(url))),
      ];

      if (!doiUrls.length) {
        // don't do anything
        return;
      }

      const client = axios.create({
        headers: {
          Accept: "text/x-bibliography",
          style: "harvard-cite-them-right",
        },
      });

      axiosRetry(client, {
        retries: 3,
        shouldResetTimeout: true,
        retryDelay: (retryCount, error) => {
          if (error.response?.status === 429) {
            // api requests limit reached https://support.datacite.org/docs/is-there-a-rate-limit-for-making-requests-against-the-datacite-apis
            return 5 * 60 * 1000; // wait for 5 mins
          }

          return retryCount * 1000;
        },
        retryCondition: (error) => error.response?.status !== 404, // don't retry on 404
      });

      const nrOfChunks = Math.ceil(doiUrls.length / CHUNK_SIZE); // fetch urls in chunks
      let cursor = 0;
      for (let i = 0; i < nrOfChunks; i++) {
        const currentChunk = doiUrls.slice(cursor, cursor + CHUNK_SIZE);

        const promises = currentChunk.map((url) => {
          addToLogs(`FETCHING => ${url}`);

          return client.get(url).catch((error) => {
            addToLogs(`ERROR => ${error.message} => ${url}`);
            return error;
          });
        });

        const results = await Promise.all(promises);

        results.forEach((result, index) => {
          if (!(result instanceof Error)) {
            fetchedDOIs.push({ [currentChunk[index]]: result.data });
          }
        });

        cursor += CHUNK_SIZE;
        if (doiUrls.length - cursor > 0) {
          addToLogs(`REMAINING ${doiUrls.length - cursor}`);
        }
      }

      const parts = FILE_NAME.split(".");
      const ext = parts[parts.length - 1];

      fs.writeFile(
        `${FILE_NAME.replace(`.${ext}`, "")}_references.json`,
        JSON.stringify(fetchedDOIs),
        { encoding: "utf8" },
        async (error) => {
          if (error) {
            throw error;
          }
        }
      );
    });
  } catch (error) {
    addToLogs(`ERROR => ${error.message}`);
  } finally {
    createLogsFile(logs);
  }
};

getMetadata();
