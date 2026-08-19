import type { Metadata } from "next";
import { WizardShell } from "@/components/wizard/WizardShell";

export const metadata: Metadata = {
  title: "Your return — TaxWizard",
};

export default function WizardPage() {
  return <WizardShell />;
}
