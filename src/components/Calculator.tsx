"use client";

import { useState } from "react";

type Op = "+" | "−" | "×" | "÷";

function apply(a: number, b: number, op: Op) {
  switch (op) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
  }
}

function show(n: number) {
  if (!Number.isFinite(n)) return "Error";
  const r = Math.round(n * 100) / 100; // 2 decimal places is plenty for load maths
  return r.toLocaleString("en-AU", { maximumFractionDigits: 2 });
}

/** A simple floating calculator for the calculation quizzes. */
export function Calculator() {
  const [open, setOpen] = useState(false);
  const [entry, setEntry] = useState("0"); // what's being typed
  const [acc, setAcc] = useState<number | null>(null); // running total
  const [op, setOp] = useState<Op | null>(null);
  const [fresh, setFresh] = useState(true); // next digit starts a new entry
  const [tape, setTape] = useState("");

  const value = () => Number(entry.replace(/,/g, ""));

  const digit = (d: string) => {
    if (fresh) {
      setEntry(d === "." ? "0." : d);
      setFresh(false);
    } else {
      if (d === "." && entry.includes(".")) return;
      if (entry.replace(/[^0-9]/g, "").length >= 12) return;
      setEntry(entry === "0" && d !== "." ? d : entry + d);
    }
  };

  const chooseOp = (next: Op) => {
    const v = value();
    let total = v;
    if (acc !== null && op && !fresh) total = apply(acc, v, op);
    else if (acc !== null && fresh) total = acc;
    setAcc(total);
    setOp(next);
    setTape(`${show(total)} ${next}`);
    setEntry(show(total).replace(/,/g, ""));
    setFresh(true);
  };

  const equals = () => {
    if (acc === null || !op) return;
    const v = value();
    const total = apply(acc, v, op);
    setTape(`${show(acc)} ${op} ${show(v)} =`);
    setEntry(Number.isFinite(total) ? String(Math.round(total * 100) / 100) : "Error");
    setAcc(null);
    setOp(null);
    setFresh(true);
  };

  const clear = () => {
    setEntry("0");
    setAcc(null);
    setOp(null);
    setFresh(true);
    setTape("");
  };

  const back = () => {
    if (fresh) return;
    setEntry(entry.length > 1 ? entry.slice(0, -1) : "0");
  };

  const display = entry === "Error" ? "Error" : show(Number(entry));
  const key =
    "rounded-lg bg-white py-3 text-lg font-semibold shadow-sm active:translate-y-px hover:bg-paper border border-line";
  const opKey = "rounded-lg bg-ink py-3 text-lg font-bold text-hivis active:translate-y-px hover:bg-ink-soft";

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-40 rounded-full bg-ink px-5 py-3 font-semibold text-white shadow-lg hover:bg-ink-soft"
      >
        🧮 Calculator
      </button>
    );
  }

  return (
    <div
      className="fixed right-4 bottom-4 z-40 w-[17rem] rounded-2xl border border-line bg-[#f1eee6] p-3 shadow-2xl"
      role="dialog"
      aria-label="Calculator"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold">🧮 Calculator</span>
        <button type="button" onClick={() => setOpen(false)} className="px-2 text-muted hover:text-ink" aria-label="Close calculator">
          ✕
        </button>
      </div>
      <div className="rounded-lg bg-ink px-3 py-2 text-right text-white">
        <div className="h-4 text-xs text-white/60">{tape}</div>
        <div className="truncate text-3xl font-bold tabular-nums" aria-live="polite">
          {display}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        <button type="button" className={`${key} col-span-2 text-stop`} onClick={clear}>
          Clear
        </button>
        <button type="button" className={key} onClick={back} aria-label="Delete last digit">
          ⌫
        </button>
        <button type="button" className={opKey} onClick={() => chooseOp("÷")}>
          ÷
        </button>
        {["7", "8", "9"].map((d) => (
          <button type="button" key={d} className={key} onClick={() => digit(d)}>
            {d}
          </button>
        ))}
        <button type="button" className={opKey} onClick={() => chooseOp("×")}>
          ×
        </button>
        {["4", "5", "6"].map((d) => (
          <button type="button" key={d} className={key} onClick={() => digit(d)}>
            {d}
          </button>
        ))}
        <button type="button" className={opKey} onClick={() => chooseOp("−")}>
          −
        </button>
        {["1", "2", "3"].map((d) => (
          <button type="button" key={d} className={key} onClick={() => digit(d)}>
            {d}
          </button>
        ))}
        <button type="button" className={opKey} onClick={() => chooseOp("+")}>
          +
        </button>
        <button type="button" className={`${key} col-span-2`} onClick={() => digit("0")}>
          0
        </button>
        <button type="button" className={key} onClick={() => digit(".")}>
          .
        </button>
        <button type="button" className="rounded-lg bg-hivis py-3 text-lg font-bold text-ink active:translate-y-px hover:bg-hivis-dark" onClick={equals}>
          =
        </button>
      </div>
    </div>
  );
}
