(() => {
  "use strict";

  const css = `
    .rt-account-button{border:1px solid rgba(101,214,207,.38);background:rgba(22,139,255,.10);color:var(--text,#f4f8ff);border-radius:10px;padding:9px 13px;font-size:12px;font-weight:650;white-space:nowrap}
    .rt-account-button:hover{border-color:#62d5d0;background:rgba(54,200,195,.12)}
    .rt-dashboard-nav{border:1px solid rgba(107,210,203,.42);background:linear-gradient(110deg,rgba(22,139,255,.16),rgba(54,200,195,.13));color:var(--text,#f4f8ff);border-radius:10px;padding:9px 13px;font-size:12px;font-weight:700;white-space:nowrap}
    .rt-dashboard-nav:hover{border-color:#62d5d0;background:rgba(54,200,195,.2)}
    .rt-dashboard-nav[hidden]{display:none}
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
    .rt-dashboard-backdrop{position:fixed;inset:0;z-index:9997;background:rgba(1,8,18,.78);backdrop-filter:blur(9px);overflow:auto;padding:24px}
    .rt-dashboard-backdrop[hidden]{display:none}
    .rt-dashboard{width:min(100%,1040px);margin:24px auto;background:var(--bg,#07111f);color:var(--text,#f1f7fc);border:1px solid var(--border,rgba(133,177,207,.17));border-radius:20px;box-shadow:0 24px 90px #0009;overflow:hidden}
    .rt-dash-head{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:24px 28px;border-bottom:1px solid var(--border)}
    .rt-dash-kicker{font-size:10px;letter-spacing:1.8px;color:#6bd2cb;font-weight:800}.rt-dash-head h2{font-size:24px;margin:7px 0 5px}.rt-dash-head p{margin:0;color:var(--muted);font-size:12px}
    .rt-dash-close{border:1px solid var(--border);background:transparent;color:var(--text);border-radius:9px;padding:9px 12px}
    .rt-dash-body{padding:25px 28px 30px}.rt-dash-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
    .rt-dash-card{background:var(--panel,#102137);border:1px solid var(--border);border-radius:14px;padding:18px;min-width:0}
    .rt-dash-card h3{font-size:13px;margin:0 0 9px}.rt-dash-value{font-size:21px;font-weight:750;letter-spacing:-.5px}.rt-dash-muted{font-size:11px;line-height:1.6;color:var(--muted);margin-top:7px}
    .rt-dash-section{margin-top:23px}.rt-dash-section h3{font-size:15px;margin:0 0 12px}.rt-dash-projects{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .rt-dash-project{padding:16px;border:1px solid var(--border);border-radius:12px;background:rgba(16,33,55,.55)}.rt-dash-project strong{font-size:12px}.rt-dash-project p{font-size:11px;color:var(--muted);line-height:1.6;margin:7px 0 0}
    .rt-dash-tag{display:inline-flex;border:1px solid rgba(107,210,203,.28);color:#79d8d1;background:rgba(107,210,203,.08);border-radius:30px;padding:5px 9px;font-size:10px;font-weight:700}
    .rt-dash-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px}.rt-dash-action{border:1px solid var(--border);border-radius:9px;padding:10px 13px;background:rgba(57,121,245,.12);color:var(--text);font-size:11px}
    @media(max-width:700px){.rt-dashboard-backdrop{padding:10px}.rt-dashboard{margin:8px auto}.rt-dash-head,.rt-dash-body{padding:18px}.rt-dash-grid{grid-template-columns:1fr}.rt-dash-projects{grid-template-columns:1fr}.rt-dash-head h2{font-size:20px}}
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
  const topDashboardButton = document.createElement("button");
  topDashboardButton.type = "button";
  topDashboardButton.className = "rt-dashboard-nav";
  topDashboardButton.textContent = "Dashboard";
  topDashboardButton.hidden = true;
  topDashboardButton.setAttribute("aria-label", "Open your RETIMEA dashboard");
  topActions.prepend(accountButton);
  topActions.prepend(topDashboardButton);

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
        <button class="rt-auth-link" id="rtAuthDashboard" type="button" hidden>Open dashboard</button>
        <button class="rt-auth-link" id="rtAuthSignOut" type="button" hidden>Sign out</button>
      </div>
      <div class="rt-auth-status" id="rtAuthStatus" role="status" aria-live="polite">Loading secure account service…</div>
      <p class="rt-auth-note">Your password is handled by Supabase Authentication. RETIMEA AI does not store your password.</p>
    </section>`;
  document.body.appendChild(backdrop);

  const dashboard = document.createElement("div");
  dashboard.className = "rt-dashboard-backdrop";
  dashboard.hidden = true;
  dashboard.innerHTML = `
    <main class="rt-dashboard" role="dialog" aria-modal="true" aria-labelledby="rtDashTitle">
      <header class="rt-dash-head">
        <div><div class="rt-dash-kicker">RETIMEA AI · PERSONAL WORKSPACE</div><h2 id="rtDashTitle">Your dashboard</h2><p id="rtDashWelcome">Your creative and intelligent workspace, all in one place.</p></div>
        <button class="rt-dash-close" type="button">Close</button>
      </header>
      <div class="rt-dash-body">
        <div class="rt-dash-grid">
          <section class="rt-dash-card"><h3>ACCOUNT</h3><div class="rt-dash-value" id="rtDashAccount">Active</div><div class="rt-dash-muted" id="rtDashEmail">Signed-in account</div></section>
          <section class="rt-dash-card"><h3>YOUR PLAN</h3><div class="rt-dash-value">Free</div><div class="rt-dash-muted">Free access is active. Pro and Business upgrades will be introduced later.</div></section>
          <section class="rt-dash-card"><h3>USAGE</h3><div class="rt-dash-value">Not connected</div><div class="rt-dash-muted">Usage tracking will be enabled after secure account limits are configured.</div></section>
        </div>
        <section class="rt-dash-section"><h3>My workspace</h3><div class="rt-dash-projects">
          <article class="rt-dash-project"><strong>My Projects</strong><p>Your documents, designs and visualizations will appear here when secure project saving is enabled.</p><span class="rt-dash-tag">Coming next</span></article>
          <article class="rt-dash-project"><strong>Recent Activity</strong><p>Your recent tool activity will be collected here after account-linked activity storage is ready.</p><span class="rt-dash-tag">Coming next</span></article>
          <article class="rt-dash-project"><strong>AI Workspaces</strong><p>Access the RETIMEA tools from the main navigation. Your existing tools remain available.</p><span class="rt-dash-tag">Available</span></article>
          <article class="rt-dash-project"><strong>Account & Security</strong><p>Your account is managed securely through Supabase Authentication.</p><span class="rt-dash-tag">Connected</span></article>
        </div></section>
        <div class="rt-dash-actions"><button class="rt-dash-action" type="button" id="rtDashBack">Back to RETIMEA</button><button class="rt-dash-action" type="button" id="rtDashAccountSettings">Account settings</button></div>
      </div>
    </main>`;
  document.body.appendChild(dashboard);

  const form = backdrop.querySelector("#rtAuthForm");
  const email = backdrop.querySelector("#rtAuthEmail");
  const password = backdrop.querySelector("#rtAuthPassword");
  const submit = backdrop.querySelector("#rtAuthSubmit");
  const status = backdrop.querySelector("#rtAuthStatus");
  const reset = backdrop.querySelector("#rtAuthReset");
  const signOut = backdrop.querySelector("#rtAuthSignOut");
  const dashboardButton = backdrop.querySelector("#rtAuthDashboard");
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
  function openDashboard() {
    if (!supabase) return;
    dashboard.querySelector("#rtDashEmail").textContent = supabase.auth.getUser ? "Loading account…" : "Signed-in account";
    dashboard.hidden = false;
    hide();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) dashboard.querySelector("#rtDashEmail").textContent = data.user.email;
    }).catch(() => {});
  }
  function closeDashboard() { dashboard.hidden = true; }

  accountButton.addEventListener("click", show);
  topDashboardButton.addEventListener("click", openDashboard);
  dashboardButton.addEventListener("click", openDashboard);
  dashboard.querySelector(".rt-dash-close").addEventListener("click", closeDashboard);
  dashboard.querySelector("#rtDashBack").addEventListener("click", closeDashboard);
  dashboard.querySelector("#rtDashAccountSettings").addEventListener("click", () => { closeDashboard(); show(); });
  dashboard.addEventListener("click", event => { if (event.target === dashboard) closeDashboard(); });
  backdrop.querySelector(".rt-auth-close").addEventListener("click", hide);
  backdrop.addEventListener("click", event => { if (event.target === backdrop) hide(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !dashboard.hidden) closeDashboard(); else if (event.key === "Escape" && !backdrop.hidden) hide(); });
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
      dashboardButton.hidden = false;
      topDashboardButton.hidden = false;
      say("Signed in successfully. Account and saved-project features will be connected in upcoming stages.");
    } else {
      accountButton.textContent = "Sign in";
      accountButton.title = "Sign in or create a RETIMEA account";
      backdrop.querySelector("#rtAuthTitle").textContent = "Your RETIMEA account";
      backdrop.querySelector(".rt-auth-sub").textContent = "Sign in or create an account to get ready for your personal workspace.";
      form.hidden = false;
      signOut.hidden = true;
      dashboardButton.hidden = true;
      topDashboardButton.hidden = true;
      closeDashboard();
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
        const { data, error } = await supabase.auth.signUp(
          { email: mail, password: pass },
          { emailRedirectTo: window.location.origin }
        );
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
