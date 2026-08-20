export const metadata = {
  title: "NEON Club - Tarjeta de Fidelización Digital",
  description:
    "Acumula sellos con tus compras y canjea raspados gratis. Tu tarjeta virtual Neón te espera.",
  robots: "noindex, nofollow",
};

import { redirect } from "next/navigation";

export default function ClubPage() {
  redirect("/club/register");
}
