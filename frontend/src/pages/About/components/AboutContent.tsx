import { Sheet, Grid, Typography, Card, AspectRatio, Box } from "@mui/joy";

export default function AboutContent() {
  return (
    <Sheet
      variant="outlined"
      color="neutral"
      sx={{ width: "100%", height: "100%", p: 2, overflow: "auto" }}
    >
      <Grid container spacing={4}>
        <Grid xs={6} mb={1}>
          <Box mb={1}>
            <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
              Was bietet die Trainingsapp?
            </Typography>
            <Typography>
              Die Trainingsapp ist dein Wegbegleiter zu einem gesünderen
              Lebensstil. Durch individuell angepasste Trainingspläne und eine
              Community, unterstützt die App dich dabei, deine Fitnessziele
              effektiv und nachhaltig zu erreichen. Unsere Trainingsapp umfasste
              folgende Features: - Personalisierte Trainingspläne: Erstelle
              deinen eigenen Trainingsplan, der genau auf deine Ziele, deinen
              Zeitplan und dein Fitnesslevel abgestimmt ist. Ob du Muskeln
              aufbauen, Gewicht verlieren oder einfach nur aktiver sein möchtest
              – unsere App hat alles, was du brauchst. - zahlreiche Übungen:
              Finde klare Anleitungen und anschauliche Videos für jede Übung aus
              denen du deinen idealen Plan zusammenstellen kannst. - Community:
              Tritt in Kontakt mit anderen Nutzern, die ähnliche Ziele
              verfolgen, finde Trainingspartner in deiner Nähe und tausche Tipps
              und Erfahrungen aus. - Einfaches Tracking deiner Fortschritte: Mit
              unserer einfach zu bedienenden Tracking-Funktion kannst du deine
              Fortschritte verfolgen und deine Ziele anpassen. Sieh auf einen
              Blick, wie weit du gekommen bist.
            </Typography>
          </Box>
          <Box mb={1}>
            <AspectRatio minHeight="120px" maxHeight="200px">
              <img
                src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
                loading="lazy"
                alt=""
              />
            </AspectRatio>
          </Box>
        </Grid>
        <Grid xs={6} mb={1}>
          <Box mb={1}>
            <AspectRatio minHeight="120px" maxHeight="200px">
              <img
                src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
                loading="lazy"
                alt=""
              />
            </AspectRatio>
          </Box>
          <Box mb={1}>
            <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
              Welche Vision verfolgen wir?
            </Typography>
            <Typography>
              Bei der Trainingsapp geht es uns darum, Fitness zugänglich und
              umsetzbar für jeden zu machen. Wir möchten, dass du dich gut
              fühlst, fit bleibst und Spaß an Bewegung hast, unabhängig von
              deinem Fitnesslevel oder deinem straffen Zeitplan. Unsere App soll
              dir helfen, regelmäßiges Training in deinen Alltag zu integrieren
              und dabei Freude zu empfinden. Wir legen großen Wert auf Qualität,
              Benutzerfreundlichkeit und innovative Lösungen. Wir sind
              überzeugt, dass unsere App nicht nur deine Fitness verbessern,
              sondern auch dein Wohlbefinden und deine allgemeine Lebensqualität
              steigern kann.
            </Typography>
          </Box>
          <Box mb={1}>
            <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
              Hast du weitere Fragen oder Anmerkungen?
            </Typography>
            <Typography>
              Kontaktiere uns hier ganz einfach per E-Mail
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Sheet>
  );
}
