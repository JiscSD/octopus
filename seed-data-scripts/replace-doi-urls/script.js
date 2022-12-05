/**
 * REPLACE DOI URLS WITH REFERENCES TEXT
 *
 * This script removes doi urls duplicates (per publication) and replaces them with their corresponding reference text from the json file
 *
 * It takes 2 file arguments: [seed_data].txt and [references_file].json
 *
 * [references_file].json must contain an array with references object of the form:
 *
 * [
 *    {
        "https://doi.org/10.1016/J.COMPSTRUCT.2013.04.026": "Isbilir, O., & Ghassemieh, E. (2013). Numerical investigation of the effects of drill geometry on drilling induced delamination of carbon fiber reinforced composites. Composite Structures, 105, 126–133. https://doi.org/10.1016/j.compstruct.2013.04.026\n"
      },
      {
        "https://doi.org/10.3390/APP11094285": "Aamir, M., Tolouei-Rad, M., Giasin, K., Vafadar, A., Koklu, U., & Keeble, W. (2021). Evaluation of the Surface Defects and Dimensional Tolerances in Multi-Hole Drilling of AA5083, AA6061, and AA2024. Applied Sciences, 11(9), 4285. https://doi.org/10.3390/app11094285\n"
      },
      {
        "https://doi.org/10.2351/1.5058920": "Sárady, I., Beck, Th., Bostanjoglo, G., Phillipps, G., & Schmidt, I. (1995). Drilling and cutting of superalloys with Q-switched and modulated Nd:YAG laser pulses. International Congress on Applications of Lasers &amp; Electro-Optics. https://doi.org/10.2351/1.5058920\n"
      },
      ...
 * ]
 *
 * The result will be written in a new [seed_data]_updated.txt file
 *
 * To run the script:
 * - run the script with the following command: 'node script.js [seed_data].txt [references_file].json'
 */

const fs = require("fs");

// Make sure we got the filenames on the command line.
if (process.argv.length < 4) {
  console.log(
    "PLEASE PROVIDE THE SEED DATA FILE NAME AND THE REFERENCES JSON FILE NAME!"
  );
  process.exit(1);
}

const SEED_DATA_FILE = process.argv[2];
const REFERENCES_JSON = process.argv[3];

if (SEED_DATA_FILE.split(".").pop() !== "txt") {
  console.log("PLEASE PROVIDE A VALID SEED DATA TXT FILE!");
  process.exit(1);
}

if (REFERENCES_JSON.split(".").pop() !== "json") {
  console.log("PLEASE PROVIDE A VALID REFERENCES JSON FILE!");
  process.exit(1);
}

const referencesArray = require(`./${REFERENCES_JSON}`);

if (!Array.isArray(referencesArray)) {
  console.log(
    "REFERENCES JSON FILE MUST CONTAIN AN ARRAY WITH REFERENCES OBJECT!"
  );
  process.exit(1);
}

const getURLsFromText = (text) =>
  text.match(
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:()<>;\/~+#-]*[\w@?^=%&\/~+#-()])/g
  ) || [];

const validateDOI = (value) =>
  /(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b/.test(value);

const replaceDOIs = () => {
  const newFileData = [];
  let invalidReferencesCount = 0;
  let noCorrespondingTextCount = 0;

  try {
    fs.readFile(SEED_DATA_FILE, "utf8", (error, data) => {
      if (error) throw error;

      const fileData = data.split("\n");

      for (let i = 0; i < fileData.length; i++) {
        let currentLine = fileData[i];

        // extract doi urls from the current line
        const doiUrls = [
          ...new Set(
            getURLsFromText(currentLine).filter((url) => validateDOI(url))
          ),
        ];

        if (!doiUrls.length) {
          // add text line as it is
          newFileData.push(currentLine);
          continue;
        }

        doiUrls.forEach((doiUrl) => {
          // take first part of the text
          const firstPart = currentLine.slice(0, currentLine.indexOf(doiUrl));

          // take second part of the text and remove all occurrences of this DOI url
          const secondPart = currentLine
            .slice(currentLine.indexOf(doiUrl))
            .split(doiUrl)
            .filter((part) => part !== "\t")
            .join("");

          // find corresponding reference for this DOI url
          const foundReference = referencesArray.find(
            (reference) => reference[doiUrl]
          );

          if (!foundReference) {
            noCorrespondingTextCount += 1;
          }

          // extract valid reference text only
          const referenceText =
            foundReference &&
            typeof foundReference[doiUrl] === "string" &&
            !foundReference[doiUrl].includes("<!DOCTYPE") && // ignore html pages
            !foundReference[doiUrl].match(/(&[a-zA-Z]*;)|(<\/)/) // ignore if html markup
              ? foundReference[doiUrl]
                  ?.split("\n") // remove new lines
                  .join("")
                  .split('"') // replace '"' with '""'
                  .join('""')
              : null;

          if (!referenceText) {
            invalidReferencesCount += 1;
          }

          currentLine = firstPart + `"${referenceText || doiUrl}"` + secondPart;
        });

        newFileData.push(currentLine);
      }

      const parts = SEED_DATA_FILE.split(".");
      const ext = parts[parts.length - 1];

      fs.writeFile(
        `${SEED_DATA_FILE.replace(`.${ext}`, "")}_updated.${ext}`,
        newFileData.join("\n"),
        { encoding: "utf8" },
        async (error) => {
          if (error) {
            throw error;
          }
        }
      );

      console.log(
        "Successfully replaced DOIs with valid reference text. Please check",
        `${SEED_DATA_FILE.replace(`.${ext}`, "")}_updated.${ext}`,
        "file"
      );

      console.log(
        noCorrespondingTextCount,
        "references had no corresponding API response"
      );

      console.log(
        invalidReferencesCount,
        "references had invalid text (eg: html markup)"
      );
    });
  } catch (error) {
    console.log(error.message);
  }
};

replaceDOIs();
