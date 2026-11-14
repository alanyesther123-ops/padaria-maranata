/* Menu do celular */
const menuBtn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  menuBtn.setAttribute('aria-expanded', aberto);
});
menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('aberto');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

/* Aberta agora / fechada agora (horário de Brasília) */
const horarios = {
  // dia: 0 = domingo ... 6 = sábado
  paulinia: () => ({ abre: 5, fecha: 22 }),
  sumare: (dia) => (dia >= 1 && dia <= 5 ? { abre: 5, fecha: 19 } : { abre: 5, fecha: 12 })
};

function agoraEmBrasilia() {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', hourCycle: 'h23'
  }).formatToParts(new Date());
  const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const dia = dias[partes.find((p) => p.type === 'weekday').value];
  const hora = Number(partes.find((p) => p.type === 'hour').value);
  return { dia, hora };
}

function atualizarStatus() {
  const { dia, hora } = agoraEmBrasilia();
  document.querySelectorAll('.unidade').forEach((card) => {
    const regra = horarios[card.dataset.unidade](dia);
    const status = card.querySelector('[data-status]');
    const aberta = hora >= regra.abre && hora < regra.fecha;
    status.textContent = aberta ? `Aberta agora, fecha às ${regra.fecha}h` : 'Fechada agora';
    status.classList.toggle('aberta', aberta);
    status.classList.toggle('fechada', !aberta);
  });
}
atualizarStatus();
setInterval(atualizarStatus, 60000);

/* Galeria: mostra a foto se o arquivo existir; senão mantém o espaço reservado */
document.querySelectorAll('.galeria figure').forEach((fig) => {
  const img = fig.querySelector('img');
  const marcar = () => fig.classList.add('tem-foto');
  if (img.complete && img.naturalWidth > 0) marcar();
  img.addEventListener('load', marcar);
});

/* Botão flutuante de WhatsApp */
const zapBtn = document.getElementById('zap-btn');
const zapMenu = document.getElementById('zap-menu');

function fecharZap() {
  zapMenu.hidden = true;
  zapBtn.setAttribute('aria-expanded', 'false');
}
zapBtn.addEventListener('click', () => {
  const abrir = zapMenu.hidden;
  zapMenu.hidden = !abrir;
  zapBtn.setAttribute('aria-expanded', abrir);
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.zap-flutuante')) fecharZap();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharZap();
});

/* Ano no rodapé */
document.getElementById('ano').textContent = new Date().getFullYear();
