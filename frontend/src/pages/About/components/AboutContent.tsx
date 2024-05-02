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
              Wer sind wir
            </Typography>
            <Typography>Ein Langer Text</Typography>
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
              Welche Vision verfolgen wir
            </Typography>
            <Typography>Ein Langer Text</Typography>
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
