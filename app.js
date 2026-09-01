/* ============================================================
   I Promessi Sposi — indice delle registrazioni
   Nessuna libreria, nessuna compilazione. v1.0.0
   ============================================================ */

(function () {
  "use strict";

  var CFG = window.CONFIG || {};
  var CAT = window.CATALOGO || { capitoli: [] };
  var CAPITOLI = CAT.capitoli || [];

  var CHIAVE = "promessisposi.ascoltati.v1";

  /* ---------- memoria locale ---------- */

  var ascoltati = leggiAscolti();

  function leggiAscolti() {
    if (CFG.ricordaAscolti === false) return {};
    try {
      var g = window.localStorage.getItem(CHIAVE);
      return g ? JSON.parse(g) : {};
    } catch (e) {
      return {};
    }
  }

  function salvaAscolti() {
    if (CFG.ricordaAscolti === false) return;
    try {
      window.localStorage.setItem(CHIAVE, JSON.stringify(ascoltati));
    } catch (e) {
      /* navigazione privata o memoria piena: pazienza, resta tutto in pagina */
    }
  }

  /* ---------- indirizzi Dropbox ---------- */

  /* Il link della cartella condivisa apre un singolo file
     aggiungendo il parametro preview. */
  function indirizzoAnteprima(nomeFile) {
    var base = CFG.cartella || "";
    if (!base) return "";
    try {
      var u = new URL(base);
      u.searchParams.set("preview", nomeFile);
      u.searchParams.set("dl", "0");
      return u.toString();
    } catch (e) {
      var pulito = base.split("#")[0];
      var sep = pulito.indexOf("?") === -1 ? "?" : "&";
      return pulito + sep + "preview=" + encodeURIComponent(nomeFile);
    }
  }

  /* Il lettore interno ha bisogno del file grezzo:
     si ottiene dal link pubblico del singolo file, con raw=1. */
  function indirizzoDiretto(nomeFile) {
    var mappa = CFG.linkDiretti || {};
    var l = mappa[nomeFile];
    if (!l) return "";
    try {
      var u = new URL(l);
      u.searchParams.delete("dl");
      u.searchParams.set("raw", "1");
      return u.toString();
    } catch (e) {
      return l.replace(/([?&])dl=\d/, "$1raw=1");
    }
  }

  /* ---------- formattazione ---------- */

  function pesoLeggibile(byte) {
    if (!byte) return "";
    var mb = byte / (1024 * 1024);
    if (mb >= 1000) return (mb / 1024).toFixed(2).replace(".", ",") + " GB";
    return Math.round(mb) + " MB";
  }

  var MESI = ["gennaio","febbraio","marzo","aprile","maggio","giugno",
              "luglio","agosto","settembre","ottobre","novembre","dicembre"];

  function dataLeggibile(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    if (p.length !== 3) return iso;
    var g = parseInt(p[2], 10);
    return (g === 1 ? "1°" : g) + " " + MESI[parseInt(p[1], 10) - 1] + " " + p[0];
  }

  function normalizza(s) {
    return (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, "'")
      .trim();
  }

  function testo(el, s) { el.textContent = s; return el; }

  function crea(tag, classe, contenuto) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (contenuto !== undefined) el.textContent = contenuto;
    return el;
  }

  /* ---------- stato della pagina ---------- */

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

  /* ---------- disegno di un capitolo ---------- */

  function etichettaCapitolo(c) {
    return c.numero === 0 ? "Introduzione" : "Capitolo " + c.romano;
  }

  function disegnaCapitolo(c) {
    var registrato = c.tracce.length > 0;
    var letto = !!ascoltati[c.numero];

    var li = crea("li", "capitolo");
    li.id = "cap-" + c.numero;
    if (c.numero === 0) li.classList.add("introduzione");
    if (!registrato) li.classList.add("assente");
    if (letto) li.classList.add("ascoltato");

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
    if (registrato) {
      var lettori = [];
      c.tracce.forEach(function (t) {
        if (lettori.indexOf(t.lettore) === -1) lettori.push(t.lettore);
      });
      dati.appendChild(crea("span", "voce", "legge " + lettori.join(" e ")));
      c.tracce.forEach(function (t) {
        var e = t.parte ? "parte " + t.parte + " · " : "";
        dati.appendChild(crea("span", "dato",
          e + t.formato.toUpperCase() + " · " + pesoLeggibile(t.byte)));
      });
      dati.appendChild(crea("span", "dato", "consegnato il " + dataLeggibile(c.tracce[0].data)));
    } else {
      dati.appendChild(crea("span", "dato avviso", "ancora da registrare"));
    }
    box.appendChild(dati);
    li.appendChild(box);

    /* azioni */
    var azioni = crea("div", "azioni");

    if (registrato) {
      c.tracce.forEach(function (t) {
        var a = document.createElement("a");
        a.className = "ascolta";
        a.href = indirizzoAnteprima(t.file);
        a.target = "_blank";
        a.rel = "noopener";
        a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
        a.appendChild(document.createTextNode(
          t.parte ? "Ascolta " + t.parte : "Ascolta"));
        a.setAttribute("aria-label",
          "Ascolta " + etichettaCapitolo(c) + (t.parte ? ", parte " + t.parte : "") +
          ", letto da " + t.lettore);
        azioni.appendChild(a);
      });

      var seg = crea("button", "segna");
      seg.type = "button";
      seg.textContent = letto ? "✓ Ascoltato" : "Segna letto";
      seg.setAttribute("aria-pressed", letto ? "true" : "false");
      seg.addEventListener("click", function () {
        if (ascoltati[c.numero]) delete ascoltati[c.numero];
        else ascoltati[c.numero] = true;
        salvaAscolti();
        disegna();
      });
      azioni.appendChild(seg);
    }

    li.appendChild(azioni);

    /* lettore interno, solo se è stato indicato un link diretto */
    if (registrato) {
      c.tracce.forEach(function (t) {
        var src = indirizzoDiretto(t.file);
        if (!src) return;
        var w = crea("div", "lettore");
        var au = document.createElement("audio");
        au.controls = true;
        au.preload = "none";
        au.src = src;
        au.addEventListener("ended", function () {
          ascoltati[c.numero] = true;
          salvaAscolti();
          disegna();
        });
        w.appendChild(au);
        li.appendChild(w);
      });
    }

    return li;
  }

  /* ---------- selezione ---------- */

  function passaFiltro(c) {
    var registrato = c.tracce.length > 0;
    var letto = !!ascoltati[c.numero];
    switch (stato.filtro) {
      case "da-ascoltare": return registrato && !letto;
      case "ascoltati":    return registrato && letto;
      case "mancanti":     return !registrato;
      default:             return true;
    }
  }

  function passaRicerca(c) {
    var q = stato.cerca;
    if (!q) return true;
    var campi = [
      c.titolo, c.sommario, c.romano, String(c.numero),
      etichettaCapitolo(c)
    ];
    c.tracce.forEach(function (t) { campi.push(t.lettore, t.file, t.formato); });
    var testone = normalizza(campi.join(" "));
    return q.split(/\s+/).every(function (parola) {
      return testone.indexOf(parola) !== -1;
    });
  }

  /* ---------- disegno completo ---------- */

  function disegna() {
    var scelti = CAPITOLI.filter(function (c) {
      return passaFiltro(c) && passaRicerca(c);
    });

    elIndice.innerHTML = "";

    if (stato.vista === "lettore") {
      var gruppi = {};
      scelti.forEach(function (c) {
        var chiave = c.tracce.length ? c.tracce[0].lettore : "Ancora da assegnare";
        (gruppi[chiave] = gruppi[chiave] || []).push(c);
      });
      Object.keys(gruppi)
        .sort(function (a, b) { return a.localeCompare(b, "it"); })
        .forEach(function (nome) {
          var t = crea("li", "gruppo",
            nome + " · " + gruppi[nome].length +
            (gruppi[nome].length === 1 ? " lettura" : " letture"));
          elIndice.appendChild(t);
          gruppi[nome].forEach(function (c) { elIndice.appendChild(disegnaCapitolo(c)); });
        });
    } else {
      scelti.forEach(function (c) { elIndice.appendChild(disegnaCapitolo(c)); });
    }

    elNessuno.hidden = scelti.length > 0;

    var conteggio = scelti.filter(function (c) { return c.tracce.length > 0; }).length;
    if (stato.cerca || stato.filtro !== "tutti") {
      elEsito.textContent = conteggio + (conteggio === 1 ? " capitolo" : " capitoli") +
        " su " + registrati.length + " registrati.";
    } else {
      elEsito.textContent = registrati.length + " letture archiviate" +
        (CAPITOLI.length - registrati.length > 0
          ? " · " + (CAPITOLI.length - registrati.length) + " ancora da registrare"
          : "") + ".";
    }

    aggiornaCruscotto();
  }

  function aggiornaCruscotto() {
    var letti = registrati.filter(function (c) { return ascoltati[c.numero]; }).length;
    var tot = registrati.length;
    elConta.textContent = letti;
    elTotale.textContent = "di " + tot + (tot === 1 ? " capitolo ascoltato" : " capitoli ascoltati");
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
    elCerca.value = "";
    stato.cerca = "";
    elPulisci.hidden = true;
    elCerca.focus();
    disegna();
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
    var prossimo = registrati.find(function (c) { return !ascoltati[c.numero]; });
    if (!prossimo) return;
    stato.filtro = "tutti";
    stato.cerca = "";
    elCerca.value = "";
    elPulisci.hidden = true;
    Array.prototype.forEach.call(document.querySelectorAll(".filtro"), function (x) {
      x.classList.toggle("attivo", x.dataset.filtro === "tutti");
    });
    disegna();
    var el = document.getElementById("cap-" + prossimo.numero);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.animate(
        [{ backgroundColor: "rgba(200,161,90,.35)" }, { backgroundColor: "transparent" }],
        { duration: 1600, easing: "ease-out" }
      );
    }
  });

  elAzzera.addEventListener("click", function () {
    if (!window.confirm("Vuoi togliere tutti i segni di ascolto?")) return;
    ascoltati = {};
    salvaAscolti();
    disegna();
  });

  /* ---------- piè di pagina ---------- */

  var linkCartella = document.getElementById("link-cartella");
  linkCartella.href = CFG.cartella || "#";
  if (!CFG.cartella) linkCartella.parentNode.hidden = true;

  testo(document.getElementById("percorso"), CFG.percorso || "");

  var nota = document.getElementById("nota-referente");
  var r = CFG.referente || {};
  if (r.nome) {
    nota.textContent = "Manca un capitolo o c'è una registrazione da rifare? Scrivi a " + r.nome;
    if (r.email) {
      nota.appendChild(document.createTextNode(" — "));
      var a = document.createElement("a");
      a.href = "mailto:" + r.email;
      a.textContent = r.email;
      nota.appendChild(a);
    }
    nota.appendChild(document.createTextNode("."));
  }

  /* ---------- via ---------- */

  disegna();

})();
