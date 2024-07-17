import fs, { link } from "fs";
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
  desktop_video_green {
    "videoUrlGreen": asset->url,
  },
  desktop_video_red {
    "videoUrlRed": asset->url,
  },
  desktop_video_blue {
    "videoUrlBlue": asset->url,
  },
  desktop_video_purple {
    "videoUrlPurple": asset->url,
  },
  mobile_video_green {
    "videoUrlGreen": asset->url,
  },
  mobile_video_red {
    "videoUrlRed": asset->url,
  },
  mobile_video_blue {
    "videoUrlBlue": asset->url,
  },
  mobile_video_purple {
    "videoUrlPurple": asset->url,
  },
}`;
const backdropsResponse = await get(backdropsQuery)

await downloadAsset(
  backdropsResponse.desktop_video_green.videoUrlGreen,
  "public/media/desktop_video_green.mp4"
);
await downloadAsset(
  backdropsResponse.desktop_video_red.videoUrlRed,
  "public/media/desktop_video_red.mp4"
);
await downloadAsset(
  backdropsResponse.desktop_video_blue.videoUrlBlue,
  "public/media/desktop_video_blue.mp4"
);
await downloadAsset(
  backdropsResponse.desktop_video_purple.videoUrlPurple,
  "public/media/desktop_video_purple.mp4"
);
await downloadAsset(
  backdropsResponse.mobile_video_green.videoUrlGreen,
  "public/media/mobile_video_green.mp4"
);
await downloadAsset(
  backdropsResponse.mobile_video_red.videoUrlRed,
  "public/media/mobile_video_red.mp4"
);
await downloadAsset(
  backdropsResponse.mobile_video_blue.videoUrlBlue,
  "public/media/mobile_video_blue.mp4"
);
await downloadAsset(
  backdropsResponse.mobile_video_purple.videoUrlPurple,
  "public/media/mobile_video_purple.mp4"
);

const backdropsJson = {
  desktop_video_green: "/media/desktop_video_green.mp4",
  desktop_video_red: "/media/desktop_video_red.mp4",
  desktop_video_blue: "/media/desktop_video_blue.mp4",
  desktop_video_purple: "/media/desktop_video_purple.mp4",
  mobile_video_green: "/media/mobile_video_green.mp4",
  mobile_video_red: "/media/mobile_video_red.mp4",
  mobile_video_blue: "/media/mobile_video_blue.mp4",
  mobile_video_purple: "/media/mobile_video_purple.mp4",
};

// Sanity check that all backdrops got donwloaded
for (const path of Object.values(backdropsJson)) {
  if (!fs.existsSync(`public${path}`)) {
    throw new Error(`File is missing at public${path}!`);
  }
}
console.log('Videos passed sanity check')

await createJson(backdropsJson, "src/assets/backdrops.json");


// site
const siteQuery = `
*[_id == "site"][0] {
  meta_description,
  meta_keywords,
  "faviconUrl": favicon.asset->url,
  "thumbnailUrl": thumbnail.asset->url
}`;
const siteResponse = await get(siteQuery)

let siteJson = JSON.parse(JSON.stringify(siteResponse));

const extension_favicon = new URL(siteResponse.faviconUrl).pathname.split(".").pop();
const path_favicon = `/favicon.${extension_favicon}`;
await downloadAsset(siteResponse.faviconUrl, `public${path_favicon}`);
siteJson.faviconUrl = path_favicon

const extension_thumbnail = new URL(siteResponse.thumbnailUrl).pathname.split(".").pop();
const path_thumbnail = `/media/thumbnail.${extension_thumbnail}`;
await downloadAsset(siteResponse.thumbnailUrl, `public${path_thumbnail}`);
siteJson.thumbnailUrl = path_thumbnail

await createJson(siteJson, "src/assets/site.json");


// read
const readQuery = `
*[_id == "read"][0] {
  introduction,
  additional_info,
  people[] {
    name,
    info,
    "avatarUrlGreen": avatar_green.asset->url,
    "avatarUrlRed": avatar_red.asset->url,
    "avatarUrlBlue": avatar_blue.asset->url,
    "avatarUrlPurple": avatar_purple.asset->url
  }
}`;
const readResponse = await get(readQuery)

let readJson = JSON.parse(JSON.stringify(readResponse));
readJson.people = [];
for (const person of readResponse.people) {
  const extension_green = new URL(person.avatarUrlGreen).pathname.split(".").pop();
  const path_green = `/media/${slugify(person.name)}_green.${extension_green}`;
  await downloadAsset(person.avatarUrlGreen, `public${path_green}`);

  const extension_red = new URL(person.avatarUrlRed).pathname.split(".").pop();
  const path_red = `/media/${slugify(person.name)}_red.${extension_red}`;
  await downloadAsset(person.avatarUrlRed, `public${path_red}`);

  const extension_blue = new URL(person.avatarUrlBlue).pathname.split(".").pop();
  const path_blue = `/media/${slugify(person.name)}_blue.${extension_blue}`;
  await downloadAsset(person.avatarUrlBlue, `public${path_blue}`);

  const extension_purple = new URL(person.avatarUrlPurple).pathname.split(".").pop();
  const path_purple = `/media/${slugify(person.name)}_purple.${extension_purple}`;
  await downloadAsset(person.avatarUrlPurple, `public${path_purple}`);

  readJson.people.push({
    slug: slugify(person.name),
    name: person.name,
    info: person.info,
    avatar_red: path_red,
    avatar_green: path_green,
    avatar_blue: path_blue,
    avatar_purple: path_purple,
  });
}

await createJson(readJson, "src/assets/read.json");

// listen
const listenQuery = `
*[_id == "listen"][0] {
  productions[] {
    title,
    link,
    spotify_embeds
  }
}`;
const listenResponse = await get(listenQuery)

let listenJson = { productions: [] };
for (const production of listenResponse.productions) {
  listenJson.productions.push({
    slug: slugify(production.title),
    title: production.title,
    link: production.link,
    spotify_embeds: production.spotify_embeds,
  });
}

await createJson(listenJson, "src/assets/listen.json");
