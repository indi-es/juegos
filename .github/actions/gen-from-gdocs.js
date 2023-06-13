import { google } from "googleapis";
import "dotenv/config";

import { getPlatforms, getDate, getBool, saveFile } from "./utils.js";

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
      platforms: getPlatforms({
        cellXbox,
        cellNintendo,
        cellSteam,
        cellPlayStation,
        cellPlayStore,
        cellAppStore,
        cellOther,
      }),
      crowdfunding: {
        url: cellCrowdfundingCampaign.hyperlink ?? null,
        funded: getBool(
          cellCrowdfundingCampaignFunded.userEnteredValue?.stringValue
        ),
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
      status: cellState?.userEnteredValue?.stringValue ?? null,
    };
  });

  const jsonFile = {
    games: data,
  };

  await saveFile("../../data.json", JSON.stringify(jsonFile, null, 2));
} catch (err) {
  console.error(err);
}
