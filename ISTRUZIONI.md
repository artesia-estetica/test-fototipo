# Come collegare il Test Fototipo a Google Sheet + Email

Hai 3 file in questa cartella:

- `index.html` → la pagina del quiz che le clienti compileranno
- `Codice.gs` → lo script che salva i dati e manda l'email
- `ISTRUZIONI.md` → questa guida

Segui questi passaggi **nell'ordine**, ci vogliono circa 10 minuti.

---

## 1. Crea il Google Sheet

1. Vai su [sheets.google.com](https://sheets.google.com) e crea un foglio nuovo.
2. Chiamalo ad esempio **"Risposte Test Fototipo Artesia"**.
3. Non serve creare intestazioni: le crea automaticamente lo script alla prima risposta.

## 2. Apri l'editor di script

1. Nel foglio, vai su **Estensioni → Apps Script**.
2. Cancella il contenuto del file `Codice.gs` che si apre vuoto.
3. Apri il file `Codice.gs` che trovi in questa cartella sul tuo computer, copia **tutto** il contenuto e incollalo nell'editor di Apps Script.
4. Premi il tasto 💾 (Salva progetto). Dai un nome al progetto, es. "Test Fototipo Artesia".

## 3. Inserisci le tue offerte personalizzate

Sempre dentro l'editor di script, cerca il blocco `FOTOTIPI` in cima al file: contiene 4 sezioni (I-II, III, IV-V, VI). Per ognuna sostituisci la riga:

```
offerta: 'INSERIRE QUI OFFERTA DEDICATA AL FOTOTIPO ...'
```

con il testo della tua offerta reale. Salva di nuovo (💾).

## 4. Pubblica lo script come Web App

1. In alto a destra clicca **Esegui il deployment → Nuovo deployment**.
2. Clicca l'icona ⚙️ accanto a "Seleziona tipo" e scegli **App web**.
3. Imposta:
   - **Esegui come:** Io (il tuo account)
   - **Chi ha accesso:** Chiunque
4. Clicca **Esegui il deployment**.
5. La prima volta Google chiederà di autorizzare lo script: clicca **Autorizza accesso**, scegli il tuo account, poi (se compare un avviso "app non verificata") clicca **Impostazioni avanzate → Vai al progetto (nome non sicuro)** → **Consenti**. È il tuo stesso script, è sicuro autorizzarlo.
6. Copia l'**URL dell'app web** che ti viene mostrato (inizia con `https://script.google.com/macros/s/.../exec`).

## 5. Collega l'URL alla pagina del quiz

1. Apri `index.html` con un editor di testo (anche TextEdit va bene, basta non salvarlo come "rich text").
2. Cerca la riga:
   ```js
   const SCRIPT_URL = "INCOLLA_QUI_URL_WEB_APP_APPS_SCRIPT";
   ```
3. Sostituisci `INCOLLA_QUI_URL_WEB_APP_APPS_SCRIPT` con l'URL copiato al punto 4.6, tra le virgolette. Esempio:
   ```js
   const SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
4. Salva il file.

## 6. Pubblica la pagina online

`index.html` è un file autonomo: puoi caricarlo su qualunque hosting statico (es. una sottopagina del sito Artesia, Netlify, Google Sites con embed HTML, ecc.) oppure condividerlo direttamente come link alle clienti.

## 7. Prova il test

Apri la pagina, compila il quiz con un tuo nome ed email di prova e verifica che:

- Il risultato compaia subito a schermo
- Una nuova riga compaia nel Google Sheet
- Arrivi l'email col risultato e l'offerta

---

### Ogni volta che vuoi modificare le domande, i punteggi o le offerte

- Domande/punteggi/testi del risultato a schermo → modifica l'oggetto `QUESTIONS` e `RESULTS` dentro `index.html`.
- Testi dell'offerta via email → modifica l'oggetto `FOTOTIPI` dentro `Codice.gs` (poi salva e, se hai già pubblicato il deployment, vai su **Esegui il deployment → Gestisci deployment → ✏️ → Nuova versione → Esegui il deployment** per aggiornare la Web App senza cambiare URL).
