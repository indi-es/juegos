import { google } from "googleapis";
import "dotenv/config";

import {
  getPlatforms,
  getDate,
  getBool,
  saveFile,
  getCrowdfundingLink,
} from "./utils.js";

const sheets = google.sheets("v4");

const sheetID = `1qZNjZOXthLsm_NQynQ2VOPgVUMK6hfAuLeTj1HG-bV0`;
const sheetName = `Videojuegos mexicanos`;
const sheetRange = `A9:Q`;
const API_KEY = process.env.GOOGLE_API_KEY;
const request = {
  spreadsheetId: sheetID,
  ranges: [`${sheetName}!${sheetRange}`],
  fields: "sheets(data(rowData(values(hyperlink,userEnteredValue))))",
  auth: API_KEY,
};

try {
  const response = (await sheets.spreadsheets.get(request)).data;
  const rowData = response.sheets[0]?.data[0]?.rowData;
  const data = rowData?.map(({ values }) => {
    const [
      cellName,
      cellXbox,
      ,
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
      cellEngine,
    ] = values;

    const name = cellName?.userEnteredValue?.stringValue ?? null;
    if (!name) return null;

    return {
      name: name,
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
        url: getCrowdfundingLink(
          cellCrowdfundingCampaign,
          cellCrowdfundingCampaignFunded
        ),
        funded: getBool(
          cellCrowdfundingCampaignFunded.userEnteredValue,
          cellCrowdfundingCampaignFunded.hyperlink
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
      genre:
        cellGenre?.userEnteredValue?.stringValue
          ?.split(",")
          .map((item) => item.trim()) ?? null,
      status: cellState?.userEnteredValue?.stringValue ?? null,
      engine: cellEngine?.userEnteredValue?.stringValue ?? null,
    };
  });

  const jsonFile = {
    games: data.filter(Boolean),
  };

  await saveFile("../../data.json", JSON.stringify(jsonFile, null, 2));
} catch (err) {
  console.error(err);
}
