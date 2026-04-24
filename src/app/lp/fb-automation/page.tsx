import { Metadata } from "next";
import FbAutomationClient from "./FbAutomationClient";

export const metadata: Metadata = {
  title: "AI Website & Automation Roadmap for Dubai F&B",
  description: "Learn how to build a zero-cost AI website and automate your customer acquisition in Dubai's highly competitive F&B market.",
};

export default function FbAutomationPage() {
  return <FbAutomationClient />;
}
