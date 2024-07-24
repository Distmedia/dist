import fs from "fs";

function remove(path) {
  try {
    fs.unlinkSync(path)
      console.log(`removed ${path}`);
  } catch(e) {
    if (e.code === 'ENOENT') {
      console.log(`not found ${path}`);
    } else {
      console.error(`error ${path}`)
    }
  }
}

const paths = [
  "public/media/desktop_video_green.mp4",
  "public/media/desktop_video_red.mp4",
  "public/media/desktop_video_blue.mp4",
  "public/media/desktop_video_purple.mp4",
  "public/media/mobile_video_green.mp4",
  "public/media/mobile_video_red.mp4",
  "public/media/mobile_video_blue.mp4",
  "public/media/mobile_video_purple.mp4",
  "src/assets/backdrops.json",
  "src/assets/site.json",
  "src/assets/read.json",
  "src/assets/listen.json"
]

paths.forEach(p => remove(p))
