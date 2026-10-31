/* Government app tutorial videos.
   To add a video: copy the 11-character ID from the YouTube link
   (youtu.be/<ID> or watch?v=<ID>, nothing after "?" or "&"), then add
   { youtubeId, appName, title, purpose } to the right group's `videos`.
   To add a whole playlist, set playlistId on the group instead.
   Purposes are drafted from titles and labels. Review them before publishing. */
export const tutorialGroups = [
  {
    id: 'nadra-processes',
    title: 'NADRA processes guide',
    intro: 'An official NADRA playlist of 21 guides explaining common NADRA processes.',
    playlistId: 'PLXBKCUxVfxRf1lLIq54lydtpuHm4AZyd_',
    videos: [],
  },
  {
    id: 'passport',
    title: 'Passport',
    videos: [
      {
        youtubeId: 'lZ9a0hE-RLc',
        appName: 'Passport online',
        title: 'Passport application guide',
        purpose: 'Helps you learn the steps for applying for a passport online.',
      },
    ],
  },
  {
    id: 'driving-license',
    title: 'Driving license',
    videos: [
      {
        youtubeId: 'XRLE8N-8lo0',
        appName: 'DLS',
        title: 'DLS driving licence guide',
        purpose: 'Helps you learn to use the DLS driving licence service.',
      },
      {
        youtubeId: 'pTXavAi6xdQ',
        appName: 'Punjab driving license (Dastak app)',
        title: 'Driving licence through the Dastak app',
        purpose: 'Helps you learn how to apply for a Punjab driving licence using the Dastak app.',
      },
    ],
  },
]
