import { getCurrentCW } from "@/utils/utils";
import { redirect } from "next/navigation";

export default function Home() {
  const currentCW = getCurrentCW();
  redirect("/calendar/" + currentCW);
}
