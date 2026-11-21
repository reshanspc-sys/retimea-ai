(() => {
  "use strict";

  const css = `
    .rt-account-button{border:1px solid rgba(101,214,207,.38);background:rgba(22,139,255,.10);color:var(--text,#f4f8ff);border-radius:10px;padding:9px 13px;font-size:12px;font-weight:650;white-space:nowrap}
    .rt-account-button:hover{border-color:#62d5d0;background:rgba(54,200,195,.12)}
    .rt-auth-backdrop{position:fixed;inset:0;z-index:9998;display:grid;place-items:center;padding:18px;background:rgba(1,8,18,.72);backdrop-filter:blur(8px)}
    .rt-auth-backdrop[hidden]{display:none}
    .rt-auth-card{position:relative;width:min(100%,430px);padding:28px;background:var(--panel,#0b1c31);color:var(--text,#f4f8ff);border:1px solid var(--border,rgba(75,151,207,.22));border-radius:18px;box-shadow:0 24px 80px #0008}
    .rt-auth-card h2{margin:0 0 7px;font-size:22px}.rt-auth-sub{margin:0 0 22px;color:var(--muted,#91a9c2);font-size:13px;line-height:1.5}
    .rt-auth-tabs{display:flex;gap:7px;margin-bottom:18px}.rt-auth-tabs button,.rt-auth-secondary{border:1px solid var(--border);background:transparent;color:var(--text);border-radius:9px;padding:9px 12px;font-size:12px}
    .rt-auth-tabs button[aria-pressed=true]{background:rgba(22,139,255,.16);border-color:#3987ed}
    .rt-auth-label{display:block;font-size:12px;margin:12px 0 6px;color:var(--muted)}
    .rt-auth-input{width:100%;padding:12px;border:1px solid var(--border);border-radius:9px;background:rgba(2,12,24,.55);color:var(--text);outline:none}
    .rt-auth-input:focus{border-color:#62d5d0}
    .rt-auth-submit{width:100%;margin-top:18px;border:0;border-radius:10px;padding:12px;background:linear-gradient(110deg,#168bff,#3479e9,#36c8c3);color:#041321;font-weight:750}
    .rt-auth-row{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:14px}
    .rt-auth-link{border:0;background:none;color:#69d8d1;text-decoration:underline;font-size:12px;cursor:pointer;padding:4px}
    .rt-auth-status{min-height:36px;margin-top:14px;color:var(--muted);font-size:12px;line-height:1.5}
    .rt-auth-close{position:absolute;right:14px;top:12px;border:0;background:none;color:var(--muted);font-size:22px;cursor:pointer}
    .rt-auth-note{font-size:10px;line-height:1.5;color:var(--muted);margin-top:12px}
    @media(max-width:700px){.rt-account-button{padding:8px 9px;font-size:11px}.rt-auth-card{padding:22px}}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const topActions = document.querySelector(".topbar-actions");
  if (!topActions) return;

  const accountButton = document.createElement("button");
  accountButton.type = "button";
  accountButton.className = "rt-account-button";
  accountButton.textContent = "Sign in";
  accountButton.setAttribute("aria-haspopup", "dialog");
  topActions.prepend(accountButton);

  const backdrop = document.createElement("div");
  backdrop.className = "rt-auth-backdrop";
  backdrop.hidden = true;
  backdrop.innerHTML = `
    <section class="rt-auth-card" role="dialog" aria-modal="true" aria-labelledby="rtAuthTitle">
      <button class="rt-auth-close" type="button" aria-label="Close">×</button>
      <h2 id="rtAuthTitle">Your RETIMEA account</h2>
      <p class="rt-auth-sub">Sign in or create an account to get ready for your personal workspace.</p>
      <div class="rt-auth-tabs" role="group" aria-label="Account action">
        <button type="button" data-mode="signin" aria-pressed="true">Sign in</button>
        <button type="button" data-mode="signup" aria-pressed="false">Create account</button>
      </div>
      <form id="rtAuthForm">
        <label class="rt-auth-label" for="rtAuthEmail">Email address</label>
        <input class="rt-auth-input" id="rtAuthEmail" type="email" autocomplete="email" required maxlength="254">
        <label class="rt-auth-label" for="rtAuthPassword">Password</label>
        <input class="rt-auth-input" id="rtAuthPassword" type="password" autocomplete="current-password" required minlength="8" maxlength="128">
        <button class="rt-auth-submit" id="rtAuthSubmit" type="submit">Sign in</button>
      </form>
      <div class="rt-auth-row">
        <button class="rt-auth-link" id="rtAuthReset" type="button">Forgot password?</button>
        <button class="rt-auth-link" id="rtAuthSignOut" type="button" hidden>Sign out</button>
      </div>
      <div class="rt-auth-status" id="rtAuthStatus" role="status" aria-live="polite">Loading secure account service…</div>
      <p class="rt-auth-note">Your password is handled by Supabase Authentication. RETIMEA AI does not store your password.</p>
    </section>`;
  document.body.appendChild(backdrop);

  const form = backdrop.querySelector("#rtAuthForm");
  const email = backdrop.querySelector("#rtAuthEmail");
  const password = backdrop.querySelector("#rtAuthPassword");
  const submit = backdrop.querySelector("#rtAuthSubmit");
  const status = backdrop.querySelector("#rtAuthStatus");
  const reset = backdrop.querySelector("#rtAuthReset");
  const signOut = backdrop.querySelector("#rtAuthSignOut");
  const modeButtons = [...backdrop.querySelectorAll("[data-mode]")];
  let mode = "signin";
  let supabase = null;
  let configError = "";

  function say(message) { status.textContent = message; }
  function setMode(next) {
    mode = next;
    modeButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.mode === mode)));
    submit.textContent = mode === "signup" ? "Create account" : "Sign in";
    password.autocomplete = mode === "signup" ? "new-password" : "current-password";
    reset.hidden = mode === "signup" || !supabase;
    say(mode === "signup" ? "Use an email address you can access. Supabase may ask you to confirm it." : "Enter your email and password to continue.");
  }
  function show() { backdrop.hidden = false; if (supabase) email.focus(); }
  function hide() { backdrop.hidden = true; }

  accountButton.addEventListener("click", show);
  backdrop.querySelector(".rt-auth-close").addEventListener("click", hide);
  backdrop.addEventListener("click", event => { if (event.target === backdrop) hide(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !backdrop.hidden) hide(); });
  modeButtons.forEach(button => button.addEventListener("click", () => setMode(button.dataset.mode)));

  function renderSession(session) {
    if (session?.user) {
      const label = session.user.email || "Account";
      accountButton.textContent = label.length > 22 ? label.slice(0, 19) + "…" : label;
      accountButton.title = label;
      backdrop.querySelector("#rtAuthTitle").textContent = "You're signed in";
      backdrop.querySelector(".rt-auth-sub").textContent = "Your RETIMEA account is connected.";
      form.hidden = true;
      reset.hidden = true;
      signOut.hidden = false;
      say("Signed in successfully. Account and saved-project features will be connected in upcoming stages.");
    } else {
      accountButton.textContent = "Sign in";
      accountButton.title = "Sign in or create a RETIMEA account";
      backdrop.querySelector("#rtAuthTitle").textContent = "Your RETIMEA account";
      backdrop.querySelector(".rt-auth-sub").textContent = "Sign in or create an account to get ready for your personal workspace.";
      form.hidden = false;
      signOut.hidden = true;
      setMode("signin");
    }
  }

  async function loadSdk() {
    if (window.supabase?.createClient) return;
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.onload = resolve;
      script.onerror = () => reject(new Error("Could not load the Supabase client library."));
      document.head.appendChild(script);
    });
  }

  async function initialise() {
    try {
      const response = await fetch("/api/supabase-config", { cache: "no-store" });
      const config = await response.json();
      if (!response.ok || !config.configured) throw new Error(config.error || "Supabase Preview configuration is missing.");
      await loadSdk();
      supabase = window.supabase.createClient(config.url, config.anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      renderSession(data.session);
      supabase.auth.onAuthStateChange((event, session) => {
        renderSession(session);
        if (event === "SIGNED_IN" && session?.user) hide();
      });
      say("Secure account service is ready.");
    } catch (error) {
      configError = error.message || "Account service is not available.";
      say(configError + " This Preview build needs its Supabase variables configured.");
    }
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!supabase) { say(configError || "Account service is still loading. Please try again."); return; }
    const mail = email.value.trim();
    const pass = password.value;
    submit.disabled = true;
    say(mode === "signup" ? "Creating your account…" : "Signing in…");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: mail, password: pass });
        if (error) throw error;
        say(data.session ? "Account created and signed in." : "Account created. Check your email for a confirmation link before signing in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: mail, password: pass });
        if (error) throw error;
      }
    } catch (error) {
      say(error.message || "Authentication failed. Please try again.");
    } finally {
      submit.disabled = false;
    }
  });

  reset.addEventListener("click", async () => {
    if (!supabase) return;
    const mail = email.value.trim();
    if (!mail) { say("Enter your email address first, then select Forgot password."); email.focus(); return; }
    reset.disabled = true;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(mail, {
        redirectTo: window.location.origin
      });
      if (error) throw error;
      say("If an account exists for this address, a password-reset email has been sent.");
    } catch (error) {
      say(error.message || "Could not request a password reset.");
    } finally {
      reset.disabled = false;
    }
  });

  signOut.addEventListener("click", async () => {
    if (!supabase) return;
    signOut.disabled = true;
    const { error } = await supabase.auth.signOut();
    signOut.disabled = false;
    say(error ? error.message : "You have signed out.");
  });

  setMode("signin");
  initialise();
})();
