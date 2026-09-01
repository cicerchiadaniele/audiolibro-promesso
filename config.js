/* ============================================================
   L'unico file da toccare.
   ============================================================ */

window.CONFIG = {

  /* Link pubblico di sola lettura della cartella Dropbox.
     È già quello attivo. Se lo rigeneri da Dropbox, incollalo qui
     per intero, compreso ?rlkey=… */
  cartella:
    "https://www.dropbox.com/scl/fo/yqxoxw8yvbxt9sofu3b0v/AJOlVIYQNOnSNw4Isb5-TWU?rlkey=lq2nmw4qb0psuoj6oth4yu86r&dl=0",


  /* Ascolto dentro la pagina.
     Dropbox non permette di ricavare l'audio dal link della cartella,
     quindi serve un link pubblico del singolo file. Quando ne incolli
     uno qui sotto, accanto al capitolo compare anche il lettore interno.
     Formato: "nome del file": "link pubblico del file"
     Esempio:
       "01_Pasquali Silvia e Ilaria.mp3": "https://www.dropbox.com/scl/fi/…?rlkey=…&dl=0"
     Senza nulla qui dentro l'app funziona lo stesso: apre Dropbox. */
  linkDiretti: {},

  /* Memoria locale dei capitoli ascoltati (resta sul dispositivo di chi legge). */
  ricordaAscolti: true

};
