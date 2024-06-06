import {
  Sheet,
  Grid,
  Typography,
  Card,
  AspectRatio,
  Box,
  Link,
  Stack,
} from "@mui/joy";

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
              "Die Trainingsapp ist dein Wegbegleiter zu einem gesünderen
              Lebensstil. Wir legen dabei einen besonderen Fokus auf
              Krafttraining und unterstützen dich dabei deine Fitnessziele
              effektiv und nachhaltig zu erreichen. Unsere Trainingsapp umfasst
              folgende Features: - Personalisierte Trainingspläne: Erstelle
              deinen eigenen Trainingsplan, der genau auf deine Ziele, deinen
              Zeitplan und dein Fitnesslevel abgestimmt ist. - Zahlreiche
              Übungen: Finde klare Anleitungen und anschauliche Videos für
              unterschiedlichste Übungen aus denen du deinen idealen
              Trainingsplan zusammenstellen kannst. - Ortsabhängige
              Trainingspartnersuche: Tritt in Kontakt mit anderen Nutzern, die
              ähnliche Ziele verfolgen, finde Trainingspartner in deiner Nähe
              und tausche Tipps und Erfahrungen aus. - Einfaches Tracking deiner
              Fortschritte: Trage im Rahmen deines Kalenders deine im Training
              verwendeten Gewichte ein. So kannst du deine Fortschritte
              verfolgen und sehen wie weit du schon gekommen bist."
            </Typography>
          </Box>
          <Box mb={1}>
            <AspectRatio minHeight="120px" maxHeight="300px">
              <img src="/about1.jpg" loading="lazy" alt="" />
            </AspectRatio>
          </Box>
        </Grid>
        <Grid xs={6} mb={1}>
          <Box mb={1}>
            <AspectRatio minHeight="120px" maxHeight="300px">
              <img src="/about2.jpg" loading="lazy" alt="" />
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
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid xs={12} mb={1}>
          <Box mb={1}>
            <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
              Wer sind wir?
            </Typography>
            <Typography>
              Wir sind ein Team aus vier Studierenden, die sich neben der IT
              auch gemeinsam für einen gesunden Lebensstil begeistern. Aus
              dieser Begeisterung heraus entstand die Idee, eine App zu
              entwickeln, die es Menschen jeglichen Fitnessstands und mit
              unterschiedlichsten Vorkenntnissen ermöglicht, aktiv zu werden und
              ihre persönlichen Gesundheitsziele zu verfolgen.
            </Typography>
          </Box>
        </Grid>
        <Grid xs={12} mb={1}>
          <Box mb={1}>
            <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
              Hast du Fragen oder Anmerkungen?
            </Typography>
            <Typography>
              Kontaktiere uns hier ganz einfach per E-Mail!
            </Typography>
            <Stack direction="column">
              <Link color="success" href="mailto:mira.falk@fom-net.de">
                mira.falk@fom-net.de
              </Link>
              <Link color="success" href="mailto:jennifer.witte@fom-net.de">
                jennifer.witte@fom-net.de
              </Link>
              <Link color="success" href="mailto:clemens.burger@fom-net.de">
                clemens.burger@fom-net.de
              </Link>
              <Link color="success" href="mailto:daniel.jaufmann@fom-net.de">
                daniel.jaufmann@fom-net.de
              </Link>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Sheet>
  );
}
