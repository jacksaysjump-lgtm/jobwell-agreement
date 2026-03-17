'use strict';
// @netlify/blobs is pre-bundled in the Netlify Functions runtime.
// No package.json or npm install required — works with drag-and-drop deploy.
const { getStore } = require('@netlify/blobs');
const { createHash, randomBytes } = require('crypto');

// ── Agreement text ────────────────────────────────────────────────────────
const AGREEMENT_TEXT = 'ACCEPTANCE\n\nBy clicking "I Agree and Continue," you ("Client") enter into a binding agreement with Jobwell Staffing LLC, a New Jersey limited liability company ("Agency"), governing your access to and use of candidate profiles. This electronic acknowledgment constitutes a legally valid and enforceable agreement under the Electronic Signatures in Global and National Commerce Act (E-Sign Act) and applicable New Jersey law.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n0. DEFINITIONS\n\n"Introduced Candidate" means any individual whose profile, resume, or contact information was provided to Client by Agency, regardless of whether Client had prior independent awareness of that individual. A candidate is deemed introduced as of the date Client first accessed that candidate\'s profile, as recorded in Agency\'s access logs.\n\n"Hire or Engage" means any full-time, part-time, contract, freelance, consulting, advisory, or any other paid or unpaid working arrangement, whether directly or through a third party, subsidiary, affiliate, or related entity of Client.\n\n"Introduction Date" means the date on which Client first accessed a specific candidate\'s profile, as recorded in Agency\'s system logs.\n\n"Placement Process" means Agency\'s standard process by which Client hires an Introduced Candidate through Agency and pays Agency\'s applicable placement fee.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n1. NON-POACHING OBLIGATION\n\nClient agrees not to Hire or Engage any Introduced Candidate outside of Agency\'s Placement Process. All hiring of Introduced Candidates must be completed through Agency, regardless of how the hire or engagement is structured or through what channel it is initiated.\n\nPrior Relationship Exception: This Section does not apply where Client can demonstrate, with written evidence predating the Introduction Date, that an independent working relationship with the relevant candidate existed prior to Agency\'s introduction. Client bears the sole burden of proof in establishing any such prior relationship. Mere prior awareness of a candidate does not constitute a prior relationship for purposes of this exception.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n2. CIRCUMVENTION FEE\n\nIf Client Hires or Engages an Introduced Candidate by any means that bypasses Agency\'s Placement Process -- directly, indirectly, or through a third party -- within twelve (12) months of the applicable Introduction Date, a circumvention fee is immediately due and payable to Agency equal to the greater of:\n\n  (a) Twenty percent (20%) of the Introduced Candidate\'s first-year annualized total compensation (including base salary, guaranteed bonuses, signing bonuses, commissions, allowances, and the fair market value of any non-cash benefits); or\n\n  (b) Five thousand dollars ($5,000).\n\nCompensation Disclosure and Audit Right: Within five (5) business days of any hire or engagement that triggers this Section, Client shall provide Agency with written documentation of the Introduced Candidate\'s total compensation package, including a copy of the executed offer letter or engagement agreement. Agency reserves the right to audit Client\'s compensation records, upon reasonable notice, to verify the accuracy of any circumvention fee calculation. If Client fails to provide documentation within the required period, Agency may calculate the fee based on the prevailing market rate for the role as reasonably determined by Agency, and that calculation shall be binding absent clear written evidence to the contrary provided by Client.\n\nThis fee applies per Introduced Candidate hired or engaged in circumvention. This fee does not apply when the hire is completed through Agency\'s standard Placement Process.\n\nAny circumvention fee not paid within thirty (30) days of the hire or engagement date shall accrue interest at 1.5% per month until paid in full.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n3. NO DIRECT CONTACT\n\nClient agrees not to initiate direct communication with Introduced Candidates outside of Agency-facilitated channels for the purpose of soliciting, recruiting, or engaging them. Client-facing interviews, reference checks, and other candidate-facing activities arranged or expressly approved by Agency do not violate this Section. Nothing herein prohibits incidental professional contact unrelated to hiring or engagement.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n4. CONFIDENTIALITY\n\nCandidate profiles, resumes, contact details, and all related materials provided by Agency ("Confidential Information") are confidential and proprietary to Agency. Client agrees to:\n\n  (a) Not disclose Confidential Information to any third party without Agency\'s prior written consent;\n\n  (b) Use Confidential Information solely to evaluate candidates through Agency\'s Placement Process;\n\n  (c) Implement reasonable security measures to prevent unauthorized access to or disclosure of Confidential Information.\n\nThis confidentiality obligation survives for two (2) years following the date of Client\'s access to each candidate\'s profile.\n\nClient acknowledges that any breach of this Section may cause irreparable harm to Agency for which monetary damages would be inadequate, and Agency shall be entitled to seek injunctive or other equitable relief without the requirement to post bond.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n5. LOGGED ACCEPTANCE\n\nClient\'s agreement is recorded with Client\'s name, company, email address, and timestamp at the time of access. This record serves as admissible evidence of Client\'s acceptance of these Terms. By proceeding, Client represents that the individual clicking "I Agree and Continue" has authority to bind Client to this Agreement.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n6. GOVERNING LAW AND DISPUTE RESOLUTION\n\nThis Agreement is governed by the laws of the State of New Jersey, without regard to its conflict of laws principles. Any dispute arising out of or relating to this Agreement shall be resolved exclusively in the state or federal courts located in Somerset County, New Jersey, and each party irrevocably consents to personal jurisdiction and venue in such courts.\n\nIn any action to enforce this Agreement, the prevailing party is entitled to recover its reasonable attorneys\' fees, court costs, and other litigation expenses from the non-prevailing party.\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n7. MISCELLANEOUS\n\nSeverability: If any provision of this Agreement is found invalid or unenforceable, it shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force.\n\nEntire Agreement: This Agreement constitutes the entire agreement between the parties with respect to candidate access and the non-poaching obligations set forth herein. It does not supersede any separate placement agreement, master services agreement, or fee arrangement between the parties.\n\nModification: Agency reserves the right to update these Terms at any time. Updated Terms will be presented upon next access. Continued use constitutes acceptance. Material changes will be noted with a revised effective date.\n\nWaiver: Agency\'s failure to enforce any right or provision shall not constitute a waiver of that right in any subsequent instance.';

