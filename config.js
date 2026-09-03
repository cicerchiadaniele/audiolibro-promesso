/* ============================================================
   L'unico file da toccare.
   ============================================================ */

window.CONFIG = {

  /* Link pubblico della cartella Dropbox.
     Usato solo come ripiego, se un file perde il suo link diretto. */
  cartella:
    "https://www.dropbox.com/scl/fo/yqxoxw8yvbxt9sofu3b0v/AJOlVIYQNOnSNw4Isb5-TWU?rlkey=lq2nmw4qb0psuoj6oth4yu86r&dl=0",

  /* ------------------------------------------------------------
     I link pubblici dei singoli file: sono questi ad accendere il
     lettore interno e a far comparire le durate.

     Generati il 1° settembre 2026 dallo scenario Make
     «Promessi Sposi — Link Pubblici» (id 7195239). Se aggiungi o
     rinomini un file, rilancia quello scenario e aggiorna qui.
     ------------------------------------------------------------ */
  linkDiretti: {
    "00_Pasquali Gabriele.mp3":
      "https://www.dropbox.com/scl/fi/dnwoi5183q17z4mjcrm9v/00_Pasquali-Gabriele.mp3?rlkey=zfq2nn8kf0mhgqux13ywdrppb&dl=0",
    "01_Pasquali Silvia e Ilaria.mp3":
      "https://www.dropbox.com/scl/fi/h73i9avczo1f96xw2m43o/01_Pasquali-Silvia-e-Ilaria.mp3?rlkey=bqq61281bott0irsd6ndf1chn&dl=0",
    "02_Gianni.m4a":
      "https://www.dropbox.com/scl/fi/n1kki9z73i2qic376uskr/02_Gianni.m4a?rlkey=1adibt7yh3pl8wfp5ms2kbgi6&dl=0",
    "03_Manuela.m4a":
      "https://www.dropbox.com/scl/fi/lv15ls8lhyncbfrysg1mo/03_Manuela.m4a?rlkey=0cnoe3ud50lo1pvnol0cotinq&dl=0",
    "04_Ciro.mp4":
      "https://www.dropbox.com/scl/fi/bu85xmq4w7xkfioql6abf/04_Ciro.mp4?rlkey=pcm3e7jjr249dxc1htodk78s4&dl=0",
    "05_Nicola.mp3":
      "https://www.dropbox.com/scl/fi/8qigjywnmutcgcn1wxaa3/05_Nicola.mp3?rlkey=3ytt0gnheaogv1cd7tokuv2y0&dl=0",
    "06_Luigi.m4a":
      "https://www.dropbox.com/scl/fi/c4gcfs49k8313gc0tuopn/06_Luigi.m4a?rlkey=qquvy22064zzqtnt0j7o9s863&dl=0",
    "07_Giancarlo.mp3":
      "https://www.dropbox.com/scl/fi/az2zuysi6h45gh2dllo5z/07_Giancarlo.mp3?rlkey=kr3o2c7tw56r827sibu4sggyt&dl=0",
    "08_Chiara.aac":
      "https://www.dropbox.com/scl/fi/6k78d8j2xlpohzc9gpher/08_Chiara.aac?rlkey=foccfl31dp68x9e8uhn073cir&dl=0",
    "09_Giovanni.mp3":
      "https://www.dropbox.com/scl/fi/b29aypiqzfqe22qtbbedl/09_Giovanni.mp3?rlkey=iwhmhjboh0ctu25fq0lasspua&dl=0",
    "10_Francesca B.m4a":
      "https://www.dropbox.com/scl/fi/x4h0vfx9vqxxmlosypw5p/10_Francesca-B.m4a?rlkey=amx814mwdlzoo3a6lgfqv1v41&dl=0",
    "11_Michele.mp3":
      "https://www.dropbox.com/scl/fi/iquwrnzlceceqdzzuinra/11_Michele.mp3?rlkey=040i55h2u01uj3ez2eblyg70z&dl=0",
    "12_Morena.m4a":
      "https://www.dropbox.com/scl/fi/hw9l0lyfnmydrqw8l6nei/12_Morena.m4a?rlkey=7uk4l8363m0mugqpokp7u7nit&dl=0",
    "13_Luciano.m4a":
      "https://www.dropbox.com/scl/fi/99yemognv0hpl4wbdwjak/13_Luciano.m4a?rlkey=uxw4cv5k3g63f7jai6vpmu7cw&dl=0",
    "14_Daniele.mp3":
      "https://www.dropbox.com/scl/fi/cvhr4v1jl8r1tcc3wka3h/14_Daniele.mp3?rlkey=4gezpor9bw7hgs8nntbq1nrmz&dl=0",
    "15_Francesca S.m4a":
      "https://www.dropbox.com/scl/fi/rpwv4z7b1y0iaucemr78a/15_Francesca-S.m4a?rlkey=ujn5ixxv7y1p6ywl4sgn1g0xn&dl=0",
    "16_Antonio.m4a":
      "https://www.dropbox.com/scl/fi/3xh7224mc6qh59n2x2nf5/16_Antonio.m4a?rlkey=7m9u0jxl1hblkicpaj88jk4oj&dl=0",
    "17_Martino.m4a":
      "https://www.dropbox.com/scl/fi/vrwvcz9z0l512kbmfpwkv/17_Martino.m4a?rlkey=l2plgxvhzxwarug34m0tge5j8&dl=0",
    "18_Fabrizio.m4a":
      "https://www.dropbox.com/scl/fi/gqtavvgdsh7h1eml4t5ip/18_Fabrizio.m4a?rlkey=15rruogesbibmsyifov13ohur&dl=0",
    "19_Chiara.aac":
      "https://www.dropbox.com/scl/fi/2pyzf48dnnhzkd0u0bf4b/19_Chiara.aac?rlkey=vu4i6ubqepvir5y09mmm2faz8&dl=0",
    "20_Gianni.m4a":
      "https://www.dropbox.com/scl/fi/56wh4vkrn6ktr4qut2jfj/20_Gianni.m4a?rlkey=p03cbw1a4k5xdt12i6o5gkgcx&dl=0",
    "21_Manuela.m4a":
      "https://www.dropbox.com/scl/fi/qalphyhovsxi9az7psq28/21_Manuela.m4a?rlkey=8sczd0ok5z8hi2jeql64mb83u&dl=0",
    "22_Teresa.mp3":
      "https://www.dropbox.com/scl/fi/vtm2nfadg8bwan5farizf/22_Teresa.mp3?rlkey=7lgtolian8lycczazdq9521cx&dl=0",
    "23_Ciro.m4a":
      "https://www.dropbox.com/scl/fi/9pb6lu4ojj7em10xuerx2/23_Ciro.m4a?rlkey=ij9x8bllt1wws6ew3opaj39uy&dl=0",
    "24_Luigi.m4a":
      "https://www.dropbox.com/scl/fi/ucrheuvktb77dud5ngt40/24_Luigi.m4a?rlkey=ldatuwyvst23yak5fvh38kscm&dl=0",
    "25_Giancarlo.mp3":
      "https://www.dropbox.com/scl/fi/nz72ezomd28r7oxq2cd6a/25_Giancarlo.mp3?rlkey=owsmcr4uqgi0usl9xbyaj04if&dl=0",
    "26_Claudia.m4a":
      "https://www.dropbox.com/scl/fi/edtrwd36s9dwgcfygb51d/26_Claudia.m4a?rlkey=8ypxlrae9i1lhzltdsvjjn2s2&dl=0",
    "27_Francesca B.m4a":
      "https://www.dropbox.com/scl/fi/on7f5gfxz6qjjevk5vfmt/27_Francesca-B.m4a?rlkey=401793ln11py20do331ayl51o&dl=0",
    "28_Michele.mp3":
      "https://www.dropbox.com/scl/fi/9jeoip54crbwac467nyx1/28_Michele.mp3?rlkey=6k60g81rtuqc62algfs3jycuh&dl=0",
    "29_Luciano.m4a":
      "https://www.dropbox.com/scl/fi/36fx7swap65rtqlrwcs2s/29_Luciano.m4a?rlkey=ig7r9br3fvjl75ss8knvrwvye&dl=0",
    "30_Morena.m4a":
      "https://www.dropbox.com/scl/fi/jzscmcr4ehwh1gh8042a2/30_Morena.m4a?rlkey=orocmr6mma07e6uwhmsahykvg&dl=0",
    "31_Daniele.mp3":
      "https://www.dropbox.com/scl/fi/23szzd0b7s346r4avras1/31_Daniele.mp3?rlkey=4ne2fb8a7iy0wzt0vmqz1f1pv&dl=0",
    "32_Francesca S.m4a":
      "https://www.dropbox.com/scl/fi/sdmcgb7yilvas9kzjesf8/32_Francesca-S.m4a?rlkey=9pwzhagbu397xjij5qwla0adj&dl=0",
    "33_Antonio.m4a":
      "https://www.dropbox.com/scl/fi/1zhukasnw8bkqis6mkvyd/33_Antonio.m4a?rlkey=81i53n227j6kp9zx5qpz18ebc&dl=0",
    "34-1_Chiara.aac":
      "https://www.dropbox.com/scl/fi/0mpk3mrm0xaazad380dtf/34-1_Chiara.m4a?rlkey=kdqthrwhpdmtc1vn0jpfz85rm&dl=0",
    "34-2_Chiara.aac":
      "https://www.dropbox.com/scl/fi/lqidiec4kmtu3jjvkc5ba/34-2_Chiara.aac?rlkey=u6u4l1v4vnsdokswe40x7nin7&dl=0",
    "35_Matteo.m4a":
      "https://www.dropbox.com/scl/fi/t9dmvcnpx9gq6utebhqwj/35_Matteo.m4a?rlkey=x3xcq4ky4mxdwnqk2ev8ilx38&dl=0",
    "36_Nicola.mp3":
      "https://www.dropbox.com/scl/fi/muzy1244laupt83j6iemk/36_Nicola.mp3?rlkey=md0u1zw2osusrg99j8syymdcq&dl=0",
    "37_Pasquali Luisa.mp3":
      "https://www.dropbox.com/scl/fi/4zauzwr54hek3kfbm0poo/37_Pasquali-Luisa.mp3?rlkey=kkw2iex8uqnz5qs0ua51rsr86&dl=0",
    "38_Pasquali Gabriele.mp3":
      "https://www.dropbox.com/scl/fi/epl0s7rtd0ouspcxu4clw/38_Pasquali-Gabriele.mp3?rlkey=614r37wqvcfbj3hlfzjfyuv16&dl=0",
  },

  /* Quanti file interrogare insieme per misurarne la durata. */
  misureInParallelo: 4,

  /* Passa da solo al capitolo successivo quando finisce quello in ascolto. */
  incatena: true,

  /* Memoria locale: capitoli ascoltati, punto di ripresa, durate misurate.
     Resta sul dispositivo di chi ascolta. */
  ricordaAscolti: true

};
