import { redirect } from "next/navigation";

export default function ActiveFlavorsRedirectPage() {
  redirect("/flavors");
}