const DEFAULTS = {
  title: 'Candidate Access Agreement',
  body: AGREEMENT_TEXT,
  version: '1.0',
  pwHash: ''
};

const TOKEN_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const TOKEN_RE = /^[0-9a-f]{16}$/;
const MAX_NAME = 200, MAX_COMPANY = 200, MAX_EMAIL = 254;
const MAX_LABEL = 300, MAX_URL = 2048, MAX_TITLE = 300;
const MAX_BODY = 50000, MAX_VERSION = 20;

function sha256(str) { return createHash('sha256').update(str, 'utf8').digest('hex'); }
function makeToken() { return randomBytes(8).toString('hex'); }
function validUrl(u) {
  try { const p = new URL(u).protocol; return p === 'https:' || p === 'http:'; }
  catch (e) { return false; }
}
function cap(str, max) {
  const s = (str == null ? '' : String(str)).trim();
  return s.length <= max ? s : null;
}
function res(code, data) {
  return { statusCode: code, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
}
function ok(data) { return res(200, data || { ok: true }); }
function fail(msg, code) { return res(code || 400, { error: msg }); }

async function getCfg(store) {
  const r = await store.get('config');
  return r ? Object.assign({}, DEFAULTS, JSON.parse(r)) : Object.assign({}, DEFAULTS);
}
async function getTokens(store) {
  const r = await store.get('tokens');
  return r ? JSON.parse(r) : {};
}
async function getSigs(store) {
  const listed = await store.list({ prefix: 'sig/' });
  if (!listed || !listed.blobs || listed.blobs.length === 0) return [];
  const fetches = listed.blobs.map(b =>
    store.get(b.key).then(r => {
      try { return r ? JSON.parse(r) : null; } catch (e) { return null; }
    })
  );
  const results = await Promise.all(fetches);
  return results
    .filter(s => s !== null)
    .sort((a, b) => a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0);
}
function pruneExpiredTokens(tokens) {
  const now = Date.now();
  const pruned = Object.assign({}, tokens);
  for (const tok of Object.keys(pruned)) {
    const td = pruned[tok];
    if (!td || !td.createdAt || now - new Date(td.createdAt).getTime() > TOKEN_TTL_MS)
      delete pruned[tok];
  }
  return pruned;
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return fail('Method not allowed', 405);

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return fail('Invalid JSON'); }

  // getStore with consistency:'strong' ensures reads always reflect latest writes
  const store = getStore({ name: 'jobwell', consistency: 'strong' });
  const action = body.action;
  const password = body.password;

  try {

    if (action === 'check-setup') {
      const cfg0 = await getCfg(store);
      return ok({ needsSetup: !cfg0.pwHash });
    }

    if (action === 'get-agreement') {
      const tok = body.token;
      if (!tok || !TOKEN_RE.test(tok)) return fail('Invalid link', 404);
      const [tokens0, cfg1] = await Promise.all([getTokens(store), getCfg(store)]);
      const td0 = tokens0[tok];
      if (!td0) return fail('Invalid or expired link', 404);
      if (Date.now() - new Date(td0.createdAt).getTime() > TOKEN_TTL_MS)
        return fail('This link has expired. Please contact Jobwell Staffing for a new link.', 410);
      return ok({ title: cfg1.title, body: cfg1.body, version: cfg1.version, label: td0.label || '' });
    }

    if (action === 'sign') {
      const sigTok = body.token;
      if (!sigTok || !TOKEN_RE.test(sigTok)) return fail('Invalid link', 404);

      const name    = cap(body.name,    MAX_NAME);
      const company = cap(body.company, MAX_COMPANY);
      const email   = cap(body.email,   MAX_EMAIL);
      if (!name)    return fail('Name is required and must be under ' + MAX_NAME + ' characters');
      if (!company) return fail('Company is required and must be under ' + MAX_COMPANY + ' characters');
      if (!email)   return fail('Email is required and must be under ' + MAX_EMAIL + ' characters');
      if (name.length < 2) return fail('Please enter your full name');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Invalid email address');

      const [tokens1, cfg2] = await Promise.all([getTokens(store), getCfg(store)]);
      const td1 = tokens1[sigTok];
      if (!td1) return fail('Invalid or expired link', 404);
      if (Date.now() - new Date(td1.createdAt).getTime() > TOKEN_TTL_MS)
        return fail('This link has expired. Please contact Jobwell Staffing.', 410);

      const sigId = Date.now().toString(36) + randomBytes(4).toString('hex');
      const entry = {
        id: sigId, name, company,
        email: email.toLowerCase(),
        ts: new Date().toISOString(),
        ver: cfg2.version || '1.0',
        deckUrl: td1.deckUrl,
        token: sigTok,
        label: td1.label || ''
      };
      // Each sig is its own blob key — atomic write, no race condition
      await store.set('sig/' + sigId, JSON.stringify(entry));
      return ok({ deckUrl: td1.deckUrl });
    }

    if (action === 'admin-setup') {
      const cfgS = await getCfg(store);
      if (cfgS.pwHash) return fail('Admin password already set', 400);
      const pw0 = cap(body.password, 200);
      if (!pw0 || pw0.length < 8) return fail('Password must be at least 8 characters');
      await store.set('config', JSON.stringify(Object.assign({}, cfgS, { pwHash: sha256(pw0) })));
      return ok();
    }

    // All remaining actions require authentication
    const cfgA = await getCfg(store);
    if (!cfgA.pwHash) return fail('Admin setup required', 401);
    const pw = cap(password, 200);
    if (!pw) return fail('Password required', 401);
    if (sha256(pw) !== cfgA.pwHash) return fail('Incorrect password', 401);

    if (action === 'admin-login') return ok();

    if (action === 'admin-create-link') {
      const deckUrl = cap(body.deckUrl, MAX_URL);
      const label   = cap(body.label || '', MAX_LABEL);
      if (!deckUrl) return fail('Deck URL is required');
      if (!validUrl(deckUrl)) return fail('URL must start with https:// or http://');
      const newTok = makeToken();
      const tokens2 = await getTokens(store);
      tokens2[newTok] = { deckUrl, label: label || '', createdAt: new Date().toISOString() };
      await store.set('tokens', JSON.stringify(tokens2));
      const host = event.headers['x-forwarded-host'] || event.headers['host'] || '';
      return ok({ token: newTok, signingUrl: 'https://' + host + '/?t=' + newTok });
    }

    if (action === 'admin-revoke-link') {
      const revTok = body.token;
      if (!revTok || !TOKEN_RE.test(revTok)) return fail('Invalid token format');
      const tokens3 = await getTokens(store);
      delete tokens3[revTok];
      await store.set('tokens', JSON.stringify(tokens3));
      return ok();
    }

    if (action === 'admin-get-data') {
      const [sigsAll, rawToks] = await Promise.all([getSigs(store), getTokens(store)]);
      const liveToks = pruneExpiredTokens(rawToks);
      const { pwHash: _omit, ...cfgPublic } = cfgA;
      return ok({ sigs: sigsAll, tokens: liveToks, config: cfgPublic });
    }

    if (action === 'admin-clear-sigs') {
      const listed2 = await store.list({ prefix: 'sig/' });
      if (listed2 && listed2.blobs && listed2.blobs.length > 0) {
        await Promise.all(listed2.blobs.map(b => store.delete(b.key)));
      }
      return ok();
    }

    if (action === 'admin-save-config') {
      const nc = Object.assign({}, cfgA);
      if (body.title    != null) { const t = cap(body.title,    MAX_TITLE);   if (t === null) return fail('Title exceeds maximum length');   nc.title   = t || DEFAULTS.title; }
      if (body.bodyText != null) { const b = cap(body.bodyText, MAX_BODY);    if (b === null) return fail('Agreement body exceeds maximum length'); nc.body = b || DEFAULTS.body; }
      if (body.version  != null) { const v = cap(body.version,  MAX_VERSION); if (v === null) return fail('Version exceeds maximum length'); nc.version = v || '1.0'; }
      if (body.newPassword) {
        const np = cap(body.newPassword, 200);
        if (np === null) return fail('Password exceeds maximum length');
        if (!np || np.length < 8) return fail('New password must be at least 8 characters');
        nc.pwHash = sha256(np);
      }
      await store.set('config', JSON.stringify(nc));
      return ok();
    }

    return fail('Unknown action');

  } catch (e) {
    console.error('[jobwell-api]', e.message, e.stack);
    return res(500, { error: 'Server error: ' + e.message });
  }
};
