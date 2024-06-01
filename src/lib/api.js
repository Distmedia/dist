import { sanityClient } from 'sanity:client'

export async function getSanity(query, mock = undefined, live = false) {
  if (mock) {
    return preparedData[mock]
  }

  if (live) {
    const response = await sanityClient.fetch(query)
    return response
  }
}

const preparedData = {
  // *[_id == 'read'][0]{
  //   introduction,
  //   people,
  //   additional_info
  // }
  read: {
    "introduction": [
      {
        "style": "normal",
        "_key": "91403ed6aed3",
        "markDefs": [],
        "children": [
          {
            "text": "Vi är journalister, ljud-designers & producenter med lång erfarenhet som\ndrivs av smarta, modiga, roliga, berörande och oväntade berättelser. Kom\ntill oss i Gamla Stan i Stockholm om du har en bra historia, eller vill\nsamarbeta med oss.",
            "_key": "1af66e8557500",
            "_type": "span",
            "marks": []
          }
        ],
        "_type": "block"
      }
    ],
    "people": [
      {
        "_key": "6741a4e26966",
        "info": [
          {
            "children": [
              {
                "_type": "span",
                "marks": [],
                "text": "Waow",
                "_key": "b6163699822f"
              }
            ],
            "_type": "block",
            "style": "normal",
            "_key": "90476bce213f",
            "markDefs": []
          }
        ],
        "_type": "person",
        "name": "Skidmannen",
        "avatar": {
          "_type": "image",
          "asset": {
            "_ref": "image-ac18f749de0493c6072037c04da4bea8475b4026-640x475-webp",
            "_type": "reference"
          }
        }
      }
    ],
    "additional_info": [
      {
        "markDefs": [],
        "children": [
          {
            "marks": [],
            "text": "Moar here",
            "_key": "45ec787c878f",
            "_type": "span"
          }
        ],
        "_type": "block",
        "style": "normal",
        "_key": "cf5ff12bb382"
      },
      {
        "children": [
          {
            "_type": "span",
            "marks": [
              "cadf1d2b01d8"
            ],
            "text": "Admin",
            "_key": "13963c428543"
          }
        ],
        "_type": "block",
        "style": "normal",
        "_key": "1523cd0ea660",
        "markDefs": [
          {
            "_type": "link",
            "href": "/admin",
            "_key": "cadf1d2b01d8"
          }
        ]
      }
    ]
  },
  // *[_id == 'listen'][0]{
  //   productions
  // }
  productions: {
    "productions": [
      {
        "_type": "production",
        "spotify_embeds": [
          "https://open.spotify.com/embed/track/0Ui05Ov0s4PnRc4JI3Pilg?utm_source=generator",
          "https://open.spotify.com/embed/track/7aQjPecQdIuNd1sz3KCDhD?utm_source=generator"
        ],
        "_key": "2f32ae4fd360",
        "title": "The Cardigans"
      },
      {
        "_key": "e6d71775f783",
        "title": "Kendrick",
        "_type": "production",
        "spotify_embeds": [
          "https://open.spotify.com/embed/track/6AI3ezQ4o3HUoP6Dhudph3?utm_source=generator"
        ]
      }
    ]
  },
  // *[_id == 'read'][0]{
  //   people[] {
  //     "avatarUrl": avatar.asset->url,
  //     ...
  //   }
  // }
  people: {
    "people": [
      {
        "avatar": {
          "_type": "image",
          "asset": {
            "_ref": "image-ac18f749de0493c6072037c04da4bea8475b4026-640x475-webp",
            "_type": "reference"
          }
        },
        "_key": "6741a4e26966",
        "info": [
          {
            "style": "normal",
            "_key": "90476bce213f",
            "markDefs": [],
            "children": [
              {
                "_type": "span",
                "marks": [],
                "text": "Waow",
                "_key": "b6163699822f"
              },
            ],
            "_type": "block"
          }
        ],
        "_type": "person",
        "name": "Skidmannen",
        "avatarUrl": "/skidmannen.webp"
      }
    ]
  }
}
