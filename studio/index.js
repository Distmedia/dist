function slugify(str) {
  const str_ = str || ""
  const map = { å: "a", ä: "a", ö: "o" };

  return str_
    .trim() // remove whitespace from both ends of the string
    .toLowerCase() // convert to lowercase
    .replace(/å|ä|ö/gi, (match) => map[match]) // replace å, ä, ö with a, a, o
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[^a-z0-9-]/gi, ""); // remove all characters that are not letters or -
}

function slugable(str) {
  const slug = slugify(str)

  if (slug.length < 1) {
    return "Must be at least 1 character"
  } 

  if (str.length > 80) {
    return "Must be at most 80 character"
  }

  return true
}

function spotifyEmbedable(str) {
  const str_ = str || ""

  if (str_.startsWith("https://open.spotify.com/embed/track/") && str_.endsWith("?utm_source=generator")) {
    return true
  }

  return "Not a valid Spotify embed link"
}

export const schemaTypes = [
  //// Pages
  // Site
  {
    name: "site",
    title: "Site",
    type: "document",
    __experimental_formPreviewTitle: false,
    preview: {
      prepare() {
        return { title: "Site" }
      }
    },
    fields: [
      {
        name: 'desktop_video',
        title: 'Desktop video',
        description: 'Desktop video (webm)',
        type: 'file',
        validation: rule => rule.required(),
        options: {
          accept: 'video/webm'
        }
      },
      {
        name: 'desktop_video_fallback',
        title: 'Desktop video (fallback)',
        description: 'Desktop video fallback (mp4)',
        type: 'file',
        validation: rule => rule.required(),
        options: {
          accept: 'video/mp4'
        }
      },
      {
        name: 'mobile_video',
        title: 'Mobile video',
        description: 'Mobile video (webm)',
        type: 'file',
        validation: rule => rule.required(),
        options: {
          accept: 'video/webm'
        }
      },
      {
        name: 'mobile_video_fallback',
        title: 'Mobile video (fallback)',
        description: 'Mobile video fallback (mp4)',
        type: 'file',
        validation: rule => rule.required(),
        options: {
          accept: 'video/mp4'
        }
      },
    ]
  },

  // Read
  {
    name: "read",
    title: "Read",
    type: "document",
    __experimental_formPreviewTitle: false,
    preview: {
      prepare() {
        return { title: "Read" }
      }
    },
    fields: [
      {
        name: 'introduction',
        title: 'Introduction',
        type: 'array', 
        of: [{
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}, {title: 'Title', value: 'h6'}],
          marks: { decorators: [{title: 'Strong', value: 'strong'}, {title: 'Emphasis', value: 'em'}]},
          lists: [],
        }],
      },
      {
        name: 'people',
        title: 'People',
        type: 'array',
        of: [{type: 'person'}]
      },
      {
        name: 'additional_info',
        title: 'Additional info',
        type: 'array', 
        of: [{
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}, {title: 'Title', value: 'h6'}],
          marks: { decorators: [{title: 'Strong', value: 'strong'}, {title: 'Emphasis', value: 'em'}]},
          lists: [],
        }],
      },
    ]
  },

  // Listen
  {
    name: "listen",
    title: "Listen",
    type: "document",
    __experimental_formPreviewTitle: false,
    preview: {
      prepare() {
        return { title: "Listen" }
      }
    },
    fields: [
      {
        title: 'Productions',
        name: 'productions',
        type: 'array',
        of: [{type: 'production'}]
      },
    ]
  },

  //// Custom typed
  // Person
  {
    name: 'person',
    title: 'Person',
    type: 'object',
    fields: [
      {
        name: 'name', 
        type: 'string', 
        title: 'Name',
        validation: rule => rule.required().custom(str => slugable(str))
      },
      {
        name: 'avatar', 
        type: 'image', 
        title: 'Avatar', 
        validation: rule => rule.required(),
      },
      {
        name: 'info',
        title: 'Info',
        type: 'array', 
        of: [{
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}, {title: 'Title', value: 'h6'}],
          marks: { decorators: [{title: 'Strong', value: 'strong'}, {title: 'Emphasis', value: 'em'}]},
          lists: [],
        }],
      },
    ]
  },

  // Production
  {
    name: 'production',
    title: 'Production',
    type: 'object',
    fields: [
      {
        name: 'title', 
        type: 'string', 
        title: 'Title',
        validation: rule => rule.required().custom(str => slugable(str))
      },
      {
        name: 'spotify_embeds',
        title: 'Spotify embeds',
        type: 'array',
        description: 'ex. https://open.spotify.com/embed/track/HASH?utm_source=generator',
        of: [
          {
            type: 'url',
            validation: rule => rule.required().custom(str => spotifyEmbedable(str)),
          }
        ]
      },
    ]
  },
]
