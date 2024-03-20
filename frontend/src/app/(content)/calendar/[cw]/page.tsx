import Heading from "@/components/Heading";
import WeekColumns from "@/components/WeekColumns";
import WeekSelector from "@/components/WeekSelector";
import useTranslation from "next-translate/useTranslation";

export default function CW({ params }: { params: { cw: string } }) {
  const { t } = useTranslation("common");
  return (
    <>
      {" "}
      m
      <Heading title={t("calendar")} />
      <WeekSelector cw={params.cw} />
      <WeekColumns cw={params.cw} />
    </>
  );
}
