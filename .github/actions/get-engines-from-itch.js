import fetch from "node-fetch";
import cheerio from "cheerio";

import { readFile } from "fs/promises";

const waitSeconds = 1_000 * 1;

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function getMadeWithInfo(element) {
  try {
    const url = element.platforms.find(
      (element) => element.name === "Itch"
    ).url;
    console.log("Scraping info from Itch:", url);
    const response = await fetch(url);

    if (response.status !== 200) {
      console.log(response.status);
    }

    const body = await response.text();
    const $ = cheerio.load(body);
    const $madeWithRow = $(
      `.game_info_panel_widget table td:contains("Made with") <`
    );

    if ($madeWithRow.length > 0) {
      const madeWith = $madeWithRow.find(`td:last-child`).text();
      return { name: element.name, madeWith };
    }

    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function getArrayData(arr) {
  const data = [];
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    const info = await getMadeWithInfo(element);
    data.push(info);
  }
  return data.filter(Boolean);
}

const data = JSON.parse(await readFile("../../data.json", "utf8"));

const filtered = data.games.filter((item) => {
  if (item.engine != "Desconocido") return false;
  if (item.platforms == null) return false;
  for (let index = 0; index < item.platforms.length; index++) {
    const element = item.platforms[index];
    if (element.name === "Itch") return true;
  }
  return false;
});

console.log(`${filtered.length} Juegos con engine Desconocido en Itch`);

const madeWith = await getArrayData(filtered);

console.log(`Encontrados ${madeWith.length} juegos con su información`);
console.log(madeWith);
