import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Founder Story | TrustBridge B2B",
  description:
    "Warum TrustBridge entstanden ist und warum vertrauensbasierte B2B-Beschaffung heute wichtiger ist denn je.",
};

export default async function FounderPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const content = {
    de: {
      back: "Zurück zu Über uns",
      label: "Ein Wort des Gründers",
      title: "Warum dieses Modell entstanden ist – und warum es jetzt funktioniert",
      subtitle:
        "Ein Wort des Gründers an Euch, die Käufer und Verkäufer – und das sind wir ja schließlich alle.",
      paragraphs: [
        "Ich habe lange daran geglaubt, dass man mit profunder Ausbildung, mit Erfahrung, einem guten Netzwerk und gesundem Menschenverstand die richtigen Entscheidungen trifft.",
        "Dass man erkennt, wer zuverlässig ist – besonders noch, wenn man wie ich als internationaler Auditor hunderte Firmen gesehen und Menschen bewertet hat.",
        "Dass man mit den richtigen Leuten stabile Geschäfte aufbauen kann.",
        "Dass Probleme Ausnahmen sind – nicht das System.",
        "Diese Überzeugung hat sich über Jahre und durch Erfahrung in vielen Branchen und mehreren Ländern aufgebaut.",
        "Diese Überzeugung ist entstanden in einer Zeit des Aufbruchs, nach dem 2. Weltkrieg, in einer Wirtschaftsdemokratie, die sogar in kommunistische Länder exportiert wurde.",
        "Und diese Überzeugung ist Stück für Stück zerbrochen.",
        "Nicht durch Theorie. Durch Praxis.",
        "Durch Projekte, die funktioniert haben – bis sie es plötzlich nicht mehr taten.",
        "Durch Partner, die überzeugt haben – und später nicht mehr greifbar waren.",
        "Durch Strukturen, die auf Vertrauen aufgebaut waren – aber diesem Vertrauen nicht standgehalten haben.",
        "Durch Lobbyisten, die natürliche Wirtschaftsprozesse zu ihrem eigenen Vorteil verbogen haben.",
        "Und irgendwann stellt sich nicht mehr die Frage, wie ein besserer Deal zustande kommt. Sondern eine andere: Was läuft hier eigentlich grundsätzlich falsch?",
        "Dann kam die nächste Ebene dazu: Krieg in der Ukraine. Konflikte im Nahen Osten. Energiepreise, die plötzlich alles verändern. Weltmächte, die nicht mehr kooperieren, sondern gegeneinander arbeiten.",
        "Und gleichzeitig ein System, das aus einer langen Phase des Überflusses kommt: zu viel Geld und daneben zu viel Armut. Zu viele Möglichkeiten und daneben zu wenige Ressourcen. Zu wenig echte Prüfung.",
        "Wir haben gelernt zu beschaffen. Wir folgen Trends, ohne die eigenen Möglichkeiten zu beachten. Wir kaufen, weil unqualifizierte Auditoren und Marketingler uns vorgaukeln, dass wir das brauchen – und wir haben verlernt zu hinterfragen.",
        "Heute ist klar: Das Problem ist heute nicht mehr wie vor 30 Jahren, dass es zu wenig Anbieter gibt. Das Problem ist, dass man nicht mehr weiß, welchen man vertrauen kann.",
        "Und genau hier kippt alles.",
        "Beschaffung ist heute kein operativer Prozess mehr. Es ist eine Entscheidung unter Unsicherheit. Mit echten Konsequenzen.",
        "Ich habe selbst erlebt, was es bedeutet, wenn Strukturen nicht tragen. Wenn Verantwortung nicht klar ist. Wenn niemand mehr wirklich zuständig ist, sobald es schwierig wird.",
        "Und genau daraus ist dieses Modell entstanden.",
        "Nicht aus der Idee, eine weitere Plattform zu bauen. Sondern aus der Notwendigkeit, ein Problem zu lösen, das real ist.",
        "Wir wollten keine bessere Liste von Anbietern. Wir wollten wissen, wer funktioniert.",
        "Wir wollten keine weiteren Kontakte. Wir wollten funktionierende Abläufe.",
        "Wir wollten keine Versprechen. Wir wollten Verlässlichkeit.",
        "Denn Sicherheit und Verlässlichkeit sparen unendlich Ressourcen. Und wenn Ressourcen knapper werden, ist das vielleicht unser und Ihr Schlüssel zur Überlebensfähigkeit.",
        "Deshalb prüfen wir Anbieter strukturiert.",
        "Deshalb kombinieren wir externe Einschätzungen mit eigener Bewertung.",
        "Deshalb bleiben wir Teil der Abwicklung – und ziehen uns nicht zurück, wenn es ernst wird.",
        "Und deshalb gibt es bei uns auch eine Konfliktlösung und Mediation.",
        "Nicht als Formalität, sondern weil wir wissen, dass genau dort entschieden wird, ob ein System funktioniert oder nicht.",
        "Die meisten Plattformen hören beim Kontakt auf. Wir fangen dort erst an.",
        "Warum funktioniert das jetzt und warum sehen wir darin die Zukunft?",
        "Weil die Welt sich verändert hat.",
        "Weil Unsicherheit nicht mehr die Ausnahme ist, sondern der Normalzustand.",
        "Weil Geschwindigkeit allein nicht mehr reicht.",
        "Und weil Vertrauen wieder verdient werden muss – nicht vorausgesetzt werden kann.",
        "Die Zukunft gehört nicht den Plattformen, die nur Möglichkeiten schaffen und Marketing transportieren.",
        "Sondern denen, die Verantwortung übernehmen, wenn es darauf ankommt.",
      ],
    },

    ro: {
      back: "Înapoi la Despre noi",
      label: "Un cuvânt din partea fondatorului",
      title: "De ce a apărut acest model – și de ce funcționează acum",
      subtitle:
        "Un cuvânt din partea fondatorului către voi, cumpărătorii și vânzătorii – pentru că, în fond, suntem cu toții ambele.",
      paragraphs: [
        "Mult timp am crezut că, printr-o educație solidă, experiență, o rețea bună și bun simț, se pot lua deciziile corecte.",
        "Că poți recunoaște cine este de încredere – mai ales dacă, ca mine, ai văzut sute de companii și ai evaluat oameni ca auditor internațional.",
        "Că, împreună cu oamenii potriviți, poți construi afaceri stabile.",
        "Că problemele sunt excepții – nu sistemul.",
        "Această convingere s-a format de-a lungul anilor, prin experiență în numeroase industrii și în mai multe țări.",
        "S-a născut într-o perioadă de dezvoltare, după Al Doilea Război Mondial, într-o democrație economică ce a fost chiar exportată și în țări comuniste.",
        "Și această convingere s-a destrămat treptat.",
        "Nu prin teorie. Prin practică.",
        "Prin proiecte care au funcționat – până când, brusc, nu au mai funcționat.",
        "Prin parteneri care păreau convingători – și mai târziu nu au mai fost de găsit.",
        "Prin structuri construite pe încredere – dar care nu au rezistat acestei încrederi.",
        "Prin lobby-iști care au distorsionat procesele economice naturale în propriul lor avantaj.",
        "La un moment dat, nu mai este vorba despre cum să obții un acord mai bun. Ci apare o altă întrebare: Ce nu funcționează, de fapt, la nivel fundamental?",
        "Apoi a apărut un alt nivel: războiul din Ucraina, conflictele din Orientul Mijlociu, prețurile energiei care schimbă brusc totul și mari puteri care nu mai cooperează, ci acționează una împotriva celeilalte.",
        "Și, în același timp, un sistem care vine dintr-o lungă perioadă de abundență: prea mulți bani și, în același timp, prea multă sărăcie. Prea multe posibilități și prea puține resurse. Prea puțină verificare reală.",
        "Am învățat să achiziționăm. Urmăm tendințe fără să ținem cont de propriile noastre capacități. Cumpărăm pentru că auditori necalificați și specialiști în marketing ne fac să credem că avem nevoie de asta – și am uitat să punem întrebări.",
        "Astăzi este clar: problema nu mai este, ca acum 30 de ani, că există prea puțini furnizori. Problema este că nu mai știm în cine putem avea încredere.",
        "Și exact aici se schimbă totul.",
        "Achizițiile nu mai sunt astăzi un proces operațional. Sunt o decizie luată în condiții de incertitudine. Cu consecințe reale.",
        "Am trăit personal ce înseamnă atunci când structurile nu funcționează. Când responsabilitatea nu este clară. Când nimeni nu mai este cu adevărat responsabil atunci când lucrurile devin dificile.",
        "Și exact din asta s-a născut acest model.",
        "Nu din ideea de a construi încă o platformă. Ci din necesitatea de a rezolva o problemă reală.",
        "Nu am vrut o listă mai bună de furnizori. Am vrut să știm cine funcționează cu adevărat.",
        "Nu am vrut mai multe contacte. Am vrut procese care funcționează.",
        "Nu am vrut promisiuni. Am vrut fiabilitate.",
        "Pentru că siguranța și fiabilitatea economisesc resurse enorme. Iar pe măsură ce resursele devin mai limitate, aceasta poate fi cheia noastră și a dumneavoastră pentru supraviețuire.",
        "De aceea evaluăm furnizorii într-un mod structurat.",
        "De aceea combinăm evaluările externe cu propria noastră evaluare.",
        "De aceea rămânem parte din proces – și nu ne retragem atunci când lucrurile devin serioase.",
        "Și de aceea oferim și soluționarea conflictelor și mediere.",
        "Nu ca o formalitate, ci pentru că știm că exact acolo se decide dacă un sistem funcționează sau nu.",
        "Majoritatea platformelor se opresc la realizarea contactului. Noi abia de acolo începem.",
        "De ce funcționează asta acum – și de ce vedem în asta viitorul?",
        "Pentru că lumea s-a schimbat.",
        "Pentru că incertitudinea nu mai este excepția, ci norma.",
        "Pentru că viteza singură nu mai este suficientă.",
        "Și pentru că încrederea trebuie din nou câștigată – nu poate fi presupusă.",
        "Viitorul nu aparține platformelor care doar creează oportunități și transmit marketing.",
        "Ci celor care își asumă responsabilitatea atunci când contează cu adevărat.",
      ],
    },

    hu: {
      back: "Vissza a Rólunk oldalra",
      label: "Egy szó az alapítótól",
      title: "Miért jött létre ez a modell – és miért működik most",
      subtitle:
        "Egy szó az alapítótól hozzátok, vevőkhöz és eladókhoz – hiszen végső soron mindannyian mindkettők vagyunk.",
      paragraphs: [
        "Sokáig hittem abban, hogy alapos képzettséggel, tapasztalattal, jó kapcsolati hálóval és józan ésszel helyes döntéseket lehet hozni.",
        "Hogy felismerhető, ki megbízható – különösen akkor, ha valaki, mint én, nemzetközi auditorként több száz céget látott és embereket értékelt.",
        "Hogy a megfelelő emberekkel stabil üzleteket lehet építeni.",
        "Hogy a problémák kivételek – nem maga a rendszer.",
        "Ez a meggyőződés évek alatt alakult ki, számos iparágban és több országban szerzett tapasztalatok alapján.",
        "Egy olyan korszakban született, amely a második világháború utáni fellendülést hozta, egy gazdasági demokráciában, amelyet még kommunista országokba is exportáltak.",
        "És ez a meggyőződés fokozatosan darabokra tört.",
        "Nem elmélet által. Hanem a gyakorlatban.",
        "Projekteken keresztül, amelyek működtek – egészen addig, amíg hirtelen már nem.",
        "Partnereken keresztül, akik meggyőzőek voltak – majd később elérhetetlenné váltak.",
        "Struktúrákon keresztül, amelyek bizalomra épültek – de nem bírták el ezt a bizalmat.",
        "Lobbistákon keresztül, akik a természetes gazdasági folyamatokat a saját előnyükre torzították.",
        "Egy ponton már nem az a kérdés, hogyan lehet jobb üzletet kötni. Hanem egy másik: Mi az, ami alapvetően rosszul működik itt?",
        "Aztán megjelent egy újabb szint: háború Ukrajnában, konfliktusok a Közel-Keleten, energiaárak, amelyek hirtelen mindent megváltoztatnak, és világhatalmak, amelyek már nem együttműködnek, hanem egymás ellen dolgoznak.",
        "És mindeközben egy rendszer, amely egy hosszú bőségidőszakból érkezik: túl sok pénz és mellette túl sok szegénység. Túl sok lehetőség és túl kevés erőforrás. Túl kevés valódi ellenőrzés.",
        "Megtanultunk beszerezni. Trendeket követünk anélkül, hogy a saját lehetőségeinket figyelembe vennénk. Vásárolunk, mert képzetlen auditorok és marketingesek elhitetik velünk, hogy szükségünk van rá – és elfelejtettünk kérdezni.",
        "Ma már világos: a probléma már nem az, mint 30 évvel ezelőtt, hogy túl kevés a beszállító. A probléma az, hogy már nem tudjuk, kiben bízhatunk.",
        "És pontosan itt fordul meg minden.",
        "A beszerzés ma már nem operatív folyamat. Hanem bizonytalanság alatti döntés. Valós következményekkel.",
        "Saját tapasztalatból tudom, mit jelent, amikor a struktúrák nem működnek. Amikor a felelősség nem egyértelmű. Amikor senki sem igazán illetékes, amint nehézzé válik a helyzet.",
        "És pontosan ebből született ez a modell.",
        "Nem egy újabb platform építésének ötletéből. Hanem egy valós probléma megoldásának szükségességéből.",
        "Nem egy jobb beszállítói listát akartunk. Azt akartuk tudni, ki működik valóban.",
        "Nem több kapcsolatot akartunk. Működő folyamatokat akartunk.",
        "Nem ígéreteket akartunk. Megbízhatóságot akartunk.",
        "Mert a biztonság és a megbízhatóság hatalmas erőforrásokat takarít meg. És ahogy az erőforrások szűkösebbé válnak, ez lehet a mi és az Ön túlélési kulcsa.",
        "Ezért vizsgáljuk strukturált módon a beszállítókat.",
        "Ezért kombináljuk a külső értékeléseket a saját értékelésünkkel.",
        "Ezért maradunk a folyamat részei – és nem lépünk hátra, amikor komolyra fordulnak a dolgok.",
        "És ezért kínálunk konfliktuskezelést és mediációt is.",
        "Nem formalitásként, hanem mert tudjuk, hogy pontosan ott dől el, működik-e egy rendszer vagy sem.",
        "A legtöbb platform a kapcsolatfelvételnél megáll. Mi ott kezdjük el igazán.",
        "Miért működik ez most – és miért látjuk ebben a jövőt?",
        "Mert a világ megváltozott.",
        "Mert a bizonytalanság már nem kivétel, hanem az alapállapot.",
        "Mert a gyorsaság önmagában már nem elég.",
        "És mert a bizalmat újra ki kell érdemelni – nem lehet adottnak venni.",
        "A jövő nem azoké a platformoké, amelyek csak lehetőségeket teremtenek és marketinget közvetítenek.",
        "Hanem azoké, akik felelősséget vállalnak, amikor igazán számít.",
      ],
    },
  };

  const t = content[lang as keyof typeof content] || content.de;

  return (
    <main className="min-h-screen bg-[#f4f6f8] pb-24 text-slate-900">
      <section className="bg-gradient-to-r from-[#0b5f5d] via-[#108280] to-[#0a3f3e] px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/${lang}/about`}
            className="mb-8 inline-block rounded-full bg-white/10 px-5 py-2 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white/20"
          >
            ← {t.back}
          </Link>

          <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-cyan-200">
            {t.label}
          </p>

          <h1 className="text-4xl font-black uppercase italic leading-tight md:text-6xl">
            {t.title}
          </h1>

          <p className="mt-6 max-w-3xl text-xl font-semibold leading-relaxed text-white/85">
            {t.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-4xl px-6">
        <article className="rounded-3xl border-4 border-slate-900 bg-white p-7 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:p-12">
          <div className="space-y-6">
            {t.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-lg font-medium leading-8 text-slate-700"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}