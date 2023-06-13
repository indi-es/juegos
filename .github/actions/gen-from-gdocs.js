import fs from "fs";
import { google } from "googleapis";
import { promisify } from "util";
import "dotenv/config";

const sheets = google.sheets("v4");

const sheetID = `1qZNjZOXthLsm_NQynQ2VOPgVUMK6hfAuLeTj1HG-bV0`;
const sheetName = `Videojuegos mexicanos`;
const sheetRange = `A8:P744`;
const API_KEY = process.env.GOOGLE_API_KEY;
const request = {
  spreadsheetId: sheetID,
  ranges: [`${sheetName}!${sheetRange}`],
  fields: "sheets(data(rowData(values(hyperlink,userEnteredValue))))",
  auth: API_KEY,
};

try {
  const response = (await sheets.spreadsheets.get(request)).data;
  // console.log(JSON.stringify(response, null, 2));
  const data = response.sheets[0]?.data[0]?.rowData.map(({ values }) => {
    const [
      cellName,
      cellXbox,
      cellNull,
      cellNintendo,
      cellSteam,
      cellPlayStation,
      cellPlayStore,
      cellAppStore,
      cellOther,
      cellCrowdfundingCampaign,
      cellCrowdfundingCampaignFunded,
      cellDevelopers,
      cellPublishers,
      cellDateLaunched,
      cellGenre,
      cellState,
    ] = values;

    return {
      name: cellName?.userEnteredValue?.stringValue ?? null,
      url: cellName?.hyperlink ?? null,
      xbox: cellXbox?.hyperlink ?? null,
      nintendo: cellNintendo?.hyperlink ?? null,
      playStation: cellPlayStation?.hyperlink ?? null,
      playStore: cellPlayStore?.hyperlink ?? null,
      appStore: cellAppStore?.hyperlink ?? null,
      other: cellOther?.hyperlink ?? null,
      crowdfunding: {
        url: cellCrowdfundingCampaign.hyperlink ?? null,
        funded:
          cellCrowdfundingCampaignFunded.userEnteredValue?.stringValue ?? null,
      },
      developers:
        cellDevelopers?.userEnteredValue?.stringValue
          ?.split(",")
          .map((item) => item.trim()) ?? null,
      publishers:
        cellPublishers?.userEnteredValue?.stringValue
          ?.split(",")
          .map((item) => item.trim()) ?? null,
      "date-launch":
        getDate(cellDateLaunched?.userEnteredValue?.numberValue) ?? null,
      genre: cellGenre?.userEnteredValue?.stringValue ?? null,
      state: cellState?.userEnteredValue?.stringValue ?? null,
    };
  });

  const jsonFile = {
    games: data,
  };

  await saveFile("../../data.json", JSON.stringify(jsonFile, null, 2));
} catch (err) {
  console.error(err);
}

export function getDate(value) {
  if (value == null) return null;
  const date = new Date((value - 25569) * 86400000);
  return date.toISOString();
}

export async function saveFile(path, content) {
  const writeFileAsync = promisify(fs.writeFile);
  await writeFileAsync(path, content);
  console.info(`${path} file saved`);
}
