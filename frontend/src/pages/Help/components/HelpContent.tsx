import { Sheet, Grid, Typography, Card } from "@mui/joy";

// TESTDATEN // Benötigt werden Daten vom Typ Help
import helpTestData from "../../../example/exampleHelp.json";

export default function HelpContent() {
  return (
    <Sheet
      variant="outlined"
      color="neutral"
      sx={{ width: "100%", height: "100%", p: 2, overflow: "auto" }}
    >
      <Grid container spacing={4}>
        {helpTestData.map((helpTestEntry) => {
          return (
            <Grid xs={6}>
              <Card
                variant="outlined"
                sx={{ height: "50vh", overflow: "auto" }}
              >
                <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
                  {helpTestEntry.title}
                </Typography>
                <Typography>{helpTestEntry.text}</Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Sheet>
  );
}
