import { cookies } from "next/headers";
import DashboardHomeClient from "./DashboardHomeClient";
import {
  HOME_VISIBILITY_COOKIE_KEY,
  parseHomeVisibilityCookie,
} from "@/features/home/preferences";

export default async function DashboardHomePage() {
  const cookieStore = await cookies();
  const initialHomeVisibility = parseHomeVisibilityCookie(
    cookieStore.get(HOME_VISIBILITY_COOKIE_KEY)?.value,
  );

  return (
    <DashboardHomeClient initialHomeVisibility={initialHomeVisibility} />
  );
}
