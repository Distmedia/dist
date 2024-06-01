export function slugify(str) {
  const map = { å: "a", ä: "a", ö: "o" };

  return str
    .trim() // remove whitespace from both ends of the string
    .toLowerCase() // convert to lowercase
    .replace(/å|ä|ö/gi, (match) => map[match]) // replace å, ä, ö with a, a, o
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[^a-z0-9-]/gi, ""); // remove all characters that are not letters or -
}

// Base color must be #000!
export function hslFilter(h, s, l) {
  return `hue-rotate(${h}deg) saturate(${s}%) brightness(${l}%)`
}


  // const style = hslFilter(132, 50, 37)
  // console.log(style)
  // video.style.filter = style
