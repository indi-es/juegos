import fetch from "node-fetch";
import cheerio from "cheerio";

import { readFile } from "fs/promises";

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

const madeWith = await Promise.all(
  filtered.map(async (element) => {
    const url = element.platforms.find(
      (element) => element.name === "Itch"
    ).url;
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const $madeWithRow = $(
      `.game_info_panel_widget table td:contains("Made with") <`
    );

    if ($madeWithRow.length > 0) {
      const madeWith = $madeWithRow.find(`td:last-child`).text();
      return { name: element.name, madeWith };
    }
  })
);

const madeWithFiltered = madeWith.filter(Boolean);
console.log(`Encontrados ${madeWithFiltered.length} juegos con su información`);
console.log(madeWithFiltered);
