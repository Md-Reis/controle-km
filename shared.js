// ═══════════════════════════════════════════════
//  shared.js — Funções utilitárias compartilhadas
//  Sheyla Toyota · Leva e Traz
// ═══════════════════════════════════════════════

// ── Formatação ──────────────────────────────────
function formatCurrency(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ── Datas (sem problema de fuso UTC) ────────────
// Retorna "YYYY-MM-DD" no horário local (nunca usa UTC)
function toLocalDateStr(d) {
  return d.getFullYear() + '-'
    + String(d.getMonth() + 1).padStart(2, '0') + '-'
    + String(d.getDate()).padStart(2, '0');
}

// Diferença em dias inteiros entre duas strings "YYYY-MM-DD" (ou ISO)
// Compara apenas a parte de data local, ignorando hora/fuso
function diasEntreStrings(isoA, isoB) {
  const strA = (isoA || '').slice(0, 10);
  const strB = (isoB || '').slice(0, 10);
  const [ya, ma, da] = strA.split('-').map(Number);
  const [yb, mb, db] = strB.split('-').map(Number);
  const msA = new Date(ya, ma - 1, da).getTime();
  const msB = new Date(yb, mb - 1, db).getTime();
  return Math.round((msB - msA) / 86400000);
}

// Diferença em dias entre uma data ISO salva e hoje (local)
// Positivo = no passado, negativo = no futuro
function diasAtrasDeHoje(isoData) {
  const hojeStr = toLocalDateStr(new Date());
  return diasEntreStrings(isoData, hojeStr);
}

// ── Toast ────────────────────────────────────────
function showToast(msg, type) {
  type = type || 'success';
  const toast = document.getElementById('toast');
  if (!toast) return;
  const colors = { success: '#22c55e', error: '#ef4444', info: '#38bdf8' };
  toast.innerText = msg;
  toast.style.borderLeft = '6px solid ' + (colors[type] || colors.success);
  toast.style.display = 'block';
  setTimeout(function() { toast.style.display = 'none'; }, 2500);
}

// ── Google Maps ──────────────────────────────────
// Recebe um objeto rota { paradas: [{lat, lng, address}, ...] }
// Abre o Google Maps com a rota completa
function abrirNoMaps(rota) {
  if (!rota || !rota.paradas || rota.paradas.length < 2) {
    showToast('Rota sem paradas suficientes', 'info');
    return;
  }
  const paradas = rota.paradas;
  const origem  = paradas[0].lat + ',' + paradas[0].lng;
  const destino = paradas[paradas.length - 1].lat + ',' + paradas[paradas.length - 1].lng;
  const waypoints = paradas.slice(1, -1)
    .map(function(p) { return p.lat + ',' + p.lng; })
    .join('|');
  let url = 'https://www.google.com/maps/dir/?api=1'
    + '&origin=' + encodeURIComponent(origem)
    + '&destination=' + encodeURIComponent(destino)
    + '&travelmode=driving';
  if (waypoints) url += '&waypoints=' + encodeURIComponent(waypoints);
  window.open(url, '_blank');
}

// ── Badge de pendências da Agenda ────────────────
// Lê agendaApp e conta pendente/confirmado para hoje
// Injeta badge em todos os links da agenda na global nav
function atualizarBadgeAgenda() {
  try {
    const agData = JSON.parse(localStorage.getItem('agendaApp')) || {};
    const hoje   = toLocalDateStr(new Date());
    const n = (agData.agendamentos || []).filter(function(a) {
      return a.data === hoje && (a.status === 'pendente' || a.status === 'confirmado');
    }).length;

    document.querySelectorAll('a.gnav-item[href="agenda.html"]').forEach(function(el) {
      var old = el.querySelector('.gnav-badge');
      if (old) old.remove();
      if (n > 0) {
        var badge = document.createElement('span');
        badge.className = 'gnav-badge';
        badge.textContent = n > 9 ? '9+' : n;
        el.style.position = 'relative';
        el.appendChild(badge);
      }
    });
  } catch(e) {}
}

// ── Tema ─────────────────────────────────────────
function toggleTheme() {
  const c = document.documentElement.getAttribute('data-theme') || 'dark';
  const n = c === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', n);
  localStorage.setItem('kmTheme', n);
  const b = document.getElementById('theme-toggle');
  if (b) b.textContent = n === 'dark' ? '🌙' : '☀️';
}

// ── FAB ──────────────────────────────────────────
function toggleFab() {
  const o = document.getElementById('fab-options');
  const m = document.getElementById('fab-main');
  const b = document.getElementById('fab-backdrop');
  if (!o) return;
  const open = o.classList.toggle('visible');
  m.classList.toggle('open', open);
  b.classList.toggle('visible', open);
}
function closeFab() {
  var o = document.getElementById('fab-options');
  var m = document.getElementById('fab-main');
  var b = document.getElementById('fab-backdrop');
  if (o) o.classList.remove('visible');
  if (m) m.classList.remove('open');
  if (b) b.classList.remove('visible');
}