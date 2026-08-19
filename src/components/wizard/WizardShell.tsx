"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WIZARD_STEPS } from "@/lib/wizard/schema";
import type { WizardAnswers, WizardFieldKey } from "@/lib/wizard/types";
import { QuestionStep } from "./QuestionStep";
import { ProgressStaircase } from "./ProgressStaircase";
import { ResultsSummary } from "@/components/results/ResultsSummary";

const STORAGE_KEY = "taxwizard:draft:v1";

interface StoredDraft {
  answers: WizardAnswers;
  stepIndex: number;
}

function loadDraft(): StoredDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "answers" in parsed &&
      "stepIndex" in parsed &&
      typeof (parsed as StoredDraft).stepIndex === "number"
    ) {
      return parsed as StoredDraft;
    }
    return null;
  } catch {
    return null;
  }
}

function saveDraft(draft: StoredDraft) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // localStorage unavailable (private browsing, quota) — draft simply won't persist.
  }
}

export function WizardShell() {
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<WizardAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    // localStorage doesn't exist during SSR, so the first render always uses
    // empty defaults (matching the server-rendered HTML) and this effect
    // syncs in the real draft client-side. The one extra render this causes
    // on mount is the intended, SSR-safe tradeoff.
    const draft = loadDraft();
    if (draft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers(draft.answers);
      setStepIndex(draft.stepIndex);
    }
    setHydrated(true);
  }, []);

  const visibleSteps = useMemo(
    () => WIZARD_STEPS.filter((step) => !step.showIf || step.showIf(answers)),
    [answers],
  );

  const clampedIndex = Math.min(stepIndex, visibleSteps.length);
  const currentStep = visibleSteps[clampedIndex];
  const isComplete = clampedIndex >= visibleSteps.length;

  useEffect(() => {
    if (!hydrated) return;
    saveDraft({ answers, stepIndex: clampedIndex });
  }, [answers, clampedIndex, hydrated]);

  function handleSubmit(rawValue: unknown) {
    if (!currentStep) return;
    const parsed = currentStep.schema.safeParse(rawValue);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "That doesn't look right.");
      return;
    }

    const nextAnswers: WizardAnswers = { ...answers, [currentStep.id]: parsed.data };

    // Drop answers for any step that this change just hid, so stale
    // conditional answers don't linger (e.g. flipping "own a car?" to No).
    for (const step of WIZARD_STEPS) {
      if (step.showIf && !step.showIf(nextAnswers)) {
        delete nextAnswers[step.id as WizardFieldKey];
      }
    }

    setError(undefined);
    setDirection(1);
    setAnswers(nextAnswers);
    setStepIndex(clampedIndex + 1);
  }

  function handleBack() {
    if (clampedIndex === 0) return;
    setError(undefined);
    setDirection(-1);
    setStepIndex(clampedIndex - 1);
  }

  if (!hydrated) {
    return <div className="flex flex-1" aria-hidden />;
  }

  return (
    <div
      className={`mx-auto flex w-full flex-1 flex-col px-6 py-12 ${
        isComplete ? "max-w-2xl justify-start" : "max-w-xl justify-center"
      }`}
    >
      {!isComplete && (
        <div className="mb-8">
          <ProgressStaircase total={visibleSteps.length} currentIndex={clampedIndex} />
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {isComplete ? (
          <motion.div
            key="complete"
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 24 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              onClick={handleBack}
              className="mb-6 text-sm font-medium text-on-ink-muted hover:text-on-ink"
            >
              ← Edit your answers
            </button>
            <ResultsSummary answers={answers} canSave />
          </motion.div>
        ) : currentStep ? (
          <motion.div
            key={currentStep.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 24 }}
            transition={{ duration: 0.2 }}
          >
            <QuestionStep
              step={currentStep}
              currentValue={answers[currentStep.id as WizardFieldKey]}
              error={error}
              onSubmit={handleSubmit}
              onBack={handleBack}
              canGoBack={clampedIndex > 0}
              isLastStep={clampedIndex === visibleSteps.length - 1}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
