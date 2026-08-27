import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { voiceSamples } from "../lib/tulkey";
import { useApp } from "../lib/state";
import { mitra } from "../lib/mitra";

const tulkey = mitra.hi;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function WaveBars() {
  return (
    <span className="tulkey-siri-wave" aria-hidden>
      {Array.from({ length: 7 }, (_, i) => <i key={i} />)}
    </span>
  );
}

export function TulkeyVoiceOverlay() {
  const {
    tulkeyVoiceOpen,
    closeTulkeyVoice,
    go,
    askTulkey,
    tulkeyThinking,
    tulkeyMessages,
  } = useApp();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [spoken, setSpoken] = useState("");
  const [typing, setTyping] = useState(false);
  const sampleIndex = useRef(0);
  const spokenId = useRef<number | null>(null);

  const lastTulkey = [...tulkeyMessages].reverse().find((item) => item.role === "tulkey");
  const lastUser = [...tulkeyMessages].reverse().find((item) => item.role === "user");
  const lastTulkeyId = lastTulkey?.id;
  const lastTulkeyText = lastTulkey?.text ?? "";

  const phase = listening
    ? "listening"
    : tulkeyThinking
      ? "thinking"
      : typing
        ? "speaking"
        : lastTulkey
          ? "ready"
          : "idle";

  useEffect(() => {
    if (!tulkeyVoiceOpen) {
      setListening(false);
      setTranscript("");
      setSpoken("");
      setTyping(false);
      spokenId.current = null;
      return;
    }
    setListening(true);
    setTranscript("");
    setSpoken("");
    setTyping(false);
    spokenId.current = null;
  }, [tulkeyVoiceOpen]);

  useEffect(() => {
    if (!tulkeyVoiceOpen || !listening || tulkeyThinking) return;
    const sample = voiceSamples[sampleIndex.current % voiceSamples.length];
    const words = sample.split(" ");
    const instant = prefersReducedMotion();
    let i = 0;
    let settle: number | undefined;
    setTranscript(instant ? sample : "");
    if (instant) {
      settle = window.setTimeout(() => {
        sampleIndex.current += 1;
        setListening(false);
        askTulkey(sample);
      }, 420);
      return () => window.clearTimeout(settle);
    }
    const id = window.setInterval(() => {
      i += 1;
      setTranscript(words.slice(0, i).join(" "));
      if (i >= words.length) {
        window.clearInterval(id);
        sampleIndex.current += 1;
        settle = window.setTimeout(() => {
          setListening(false);
          askTulkey(sample);
        }, 520);
      }
    }, 300);
    return () => {
      window.clearInterval(id);
      if (settle) window.clearTimeout(settle);
    };
  }, [listening, tulkeyThinking, tulkeyVoiceOpen, askTulkey]);

  useEffect(() => {
    if (!tulkeyVoiceOpen || listening || tulkeyThinking || lastTulkeyId == null) return;
    if (spokenId.current === lastTulkeyId) return;
    spokenId.current = lastTulkeyId;
    const instant = prefersReducedMotion();
    if (instant) {
      setSpoken(lastTulkeyText);
      setTyping(false);
      return;
    }
    const words = lastTulkeyText.split(" ");
    let i = 0;
    setSpoken("");
    setTyping(true);
    const id = window.setInterval(() => {
      i += 1;
      setSpoken(words.slice(0, i).join(" "));
      if (i >= words.length) {
        window.clearInterval(id);
        setTyping(false);
      }
    }, 72);
    return () => window.clearInterval(id);
  }, [tulkeyVoiceOpen, listening, tulkeyThinking, lastTulkeyId, lastTulkeyText]);

  if (!tulkeyVoiceOpen) return null;

  const toggleMic = () => {
    if (tulkeyThinking || typing) return;
    if (listening) {
      setListening(false);
      const spokenText = transcript.trim();
      if (spokenText.length > 6) askTulkey(spokenText);
      return;
    }
    setTranscript("");
    setSpoken("");
    setTyping(false);
    spokenId.current = null;
    setListening(true);
  };

  const openThread = () => {
    closeTulkeyVoice();
    go("ai");
  };

  const statusLabel = listening
    ? "Listening"
    : tulkeyThinking
      ? "Thinking"
      : typing
        ? "Answering"
        : lastTulkey
          ? "Mitra"
          : "Tap the mic";

  return (
    <div className={`tulkey-voice ${phase}`} role="dialog" aria-modal="true" aria-label="Ask Mitra">
      <header className="tulkey-voice-bar">
        <button type="button" className="icon-btn" onClick={closeTulkeyVoice} aria-label="Close">
          <Icon name="close" />
        </button>
        <p className="t-h-s">Mitra</p>
        <button type="button" className="icon-btn" onClick={openThread} aria-label="Open conversation">
          <Icon name="chat" />
        </button>
      </header>

      <div className="tulkey-voice-stage">
        <div className={`tulkey-siri ${phase}`}>
          <div className="tulkey-siri-face">
            <img src={tulkey} alt="" />
          </div>
          <WaveBars />
        </div>
        <p className="tulkey-siri-name">Mitra</p>

        <p className={`tulkey-voice-chip ${listening || tulkeyThinking || typing ? "live" : ""}`}>
          <Icon name={listening ? "mic" : tulkeyThinking ? "pulse" : "tulkey"} size={14} />
          {statusLabel}
        </p>

        {listening && (
          <p className="tulkey-voice-live" aria-live="polite">
            {transcript || "Go ahead, I’m listening"}
            <i className="tulkey-caret" />
          </p>
        )}

        {!listening && lastUser && (
          <p className="tulkey-voice-q">{lastUser.text}</p>
        )}

        {!listening && tulkeyThinking && (
          <div className="tulkey-voice-gen" aria-live="polite" aria-label="Generating an answer">
            <i /><i /><i />
          </div>
        )}

        {!listening && !tulkeyThinking && lastTulkey && (
          <p className={`tulkey-voice-a ${typing ? "typing" : "in"}`}>
            {spoken}
            {typing && <i className="tulkey-caret" />}
          </p>
        )}
      </div>

      <div className="tulkey-voice-dock">
        <div className={`tulkey-voice-mic-wrap ${listening ? "on" : ""} ${tulkeyThinking ? "busy" : ""}`}>
          <span className="tulkey-mic-ring" aria-hidden />
          <span className="tulkey-mic-ring" aria-hidden />
          <button
            type="button"
            className={`tulkey-voice-mic ${listening ? "on" : ""}`}
            aria-label={listening ? "Stop listening" : "Start listening"}
            aria-pressed={listening}
            disabled={tulkeyThinking || typing}
            onClick={toggleMic}
          >
            <Icon name="mic" size={26} />
          </button>
        </div>
        <div className="tulkey-voice-actions">
          <button type="button" className="btn btn-secondary btn-md" onClick={closeTulkeyVoice}>
            <Icon name="close" size={16} />
            Close
          </button>
          <button type="button" className="btn btn-primary btn-md" onClick={openThread}>
            <Icon name="chat" size={16} />
            Conversation
          </button>
        </div>
      </div>
    </div>
  );
}

export function HomeFab() {
  const { route, tulkeyVoiceOpen, openTulkeyVoice } = useApp();
  if (route !== "home" || tulkeyVoiceOpen) return null;
  return (
    <button type="button" className="home-fab" onClick={openTulkeyVoice} aria-label="Ask Mitra">
      <Icon name="tulkey" size={26} />
    </button>
  );
}
