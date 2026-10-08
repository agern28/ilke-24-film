// ───────────────────────────────────────────────
//  Tüm kişisel içerik burada. Sadece bu dosyayı düzenlemen yeterli.
// ───────────────────────────────────────────────
// Boks makinesi turu (kaybederse rövanş için kendini tekrar çağırır)
const punchRound = {
  minigame: "punch", who: "ilke", vs: 742,
  prompt: "Sıra sende! İbre tam ortadayken VUR! 🥊",
  win: [
    { who: "ilke", say: "{score}! 😎", mood: "laugh" },
    { who: "ben", say: "NE?! Bu makine bozuk!!", mood: "shock", emote: "!" },
    { who: "ben", say: "Kesin hile var. Ayarlarıyla oynamışlar.", mood: "shock", emote: "sweat" },
    { who: "ilke", say: "Kabul et, kazandım.", mood: "happy", emote: "heart" }
  ],
  lose: []
};
punchRound.lose = [
  { who: "ben", say: "{score} mü? HAHAHA. Şampiyon hâlâ benim 💪", mood: "laugh",
    choices: [
      { text: "Rövanş! 😤", say: "Rövanş istiyorum!", then: [punchRound] },
      { text: "Makine bozuk zaten 🙄", love: 0, then: [
        { who: "ben", say: "Bahaneler, bahaneler… 😏", mood: "happy" }
      ] }
    ] }
];

