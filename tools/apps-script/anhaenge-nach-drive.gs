/**
 * Anhänge aus info@kulturspinnerei.ch nach Google Drive kopieren.
 *
 * Kopiert NUR Anhänge aus Threads mit dem Gmail-Label "Jarvis-Anhaenge"
 * in den Drive-Ordner "Eingang Anhänge". Das Label setzt Jarvis (über den
 * Gmail-Connector) oder Alain bei Mails zu gebuchten Anlässen. Pitches und
 * Rosters ohne Label werden nie angefasst.
 *
 * Dateiname:    JJJJ-MM-TT_<Absender>_<Originalname>
 * Beschreibung: Absender, Betreff, Datum, Gmail-Message-ID und Link zur Mail.
 *
 * Es wird nichts gelöscht, verschoben oder gesendet. Gmail wird nur gelesen.
 * Einrichtung: siehe README.md im selben Ordner.
 */

var LABEL = 'Jarvis-Anhaenge';
var ORDNER_NAME = 'Eingang Anhänge';
var MAX_BYTES = 25 * 1024 * 1024;       // grössere Dateien überspringen
var MIN_BILD_BYTES = 15 * 1024;         // kleine Bilder sind meist Signaturen/Logos
var MAX_THREADS_PRO_LAUF = 50;

/** Wird vom Zeit-Trigger aufgerufen, kann auch von Hand ausgeführt werden. */
function run() {
  var ordner = ordner_();
  var vorhanden = vorhandeneNamen_(ordner);
  var ich = Session.getEffectiveUser().getEmail().toLowerCase();
  var threads = GmailApp.search('label:' + LABEL + ' has:attachment', 0, MAX_THREADS_PRO_LAUF);

  threads.forEach(function (thread) {
    thread.getMessages().forEach(function (msg) {
      if (msg.isDraft()) return;
      var von = msg.getFrom();
      if (von.toLowerCase().indexOf(ich) !== -1) return; // eigene Mails überspringen

      var anhaenge = msg.getAttachments({ includeInlineImages: false, includeAttachments: true });
      anhaenge.forEach(function (a) {
        var groesse = a.getSize();
        if (groesse > MAX_BYTES) return;
        if (/^image\//.test(a.getContentType()) && groesse < MIN_BILD_BYTES) return;

        var name = dateiname_(msg.getDate(), von, a.getName());
        if (vorhanden[name]) return; // schon kopiert
        var datei = ordner.createFile(a.copyBlob()).setName(name);
        datei.setDescription([
          'Von: ' + von,
          'Betreff: ' + msg.getSubject(),
          'Datum: ' + msg.getDate().toISOString(),
          'Gmail-Message-ID: ' + msg.getId(),
          'Mail: https://mail.google.com/mail/u/0/#all/' + msg.getId()
        ].join('\n'));
        vorhanden[name] = true;
      });
    });
  });
}

/** Einmalig von Hand ausführen: legt das Label und den Trigger alle 15 Minuten an. */
function einrichten() {
  if (!GmailApp.getUserLabelByName(LABEL)) GmailApp.createLabel(LABEL);
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'run') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('run').timeBased().everyMinutes(15).create();
  ordner_();
}

function ordner_() {
  var it = DriveApp.getFoldersByName(ORDNER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(ORDNER_NAME);
}

function vorhandeneNamen_(ordner) {
  var namen = {};
  var it = ordner.getFiles();
  while (it.hasNext()) namen[it.next().getName()] = true;
  return namen;
}

function dateiname_(datum, von, original) {
  var tag = Utilities.formatDate(datum, 'Europe/Zurich', 'yyyy-MM-dd');
  var mail = (von.match(/<([^>]+)>/) || [null, von])[1];
  var absender = String(mail).split('@')[0].replace(/[^A-Za-z0-9._-]/g, '');
  return tag + '_' + absender + '_' + original;
}
