import { Metadata } from "next";
import LocalReachClient from "./LocalReachClient";

export const metadata: Metadata = {
  title: "GAM solutions — LocalReach review growth powered by LocalReach",
  description:
    "LocalReach is GAM solutions' local review-growth platform. Convert visits into Google reviews and WhatsApp contacts with a compliant, AI-powered workflow.",
};

export default function LocalReachPage() {
  return <LocalReachClient />;
}
