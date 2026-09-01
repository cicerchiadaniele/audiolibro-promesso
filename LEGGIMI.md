# I Promessi Sposi — l'audiolibro

Pagina web che raccoglie in ordine tutte le registrazioni: introduzione,
trentotto capitoli, ventitré voci. L'ascolto avviene dentro la pagina, con un
lettore fisso in basso; Dropbox resta dietro le quinte.

## Che cosa contiene

| File | A cosa serve |
|---|---|
| `index.html` | la pagina |
| `styles.css` | l'aspetto |
| `app.js` | la logica e il lettore |
| `catalogo.js` | capitoli, titoli, lettori, file |
| `config.js` | **l'unico file da modificare** |

## Per pubblicarla

Trascina la cartella su [Netlify Drop](https://app.netlify.com/drop) e ottieni
subito un indirizzo `https://…`. Vanno bene anche Vercel, GitHub Pages o
Cloudflare Pages.

## I link dei singoli file: già fatti

Il lettore interno e le durate hanno bisogno del link pubblico di ogni singolo
file, perché dal link della cartella Dropbox non lascia ricavare il flusso
audio. Tutti e quaranta i link sono già dentro `config.js`.

Li ha generati lo scenario Make **«Promessi Sposi — Link Pubblici»**
(id 7195239, cartella dei Promessi Sposi, avvio a richiesta). Sono due moduli:

1. `Dropbox › List All Files/Subfolders in a Folder` sulla cartella
   `/STUDIO CAI/01. Daniele/PROMESSI SPOSI`, tipo *Files*, limite 200.
2. `Dropbox › Create a Share Link` con *Selection Method* = **Map a
   File/Folder Path**, *File Path* mappato su `path_lower` del modulo 1 e
   *Requested Visibility* = **Public**.

Quaranta operazioni a esecuzione. Quando aggiungi un capitolo, rilancia lo
scenario: i link già esistenti vengono restituiti così come sono, viene creato
solo quello nuovo. Poi copia l'indirizzo del nuovo file dentro `linkDiretti`.

Una nota tecnica, se un giorno ci metti mano: nel modulo *Make an API Call* di
Dropbox il corpo JSON non deve terminare con due parentesi graffe chiuse,
perché Make le scambia per la fine di una variabile e spedisce tutto come
testo. Usando i moduli nativi il problema non si pone.

## Le durate

Non le devi scrivere. Al primo caricamento la pagina interroga i file, si
prende soltanto l'intestazione — non scarica l'audio — legge la durata e se la
ricorda sul dispositivo. Dal secondo accesso compaiono subito.

Se preferisci fissarne una a mano, in `catalogo.js` ogni traccia ha un campo
`durata` in secondi: se lo compili, vince su quella misurata.

## Il lettore

Compare in basso appena si tocca un capitolo. Ha avvio e pausa, salto di
quindici secondi avanti e indietro, barra di scorrimento, velocità (1×, 1,25×,
1,5×, 0,85×) e chiusura. Da tastiera: barra spaziatrice per la pausa, frecce
destra e sinistra per i salti.

Tiene a mente il punto in cui ti sei fermato, capitolo per capitolo: il
pulsante diventa «Riprendi». A fine capitolo passa da solo al successivo e
segna quello finito come ascoltato. Per non incatenare i capitoli, metti
`incatena: false` in `config.js`.

## L'indice

Ricerca per titolo, lettore o numero — funziona sia `18` sia `XVIII`, e
cercando `XVIII` non escono `XXVIII` e `XXXVIII`. Filtri per tutti, da
ascoltare, già ascoltati. Due viste: nell'ordine del libro oppure raggruppati
per lettore.

Il capitolo XXXIV ha due parti e mostra due pulsanti separati; la durata
complessiva è indicata a parte.

## Aggiungere o correggere un capitolo

Tutto sta in `catalogo.js`. Per cambiare il nome di un lettore basta correggere
il campo `lettore`, che è quello mostrato in pagina. Per una nuova traccia:

```js
"tracce": [
  {
    "file": "18_Fabrizio.m4a",
    "parte": null,
    "lettore": "Burlando Fabrizio",
    "formato": "m4a",
    "byte": 45607308,
    "data": "2026-09-01",
    "durata": null
  }
]
```

Ricordati poi di rilanciare lo scenario Make e di aggiungere il link del
nuovo file in `config.js`.

## Una nota sul capitolo IV

È stato consegnato in `.mp4` anziché `.m4a`. Il lettore interno lo riproduce
lo stesso, prendendone la traccia audio. Se vuoi uniformare, riconvertilo e
correggi il nome in `catalogo.js` e in `config.js`.
