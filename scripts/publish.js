#!/usr/bin/env node
/**
 * Publica um AAB no Google Play via Play Developer API.
 *
 * Uso:
 *   node scripts/publish.js --bundle releases/psymap-v2.2.0.aab --track internal
 *   node scripts/publish.js --bundle ... --track production --status draft
 *   node scripts/publish.js --bundle ... --track internal --notes "Correções"
 *
 * Requer play-service-account.json na raiz (service account com acesso no Play Console).
 */
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const PACKAGE_NAME = 'com.app.psymap';
const KEY_FILE = path.join(__dirname, '..', 'play-service-account.json');
const SCOPE = 'https://www.googleapis.com/auth/androidpublisher';

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

function base64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getAccessToken() {
  const key = JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'));
  const iat = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({
      iss: key.client_email,
      scope: SCOPE,
      aud: 'https://oauth2.googleapis.com/token',
      iat,
      exp: iat + 3600,
    }),
  );
  const signingInput = `${header}.${claims}`;
  const signature = crypto.createSign('RSA-SHA256').update(signingInput).sign(key.private_key);
  const assertion = `${signingInput}.${base64url(signature)}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Falha ao autenticar service account: ${JSON.stringify(body)}`);
  return body.access_token;
}

async function api(token, method, url, body, contentType = 'application/json') {
  const res = await fetch(url, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      ...(body ? { 'content-type': contentType } : {}),
    },
    body: body ? (contentType === 'application/json' ? JSON.stringify(body) : body) : undefined,
  });
  const text = await res.text();
  const parsed = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
  if (!res.ok) {
    throw new Error(`${method} ${url} → ${res.status}: ${typeof parsed === 'string' ? parsed.slice(0, 500) : JSON.stringify(parsed).slice(0, 800)}`);
  }
  return parsed;
}

async function main() {
  const bundlePath = arg('bundle');
  const track = arg('track', 'internal');
  const status = arg('status', 'completed');
  const notes = arg('notes', '');
  const rollout = arg('rollout');

  if (!bundlePath || !fs.existsSync(bundlePath)) {
    console.error('Informe um AAB válido: --bundle caminho/arquivo.aab');
    process.exit(1);
  }

  const token = await getAccessToken();
  const base = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}`;
  const uploadBase = `https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/${PACKAGE_NAME}`;

  console.log(`▶ Criando edição para ${PACKAGE_NAME}...`);
  const edit = await api(token, 'POST', `${base}/edits`, {});
  const editId = edit.id;

  try {
    console.log(`▶ Enviando ${path.basename(bundlePath)} (${(fs.statSync(bundlePath).size / 1e6).toFixed(1)} MB)...`);
    const uploaded = await api(
      token,
      'POST',
      `${uploadBase}/edits/${editId}/bundles?uploadType=media`,
      fs.readFileSync(bundlePath),
      'application/octet-stream',
    );
    const versionCode = uploaded.versionCode;
    console.log(`   versionCode enviado: ${versionCode}`);

    const release = {
      versionCodes: [String(versionCode)],
      status,
      ...(rollout ? { userFraction: Number(rollout) } : {}),
      ...(notes ? { releaseNotes: [{ language: 'pt-BR', text: notes }] } : {}),
    };
    if (status === 'inProgress' && !rollout) release.userFraction = 0.2;

    console.log(`▶ Atualizando track "${track}" (status: ${status})...`);
    await api(token, 'PUT', `${base}/edits/${editId}/tracks/${track}`, { track, releases: [release] });

    console.log('▶ Commitando edição (changesNotSentForReview)...');
    await api(token, 'POST', `${base}/edits/${editId}:commit?changesNotSentForReview=true`, {});
    console.log(`✔ Publicado na track ${track} (versionCode ${versionCode}, status ${status}).`);
  } catch (err) {
    await api(token, 'DELETE', `${base}/edits/${editId}`).catch(() => {});
    throw err;
  }
}

main().catch((err) => {
  console.error('✖', err.message);
  process.exit(1);
});
