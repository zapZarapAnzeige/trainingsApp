import {
  Sheet,
  Grid,
  Typography,
  Card,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  AccordionGroup,
} from "@mui/joy";

// TESTDATEN // Benötigt werden Daten vom Typ Help
import helpTestData from "../../../example/exampleHelp.json";
import { useState } from "react";

export default function HelpContent() {
  const [index, setIndex] = useState<number | null>(-1);
  return (
    <Sheet
      variant="outlined"
      color="neutral"
      sx={{ width: "100%", height: "100%", p: 5, overflow: "auto" }}
    >
      <AccordionGroup>
        <Accordion
          expanded={index === 0}
          onChange={(event, expanded) => {
            setIndex(expanded ? 0 : null);
          }}
        >
          <AccordionSummary sx={{ fontWeight: "bold" }}>
            Was gibt es bei der Trainingsfrequenz und dem dahintersteckenden
            System zu beachten?
          </AccordionSummary>
          <AccordionDetails>
            Je nachdem wieviel Zeit du für dein Training hast, gibt es
            unterschiedliche Möglichkeiten dein Training zu gestalten. Wenn du
            wöchentlich 1 - 3 mal Zeit hast, empfehlen sich besonders für den
            Einstieg eher Ganzkörper-Trainingseinheiten. Hast du öfter Zeit oder
            bist kein Einsteiger mehr, könntest du über einen Split nachdenken.
            Hier würdest du die Trainingseinheiten systematisch unterschiedlich
            gestalten, um mehr Progression und Regeneration zu ermöglichen .
            Eine Möglichkeit wäre es beispielsweise 2 mal pro Woche den
            Unterkörper und 2 mal pro Woche den Oberkörper zu trainieren. Eine
            weitere übliche Aufteilung wäre pull und push. Bei der Pull-Einheit
            würdest du Übungen einplanen, die eine Zugbewegung beinhalten.
            Hierunter fallen beispielsweise Latzug, Curls oder auch der
            Beinbeuger. Bei der Push-Einheit würdest du Übungen einplanen, die
            eine Drückbewegung beinhalten. Hierunter fallen beispielsweise
            Bankdrücken, Trizepsdrücken oder auch der Beinstrecker. Eine weitere
            mögliche Aufteilung wäre die Aufteilung nach Muskelgruppen. Hier
            könntest du beispielsweise eine Trainingseinheit für den Rücken,
            eine für die Brust und Schulter, eine für die Arme und eine für
            Bauch und Beine planen.
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={index === 1}
          onChange={(event, expanded) => {
            setIndex(expanded ? 1 : null);
          }}
        >
          <AccordionSummary sx={{ fontWeight: "bold" }}>
            Welche Rolle spielt Regeneration für mein Training?
          </AccordionSummary>
          <AccordionDetails>
            Dein Körper muss sich nach Trainingseinheiten erholen. Achte daher
            darauf, dass du nicht zu viel trainierst und bewusst trainingsfreie
            Tage mit einplanst. Bevor du die gleichen Muskelgruppen erneut
            trainierst sollten in der Regel mindestens 48h vergangen sein. Auch
            Muskelkater ist ein Zeichen, dass dein Körper noch in der
            Regeneration steckt und Zeit benötigt.
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={index === 2}
          onChange={(event, expanded) => {
            setIndex(expanded ? 2 : null);
          }}
        >
          <AccordionSummary sx={{ fontWeight: "bold" }}>
            Wie kann ich meine Übungen sinnvoll zusammenstellen?
          </AccordionSummary>
          <AccordionDetails>
            Bei der Übungszusammenstellung solltest du darauf achten, dass du
            Übungen einplanst, die unterschiedliche Muskelgruppen trainieren.
            Bei einem Ganzkörper-Trainingsplan empfehlen sich daher besonders
            Übungen, welche mehrere Muskeln beinhalten. Beispiele hierfür sind
            die Beinpresse oder auch das Rudern, da diese eine Vielzahl an
            Muskeln berücksichtigen. Isolierte Übungen, also Übungen die einen
            Muskel besonders fokussieren, empfehlen sich eher für
            Split-Trainingspläne. Beispiele für isolierte Übungen sind Curls
            oder Kickbacks. Einige Muskeln lassen sich jedoch nur schwierig im
            Verbund trainieren, sodass isolierte Übungen auch für einen
            Ganzkörper-Trainingsplan sinnvoll sein können. Hierzu zählen
            beispielsweise Crunches oder Seitheben.
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={index === 3}
          onChange={(event, expanded) => {
            setIndex(expanded ? 3 : null);
          }}
        >
          <AccordionSummary sx={{ fontWeight: "bold" }}>
            Wie führe ich eine Übung korrekt aus und wie verbessere ich mich in
            meinem Training?
          </AccordionSummary>
          <AccordionDetails>
            Die Übungsausführung sollte stets ausreichend langsam, kontrolliert
            und ohne Schwung erfolgen. Beim Übergang in die Kontraktion, also
            wenn du die Muskeln anspannst und zusammenziehst, empfiehlt sich
            eine explosive Ausführung. Während der gesamten Übungsausführung
            sollte eine Grundspannung in den Muskeln bestehen. Bei Maschinen
            sollen die Gewichte daher während der Ausführung zu keinem Zeitpunkt
            aufsetzen. Zur Vorbeugung von Verletzungen sollten außerdem Gelenke
            nicht durchgestreckt werden. Zur Unterstützung deiner Handgelenke
            kannst du darüber hinaus auch stabilisierende Trainingshandschuhe
            verwenden. Ein Richtwert zur Ausführung einer Übung ist die
            Durchführung von 3 Sätzen mit jeweils 6-12 Wiederholungen. Um einen
            Trainingsfortschritt zu ermöglichen, wird empfohlen, die Gewichte zu
            steigern, sobald mehr als 12 Wiederholungen erfolgen können.
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={index === 4}
          onChange={(event, expanded) => {
            setIndex(expanded ? 4 : null);
          }}
        >
          <AccordionSummary sx={{ fontWeight: "bold" }}>
            Wie wärme ich mich für mein Training auf?
          </AccordionSummary>
          <AccordionDetails>
            Zur Vorbeugung von Verletzungen solltest du deinen Körper
            entsprechend aufwärmen. Hierzu empfiehlt sich unter anderem eine
            Kombination aus gesonderten Warm-up-Übungen, wie beispielsweise
            Fahrrad fahren oder Kniebeugen mit Eigengewicht. Darüber hinaus
            empfiehlt sich jedoch auch die Durchführung eines Warm-up-Satzes bei
            jeder Kraftübung, um die spezifischen Muskeln auf die folgende
            Belastung vorzubereiten. Ein Warm-up-Satz unterscheidet sich von
            deinen geplanten Arbeitssätzen durch ein geringeres verwendetes
            Gewicht und eine erhöhte Wiederholungsanzahl.
          </AccordionDetails>
        </Accordion>
      </AccordionGroup>
    </Sheet>
  );
}
