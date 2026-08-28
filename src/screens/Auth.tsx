import { useState, type ReactNode } from "react";
import { useApp } from "../lib/state";
import { mitra } from "../lib/mitra";

/* Sign in and sign up. A demo: nothing is sent anywhere and no account is made. */

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.8z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.29 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.28a12 12 0 0 0 0 10.76l4.01-3.1z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.28 6.62l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor">
      <path d="M16.37 12.72c-.02-2.35 1.92-3.48 2-3.53-1.09-1.6-2.79-1.82-3.4-1.85-1.45-.14-2.83.85-3.56.85-.73 0-1.86-.83-3.06-.81-1.57.02-3.02.91-3.83 2.32-1.63 2.83-.42 7.02 1.17 9.32.78 1.12 1.7 2.38 2.91 2.34 1.17-.05 1.61-.76 3.02-.76 1.41 0 1.81.76 3.05.73 1.26-.02 2.05-1.14 2.82-2.27.89-1.3 1.25-2.56 1.27-2.62-.03-.01-2.43-.94-2.45-3.72zM14.1 5.35c.64-.79 1.08-1.87.96-2.96-.93.04-2.06.63-2.72 1.4-.59.69-1.11 1.8-.97 2.86 1.04.08 2.1-.53 2.73-1.3z" />
    </svg>
  );
}

function EyeMark({ off }: { off?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3.1" />
      {off && <path d="M4 20 20 4" />}
    </svg>
  );
}

function FingerMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 3.5c-2.2 0-4.2 1-5.5 2.6" />
      <path d="M18 7.4A7.4 7.4 0 0 0 12 3.5" />
      <path d="M4.2 9.8A7.9 7.9 0 0 1 5.6 7.4" />
      <path d="M12 7.2a4.8 4.8 0 0 0-4.8 4.8v2.6" />
      <path d="M16.8 12a4.8 4.8 0 0 0-2.6-4.3" />
      <path d="M16.8 12v2.4c0 1.2-.2 2.4-.6 3.5" />
      <path d="M12 10.8a1.2 1.2 0 0 0-1.2 1.2v3.4c0 1.4-.3 2.7-.8 3.9" />
      <path d="M14.4 12v3.4c0 1-.1 2-.4 3" />
      <path d="M7.4 17.6c.4-1 .6-2 .6-3.1" />
    </svg>
  );
}

function AuthShell({
  mode,
  title,
  sub,
  children,
}: {
  mode: "signin" | "signup";
  title: string;
  sub: string;
  children: ReactNode;
}) {
  const { go } = useApp();
  return (
    <div className="ob-shell auth-shell">
      <aside className="auth-hero">
        <div className="auth-hero-brand">
          <span className="auth-mark" aria-hidden>M</span>
          <strong>Money Mitra</strong>
        </div>
        <img className="auth-hero-art" src={mitra.namaste} alt="" />
        <p className="auth-hero-line">Nepal’s market, in plain words.</p>
        <ul className="auth-hero-points">
          <li>Live NEPSE tape, movers and the floor sheet</li>
          <li>Your book, your lists, your alerts</li>
          <li>Every term explained — never a stock pick</li>
        </ul>
      </aside>

      <div className="auth-card">
        <div className="auth-tabs" role="tablist" aria-label="Account">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            className={mode === "signin" ? "on" : ""}
            onClick={() => go("signin")}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            className={mode === "signup" ? "on" : ""}
            onClick={() => go("signup")}
          >
            Sign up
          </button>
        </div>

        <h1 className="auth-title">
          {title}
          <span>{sub}</span>
        </h1>

        {children}

     
      </div>
    </div>
  );
}

function SocialRow({ verb, onPick }: { verb: string; onPick: (name: string) => void }) {
  return (
    <>
      <div className="auth-social">
        <button type="button" onClick={() => onPick("Google")}>
          <GoogleMark />
          Continue with Google
        </button>
        <button type="button" onClick={() => onPick("Apple")}>
          <AppleMark />
          Continue with Apple
        </button>
      </div>
      <p className="auth-divider"><span>or {verb.toLowerCase()} with your details</span></p>
    </>
  );
}

