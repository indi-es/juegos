import fetch from "node-fetch";
import cheerio from "cheerio";

import { readFile } from "fs/promises";

const waitSeconds = 1_000 * 1;

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function getSteamId(value) {
  const url = new URL(value);
  const { pathname } = url;
  const id = pathname.split("/")[2];
  return id;
}

async function getMadeWithInfo(element) {
  try {
    const steamUrl = element.platforms.find(
      (element) => element.name === "Steam"
    ).url;
    const id = getSteamId(steamUrl);
    const url = `https://steamdb.info/app/${id}/info/`;
    // console.log(`${element.name.padEnd(100, " ")}`, url);
    console.log(`${element.name}, ${url}`);
    // const response = await fetch(url);
    //
    // if (response.status !== 200) {
    //   console.log(response.status);
    // }
    //
    // const body = await response.text();
    //
    // const $ = cheerio.load(body);
    // const $madeWithRow = $(`#info table td:contains("Made with") <`);
    // if ($madeWithRow.length > 0) {
    //   madeWith = $madeWithRow.find(`td:nth-child(1)`).text();
    // }
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
  if (item.engine !== "Desconocido" && item.engine !== "Otro") return false;
  if (item.platforms == null) return false;
  for (let index = 0; index < item.platforms.length; index++) {
    const element = item.platforms[index];
    if (element.name === "Steam") return true;
  }
  return false;
});

console.log(`${filtered.length} Juegos con engine Desconocido en Steam`);
console.log("________________________________________________________\n");
console.log("name, url");

const madeWith = await getArrayData(filtered);

console.log(`Encontrados ${madeWith.length} juegos con su información`);
console.log(madeWith);
