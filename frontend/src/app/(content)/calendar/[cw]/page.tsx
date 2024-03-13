import Heading from "@/components/Heading";
import WeekColumns from "@/components/WeekColumns";
import WeekSelector from "@/components/WeekSelector";

export default function CW({ params }: { params: { cw: string } }) {
  return (
    <>
      <Heading title="Mein Kalender" />
      <WeekSelector cw={params.cw} />
      <WeekColumns cw={params.cw} />
    </>
  );
}
