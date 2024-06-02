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
// const backdropsResponse = {
//   desktop_video: {
//     videoUrl:
//       "https://cdn.sanity.io/files/6gim9zt5/production/094156660a2cb9866810d717b56d7732b6ddfb45.webm",
//   },
//   desktop_video_fallback: {
//     videoUrl:
//       "https://cdn.sanity.io/files/6gim9zt5/production/7bdc7a67507aa3807db858cd3da867a970fb6262.mp4",
//   },
//   mobile_video: {
//     videoUrl:
//       "https://cdn.sanity.io/files/6gim9zt5/production/62fda77771657b2031cefa755298d49743b78a21.webm",
//   },
//   mobile_video_fallback: {
//     videoUrl:
//       "https://cdn.sanity.io/files/6gim9zt5/production/7fa2dc6c3043eaf0ae3d0d16ec8052e4c71d333c.mp4",
//   },
// };
await downloadAsset(
  backdropsResponse.desktop_video.videoUrl,
  "public/desktop_video.webm"
);
await downloadAsset(
  backdropsResponse.desktop_video_fallback.videoUrl,
  "public/desktop_video_fallback.mp4"
);
await downloadAsset(
  backdropsResponse.mobile_video.videoUrl,
  "public/mobile_video.webm"
);
await downloadAsset(
  backdropsResponse.mobile_video_fallback.videoUrl,
  "public/mobile_video_fallback.mp4"
);
const backdropsJson = {
  desktop_video: "/desktop_video.webm",
  desktop_video_fallback: "/desktop_video_fallback.mp4",
  mobile_video: "/mobile_video.webm",
  mobile_video_fallback: "/mobile_video_fallback.mp4",
};

// Sanity check that all backdrops got donwloaded
for (const path of ["public/desktop_video.webm", "public/desktop_video_fallback.mp4", "public/mobile_video.webm", "public/mobile_video_fallback.mp4"]) {
  if (!fs.existsSync(path)) {
    throw new Error(`File is missing at ${path}!`);
  }
}
console.log('Passed sanity check')

await createJson(backdropsJson, "src/assets/backdrops.json");


// read
const readQuery = `
*[_id == "read"][0] {
  introduction,
  additional_info,
  people[] {
    name,
    "avatarUrl": avatar.asset->url
  }
}`;
const readResponse = await get(readQuery)
// const readResponse = {
//   introduction: [
//     {
//       style: "normal",
//       _key: "91403ed6aed3",
//       markDefs: [],
//       children: [
//         {
//           _key: "1af66e8557500",
//           _type: "span",
//           marks: [],
//           text: "Vi är journalister, ljud-designers & producenter med lång erfarenhet som\ndrivs av smarta, modiga, roliga, berörande och oväntade berättelser. Kom\ntill oss i Gamla Stan i Stockholm om du har en bra historia, eller vill\nsamarbeta med oss.",
//         },
//       ],
//       _type: "block",
//     },
//   ],
//   additional_info: [
//     {
//       children: [
//         {
//           _type: "span",
//           marks: [],
//           text: "Moar here",
//           _key: "45ec787c878f",
//         },
//       ],
//       _type: "block",
//       style: "normal",
//       _key: "cf5ff12bb382",
//       markDefs: [],
//     },
//     {
//       markDefs: [
//         {
//           _type: "link",
//           href: "/admin",
//           _key: "cadf1d2b01d8",
//         },
//       ],
//       children: [
//         {
//           marks: ["cadf1d2b01d8"],
//           text: "Admin",
//           _key: "13963c428543",
//           _type: "span",
//         },
//       ],
//       _type: "block",
//       style: "normal",
//       _key: "1523cd0ea660",
//     },
//   ],
//   people: [
//     {
//       name: "Skidmannen",
//       avatarUrl:
//         "https://cdn.sanity.io/images/6gim9zt5/production/ac18f749de0493c6072037c04da4bea8475b4026-640x475.webp",
//     },
//     {
//       name: "Skidmannen2",
//       avatarUrl:
//         "https://cdn.sanity.io/images/6gim9zt5/production/ac18f749de0493c6072037c04da4bea8475b4026-640x475.webp",
//     },
//     {
//       name: "Skidmannen3",
//       avatarUrl:
//         "https://cdn.sanity.io/images/6gim9zt5/production/ac18f749de0493c6072037c04da4bea8475b4026-640x475.webp",
//     },
//   ],
// };
let readJson = JSON.parse(JSON.stringify(readResponse));
readJson.people = [];

for (const person of readResponse.people) {
  const extension = new URL(person.avatarUrl).pathname.split(".").pop();
  const path = `/${slugify(person.name)}.${extension}`;
  await downloadAsset(person.avatarUrl, `public${path}`);

  readJson.people.push({
    slug: slugify(person.name),
    name: person.name,
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
// const listenResponse = {
//   productions: [
//     {
//       title: "The Cardigans",
//       spotify_embeds: [
//         "https://open.spotify.com/embed/track/0Ui05Ov0s4PnRc4JI3Pilg?utm_source=generator",
//         "https://open.spotify.com/embed/track/7aQjPecQdIuNd1sz3KCDhD?utm_source=generator",
//         "https://open.spotify.com/embed/track/7aQjPecQdIuNd1sz3KCDhD?utm_source=generator",
//         "https://open.spotify.com/embed/track/7aQjPecQdIuNd1sz3KCDhD?utm_source=generator",
//         "https://open.spotify.com/embed/track/7aQjPecQdIuNd1sz3KCDhD?utm_source=generator",
//       ],
//     },
//     {
//       title: "Kendrick",
//       spotify_embeds: [
//         "https://open.spotify.com/embed/track/6AI3ezQ4o3HUoP6Dhudph3?utm_source=generator",
//       ],
//     },
//     {
//       title: "Kendrick2",
//       spotify_embeds: [
//         "https://open.spotify.com/embed/track/6AI3ezQ4o3HUoP6Dhudph3?utm_source=generator",
//       ],
//     },
//   ],
// };

let listenJson = { productions: [] };
for (const production of listenResponse.productions) {
  listenJson.productions.push({
    slug: slugify(production.title),
    title: production.title,
    spotify_embeds: production.spotify_embeds,
  });
}
await createJson(listenJson, "src/assets/listen.json");
