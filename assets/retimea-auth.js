(() => {
  "use strict";

  const css = `
    .app{visibility:hidden}
.rt-entry{position:fixed;inset:0;z-index:9996;display:grid;place-items:center;overflow:auto;padding:24px;background:linear-gradient(90deg,rgba(3,12,28,.30),rgba(3,13,32,.64) 52%,rgba(3,13,32,.30)),url("/assets/retimea-ai-hero-clean.png") center/contain no-repeat,#061326;color:#f1f7fc}
    .rt-entry[hidden]{display:none}
    .rt-entry-card{width:min(100%,760px);text-align:center;padding:clamp(26px,6vw,64px);border:1px solid rgba(133,177,207,.2);border-radius:26px;background:linear-gradient(145deg,rgba(16,33,55,.94),rgba(7,17,31,.96));box-shadow:0 28px 100px #0008}
    .rt-entry-mark{font-size:12px;letter-spacing:4px;font-weight:800;color:#75d8d0}
    .rt-entry h1{font-size:clamp(34px,7vw,58px);line-height:1.08;margin:22px 0 14px;letter-spacing:-1.8px}
    .rt-entry h1 span{background:linear-gradient(90deg,#3979f5,#61d5d0);-webkit-background-clip:text;background-clip:text;color:transparent}
    .rt-entry-tagline{font-size:12px;letter-spacing:3px;color:#91a5ba;text-transform:uppercase}
    .rt-entry-copy{max-width:520px;margin:22px auto 30px;color:#a9bbce;font-size:15px;line-height:1.8}
    .rt-entry-actions{display:flex;justify-content:center;flex-wrap:wrap;gap:12px}
    .rt-entry-actions button{min-width:190px;padding:14px 20px;border-radius:11px;font-size:13px;font-weight:750}
    .rt-entry-primary{border:0;background:linear-gradient(110deg,#3979f5,#61d5d0);color:#061321}
    .rt-entry-secondary{border:1px solid rgba(133,177,207,.35);background:rgba(255,255,255,.025);color:#f1f7fc}
    .rt-entry-foot{margin-top:24px;color:#7890a8;font-size:11px}
    .rt-entry-status{min-height:18px;margin-top:16px;color:#91a5ba;font-size:12px}
    @media(max-width:600px){.rt-entry{padding:14px}.rt-entry-card{border-radius:18px}.rt-entry-actions{flex-direction:column}.rt-entry-actions button{width:100%}}
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
  
    .rt-entry{background:linear-gradient(90deg,rgba(3,12,28,.34),rgba(3,13,32,.58) 52%,rgba(3,13,32,.38)),url("/assets/retimea-ai-hero-clean.png") center/cover no-repeat,#07111f;color:#f1f7fc}
    .rt-entry-card{width:min(100%,820px);padding:clamp(32px,6vw,76px);border:1px solid rgba(119,204,224,.28);border-radius:30px;background:linear-gradient(145deg,rgba(11,29,50,.84),rgba(5,17,32,.91));box-shadow:0 32px 110px rgba(0,0,0,.48),0 0 70px rgba(25,128,190,.12);backdrop-filter:blur(18px)}
    .rt-entry-mark{letter-spacing:5px;color:#8be9df}
    .rt-entry h1{font-size:clamp(38px,7vw,68px);letter-spacing:-2px;margin:26px 0 16px}
    .rt-entry-tagline{letter-spacing:3.5px;color:#b2c6d8}
    .rt-entry-copy{font-size:16px;line-height:1.85;color:#c0cfdd}
    .rt-entry-actions{gap:14px}
    .rt-entry-actions button{min-height:50px;min-width:205px;border-radius:13px;transition:transform .2s ease,box-shadow .2s ease}
    .rt-entry-actions button:hover{transform:translateY(-2px)}
    .rt-entry-primary{box-shadow:0 12px 30px rgba(57,121,245,.24)}
    .rt-entry-secondary{border-color:rgba(151,190,214,.4);background:rgba(255,255,255,.055)}
    @media(max-width:600px){.rt-entry{padding:16px}.rt-entry-card{padding:34px 22px;border-radius:22px}.rt-entry h1{font-size:39px}.rt-entry-tagline{font-size:10px;letter-spacing:2px}.rt-entry-copy{font-size:14px}}
    /* Intro page: use the clean artwork at full width without distortion or cropping */
    .rt-entry{position:fixed;inset:0;display:block;padding:0;overflow:auto;background:#061326;color:#f1f7fc}
    .rt-entry-artwork{display:block;width:100%;height:auto;min-height:100%;object-fit:contain;object-position:center top}
    .rt-entry-status{display:none}
    .rt-intro-nav{position:absolute;z-index:2;top:clamp(12px,3vh,30px);left:50%;transform:translateX(-50%);width:min( calc(100% - 32px),1180px);display:flex;align-items:center;justify-content:center;gap:clamp(5px,1.1vw,14px);padding:10px 14px;border:1px solid rgba(151,190,214,.24);border-radius:16px;background:rgba(5,17,32,.76);backdrop-filter:blur(14px);box-shadow:0 12px 36px #0005}
    .rt-intro-nav button{border:1px solid transparent;border-radius:10px;padding:10px clamp(9px,1.3vw,17px);background:transparent;color:#eef7ff;font-size:clamp(11px,1vw,13px);font-weight:650;white-space:nowrap;cursor:pointer}
    .rt-intro-nav button:hover,.rt-intro-nav button:focus-visible{border-color:rgba(112,216,210,.55);background:rgba(104,173,197,.13);outline:none}
    .rt-intro-nav .rt-intro-signin{border-color:rgba(151,190,214,.4)}
    .rt-intro-nav .rt-intro-signup{border:0;background:linear-gradient(110deg,#3979f5,#61d5d0);color:#061321}
    .rt-intro-nav-spacer{flex:1}
    .rt-intro-info{position:absolute;z-index:3;top:86px;left:50%;transform:translateX(-50%);width:min(calc(100% - 32px),620px);padding:24px 26px;border:1px solid rgba(151,190,214,.3);border-radius:18px;background:rgba(5,17,32,.94);backdrop-filter:blur(18px);box-shadow:0 22px 70px #0009;color:#f1f7fc}
    .rt-intro-info[hidden]{display:none}.rt-intro-info h2{margin:0 0 10px;font-size:21px}.rt-intro-info p,.rt-intro-info li{color:#c0cfdd;font-size:13px;line-height:1.7}.rt-intro-info ul{padding-left:20px}.rt-intro-info-close{float:right;border:1px solid rgba(151,190,214,.35);border-radius:8px;padding:5px 10px;background:transparent;color:#fff;cursor:pointer}
    @media(max-width:680px){.rt-intro-nav{top:10px;flex-wrap:wrap;gap:4px;padding:7px}.rt-intro-nav button{padding:8px 9px}.rt-intro-nav-spacer{display:none}.rt-intro-info{top:118px;padding:19px}}

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

  const entry = document.createElement("section");
  entry.className = "rt-entry";
  entry.setAttribute("aria-label", "RETIMEA AI welcome");
  entry.innerHTML = `
    <img class="rt-entry-artwork" src="/assets/retimea-ai-hero-clean.png" alt="RETIMEA AI — Intelligence Beyond Limits">
    <nav class="rt-intro-nav" aria-label="Main navigation">
      <button type="button" data-intro-home>Home</button>
      <button type="button" data-intro-panel="features">Features</button>
      <button type="button" data-intro-panel="about">About</button>
      <button type="button" data-intro-panel="pricing">Pricing</button>
      <button type="button" data-intro-panel="contact">Contact</button>
      <span class="rt-intro-nav-spacer"></span>
      <button type="button" class="rt-intro-signin" data-intro-signin>Sign in</button>
      <button type="button" class="rt-intro-signup" data-intro-signup>Create account</button>
    </nav>
    <div class="rt-entry-status" id="rtEntryStatus" role="status" aria-live="polite">Preparing your secure workspace…</div>`;
  document.body.appendChild(entry);

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
  function show(nextMode = "signin") { setMode(nextMode); backdrop.hidden = false; if (supabase) email.focus(); }
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

  const introInfo = document.createElement("section");
  introInfo.className = "rt-intro-info";
  introInfo.hidden = true;
  introInfo.setAttribute("aria-live", "polite");
  introInfo.innerHTML = `<button type="button" class="rt-intro-info-close" aria-label="Close information">Close</button><div class="rt-intro-info-content"></div>`;
  entry.appendChild(introInfo);
  const introPanels = {
    features: "<h2>Explore RETIMEA AI</h2><p>One workspace for creating, researching and working with ideas.</p><ul><li>AI chat and research</li><li>Image and document creation</li><li>Visualizations and charts</li><li>Trading research and market tools</li></ul>",
    about: "<h2>About RETIMEA AI</h2><p>RETIMEA AI brings useful intelligent tools together in one workspace, designed to help you think, create, research and achieve.</p><p><strong>Intelligence Beyond Limits.</strong></p>",
    pricing: "<h2>Simple access</h2><p>Free access is currently available for the Preview workspace. Pro and Business plans are planned for a later stage; paid-plan features and prices have not yet been announced.</p>",
    contact: "<h2>Contact</h2><p>For now, please use the account sign-in window for access support. Official contact details will be added here before public launch.</p>"
  };
  entry.querySelector("[data-intro-home]").addEventListener("click", () => { introInfo.hidden = true; });
  entry.querySelectorAll("[data-intro-panel]").forEach(button => button.addEventListener("click", () => {
    introInfo.querySelector(".rt-intro-info-content").innerHTML = introPanels[button.dataset.introPanel] || "";
    introInfo.hidden = false;
  }));
  introInfo.querySelector(".rt-intro-info-close").addEventListener("click", () => { introInfo.hidden = true; });
  entry.querySelector("[data-intro-signup]").addEventListener("click", () => show("signup"));
  entry.querySelector("[data-intro-signin]").addEventListener("click", () => show("signin"));
  accountButton.addEventListener("click", () => show("signin"));
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

  function renderSession(session, options = {}) {
    if (session?.user) {
      document.querySelector(".app").style.visibility = "visible";
      entry.hidden = true;
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
      if (options.openDashboard) openDashboard();
    } else {
      document.querySelector(".app").style.visibility = "hidden";
      entry.hidden = false;
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
      renderSession(data.session, { openDashboard: Boolean(data.session?.user) });
      supabase.auth.onAuthStateChange((event, session) => {
        renderSession(session, { openDashboard: event === "SIGNED_IN" && Boolean(session?.user) });
        if (event === "SIGNED_IN" && session?.user) hide();
      });
      entry.querySelector("#rtEntryStatus").textContent = "Your secure account service is ready.";
    } catch (error) {
      configError = error.message || "Account service is not available.";
      entry.querySelector("#rtEntryStatus").textContent = "Sign-in is temporarily unavailable. Please refresh and try again.";
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
