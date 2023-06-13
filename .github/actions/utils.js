import fs from "fs";
import { promisify } from "util";

function getOtherPlatformName(cell = {}) {
  const { hyperlink } = cell;
  if (hyperlink == null) return "Other";
  if (hyperlink.includes("itch.io")) return "Itch";
  if (hyperlink.includes("store.epicgames.com")) return "Epic Games Store";
  if (hyperlink.includes("oculus.com")) return "Oculus";
  if (hyperlink.includes("microsoft.com")) return "Microsoft Store";
  return "Other";
}

function getOtherPlatform(cell) {
  const name = getOtherPlatformName(cell);

  return {
    name,
    url: cell?.hyperlink ?? null,
  };
}

export function getPlatforms({
  cellXbox,
  cellNull,
  cellNintendo,
  cellSteam,
  cellPlayStation,
  cellPlayStore,
  cellAppStore,
  cellOther,
}) {
  return [
    {
      name: "Xbox",
      url: cellXbox?.hyperlink ?? null,
    },
    {
      name: "Nintendo",
      url: cellNintendo?.hyperlink ?? null,
    },
    {
      name: "Play Station",
      url: cellPlayStation?.hyperlink ?? null,
    },
    {
      name: "Steam",
      url: cellSteam?.hyperlink ?? null,
    },
    {
      name: "Play Store",
      url: cellPlayStore?.hyperlink ?? null,
    },
    {
      name: "App Store",
      url: cellAppStore?.hyperlink ?? null,
    },
    getOtherPlatform(cellOther),
  ].filter(({ url }) => url != null);
}

export function getDate(value) {
  if (value == null) return null;
  const date = new Date((value - 25569) * 86400000);
  return date.toISOString();
}

// Some of the columns have a True/False value some have links
export function getBool(value, optional) {
  if (optional != null) return true;
  if (value === "VERDADERO") return true;
  return false;
}

export async function saveFile(path, content) {
  const writeFileAsync = promisify(fs.writeFile);
  await writeFileAsync(path, content);
  console.info(`${path} file saved`);
}

export function getCrowdfundingLink(
  cellCrowdfundingCampaign,
  cellCrowdfundingCampaignFunded
) {
  if (cellCrowdfundingCampaign.hyperlink)
    return cellCrowdfundingCampaign.hyperlink;
  if (cellCrowdfundingCampaignFunded.hyperlink)
    return cellCrowdfundingCampaignFunded.hyperlink;
  return null;
}
