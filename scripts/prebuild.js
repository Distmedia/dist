import fs from "fs";
import https from "https";
import { createClient } from "@sanity/client";
import { slugify } from "../src/lib/helpers.js";

export const client = createClient({
  projectId: "6gim9zt5",
  dataset: "production",
  useCdn: false,
  apiVersion: "2023-03-20",
});

export async function get(query) {
  const response = await client.fetch(query);
  return response;
}

async function downloadAsset(url, outputLocationPath) {
  if (fs.existsSync(outputLocationPath)) {
    console.log(`File already exists at ${outputLocationPath}. Skipping.`);
    return;
  }

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputLocationPath);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close(resolve(true));
          console.log(`File written successfully at ${outputLocationPath}`);
        });
      })
      .on("error", (error) => {
        fs.unlink(outputLocationPath);
        reject(error.message);
      });
  });
}

async function createJson(jsonData, outputLocationPath) {
  if (fs.existsSync(outputLocationPath)) {
    console.log(`File already exists at ${outputLocationPath}. Skipping.`);
    return;
  }

  fs.writeFile(
    outputLocationPath,
    JSON.stringify(jsonData, null, 2),
    (error) => {
      if (error) {
        console.error("Error writing file:", error);
      } else {
        console.log(`File written successfully at ${outputLocationPath}`);
      }
    }
  );
}


// backdrops
const backdropsQuery = `
*[_id == "site"][0] {
  desktop_video {
    "videoUrl": asset->url,
  },
  desktop_video_fallback {
    "videoUrl": asset->url,
  },  
  mobile_video {
    "videoUrl": asset->url,
  },
  mobile_video_fallback {
    "videoUrl": asset->url,
  }
}`;
const backdropsResponse = await get(backdropsQuery)

await downloadAsset(
  backdropsResponse.desktop_video.videoUrl,
  "public/media/desktop_video.webm"
);
await downloadAsset(
  backdropsResponse.desktop_video_fallback.videoUrl,
  "public/media/desktop_video_fallback.mp4"
);
await downloadAsset(
  backdropsResponse.mobile_video.videoUrl,
  "public/media/mobile_video.webm"
);
await downloadAsset(
  backdropsResponse.mobile_video_fallback.videoUrl,
  "public/media/mobile_video_fallback.mp4"
);

const backdropsJson = {
  desktop_video: "/media/desktop_video.webm",
  desktop_video_fallback: "/media/desktop_video_fallback.mp4",
  mobile_video: "/media/mobile_video.webm",
  mobile_video_fallback: "/media/mobile_video_fallback.mp4",
};

// Sanity check that all backdrops got donwloaded
for (const path of Object.values(backdropsJson)) {
  if (!fs.existsSync(`public${path}`)) {
    throw new Error(`File is missing at public${path}!`);
  }
}
console.log('Videos passed sanity check')

await createJson(backdropsJson, "src/assets/backdrops.json");


// read
const readQuery = `
*[_id == "read"][0] {
  introduction,
  additional_info,
  people[] {
    name,
    info,
    "avatarUrl": avatar.asset->url
  }
}`;
const readResponse = await get(readQuery)

let readJson = JSON.parse(JSON.stringify(readResponse));
readJson.people = [];
for (const person of readResponse.people) {
  const extension = new URL(person.avatarUrl).pathname.split(".").pop();
  const path = `/media/${slugify(person.name)}.${extension}`;

  await downloadAsset(person.avatarUrl, `public${path}`);

  readJson.people.push({
    slug: slugify(person.name),
    name: person.name,
    info: person.info,
    avatar: path,
  });
}

await createJson(readJson, "src/assets/read.json");

// listen
const listenQuery = `
*[_id == "listen"][0] {
  productions[] {
    title,
    spotify_embeds
  }
}`;
const listenResponse = await get(listenQuery)

let listenJson = { productions: [] };
for (const production of listenResponse.productions) {
  listenJson.productions.push({
    slug: slugify(production.title),
    title: production.title,
    spotify_embeds: production.spotify_embeds,
  });
}

await createJson(listenJson, "src/assets/listen.json");
