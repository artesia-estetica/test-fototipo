/* ==========================================================
   ARTESIA — Test Fototipo
   Script per Google Sheets + Google Apps Script
   ==========================================================
   Cosa fa:
   1) Riceve i dati inviati dalla pagina del quiz (index.html)
   2) Calcola il fototipo dal punteggio
   3) Salva una riga nel foglio "Risposte"
   4) Invia alla cliente un'email personalizzata col risultato
      e l'offerta dedicata al suo fototipo

   Vedi ISTRUZIONI.md per come installarlo e collegarlo.
   ========================================================== */

const NOME_FOGLIO = 'Risposte';

/* ----------------------------------------------------------
   OFFERTE PERSONALIZZATE — sostituisci i testi qui sotto
   con quelli che hai già pronto per ciascun fototipo.
   Puoi usare tag HTML semplici (<b>, <br>, ecc.)
   ---------------------------------------------------------- */
const FOTOTIPI = {
  'I-II': {
    titolo: 'Fototipo I-II',
    sottotitolo: 'Pelle molto chiara',
    descrizione: 'Pelle molto chiara e delicata: si scotta facilmente e fatica ad abbronzarsi. Ha bisogno di protezione elevata e di trattamenti pensati per rispettarne la sensibilità.',
    offerta: 'INSERIRE QUI OFFERTA DEDICATA AL FOTOTIPO I-II',
  },
  'III': {
    titolo: 'Fototipo III',
    sottotitolo: 'Pelle media',
    descrizione: 'Carnagione media: reagisce bene al sole e si abbronza in modo graduale. Una pelle equilibrata, che trae beneficio da trattamenti mirati a mantenerne la luminosità.',
    offerta: 'INSERIRE QUI OFFERTA DEDICATA AL FOTOTIPO III',
  },
  'IV-V': {
    titolo: 'Fototipo IV-V',
    sottotitolo: 'Pelle olivastra',
    descrizione: 'Pelle olivastra che tende ad abbronzarsi rapidamente, scottandosi raramente. Una pelle resistente, che può beneficiare di trattamenti specifici per uniformità e tono.',
    offerta: 'INSERIRE QUI OFFERTA DEDICATA AL FOTOTIPO IV-V',
  },
  'VI': {
    titolo: 'Fototipo VI',
    sottotitolo: 'Pelle scura',
    descrizione: 'Pelle scura che reagisce al sole con un\'abbronzatura intensa e naturale. Una pelle forte, che merita trattamenti pensati per valorizzarne la profondità del colore.',
    offerta: 'INSERIRE QUI OFFERTA DEDICATA AL FOTOTIPO VI',
  },
};

/* ----------------------------------------------------------
   Calcola il fototipo dal punteggio totale (6-24)
   ---------------------------------------------------------- */
function calcolaFototipo(punteggio) {
  if (punteggio <= 10) return FOTOTIPI['I-II'];
  if (punteggio <= 15) return FOTOTIPI['III'];
  if (punteggio <= 20) return FOTOTIPI['IV-V'];
  return FOTOTIPI['VI'];
}

/* ----------------------------------------------------------
   Riceve i dati dal quiz (POST)
   ---------------------------------------------------------- */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const fototipo = calcolaFototipo(data.punteggio);

    salvaSuSheet(data, fototipo);
    inviaEmailRisultato(data, fototipo);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* ----------------------------------------------------------
   Salva la riga nel foglio Google Sheet
   ---------------------------------------------------------- */
function salvaSuSheet(data, fototipo) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(NOME_FOGLIO);
  if (!sheet) {
    sheet = ss.insertSheet(NOME_FOGLIO);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Data', 'Nome', 'Email',
      'Risposta 1', 'Risposta 2', 'Risposta 3', 'Risposta 4', 'Risposta 5', 'Risposta 6',
      'Punteggio', 'Fototipo',
    ]);
  }
  const risposte = data.risposte || [];
  sheet.appendRow([
    new Date(),
    data.nome || '',
    data.email || '',
    risposte[0] || '', risposte[1] || '', risposte[2] || '',
    risposte[3] || '', risposte[4] || '', risposte[5] || '',
    data.punteggio,
    fototipo.titolo,
  ]);
}

/* ----------------------------------------------------------
   Invia l'email personalizzata con risultato + offerta
   ---------------------------------------------------------- */
function inviaEmailRisultato(data, fototipo) {
  if (!data.email) return;

  const oggetto = `${data.nome}, ecco il tuo Fototipo: ${fototipo.titolo}`;
  const htmlBody = costruisciEmailHtml(data.nome, fototipo);

  MailApp.sendEmail({
    to: data.email,
    subject: oggetto,
    htmlBody: htmlBody,
  });
}

/* ----------------------------------------------------------
   Template email HTML — coerente con la grafica del sito Artesia
   (palette rosa cipria, font serif per i titoli)
   ---------------------------------------------------------- */
function costruisciEmailHtml(nome, fototipo) {
  return `
  <div style="background:#fbf3f3; padding:32px 16px; font-family:'Poppins',Arial,sans-serif;">
    <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(43,28,20,0.08);">

      <div style="padding:36px 32px 24px; text-align:center;">
        <div style="font-family:Georgia,'Playfair Display',serif; font-size:26px; letter-spacing:3px; color:#2b1c14; font-weight:600;">ARTESIA</div>
        <div style="width:48px; height:2px; background:#c26876; margin:10px auto 0;"></div>
      </div>

      <div style="padding:0 32px 32px; text-align:center;">
        <p style="font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#c26876; font-weight:600; margin:0 0 8px;">
          Il tuo risultato, ${escapeHtml(nome)}
        </p>
        <h1 style="font-family:Georgia,'Playfair Display',serif; font-size:32px; color:#2b1c14; margin:0 0 4px; font-weight:600;">
          ${fototipo.titolo}
        </h1>
        <p style="font-family:Georgia,'Playfair Display',serif; font-style:italic; color:#a84f5c; font-size:16px; margin:0 0 20px;">
          ${fototipo.sottotitolo}
        </p>
        <p style="font-size:14.5px; line-height:1.7; color:#6b6b6a; margin:0 0 24px;">
          ${fototipo.descrizione}
        </p>

        <div style="background:#faf1f2; border-radius:14px; padding:22px 24px; text-align:left;">
          <p style="font-size:12px; letter-spacing:1.5px; text-transform:uppercase; color:#a84f5c; font-weight:600; margin:0 0 10px;">
            La tua offerta dedicata
          </p>
          <p style="font-size:14.5px; line-height:1.7; color:#2b1c14; margin:0;">
            ${fototipo.offerta}
          </p>
        </div>

        <p style="font-size:13px; color:#a5a5a4; margin:28px 0 0;">
          Grazie per aver fatto il Test del Fototipo con noi 💌<br>
          Ti aspettiamo da Artesia.
        </p>
      </div>

      <div style="background:#2b1c14; padding:18px; text-align:center;">
        <p style="font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#e9c3c9; margin:0;">
          Artesia &middot; Il trucco c'è ma non si vede
        </p>
      </div>

    </div>
  </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