function PasswordField({
  label,
  value,
  placeholder,
  required,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  const [shown, setShown] = useState(false);
  return (
    <label className="auth-field">
      <span>
        {label}
        {required && <i className="auth-req">*</i>}
      </span>
      <span className="auth-input">
        <input
          type={shown ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="auth-eye"
          aria-label={shown ? "Hide password" : "Show password"}
          onClick={() => setShown((current) => !current)}
        >
          <EyeMark off={!shown} />
        </button>
      </span>
    </label>
  );
}

export function SignInScreen() {
  const { lookAround, openSheet, flash } = useApp();
  const [who, setWho] = useState("");
  const [password, setPassword] = useState("");
  const ready = who.trim().length > 0 && password.length > 0;

  const enter = (how: string) => {
    lookAround();
    flash({ message: `${how} — a demo sign-in. Nothing was sent anywhere.` });
  };

  return (
    <AuthShell mode="signin" title="Welcome back" sub="Sign in to pick up where you left off.">
      <SocialRow verb="Sign in" onPick={(name) => enter(`Signed in with ${name}`)} />

      <label className="auth-field">
        <span>Phone number or email</span>
        <span className="auth-input">
          <input
            value={who}
            placeholder="Phone or email"
            inputMode="email"
            onChange={(event) => setWho(event.target.value)}
          />
        </span>
      </label>

      <PasswordField label="Password" value={password} placeholder="Password" onChange={setPassword} />

      <button
        type="button"
        className="text-link auth-forgot"
        onClick={() =>
          openSheet({
            kind: "quick",
            title: "Forgot your password?",
            body: "We would send a reset code to your phone or email. In this demo nothing is sent.",
          })
        }
      >
        Forgot password?
      </button>

      {/* The sensor sits beside the button — it is the same action, one tap shorter,
          and it stays live while the form is still empty. */}
      <div className="auth-go-row">
        <button
          type="button"
          className="btn btn-primary btn-lg auth-go"
          disabled={!ready}
          onClick={() => enter("Signed in")}
        >
          Sign in
        </button>
        <button
          type="button"
          className="auth-fp"
          aria-label="Sign in with fingerprint"
          onClick={() => enter("Fingerprint accepted")}
        >
          <FingerMark />
        </button>
      </div>
    </AuthShell>
  );
}

export function SignUpScreen() {
  const { go, openSheet, flash } = useApp();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const match = password.length > 0 && password === confirm;
  const ready = name.trim() && phone.trim() && email.trim() && match;

  const join = (how: string) => {
    flash({ message: `${how} — a demo account. Nothing was created.` });
    go("start");
  };

  return (
    <AuthShell mode="signup" title="Make an account" sub="Two minutes, and the market reads plainly.">
      <SocialRow verb="Sign up" onPick={(who) => join(`Joined with ${who}`)} />

      <label className="auth-field">
        <span>Full name<i className="auth-req">*</i></span>
        <span className="auth-input">
          <input value={name} placeholder="Full name" onChange={(event) => setName(event.target.value)} />
        </span>
      </label>

      <label className="auth-field">
        <span>Phone number<i className="auth-req">*</i></span>
        <span className="auth-phone">
          <span className="auth-code">🇳🇵 +977</span>
          <span className="auth-input">
            <input
              value={phone}
              placeholder="Mobile number"
              inputMode="numeric"
              onChange={(event) => setPhone(event.target.value)}
            />
          </span>
        </span>
      </label>

      <label className="auth-field">
        <span>Email<i className="auth-req">*</i></span>
        <span className="auth-input">
          <input
            value={email}
            placeholder="Email"
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </span>
      </label>

      <PasswordField label="Password" value={password} placeholder="Password" required onChange={setPassword} />
      <PasswordField
        label="Confirm password"
        value={confirm}
        placeholder="Confirm password"
        required
        onChange={setConfirm}
      />
      {confirm.length > 0 && !match && <p className="auth-warn">Both passwords need to match.</p>}

      <p className="auth-terms">
        By signing up you agree to our{" "}
        <button
          type="button"
          className="text-link"
          onClick={() =>
            openSheet({
              kind: "quick",
              title: "Terms & conditions",
              body: "MoneyMitra shows market information and explains it. It does not place orders, hold your money, or advise you to buy or sell.",
              note: "A demo. No account is created and nothing is sent.",
            })
          }
        >
          Terms &amp; conditions
        </button>{" "}
        and{" "}
        <button
          type="button"
          className="text-link"
          onClick={() =>
            openSheet({
              kind: "quick",
              title: "Privacy policy",
              body: "Your holdings and lists stay on this device in the demo. Nothing is uploaded and nothing is shared with a broker.",
              note: "A demo. No account is created and nothing is sent.",
            })
          }
        >
          Privacy policy
        </button>
        .
      </p>

      <button
        type="button"
        className="btn btn-primary btn-lg btn-block"
        disabled={!ready}
        onClick={() => join("Account ready")}
      >
        Sign up
      </button>

    </AuthShell>
  );
}
