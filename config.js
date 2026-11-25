// Все редактируемые данные сайта. Фотографии в папке images/.
// Пустые строки означают, что информация пока не заполнена.
window.SITE = {
  draft: true,
  logo: "images/logo.png", // Необязательный логотип.
  heroText: "Arčiau gamtos. Arčiau žirgo.",
  ownerIntro: "Labas! Aš esu [šeimininkės vardas].",
  ownerBio: "[Trumpa istorija apie šeimininkę, patirtį su žirgais ir projekto pradžią.]",
  horseName: "Orionas",
  horseNames: "Oficialus vardas – Klajūnas, tačiau kasdien jį vadiname Orionu.", // сверить написание с документом
  horseBio: "[Oriono istorija, charakteris, amžius ir tai, kuo jis ypatingas.]",
  horseFacts: [{ label: "Veislė", value: "[Veislė]" }, { label: "Amžius", value: "[Amžius]" }],
  images: {
    hero: { src: "images/hero.jpg", alt: "Orionas gamtoje" },
    owner: { src: "images/owner.jpg", alt: "Šeimininkė su Orionu" }
  },
  servicesIntro: "[Čia bus patvirtintų veiklų aprašymas. Žemiau – galimi pavyzdžiai.]",
  services: [
    { icon: "horse", title: "Pažintis su žirgu", text: "[Veiklos aprašymas, trukmė ir sąlygos.]", price: "", example: true },
    { icon: "riding", title: "Jojimas", text: "[Veiklos aprašymas, trukmė ir sąlygos.]", price: "", example: true },
    { icon: "camera", title: "Fotosesijos", text: "[Veiklos aprašymas, trukmė ir sąlygos.]", price: "", example: true }
  ],
  gallery: [
    { src: "images/gallery-01.jpg", alt: "Oriono portretas" },
    { src: "images/gallery-02.jpg", alt: "Akimirka gamtoje" },
    { src: "images/gallery-03.jpg", alt: "Laikas su žirgu" },
    { src: "images/gallery-04.jpg", alt: "Oriono kasdienybė" },
    { src: "images/gallery-05.jpg", alt: "Žirgas ir gamta" },
    { src: "images/gallery-06.jpg", alt: "Horizonto Klajūnai" }
  ],
  contactIntro: "Turite klausimų? Susisiekite su mumis.",
  contactName: "[Vardas ir pavardė]",
  phone: "", // +370...
  email: "",
  facebook: "", // https://www.facebook.com/...
  instagram: "", // https://www.instagram.com/...
  address: "", // Новый адрес конюшни, без заглушки.
  mapEmbedUrl: "" // Google Maps > Share > Embed a map > скопировать только src из iframe.
};
