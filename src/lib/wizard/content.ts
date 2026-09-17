import en from "@/content/i18n/en.json";
import type { ExpenseCategoryKey, StepCategory } from "./types";

interface StepContent {
  question: string;
  helpText?: string;
  options?: Record<string, string>;
}

interface EmploymentPeriodsFormLabels {
  employerNameLabel: string;
  employerNamePlaceholder: string;
  monthsWorkedLabel: string;
  monthlySalaryLabel: string;
  taxDeductedLabel: string;
  addButton: string;
  removeButton: string;
  monthsTotalLabel: string;
  monthsTotalExceeded: string;
}

interface PersonalExpensesFormLabels {
  totalLabel: string;
  categories: Record<ExpenseCategoryKey, string>;
}

interface WizardContent {
  categories: Record<StepCategory, string>;
  notices: Record<string, string>;
  employmentPeriodsForm: EmploymentPeriodsFormLabels;
  personalExpensesForm: PersonalExpensesFormLabels;
  steps: Record<string, StepContent>;
}

const content = en as WizardContent;

export function getStepContent(contentKey: string): StepContent {
  const entry = content.steps[contentKey];
  if (!entry) {
    throw new Error(`Missing i18n content for wizard step "${contentKey}"`);
  }
  return entry;
}

export function getCategoryLabel(category: StepCategory): string {
  return content.categories[category];
}

export function getNotice(key: string): string | undefined {
  return content.notices[key];
}

export function getEmploymentFormLabels(): EmploymentPeriodsFormLabels {
  return content.employmentPeriodsForm;
}

export function getPersonalExpensesFormLabels(): PersonalExpensesFormLabels {
  return content.personalExpensesForm;
}
