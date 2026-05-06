import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | TrustBridge B2B",
  description: "Privacy Policy for TrustBridge Portal.",
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const translations = {
    ro: {
      title: "Politica de Confidențialitate",
      portalName: "TrustBridge Portal",
      lastUpdated: "Ultima actualizare: 01.05.2026",
      summaryHeader: "Rezumat rapid",
      summaryIntro: "Ce facem cu datele dumneavoastră:",
      summaryPoints: [
        "Utilizăm datele pentru a organiza cererile, profilurile furnizorilor și procesele de achiziție.",
        "Transferăm datele doar dacă este necesar pentru cerere, matching, tranzacție sau obligații legale.",
        "Calificarea furnizorilor, traducerile și partenerii regionali sunt procese tratate transparent.",
        "Vă păstrați toate drepturile de protecție a datelor și ne puteți contacta oricând."
      ],
      fullPolicyLabel: "Politica de Confidențialitate Detaliată",
      content: `Această politică de confidențialitate explică modul în care TrustBridge - M&M Kft (Ltd.) prelucrează datele cu caracter personal atunci când utilizați portalul nostru, site-urile web, formularele, backend-ul furnizorului, coșul de cereri, canalele de comunicare și serviciile conexe.

1. Cine este responsabilul?
Responsabil: CEO Alf Martienssen, M&M Kft, Oroszlán u. 36., 1152 Budapesta, Ungaria. E-mail: datasec@ttc-group.hu.

2. Cui se aplică?
Vizitatorilor, clienților, furnizorilor, partenerilor de afaceri și utilizatorilor formularelor de cerere.

3. Context legal regional
Operăm în Austria, Ungaria, Germania, România și Elveția. Aplicăm GDPR (UE) și noul LPD (Elveția).

4. Categorii de date prelucrate
Prelucrăm date de bază (nume, firmă), contact (e-mail, telefon), date de cont, date de achiziție, date de furnizor, date tehnice și financiare pentru calificarea furnizorilor.

5. Sursa datelor
Direct de la utilizator, din activitatea platformei, de la parteneri regionali sau registre publice.

6. Scopul prelucrării
- Administrarea contului (Art. 6 alin. 1 lit. b GDPR).
- Procesarea cererilor de achiziție și matching.
- Publicarea profilurilor de furnizor și traduceri automate.
- Calificarea furnizorilor (Supplier Qualification).
- Suport, comunicare și soluționarea conflictelor.
- Securitatea sistemului și prevenirea abuzurilor.

7. Procese automate și traduceri
Utilizăm automatizarea pentru traducerea conținutului, categorisirea cererilor și matching-ul cu furnizorii.

8. Destinatarii datelor
Datele pot fi transmise departamentelor interne, furnizorilor de IT, partenerilor regionali, autorităților și partenerilor de logistică.

9. Transferuri internaționale
Transferurile în afara SEE se fac doar pe baza clauzelor contractuale standard sau deciziilor de adecvare.

10. Cookies
Utilizăm module necesare pentru funcționare și module analitice cu consimțământ.

11. Durata stocării
Stocăm datele pe durata contractului, a contului activ sau conform termenelor legale de arhivare (ex. date fiscale).

12. Drepturile dumneavoastră
Aveți dreptul la: informare, rectificare, ștergere, restricționare, portabilitate și opoziție.

13. Reclamații
Vă puteți adresa ANSPDCP (România) sau FDPIC/EDÖB (Elveția).

14. Obligația furnizării datelor
Fără datele necesare, nu putem crea conturi sau procesa cereri.

15. Date B2B
Protejăm datele persoanelor de contact chiar și în contextul business-to-business.

16. Note pentru parteneri
Furnizorii trebuie să se asigure că au dreptul de a partaja datele angajaților lor pe platformă.

17. Securitate
Aplicăm măsuri tehnice moderne pentru integritatea și confidențialitatea datelor.

18. Modificări
Actualizăm politica în funcție de evoluția serviciilor sau a legislației.

19. Contact
datasec@ttc-group.hu`
    },
    hu: {
      title: "Adatvédelmi Tájékoztató",
      portalName: "TrustBridge Portal",
      lastUpdated: "Utoljára frissítve: 2026.05.01",
      summaryHeader: "Gyors összefoglaló",
      summaryIntro: "Mit teszünk az adataival:",
      summaryPoints: [
        "Adatait ajánlatkérések, beszállítói profilok és beszerzési folyamatok szervezésére használjuk.",
        "Csak akkor továbbítunk adatokat, ha az ajánlathoz, párosításhoz, lebonyolításhoz vagy jogi kötelezettséghez szükséges.",
        "A beszállítói minősítés, a fordítások és a regionális partnerek bevonása átlátható folyamat.",
        "Ön bármikor gyakorolhatja adatvédelmi jogait, és bármikor kapcsolatba léphet velünk."
      ],
      fullPolicyLabel: "Részletes Adatvédelmi Tájékoztató",
      content: `Ez az adatvédelmi nyilatkozat ismerteti, hogyan kezeli a TrustBridge - M&M Kft (Kft.) a személyes adatokat a portálunk, weboldalaink, űrlapjaink, kommunikációs csatornáink és kapcsolódó szolgáltatásaink használata során.

1. Ki a felelős?
Adatkezelő: Alf Martienssen ügyvezető, M&M Kft, Oroszlán u. 36., 1152 Budapest, Magyarország. E-mail: datasec@ttc-group.hu.

2. Kire vonatkozik?
Látogatókra, ügyfelekre, beszállítókra, üzleti partnerekre és az ajánlatkérő űrlapok használóira.

3. Regionális jogi keretek
Ausztriában, Magyarországon, Németországban, Romániában és Svájcban tevékenykedünk. Alkalmazzuk a GDPR-t és a svájci nDSG-t.

4. Kezelt adatok kategóriái
Kezelünk törzsadatokat (név, cég), kapcsolattartási adatokat, fiókadatokat, beszerzési adatokat, beszállítói adatokat, technikai adatokat és bonitásvizsgálati adatokat.

5. Az adatok forrása
Közvetlenül a felhasználótól, a platformon végzett tevékenységből vagy nyilvános regiszterekből.

6. Az adatkezelés célja
- Fiókkezelés (GDPR 6. cikk (1) bek. b).
- Ajánlatkérések feldolgozása és matching.
- Beszállítói profilok közzététele és automatikus fordítás.
- Beszállítói minősítés (Supplier Qualification).
- Támogatás, kommunikáció és konfliktuskezelés.
- Rendszerbiztonság és visszaélések megelőzése.

7. Automatizált folyamatok és fordítások
Automatizálást használunk a tartalomfordításhoz, a kérések kategorizálásához és a beszállítói párosításhoz.

8. Adatátvevők
Belső részlegek, IT-szolgáltatók, regionális partnerek, hatóságok és logisztikai partnerek.

9. Nemzetközi adattovábbítás
Az EGT-n kívüli adattovábbítás csak általános szerződési feltételek vagy megfelelőségi határozatok alapján történik.

10. Sütik (Cookies)
A működéshez szükséges és hozzájáruláson alapuló analitikai sütiket használunk.

11. Az adattárolás időtartama
A szerződés időtartamáig, az aktív fiók fennállásáig vagy a törvényi megőrzési időkig (pl. adóügyi adatok).

12. Az Ön jogai
Önt megilleti: tájékoztatás, helyesbítés, törlés, korlátozás, adathordozhatóság és tiltakozás.

13. Panaszjog
Fordulhat a NAIH-hoz (Magyarország) vagy a svájci EDÖB-höz.

14. Adatszolgáltatási kötelezettség
Alapadatok nélkül nem tudunk fiókot létrehozni vagy ajánlatkérést feldolgozni.

15. B2B adatok
Üzleti környezetben is védjük a kapcsolattartó személyek adatait.

16. Megjegyzések beszállítóknak
A beszállítóknak biztosítaniuk kell, hogy jogosultak alkalmazottaik adatainak megosztására a platformon.

17. Adatbiztonság
Modern technikai és szervezési intézkedéseket alkalmazunk az adatok integritása érdekében.

18. Módosítások
A tájékoztatót a szolgáltatások vagy a jogszabályok változása esetén frissítjük.

19. Kapcsolat
datasec@ttc-group.hu`
    },
    de: {
      title: "Datenschutzerklärung",
      portalName: "TrustBridge Portal",
      lastUpdated: "Zuletzt aktualisiert: 01.05.2026",
      summaryHeader: "Kurzfassung im Portal",
      summaryIntro: "Was wir mit Ihren Daten tun:",
      summaryPoints: [
        "Wir nutzen Ihre Daten, um Anfragen, Anbieterprofile und Beschaffungsprozesse zu organisieren.",
        "Wir geben Daten nur weiter, wenn dies für Anfrage, Matching, Abwicklung oder gesetzliche Pflichten erforderlich ist.",
        "Anbieterqualifizierung, Übersetzungen und regionale Partnerprozesse werden transparent berücksichtigt.",
        "Sie behalten Ihre Datenschutzrechte und können uns jederzeit kontaktieren."
      ],
      fullPolicyLabel: "Ausführliche Privacy Policy",
      content: `Diese Datenschutzerklärung erläutert, wie TrustBridge - M&M Kft (Ltd.) personenbezogene Daten verarbeitet, wenn Sie unser Portal, unsere Websites, unsere Formulare, unser Anbieter-Backend, unseren Anfragekorb, unsere Kommunikationskanäle und damit verbundene Dienste nutzen.

1. Wer ist Verantwortlicher?
Verantwortlicher: CEO Alf Martienssen, M&M Kft, Oroszlán u. 36., 1152 Budapest. E-Mail: datasec@ttc-group.hu.

2. Für wen gilt diese Erklärung?
Besucher, Kunden, Anbieter, Ansprechpartner bei Unternehmen und Nutzer von Support-Funktionen.

3. Rechtlicher Rahmen
Wir sind in Österreich, Ungarn, Deutschland, Rumänien und der Schweiz tätig. Es gelten die DSGVO und das Schweizer DSG.

4. Welche Daten wir verarbeiten
Stammdaten, Kontaktdaten, Kontodaten, Anfrage- und Beschaffungsdaten, Anbieterdaten, technische Nutzungsdaten sowie Finanzdaten zur Anbieterqualifizierung.

5. Herkunft der Daten
Direkt von Ihnen, aus Plattformaktivitäten, von regionalen Partnern oder öffentlichen Registern.

6. Warum wir Daten verarbeiten
- Kontoführung (Art. 6 Abs. 1 lit. b DSGVO).
- Suchanfragen, Matching und Prozessbegleitung.
- Anbieterprofile und automatische Übersetzungen.
- Anbieterqualifizierung (Supplier Qualification).
- Kommunikation, Support und Konfliktlösung.
- Sicherheit und Missbrauchserkennung.

7. Automatisierte Prozesse
Wir nutzen Automatisierung für Übersetzungen, Kategorisierung von Anfragen und Anbieter-Matching.

8. Empfänger der Daten
Interne Fachbereiche, IT-Dienstleister, regionale Partner, Behörden und Logistikpartner.

9. Internationale Übermittlungen
Übermittlungen außerhalb des EWR/CH erfolgen auf Basis von Standardvertragsklauseln oder Angemessenheitsbeschlüssen.

10. Cookies
Wir nutzen notwendige Cookies sowie Analyse-Tools auf Basis Ihrer Einwilligung.

11. Speicherdauer
Daten werden für die Dauer des Vertrags, des Kontos oder gemäß gesetzlicher Aufbewahrungspflichten gespeichert.

12. Ihre Rechte
Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch.

13. Beschwerderecht
Zuständig sind die jeweiligen nationalen Aufsichtsbehörden (z.B. ANSPDCP, EDÖB).

14. Bereitstellungspflicht
Ohne erforderliche Daten können wir bestimmte Leistungen nicht erbringen.

15. B2B-Daten
Wir schützen personenbezogene Daten natürlicher Personen auch im geschäftlichen Kontext.

16. Hinweise für Anbieter
Anbieter müssen die Berechtigung zur Weitergabe von Daten Dritter sicherstellen.

17. Datensicherheit
Wir treffen angemessene technische Maßnahmen zum Schutz Ihrer Daten.

18. Änderungen
Diese Erklärung wird bei Bedarf angepasst und im Portal veröffentlicht.

19. Kontakt
datasec@ttc-group.hu`
    }
  };

  const t = translations[lang as keyof typeof translations] || translations.de;

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900 font-sans pb-20">
      {/* Hero Section */}
      <section className="border-b-4 border-slate-900 bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center md:text-left">
          <p className="text-sm font-black uppercase tracking-widest text-white/70">
            {t.portalName}
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-black uppercase italic leading-tight">
            {t.title}
          </h1>
          <p className="mt-4 text-white/60 font-bold">{t.lastUpdated}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 -mt-8">
        {/* SECTION 20: Kurzfassung (Rezumat) - Neo-Brutalist Box */}
        <div className="mb-12 rounded-3xl border-4 border-slate-900 bg-[#FFD54F] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-2xl font-black uppercase flex items-center">
            <span className="mr-3 text-3xl">💡</span> {t.summaryHeader}
          </h2>
          <p className="mb-6 font-bold text-slate-900 text-lg">{t.summaryIntro}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {t.summaryPoints.map((point, idx) => (
              <div key={idx} className="flex items-start bg-white/50 p-4 rounded-xl border-2 border-slate-900/10">
                <span className="mr-3 mt-1 text-[#0b5f5d] font-black">✓</span>
                <p className="font-bold text-slate-800 leading-snug">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Detailed Policy Content */}
        <div className="rounded-3xl border-4 border-slate-900 bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:p-12">
          <h3 className="mb-8 text-xl font-black uppercase text-slate-400 border-b-2 border-slate-100 pb-4">
            {t.fullPolicyLabel}
          </h3>
          <div className="whitespace-pre-line text-base md:text-lg leading-relaxed text-slate-700 font-medium">
            {t.content}
          </div>
        </div>
      </section>
    </main>
  );
}