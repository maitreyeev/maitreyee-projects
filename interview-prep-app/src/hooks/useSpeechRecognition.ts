"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Thin wrapper around the browser's built-in Web Speech API. Free, no API
// key, no server involved — but support is uneven (solid in Chrome/Edge,
// limited or absent in Safari/iOS), so every consumer must treat `supported`
// as a hard gate and fall back to typing when it's false.

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: { transcript: string };
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const ERROR_MESSAGES: Record<string, string> = {
  "not-allowed": "Microphone access was blocked. Allow it in your browser's site settings to use voice input.",
  "no-speech": "Didn't catch that — try again and speak right after tapping the mic.",
  "audio-capture": "No microphone found on this device.",
  network: "Voice input needs an internet connection.",
};

// If you spoke for at least this long, we expect a real number of words back.
const MIN_SESSION_MS_TO_JUDGE = 4000;
// Natural speech is roughly 2-3 words/sec even slow and deliberate; well under
// half a word/sec for a several-second session means recognition likely
// dropped most of what was said, not that you paused a lot.
const MIN_WORDS_PER_SEC = 0.5;

export function useSpeechRecognition(onFinalResult: (text: string) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [looksOff, setLooksOff] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onFinalResultRef = useRef(onFinalResult);
  const sessionStartRef = useRef(0);
  const sessionWordsRef = useRef(0);

  useEffect(() => {
    onFinalResultRef.current = onFinalResult;
  }, [onFinalResult]);

  useEffect(() => {
    // Feature detection must run client-side (no window during SSR).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(getRecognitionCtor() !== null);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    setError(null);
    setInterimText("");
    setLooksOff(false);
    sessionStartRef.current = Date.now();
    sessionWordsRef.current = 0;
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let finalChunk = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) finalChunk += transcript;
        else interim += transcript;
      }
      const trimmed = finalChunk.trim();
      if (trimmed) {
        sessionWordsRef.current += trimmed.split(/\s+/).length;
        onFinalResultRef.current(trimmed);
      }
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      setError(ERROR_MESSAGES[event.error] ?? "Voice input hit a snag — you can keep typing instead.");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      setInterimText("");
      const durationMs = Date.now() - sessionStartRef.current;
      if (durationMs >= MIN_SESSION_MS_TO_JUDGE) {
        const wordsPerSec = sessionWordsRef.current / (durationMs / 1000);
        if (wordsPerSec < MIN_WORDS_PER_SEC) setLooksOff(true);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, []);

  useEffect(() => stop, [stop]);

  const dismissLooksOff = useCallback(() => setLooksOff(false), []);

  return { supported, listening, interimText, error, looksOff, dismissLooksOff, start, stop };
}
