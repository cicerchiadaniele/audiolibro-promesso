/* ============================================================
   I Promessi Sposi — indice e lettore delle registrazioni
   Nessuna libreria, nessuna compilazione. v1.4.0
   ============================================================ */

(function () {
  "use strict";

  var CFG = window.CONFIG || {};
  var CAT = window.CATALOGO || { capitoli: [] };
  var CAPITOLI = CAT.capitoli || [];

  var K_ASCOLTI = "promessisposi.ascoltati.v1";
  var K_DURATE  = "promessisposi.durate.v1";
  var K_PUNTI   = "promessisposi.punti.v1";

  /* ---------- memoria locale ---------- */

  function leggi(chiave) {
    if (CFG.ricordaAscolti === false) return {};
    try {
      var g = window.localStorage.getItem(chiave);
      return g ? JSON.parse(g) : {};
    } catch (e) { return {}; }
  }

  function salva(chiave, valore) {
    if (CFG.ricordaAscolti === false) return;
    try { window.localStorage.setItem(chiave, JSON.stringify(valore)); }
    catch (e) { /* navigazione privata: resta tutto in pagina */ }
  }

  var ascoltati = leggi(K_ASCOLTI);
  var durate    = leggi(K_DURATE);
  var punti     = leggi(K_PUNTI);

  /* ---------- l'elenco piatto delle tracce ---------- */

  var TRACCE = [];
  CAPITOLI.forEach(function (c) {
    c.tracce.forEach(function (t) {
      t.capitolo = c;
      TRACCE.push(t);
    });
  });

  /* ---------- indirizzi ---------- */

  /* flusso audio del singolo file: serve il suo link pubblico */
  function flusso(t) {
    var l = (CFG.linkDiretti || {})[t.file];
    if (!l) return "";
    try {
      var u = new URL(l);
      u.searchParams.delete("dl");
      u.searchParams.set("raw", "1");
      return u.toString();
    } catch (e) {
      return /[?&]raw=1/.test(l) ? l : l.replace(/([?&])dl=\d/, "$1raw=1");
    }
  }

  /* ripiego: apertura del file dentro la cartella condivisa */
  function ripiego(t) {
    var base = CFG.cartella || "";
    if (!base) return "";
    try {
      var u = new URL(base);
      u.searchParams.set("preview", t.file);
      u.searchParams.set("dl", "0");
      return u.toString();
    } catch (e) {
      var pulito = base.split("#")[0];
      return pulito + (pulito.indexOf("?") === -1 ? "?" : "&") +
             "preview=" + encodeURIComponent(t.file);
    }
  }

  /* ---------- durate ---------- */

  function chiaveDurata(t) { return t.file + "|" + t.byte; }

  function durataDi(t) {
    if (typeof t.durata === "number" && t.durata > 0) return t.durata;
    var d = durate[chiaveDurata(t)];
    return typeof d === "number" && d > 0 ? d : 0;
  }

  function orologio(sec) {
    if (!sec || !isFinite(sec)) return "—";
    sec = Math.round(sec);
    var o = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    if (o) return o + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    return m + ":" + String(s).padStart(2, "0");
  }

  function durataDistesa(sec) {
    if (!sec || !isFinite(sec)) return "";
    var m = Math.round(sec / 60);
    if (m < 60) return m + " min";
    var o = Math.floor(m / 60), r = m % 60;
    return o + " h" + (r ? " " + r + " min" : "");
  }

  /* Misura le durate mancanti interrogando solo l'intestazione dei file. */
  function misuraDurate() {
    var manca = TRACCE.filter(function (t) { return !durataDi(t) && flusso(t); });
    if (!manca.length) return;

    var insieme = Math.max(1, CFG.misureInParallelo || 4);
    var i = 0, aperti = 0, cambiato = false;

    function prossima() {
      if (i >= manca.length) {
        if (!aperti && cambiato) { salva(K_DURATE, durate); disegna(); }
        return;
      }
      var t = manca[i++]; aperti++;

      var au = new Audio();
      au.preload = "metadata";
      var chiuso = false;

      function fine(ok) {
        if (chiuso) return;
        chiuso = true;
        if (ok && isFinite(au.duration) && au.duration > 0) {
          durate[chiaveDurata(t)] = au.duration;
          cambiato = true;
        }
        au.src = "";
        aperti--;
        prossima();
      }

      au.addEventListener("loadedmetadata", function () { fine(true); });
      au.addEventListener("error", function () { fine(false); });
      window.setTimeout(function () { fine(false); }, 20000);

      au.src = flusso(t);
    }

    for (var n = 0; n < insieme; n++) prossima();
  }

  /* ---------- utilità ---------- */

  function normalizza(s) {
    return (s || "").toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, "'").trim();
  }

  function crea(tag, classe, contenuto) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (contenuto !== undefined) el.textContent = contenuto;
    return el;
  }

  function etichetta(c) {
    return c.numero === 0 ? "Introduzione" : "Capitolo " + c.romano;
  }

  function nomiLettori(c) {
    var l = [];
    c.tracce.forEach(function (t) { if (l.indexOf(t.lettore) === -1) l.push(t.lettore); });
    return l.join(" e ");
  }

  /* ---------- stato ---------- */

  var stato = { filtro: "tutti", vista: "capitolo", cerca: "" };

  var elIndice   = document.getElementById("indice");
  var elNessuno  = document.getElementById("nessuno");
  var elEsito    = document.getElementById("esito-ricerca");
  var elCerca    = document.getElementById("cerca");
  var elPulisci  = document.getElementById("pulisci");
  var elBarra    = document.getElementById("barra-riempita");
  var elConta    = document.getElementById("conta-ascoltati");
  var elTotale   = document.getElementById("conta-totale");
  var elRiprendi = document.getElementById("riprendi");
  var elAzzera   = document.getElementById("azzera");

  var registrati = CAPITOLI.filter(function (c) { return c.tracce.length > 0; });

  /* ============================================================
     IL LEGGÌO
     ============================================================ */

  var suono = new Audio();
  suono.preload = "metadata";

  var inAscolto = null;          // la traccia in corso
  var VELOCITA = [1, 1.25, 1.5, 0.85];
  var iVel = 0;
  var trascino = false;

  var elLeggio    = document.getElementById("leggio");
  var elLegCap    = document.getElementById("leggio-capitolo");
  var elLegVoce   = document.getElementById("leggio-voce");
  var elCursore   = document.getElementById("cursore");
  var elTCorrente = document.getElementById("tempo-corrente");
  var elTTotale   = document.getElementById("tempo-totale");
  var elSuona     = document.getElementById("suona");
  var elIcona     = document.getElementById("icona-suona");

  var VIA   = "M8 5v14l11-7z";
  var PAUSA = "M6 5h4v14H6zM14 5h4v14h-4z";

  function apriLeggio() {
    elLeggio.hidden = false;
    document.body.classList.add("con-leggio");
  }

  function chiudiLeggio() {
    suono.pause();
    suono.removeAttribute("src");
    suono.load();
    inAscolto = null;
    elLeggio.hidden = true;
    document.body.classList.remove("con-leggio");
    disegna();
  }

  function suonaTraccia(t, dallInizio) {
    var src = flusso(t);
    if (!src) { window.open(ripiego(t), "_blank", "noopener"); return; }

    if (inAscolto && inAscolto.file === t.file) {
      if (suono.paused) suono.play(); else suono.pause();
      return;
    }

    inAscolto = t;
    suono.src = src;
    suono.playbackRate = VELOCITA[iVel];

    var ripresa = dallInizio ? 0 : (punti[t.file] || 0);
    if (ripresa > 3) {
      suono.addEventListener("loadedmetadata", function una() {
        suono.removeEventListener("loadedmetadata", una);
        if (ripresa < suono.duration - 5) suono.currentTime = ripresa;
      });
    }

    apriLeggio();
    aggiornaLeggio();
    var p = suono.play();
    if (p && p.catch) p.catch(function () { /* l'utente deve toccare per avviare */ });
    disegna();
  }

  function aggiornaLeggio() {
    if (!inAscolto) return;
    var c = inAscolto.capitolo;
    elLegCap.textContent = etichetta(c) + " · " + c.titolo +
      (inAscolto.parte ? " (parte " + inAscolto.parte + ")" : "");
    elLegVoce.textContent = inAscolto.lettore;
  }

  function segnaAscoltato(numero) {
    if (!ascoltati[numero]) {
      ascoltati[numero] = true;
      salva(K_ASCOLTI, ascoltati);
    }
  }

  function prossimaTraccia() {
    var i = TRACCE.indexOf(inAscolto);
    return i > -1 && i < TRACCE.length - 1 ? TRACCE[i + 1] : null;
  }

  suono.addEventListener("timeupdate", function () {
    if (!inAscolto || trascino) return;
    var d = suono.duration;
    elTCorrente.textContent = orologio(suono.currentTime);
    if (isFinite(d) && d > 0) {
      elCursore.value = Math.round((suono.currentTime / d) * 1000);
      elTTotale.textContent = orologio(d);
      if (suono.currentTime > 8) {
        punti[inAscolto.file] = suono.currentTime;
      }
      if (suono.currentTime / d > 0.97) segnaAscoltato(inAscolto.capitolo.numero);
    }
  });

  suono.addEventListener("loadedmetadata", function () {
    if (!inAscolto) return;
    if (isFinite(suono.duration) && suono.duration > 0) {
      var k = chiaveDurata(inAscolto);
      if (!durate[k]) { durate[k] = suono.duration; salva(K_DURATE, durate); }
      elTTotale.textContent = orologio(suono.duration);
    }
  });

  suono.addEventListener("play",  function () { elIcona.firstChild.setAttribute("d", PAUSA); elSuona.setAttribute("aria-label", "Metti in pausa"); disegna(); });
  suono.addEventListener("pause", function () { elIcona.firstChild.setAttribute("d", VIA);   elSuona.setAttribute("aria-label", "Riprendi"); salva(K_PUNTI, punti); disegna(); });

  suono.addEventListener("ended", function () {
    if (!inAscolto) return;
    segnaAscoltato(inAscolto.capitolo.numero);
    delete punti[inAscolto.file];
    salva(K_PUNTI, punti);
    var p = CFG.incatena === false ? null : prossimaTraccia();
    if (p) suonaTraccia(p, true);
    else { disegna(); }
  });

  suono.addEventListener("error", function () {
    if (!inAscolto) return;
    elLegVoce.textContent = "file non raggiungibile";
  });

  elSuona.addEventListener("click", function () {
    if (!inAscolto) return;
    if (suono.paused) suono.play(); else suono.pause();
  });

  document.getElementById("indietro").addEventListener("click", function () {
    suono.currentTime = Math.max(0, suono.currentTime - 15);
  });
  document.getElementById("avanti").addEventListener("click", function () {
    suono.currentTime = Math.min(suono.duration || 0, suono.currentTime + 15);
  });

  document.getElementById("velocita").addEventListener("click", function () {
    iVel = (iVel + 1) % VELOCITA.length;
    suono.playbackRate = VELOCITA[iVel];
    this.innerHTML = String(VELOCITA[iVel]).replace(".", ",") + "&times;";
  });

  document.getElementById("chiudi-leggio").addEventListener("click", chiudiLeggio);

  elCursore.addEventListener("input", function () {
    trascino = true;
    var d = suono.duration;
    if (isFinite(d) && d > 0) elTCorrente.textContent = orologio((elCursore.value / 1000) * d);
  });
  elCursore.addEventListener("change", function () {
    var d = suono.duration;
    if (isFinite(d) && d > 0) suono.currentTime = (elCursore.value / 1000) * d;
    trascino = false;
  });

  document.addEventListener("keydown", function (e) {
    if (!inAscolto) return;
    var dentroCampo = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
    if (dentroCampo) return;
    if (e.code === "Space") { e.preventDefault(); elSuona.click(); }
    if (e.code === "ArrowLeft")  { e.preventDefault(); suono.currentTime = Math.max(0, suono.currentTime - 15); }
    if (e.code === "ArrowRight") { e.preventDefault(); suono.currentTime = Math.min(suono.duration || 0, suono.currentTime + 15); }
  });

  window.addEventListener("beforeunload", function () { salva(K_PUNTI, punti); });

  /* ============================================================
     L'INDICE
     ============================================================ */

  function disegnaCapitolo(c) {
    var letto = !!ascoltati[c.numero];
    var qui = inAscolto && inAscolto.capitolo === c;

    var li = crea("li", "capitolo");
    li.id = "cap-" + c.numero;
    if (c.numero === 0) li.classList.add("introduzione");
    if (letto) li.classList.add("ascoltato");
    if (qui) li.classList.add("in-ascolto");

    /* medaglione */
    var med = crea("div", "medaglione");
    var rom = crea("span", "rom", c.numero === 0 ? "✦" : c.romano);
    if (c.romano.length > 4) rom.classList.add("lungo");
    med.appendChild(rom);
    med.setAttribute("aria-hidden", "true");
    li.appendChild(med);

    /* testo */
    var box = crea("div", "testo");
    box.appendChild(crea("h3", "titolo", c.titolo));
    box.appendChild(crea("p", "sommario", c.sommario));

    var dati = crea("div", "riga-dati");
    dati.appendChild(crea("span", "voce", "legge " + nomiLettori(c)));

    c.tracce.forEach(function (t) {
      var d = durataDi(t);
      var pre = t.parte ? "parte " + t.parte + " · " : "";
      var el = crea("span", d ? "durata" : "durata ignota",
        d ? pre + durataDistesa(d) : pre + "durata da rilevare");
      dati.appendChild(el);
    });

    if (c.tracce.length > 1) {
      var tot = c.tracce.reduce(function (a, t) { return a + durataDi(t); }, 0);
      if (tot) dati.appendChild(crea("span", "durata", "in tutto " + durataDistesa(tot)));
    }

    box.appendChild(dati);
    li.appendChild(box);

    /* azioni */
    var azioni = crea("div", "azioni");

    c.tracce.forEach(function (t) {
      var suonaQui = inAscolto === t && !suono.paused;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ascolta";

      if (suonaQui) {
        var onde = crea("span", "onde");
        onde.innerHTML = "<i></i><i></i><i></i>";
        onde.setAttribute("aria-hidden", "true");
        b.appendChild(onde);
        b.appendChild(document.createTextNode(t.parte ? "In ascolto " + t.parte : "In ascolto"));
      } else {
        var ripresoA = punti[t.file] || 0;
        b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + VIA + '"/></svg>';
        b.appendChild(document.createTextNode(
          (ripresoA > 8 ? "Riprendi" : "Ascolta") + (t.parte ? " " + t.parte : "")));
      }

      b.setAttribute("aria-label", "Ascolta " + etichetta(c) +
        (t.parte ? ", parte " + t.parte : "") + ", legge " + t.lettore);
      b.addEventListener("click", function () { suonaTraccia(t, false); });
      azioni.appendChild(b);
    });

    var seg = crea("button", "segna");
    seg.type = "button";
    seg.textContent = letto ? "✓ Ascoltato" : "Segna letto";
    seg.setAttribute("aria-pressed", letto ? "true" : "false");
    seg.addEventListener("click", function () {
      if (ascoltati[c.numero]) delete ascoltati[c.numero];
      else ascoltati[c.numero] = true;
      salva(K_ASCOLTI, ascoltati);
      disegna();
    });
    azioni.appendChild(seg);

    li.appendChild(azioni);
    return li;
  }

  /* ---------- selezione ---------- */

  function passaFiltro(c) {
    var letto = !!ascoltati[c.numero];
    switch (stato.filtro) {
      case "da-ascoltare": return !letto;
      case "ascoltati":    return letto;
      default:             return true;
    }
  }

  function passaRicerca(c) {
    if (!stato.cerca) return true;

    /* testo libero: titolo, sommario, voci */
    var libero = [c.titolo, c.sommario, c.numero === 0 ? "introduzione" : "capitolo"];
    c.tracce.forEach(function (t) { libero.push(t.lettore); });
    var testone = normalizza(libero.join(" "));

    /* numeri e nomi di file: confronto esatto, altrimenti
       cercando XVIII salterebbero fuori anche XXVIII e XXXVIII */
    var esatti = [normalizza(c.romano), String(c.numero),
                  String(c.numero).length < 2 ? "0" + c.numero : String(c.numero)];
    c.tracce.forEach(function (t) { esatti.push(normalizza(t.file)); });

    return stato.cerca.split(/\s+/).every(function (p) {
      if (esatti.indexOf(p) !== -1) return true;
      /* inizio di parola, così «chiara» non pesca «dichiarazione» */
      var i = testone.indexOf(p);
      while (i !== -1) {
        if (i === 0 || !/[a-z0-9]/.test(testone.charAt(i - 1))) return true;
        i = testone.indexOf(p, i + 1);
      }
      return false;
    });
  }

  /* ---------- disegno ---------- */

  function disegna() {
    var scelti = CAPITOLI.filter(function (c) {
      return passaFiltro(c) && passaRicerca(c);
    });

    elIndice.innerHTML = "";

    if (stato.vista === "lettore") {
      var gruppi = {};
      scelti.forEach(function (c) {
        var chiave = c.tracce[0].lettore;
        (gruppi[chiave] = gruppi[chiave] || []).push(c);
      });
      Object.keys(gruppi).sort(function (a, b) {
        return a.localeCompare(b, "it");
      }).forEach(function (nome) {
        var quanti = gruppi[nome].length;
        elIndice.appendChild(crea("li", "gruppo",
          nome + " · " + quanti + (quanti === 1 ? " lettura" : " letture")));
        gruppi[nome].forEach(function (c) { elIndice.appendChild(disegnaCapitolo(c)); });
      });
    } else {
      scelti.forEach(function (c) { elIndice.appendChild(disegnaCapitolo(c)); });
    }

    elNessuno.hidden = scelti.length > 0;

    if (stato.cerca || stato.filtro !== "tutti") {
      elEsito.textContent = scelti.length +
        (scelti.length === 1 ? " capitolo" : " capitoli") + " su " + CAPITOLI.length + ".";
    } else {
      var tot = TRACCE.reduce(function (a, t) { return a + durataDi(t); }, 0);
      elEsito.textContent = CAPITOLI.length + " capitoli letti da " +
        contaVoci() + " voci" + (tot ? " · " + durataDistesa(tot) + " di ascolto" : "") + ".";
    }

    aggiornaCruscotto();
  }

  function contaVoci() {
    var v = [];
    TRACCE.forEach(function (t) { if (v.indexOf(t.lettore) === -1) v.push(t.lettore); });
    return v.length;
  }

  function aggiornaCruscotto() {
    var letti = registrati.filter(function (c) { return ascoltati[c.numero]; }).length;
    var tot = registrati.length;
    elConta.textContent = letti;
    elTotale.textContent = "di " + tot + " capitoli ascoltati";
    elBarra.style.width = tot ? Math.round((letti / tot) * 100) + "%" : "0%";
    elAzzera.disabled = letti === 0;
    elRiprendi.disabled = letti >= tot;
    elRiprendi.textContent = letti === 0 ? "Comincia dall'inizio" : "Riprendi da dove eri";
  }

  /* ---------- comandi ---------- */

  elCerca.addEventListener("input", function () {
    stato.cerca = normalizza(elCerca.value);
    elPulisci.hidden = elCerca.value === "";
    disegna();
  });

  elPulisci.addEventListener("click", function () {
    elCerca.value = ""; stato.cerca = ""; elPulisci.hidden = true;
    elCerca.focus(); disegna();
  });

  Array.prototype.forEach.call(document.querySelectorAll(".filtro"), function (b) {
    b.addEventListener("click", function () {
      Array.prototype.forEach.call(document.querySelectorAll(".filtro"), function (x) {
        x.classList.remove("attivo");
      });
      b.classList.add("attivo");
      stato.filtro = b.dataset.filtro;
      disegna();
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll(".ordine"), function (b) {
    b.addEventListener("click", function () {
      Array.prototype.forEach.call(document.querySelectorAll(".ordine"), function (x) {
        x.classList.remove("attivo");
      });
      b.classList.add("attivo");
      stato.vista = b.dataset.vista;
      disegna();
    });
  });

  elRiprendi.addEventListener("click", function () {
    var prossimo = null;
    for (var i = 0; i < registrati.length; i++) {
      if (!ascoltati[registrati[i].numero]) { prossimo = registrati[i]; break; }
    }
    if (!prossimo) return;
    suonaTraccia(prossimo.tracce[0], false);
    var el = document.getElementById("cap-" + prossimo.numero);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  elAzzera.addEventListener("click", function () {
    if (!window.confirm("Vuoi togliere tutti i segni di ascolto?")) return;
    ascoltati = {}; punti = {};
    salva(K_ASCOLTI, ascoltati); salva(K_PUNTI, punti);
    disegna();
  });

  /* ---------- via ---------- */

  disegna();
  misuraDurate();

})();
