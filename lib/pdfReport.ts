import { SummaryStats, EmotionStat, TimeSeriesPoint, DayOfWeekStat, HourOfDayStat } from './stats';
import { ThemeColors } from '../constants/colors';

const ESC = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

interface ReportParams {
  userName: string;
  rangeLabel: string;
  summary: SummaryStats;
  frequency: EmotionStat[];
  trend: TimeSeriesPoint[];
  dayOfWeek: DayOfWeekStat[];
  hourOfDay: HourOfDayStat[];
  logoSrc?: string;
  colors: ThemeColors;
}

export function generateReportHtml({
  userName,
  rangeLabel,
  summary,
  frequency,
  trend,
  dayOfWeek,
  hourOfDay,
  logoSrc,
  colors,
}: ReportParams): string {
  const exportedAt = new Date().toLocaleString('pt-BR');
  const displayName = userName.trim() || 'Anônimo';
  const p = colors.chartPalette;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Relatório PsyMap — ${ESC(displayName)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: ${ESC(colors.text)};
    background: ${ESC(colors.background)};
    padding: 32px 24px 48px;
    max-width: 680px;
    margin: 0 auto;
    font-size: 13px;
    line-height: 1.5;
  }
  h1 { font-size: 22px; font-weight: 700; color: ${ESC(colors.accent)}; margin-bottom: 2px; }
  h2 { font-size: 15px; font-weight: 600; color: ${ESC(colors.text)}; margin: 24px 0 10px; padding-bottom: 4px; border-bottom: 2px solid ${ESC(colors.accent)}; }
  .sub { color: ${ESC(colors.textSecondary)}; font-size: 12px; margin-bottom: 4px; }
  .meta { color: ${ESC(colors.textDim)}; font-size: 11px; margin-bottom: 18px; }

  .cards { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
  .card {
    background: ${ESC(colors.surface)};
    border-radius: 8px;
    padding: 10px 14px;
    min-width: 110px;
    flex: 1 1 auto;
    text-align: center;
    border: 1px solid ${ESC(colors.borderAlt)};
  }
  .card .num { font-size: 24px; font-weight: 700; color: ${ESC(colors.accent)}; }
  .card .lbl { font-size: 10px; color: ${ESC(colors.textSecondary)}; margin-top: 2px; }
  .card .emoji { font-size: 28px; }
  .card .sub-text { font-size: 12px; color: ${ESC(colors.text)}; font-weight: 600; margin-top: 2px; }

  .bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .bar-row .emoji-span { font-size: 16px; width: 28px; text-align: center; flex-shrink: 0; }
  .bar-row .label-span { font-size: 11px; color: ${ESC(colors.text)}; width: 90px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bar-row .bar-bg { flex: 1; height: 18px; background: ${ESC(colors.borderAlt)}; border-radius: 4px; overflow: hidden; }
  .bar-row .bar-fill { height: 100%; border-radius: 4px; text-align: right; padding-right: 6px; font-size: 10px; font-weight: 600; color: #fff; line-height: 18px; white-space: nowrap; }
  .bar-row .count { font-size: 12px; color: ${ESC(colors.textDim)}; width: 36px; text-align: right; flex-shrink: 0; }

  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th, td { padding: 5px 8px; border-bottom: 1px solid ${ESC(colors.borderAlt)}; text-align: left; }
  th { color: ${ESC(colors.textSecondary)}; font-weight: 600; font-size: 10px; text-transform: uppercase; }
  td { color: ${ESC(colors.text)}; }
  .td-num { text-align: right; font-variant-numeric: tabular-nums; }
  .td-emoji { font-size: 15px; text-align: center; }

  .dow-bars { display: flex; align-items: flex-end; gap: 6px; height: 100px; margin-top: 8px; }
  .dow-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .dow-fill { width: 100%; border-radius: 4px 4px 0 0; min-height: 4px; }
  .dow-label { font-size: 9px; color: ${ESC(colors.textSecondary)}; }
  .dow-val { font-size: 10px; color: ${ESC(colors.text)}; font-weight: 600; }

  .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid ${ESC(colors.borderAlt)}; font-size: 10px; color: ${ESC(colors.textDim)}; text-align: center; }
  .footer a { color: ${ESC(colors.textDim)}; }

  @media print {
    body { padding: 0; }
    h2 { page-break-after: avoid; }
    table { page-break-inside: avoid; }
  }
</style>
</head>
<body>

${logoSrc ? `<div style="text-align:center;margin-bottom:12px;"><img src="${ESC(logoSrc)}" width="64" height="64" alt="PsyMap" /></div>` : ''}
<h1>PsyMap — Relatório de Humor</h1>
<div class="sub">Paciente: <strong>${ESC(displayName)}</strong></div>
<div class="meta">Exportado em ${ESC(exportedAt)} · Período: ${ESC(rangeLabel)}</div>

${summaryHtml(summary)}
${frequencyHtml(frequency, p)}
${distributionTable(frequency)}
${intensityTable(trend)}
${dayOfWeekHtml(dayOfWeek, p)}
${hourOfDayHtml(hourOfDay)}

<div class="footer">
  Gerado por PsyMap — app gratuito e open-source (GPL-3.0)<br>
  https://gitlab.com/wenningtondiasx25/psymap
</div>

</body>
</html>`;
}

function summaryHtml(s: SummaryStats): string {
  if (s.totalEntries === 0) return '<p style="color:#888;text-align:center;padding:24px;">Nenhum registro no período.</p>';
  return `<h2>Resumo</h2>
<div class="cards">
  <div class="card"><div class="num">${s.totalEntries}</div><div class="lbl">Registros</div></div>
  <div class="card"><div class="num">${s.avgIntensity}</div><div class="lbl">Média intensidade</div></div>
  ${s.mostFrequent ? `<div class="card"><div class="emoji">${ESC(s.mostFrequent.emoji)}</div><div class="lbl">Mais frequente</div><div class="sub-text">${ESC(s.mostFrequent.label)}</div></div>` : ''}
  <div class="card"><div class="num">${s.daysWithEntries}</div><div class="lbl">Dias ativos</div></div>
  <div class="card"><div class="num">${s.currentStreak}</div><div class="lbl">Sequência (dias)</div></div>
</div>`;
}

function frequencyHtml(stats: EmotionStat[], p: readonly string[]): string {
  if (stats.length === 0) return '';
  const max = stats[0].count;
  return `<h2>Frequência de Emoções</h2>
${stats.map((s, i) => {
  const pct = Math.round((s.count / max) * 100);
  return `<div class="bar-row">
  <span class="emoji-span">${s.emoji}</span>
  <span class="label-span">${ESC(s.label)}</span>
  <div class="bar-bg"><div class="bar-fill" style="width:${pct}%;background:${p[i % p.length]}">${s.percentage > 5 ? s.percentage + '%' : ''}</div></div>
  <span class="count">${s.count}</span>
</div>`;
}).join('')}`;
}

function distributionTable(stats: EmotionStat[]): string {
  if (stats.length === 0) return '';
  return `<h2>Distribuição de Humor</h2>
<table>
<tr><th>Emoção</th><th class="td-num">Registros</th><th class="td-num">%</th><th class="td-num">Intens. média</th></tr>
${stats.map((s) => `<tr>
  <td class="td-emoji">${s.emoji}</td><td>${ESC(s.label)}</td>
  <td class="td-num">${s.count}</td>
  <td class="td-num">${s.percentage}%</td>
  <td class="td-num">${s.avgIntensity}</td>
</tr>`).join('')}
</table>`;
}

function intensityTable(points: TimeSeriesPoint[]): string {
  if (points.length < 2) return '';
  return `<h2>Intensidade ao Longo do Tempo</h2>
<table>
<tr><th>Data</th><th class="td-num">Intens. média</th><th class="td-num">Registros</th><th>Emoção dom.</th></tr>
${points.map((p) => {
  const [y, m, d] = p.date.split('-');
  return `<tr>
  <td>${d}/${m}/${y}</td>
  <td class="td-num">${p.avgIntensity}</td>
  <td class="td-num">${p.count}</td>
  <td>${p.dominantEmotion || '—'}</td>
</tr>`;
}).join('')}
</table>`;
}

function dayOfWeekHtml(stats: DayOfWeekStat[], p: readonly string[]): string {
  if (stats.length === 0) return '';
  const max = Math.max(...stats.map((s) => s.avgIntensity), 1);
  return `<h2>Humor por Dia da Semana</h2>
<div class="dow-bars">
${stats.map((s, i) => {
  const h = Math.max((s.avgIntensity / max) * 80, 4);
  const hasData = s.count > 0;
  return `<div class="dow-col">
    <div class="dow-val">${hasData ? s.avgIntensity : ''}</div>
    <div class="dow-fill" style="height:${h}px;background:${hasData ? p[i % p.length] : '#ccc'}"></div>
    <div class="dow-label">${s.dayLabel}</div>
  </div>`;
}).join('')}
</div>`;
}

function hourOfDayHtml(stats: HourOfDayStat[]): string {
  const active = stats.filter((s) => s.count > 0);
  if (active.length === 0) return '';
  return `<h2>Humor por Hora do Dia</h2>
<table>
<tr><th>Hora</th><th class="td-num">Intens. média</th><th class="td-num">Registros</th></tr>
${active.map((s) => `<tr>
  <td>${s.hour.toString().padStart(2, '0')}h</td>
  <td class="td-num">${s.avgIntensity}</td>
  <td class="td-num">${s.count}</td>
</tr>`).join('')}
  </table>`;
}