window.CONFIG = {
  name: "İlke",
  age: 24,
  from: "Toprak",              // jenerikte "… sunar" ve mektubun imzası

  // Şarkı: plağa dokununca başlar ve sonuna kadar çalar (biterse başa sarar).
  youtube: "RsEZmictANA",      // Taylor Swift - willow (Official Music Video)
  youtubeStart: 0,             // klibin girişini atlamak istersen saniye yaz
  songTitle: "willow · Taylor Swift",

  // Fotoğraflar "photos" klasöründe. caption: polaroidin altındaki el yazısı (boş bırakılabilir)
  photos: [
    { src: "photos/1.jpg", caption: "nereden nereye…" },
    { src: "photos/2.jpg", caption: "kafede otururken" },
    { src: "photos/3.jpg", caption: "güzel bir gün" },
    { src: "photos/4.jpg", caption: "hep asık surat 🥺" },
    { src: "photos/5.jpg", caption: "aqua florya asansördeykene bizdir " },
    { src: "photos/6.jpg", caption: "ters dünya" },
    { src: "photos/7.jpg", caption: "sinema gecesi" },
    { src: "photos/8.jpg", caption: "biz" },
    { src: "photos/9.jpg", caption: "pazar sabahı yatış" },
    { src: "photos/10.jpg", caption: "yeniden kafe..." },
    { src: "photos/11.jpg", caption: "73B de biz" }
  ],

  // Finaldeki "THE END" sahnesinde sırayla değişen başrol fotoğrafları
  starPhotos: [
    { src: "photos/s1.jpg", caption: "hayatımın başrolü" },
    { src: "photos/s2.jpg", caption: "gülüşünü sevdiğim" },
    { src: "photos/s3.jpg", caption: "gizemli kadın..." },
    { src: "photos/s4.jpg", caption: "en sevdiğim manzaram" }
  ],

  // Anı bölümleri. photo: yukarıdaki listeden kaçıncı fotoğraf (1'den başlar)
  chapters: [
    {
      title: "Başlangıç",
      photo: 1,
      text: "Bir gün hayatıma girdin ve sıradan günlerim birden bir filme dönüştü. O günden beri her şey biraz daha renkli, biraz daha güzel… biraz daha seninle doldu."
    },
    {
      title: "Küçük Anlar",
      photo: 2,
      text: "Seninle en sıradan an bile en sevdiğim sahne oldu. Bir kahve, uzun discord konuşmaları, kahkahaların… Sanki hayatımın arka planda hep çalan o şarkıydın."
    },
    {
      title: "Hep Böyle",
      photo: 3,
      text: "Ve yıllar geçse bile, de cevabım hiç değişmeyecek Sen. Her yaşında, her halinle, her mevsim seninle."
    },
    {
      title: "Yirmi Dört",
      photo: 4,
      text: "Ve şimdi hayatının 24. sezonu başlıyor. Bu bölümde de, sonraki bütün sezonlarda da yanında olmak istiyorum."
    }
  ],

  // ── Piksel oyun ─────────────────────────────
  // hairStyle: short | curlyShort | long | ponytail | bob | bun | curly · beard: "stubble" | "full" | false
  characters: {
    ilke: {
      name: "İlke", voice: 720,
      skin: "#f3d0b8", hair: "#3a2418", hairStyle: "ponytail", eyes: "#2a1a12", lips: "#c4626a",
      glasses: true, glassesColor: "#9c938a",
      top: "#7f8b5c", bottom: "#c3c3c6", shoes: "#d9d6d0"
    },
    ben: {
      name: "Toprak", voice: 420,
      skin: "#e8bf9f", hair: "#18110e", hairStyle: "curlyShort", beard: "full", beardColor: "#2e2019",
      top: "#b9bbc0", inner: "#3b3c41", bottom: "#8db0d0", shoes: "#2f3036"
    }
  },

  // place: classroom | arcade | bedroom | elevator | cafe | street | room | sunset
  // Satır türleri: { who, say, mood }, { narrate }, { walk: { ben: 70 }, speed: 1.5 }, { emote: "ilke:heart" }
  // Seçim: { who: "ben", say: "...", choices: [ { text: "İlke'nin cevabı", say: "söylediği söz (isteğe bağlı)", love: 1, mood, then: [ ...tepki satırları ] } ] }
  //   dodge: true → o seçenek parmaktan kaçar 😄 · love: aşk puanına eklenir
  // Mini oyunlar: { punch: "ben", score: 742 } · punchRound (yukarıda) · { minigame: "chase", target: "ben", taps: 12, shout, button, then }
  // mood: happy | laugh | blush | shock · emote: heart | haha | note | zzz | sweat | ! | ? | ...
  player: "ilke",
  acts: [
    {
      title: "Dershane", place: "classroom",
      positions: { ilke: 30, ben: 140 },
      script: [
        { narrate: "Bir dershane. Teneffüs. Toprak bütün cesaretini topluyor ve yanına geliyor, dikkatli ol!…" },
        { walk: { ben: 78 } },
        { who: "ben", say: "Şey… İlke… bir şey soracağım…", emote: "..." },
        { who: "ben", say: "Senin saçın kilitleniyor mu?", emote: "ilke:?",
          choices: [
            { text: "HAHAHA hayır, kilitlenmiyor ???", say: "HAHAHA hayır, kilitlenmiyor!", mood: "laugh", love: 2, then: [
              { who: "ben", say: "…", mood: "shock", emote: "sweat" },
              { who: "ben", say: "Haa… benimki çok kilitleniyor da…", mood: "blush" },
              { who: "ilke", say: "HAHAHAHAHA", mood: "laugh" },
              { narrate: "(Toprak o an yer yarılsın, içine girsin istedi. ve her şey böyle başladı.)" }
            ] },
            { text: "Kilit mi? Saçım kapı mı? 🚪", mood: "happy", then: [
              { who: "ben", say: "Yani… şey… düğüm gibi… kilit…", mood: "shock", emote: "sweat" },
              { who: "ben", say: "Benimki çok kilitleniyor da…", mood: "blush" },
              { who: "ilke", say: "HAHAHAHAHA", mood: "laugh" }
            ] },
            { text: "Bu nasıl bir soru 🤨", then: [
              { who: "ben", say: "Bilimsel merak. Tamamen akademik.", mood: "blush", emote: "sweat" },
              { who: "ben", say: "…benimki çok kilitleniyor da…", mood: "blush" },
              { who: "ilke", say: "HAHAHAHAHA", mood: "laugh" }
            ] }
          ] },
        { narrate: "Ve her şey bu saçma soruyla başladı. ❤", emote: "ilke:heart" }
      ]
    },
    {
      title: "Boks Makinesi", place: "arcade",
      positions: { ilke: 18, ben: 140 },
      script: [
        { narrate: "Aqua florya sinemasının oyun salonu. Bir boks makinesi ve çiftimiz burada bu sefer neyin peşinde?" },
        { walk: { ben: 96 } },
        { who: "ben", say: "Bahse girerim beni geçemezsin.", mood: "happy",
          choices: [
            { text: "Göreceğiz 😤", mood: "happy" },
            { text: "Önce sen vur, sonra ağlarsın", love: 2, mood: "laugh" },
            { text: "Kaybeden yemek ısmarlar!", mood: "happy", then: [
              { who: "ben", say: "Anlaştık. Şimdiden ne yiyeceğimi düşünüyorum.", mood: "happy" }
            ] }
          ] },
        { who: "ben", say: "İzle ve öğren.", mood: "happy" },
        { punch: "ben", score: 742 },
        { who: "ben", say: "742! Hadi bakalım şampiyon, sıra sende.", mood: "laugh" },
        punchRound
      ]
    },
    {
      title: "Götümü Elleme!", place: "bedroom",
      positions: { ilke: 14, ben: 70 },
      script: [
        { narrate: "Ev. Akşam. Toprak yatakta huzur içinde uzanıyor…" },
        { who: "ilke", say: "…", mood: "happy", emote: "..." },
        { who: "ben", say: "Neden öyle bakıyorsun? 😳", mood: "shock", emote: "!",
          choices: [
            { text: "Hiiiç 😇", say: "Hiiiç…", mood: "happy" },
            { text: "POPO KONTROLÜ HEHEHE 😈", say: "Popo kontrolü!", mood: "laugh", love: 2 },
            { text: "*sessizce yaklaşır*", say: "…", mood: "happy" }
          ] },
        { walk: { ilke: 50 }, speed: 0.8 },
        { who: "ben", say: "GÖTÜMÜ ELLEME! GÖTÜMÜ ELLEME!", mood: "shock", emote: "sweat" },
        { minigame: "chase", target: "ben", taps: 12, shout: "POPOMU ELLEMEEE! 🍑", button: "👋 YAKALA!", then: [
          { who: "ben", say: "Tamam tamam… teslim oluyorum yeter ki beni bırak…", mood: "blush", emote: "sweat" },
          { who: "ilke", say: "HAHAHAHA yakaladım! götünü ellicem işte!", mood: "laugh", emote: "heart" }
        ] }
      ]
    },
    {
      title: "Bugün", place: "sunset",
      positions: { ilke: 30, ben: 140 },
      script: [
        { narrate: "Gün batımı, Son sahne…", emote: "ilke:note" },
        { walk: { ben: 62 } },
        { who: "ben", say: "İlke… sana bir şey soracağım.", emote: "ilke:?" },
        { who: "ben", say: "Saçın kilitleniyor mu?", mood: "happy" },
        { who: "ilke", say: "TOPRAK! 6 SENE OLDU YETER", mood: "laugh" },
        { who: "ben", say: "Şaka şaka. Asıl soru şu: bu oyunu beğendin mi?",
          choices: [
            { text: "Evet ❤", love: 3, mood: "blush", then: [
              { who: "ben", say: "O zaman söyleyeceğim tek bir şey kaldı:", mood: "happy" },
              { who: "ben", say: "İYİ Kİ DOĞDUN! 🎂", mood: "laugh", emote: ["ben:heart", "ilke:heart"] }
            ] },
            { text: "Hayır", dodge: true }
          ] },
        { emote: ["ilke:heart", "ben:heart"], moods: { ilke: "blush", ben: "happy" }, wait: 1800 },
        { narrate: " ❤ son olarak.. …bir de mektup var." }
      ]
    }
  ],

  letter:
`Sevgili İlke,

Bugün 24 yaşına giriyorsun ve ben bunu senin için yaptım, yaparken de çok eğlendim ve her kod satırında seni ne kadar sevdiğimi tekrar tekrar fark ettim. bu filmin tek seyircisi sensin, başrolü de sen.

Gülüşün en sevdiğim şarkı. Seninle geçen her gün bir film sahnesi gibi, biraz nostaljik, biraz büyülü ama hep gerçek.

Bu yıl sana kocaman mutluluklar, sonsuz başarılar, bitmeyen kahkahalar ve bütün dileklerinin gerçek olmasını diliyorum. Ben de hep yanında olacağım, hayatının her sahnesinde.

İyi ki doğdun, iyi ki varsın, iyi ki benimlesin.

Seni çok seviyorum.`,

  finaleLine: "24. sezonun, şimdiye kadarki en güzeli olsun."
};
