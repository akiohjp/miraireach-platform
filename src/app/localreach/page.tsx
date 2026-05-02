import { Metadata } from "next";
import LocalReachClient from "../lp/localreach/LocalReachClient";

export const metadata: Metadata = {
  title: "LocalReach — AI-Powered Review Growth for Dubai Businesses | GAM Solutions",
  description:
    "Turn every customer visit into a unique Google review and a WhatsApp contact. 100% Google policy compliant. Local SEO automation built for Dubai's competitive market.",
};

export default function LocalReachPage() {
  return <LocalReachClient />;
}
