# I Promessi Sposi — l'indice dell'audiolibro

Pagina web che raccoglie in ordine tutte le registrazioni archiviate nella
cartella Dropbox. Ogni capitolo si apre con un tocco: si apre il file dentro
Dropbox, che lo riproduce senza scaricarlo.

## Che cosa contiene

| File | A cosa serve |
|---|---|
| `index.html` | la pagina |
| `styles.css` | l'aspetto |
| `app.js` | la logica |
| `catalogo.js` | l'elenco dei capitoli e dei file |
| `config.js` | **l'unico file da modificare** |

## Per pubblicarla

Trascina la cartella su [Netlify Drop](https://app.netlify.com/drop) e ottieni
subito un indirizzo `https://…` da mandare a chi legge. Vanno bene anche
Vercel, GitHub Pages o Cloudflare Pages. Funziona anche aprendo `index.html`
con un doppio clic, senza server.

Non serve altro: il link pubblico di sola lettura della cartella è già dentro
`config.js` ed è quello che risulta attivo su Dropbox al 1° settembre 2026.

## Come funziona il collegamento a Dropbox

La pagina non copia né sposta nulla. Prende il link della cartella condivisa e
vi aggiunge il nome del file, così:

```
…/AJOlVIYQNOnSNw4Isb5-TWU?rlkey=…&dl=0&preview=07_Giancarlo.mp3
```

I file restano dove sono. Se ne rinomini uno, va aggiornato il nome dentro
`catalogo.js`; se ne aggiungi uno nuovo, va aggiunta la sua traccia.

## Che cosa sa fare la pagina

- **Ricerca** per numero, titolo, nome del lettore o nome del file.
- **Filtri**: tutti, da ascoltare, già ascoltati, ancora da registrare.
- **Due viste**: per capitolo (l'ordine del libro) oppure raggruppati per
  lettore, utile per capire chi ha letto che cosa.
- **Segno di ascolto**: chi ascolta può marcare i capitoli fatti. Il segno
  resta sul suo dispositivo, non viene mandato da nessuna parte.
- **Riprendi**: porta al primo capitolo non ancora ascoltato.
- Il **capitolo XXXIV** ha due parti e mostra due pulsanti separati.
- Il **capitolo XVIII** compare come casella vuota, con la dicitura «ancora da
  registrare», finché il file non arriva.

## Stato dell'archivio

Trentotto capitoli più l'introduzione, letti da ventidue voci diverse, per
circa 1,8 GB complessivi. Manca soltanto il capitolo XVIII.

Il capitolo IV è stato consegnato in `.mp4`: Dropbox lo apre lo stesso, ma
nel lettore video invece che in quello audio. Se vuoi uniformare, basta
riconvertirlo in `.m4a` e correggere il nome dentro `catalogo.js`.

## Aggiungere un capitolo

Apri `catalogo.js`, trova il capitolo e riempi la sua voce `tracce`:

```js
"tracce": [
  {
    "file": "18_Nome.m4a",
    "parte": null,
    "lettore": "Nome",
    "formato": "m4a",
    "byte": 34000000,
    "data": "2026-09-05"
  }
]
```

`byte` e `data` servono solo a mostrare peso e giorno di consegna: se non li
conosci, metti `0` e la data del giorno.

## Ascolto dentro la pagina (facoltativo)

Dropbox non permette di ricavare il flusso audio dal link della cartella, per
questo il pulsante apre Dropbox in una scheda nuova. Se per qualche capitolo
preferisci il lettore dentro la pagina, genera da Dropbox il link pubblico di
quel singolo file e incollalo in `config.js`:

```js
linkDiretti: {
  "01_Pasquali Silvia e Ilaria.mp3": "https://www.dropbox.com/scl/fi/…?rlkey=…&dl=0"
}
```

La pagina lo trasforma da sola in link riproducibile e mostra il lettore sotto
al capitolo. Quando la traccia finisce, il capitolo si segna da solo come
ascoltato.

## Se cambi il link della cartella

Se rigeneri il link su Dropbox, il vecchio `rlkey` smette di funzionare e la
pagina non apre più nulla. Basta incollare il nuovo link per intero dentro
`config.js`, alla voce `cartella`.
