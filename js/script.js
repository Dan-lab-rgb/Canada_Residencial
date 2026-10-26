'use strict';

const config = window.SITE_CONFIG;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Fotografias seguem o padrão img/foto1.jpg, img/foto2.jpg, etc. */
function fotos(el) {
  const inicio = Number(el.dataset.inicio) || 1;
  const quantidade = Number(el.dataset.qtd) || 5;

  return Array.from({ length: quantidade }, (_, i) => `img/foto${inicio + i}.jpg`);
}

function imagem(src, index) {
  const img = new Image();
  img.alt = `Ambientes do Canadá Residencial — foto ${index + 1}`;

  // Carrega antes da inserção; lazy em imagem fora do DOM pode impedir o carregamento.
  img.loading = 'eager';
  img.decoding = 'async';
  img.src = src;

  return img;
}

function placeholder(el) {
  el.classList.add('sem-foto');
  el.textContent = 'Canadá Residencial';

  const texto = document.createElement('small');
  texto.textContent = 'Um espaço para acolher e cuidar';
  el.appendChild(texto);
}

/* Carrosséis: teclado, toque, pausa e preferência por movimento reduzido. */
$$('.foto-carousel').forEach(c => {
  const lista = fotos(c);
  const track = document.createElement('div');
  track.className = 'track';

  c.setAttribute('role', 'region');
  c.setAttribute('aria-roledescription', 'carrossel');
  c.setAttribute('aria-label', `Fotos: ${$('h1, h2', c.parentElement)?.textContent || 'residencial'}`);
  c.tabIndex = 0;

  lista.forEach((src, i) => {
    const s = document.createElement('div');
    s.className = 'slide';
    s.setAttribute('role', 'group');
    s.setAttribute('aria-label', `Foto ${i + 1} de ${lista.length}`);

    placeholder(s);

    const img = imagem(src, i);
    img.onload = () => {
      s.classList.remove('sem-foto');
      s.replaceChildren(img);
    };

    track.appendChild(s);
  });

  function button(label, className, content) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = className;
    b.setAttribute('aria-label', label);
    b.innerHTML = content;
    return b;
  }

  const prev = button('Foto anterior', 'seta prev', '‹');
  const next = button('Próxima foto', 'seta next', '›');
  const pause = button('Pausar apresentação', 'carousel-pause', 'Ⅱ');
  const dots = document.createElement('div');
  dots.className = 'dots';

  let atual = 0;
  let timer;
  let paused = motion.matches;
  let hovering = false;

  function ir(i) {
    atual = (i + lista.length) % lista.length;
    track.style.transform = `translateX(-${atual * 100}%)`;

    [...track.children].forEach((s, k) => {
      s.setAttribute('aria-hidden', String(k !== atual));
    });

    $$('button', dots).forEach((b, k) => {
      b.classList.toggle('on', k === atual);
      b.setAttribute('aria-current', String(k === atual));
    });
  }

  function reiniciar() {
    clearInterval(timer);

    if (!paused && !motion.matches && !hovering && !c.contains(document.activeElement) && !document.hidden) {
      timer = setInterval(() => ir(atual + 1), Number(c.dataset.auto) || 6000);
    }
  }

  lista.forEach((_, i) => {
    const b = button(`Mostrar foto ${i + 1}`, '', '');
    b.onclick = () => {
      ir(i);
      reiniciar();
    };

    dots.appendChild(b);
  });

  prev.onclick = () => {
    ir(atual - 1);
    reiniciar();
  };

  next.onclick = () => {
    ir(atual + 1);
    reiniciar();
  };

  function pauseLabel() {
    pause.textContent = paused ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-label', paused ? 'Reproduzir apresentação' : 'Pausar apresentação');
  }

  pause.onclick = () => {
    paused = !paused;
    pauseLabel();
    reiniciar();
  };

  c.append(track, prev, next, dots, pause);

  c.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      ir(atual + (e.key === 'ArrowRight' ? 1 : -1));
      reiniciar();
    }
  });

  let start;

  c.addEventListener('touchstart', e => {
    start = [e.touches[0].clientX, e.touches[0].clientY];
  }, { passive: true });

  c.addEventListener('touchend', e => {
    if (!start) return;

    const dx = e.changedTouches[0].clientX - start[0];
    const dy = e.changedTouches[0].clientY - start[1];

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      ir(atual + (dx < 0 ? 1 : -1));
      reiniciar();
    }

    start = null;
  });

  c.addEventListener('touchcancel', () => {
    start = null;
  });

  c.addEventListener('mouseenter', () => {
    hovering = true;
    reiniciar();
  });

  c.addEventListener('mouseleave', () => {
    hovering = false;
    reiniciar();
  });

  c.addEventListener('focusin', reiniciar);
  c.addEventListener('focusout', () => setTimeout(reiniciar, 0));
  document.addEventListener('visibilitychange', reiniciar);

  motion.addEventListener('change', () => {
    paused = motion.matches;
    pauseLabel();
    reiniciar();
  });

  ir(0);
  pauseLabel();
  reiniciar();
});

/* Galeria com diálogo nativo, foco preservado e navegação por teclado. */
$$('.galeria').forEach(g => {
  const lista = fotos(g);
  const dialog = document.createElement('dialog');
  dialog.className = 'lb';
  dialog.setAttribute('aria-label', 'Galeria de fotos do residencial');
  dialog.innerHTML = '<button type="button" class="lb-close" aria-label="Fechar galeria">×</button><button type="button" class="lb-prev" aria-label="Foto anterior">‹</button><img alt=""><button type="button" class="lb-next" aria-label="Próxima foto">›</button><p class="lb-counter" aria-live="polite"></p>';
  document.body.appendChild(dialog);

  let atual = 0;

  function mostrar(i) {
    atual = (i + lista.length) % lista.length;
    $('img', dialog).src = lista[atual];
    $('img', dialog).alt = `Ambientes do residencial — foto ${atual + 1}`;
    $('.lb-counter', dialog).textContent = `${atual + 1} / ${lista.length}`;
  }

  $('.lb-close', dialog).onclick = () => dialog.close();
  $('.lb-prev', dialog).onclick = () => mostrar(atual - 1);
  $('.lb-next', dialog).onclick = () => mostrar(atual + 1);

  dialog.addEventListener('click', e => {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      mostrar(atual + (e.key === 'ArrowRight' ? 1 : -1));
    }
  });

  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));

  lista.forEach((src, i) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'item';
    item.setAttribute('aria-label', `Ampliar foto ${i + 1}`);
    item.disabled = true;

    placeholder(item);

    const img = imagem(src, i);
    img.onload = () => {
      item.classList.remove('sem-foto');
      item.replaceChildren(img);
      item.disabled = false;
    };

    item.onclick = () => {
      mostrar(i);
      dialog.showModal();
      document.body.classList.add('modal-open');
    };

    g.appendChild(item);
  });
});

/* Menu e indicação da seção atual. */
const menu = $('#menu');
const toggle = $('.menu-btn');

function fecharMenu() {
  menu.classList.remove('aberto');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
}

toggle.onclick = () => {
  const aberto = menu.classList.toggle('aberto');
  toggle.setAttribute('aria-expanded', String(aberto));
  toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
};

$$('#menu a').forEach(a => a.addEventListener('click', fecharMenu));

document.addEventListener('click', e => {
  if (!e.target.closest('.topo')) fecharMenu();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu.classList.contains('aberto')) {
    fecharMenu();
    toggle.focus();
  }
});

window.matchMedia('(min-width: 1101px)').addEventListener('change', fecharMenu);

/* Scroll Spy: considera apenas as seções do menu e o final da página. */
const links = $$('#menu a[href^="#"]');
const sections = links
  .map(l => document.getElementById(l.hash.slice(1)))
  .filter(Boolean);
let scheduled = false;

function atualizarSecao() {
  scheduled = false;

  // Detecta a seção na região central da tela, sem depender de um valor fixo.
  const limite = Math.max(150, window.innerHeight * 0.45);
  let atual = sections[0];

  sections.forEach(s => {
    if (s.getBoundingClientRect().top <= limite) atual = s;
  });

  // A última seção pode não alcançar o limite antes do fim da rolagem.
  const fimDaPagina = window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 4;

  if (fimDaPagina) atual = sections[sections.length - 1];

  links.forEach(l => {
    const active = l.hash === '#' + atual.id;
    l.classList.toggle('ativo', active);

    if (active) l.setAttribute('aria-current', 'location');
    else l.removeAttribute('aria-current');
  });
}

window.addEventListener('scroll', () => {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(atualizarSecao);
  }
}, { passive: true });

window.addEventListener('resize', atualizarSecao);
window.addEventListener('hashchange', atualizarSecao);

atualizarSecao();

if ('IntersectionObserver' in window && !motion.matches) {
  const observer = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      observer.unobserve(e.target);
    }
  }), { threshold: .08 });

  $$('.sec .container').forEach(el => {
    el.classList.add('rev');
    observer.observe(el);
  });
}

/* Um único destino para mapa, rota e endereço. Sem coordenadas inventadas. */
const coordenadas = Number.isFinite(config.latitude) &&
  Number.isFinite(config.longitude) &&
  Math.abs(config.latitude) <= 90 &&
  Math.abs(config.longitude) <= 180;

const destino = coordenadas ? `${config.latitude},${config.longitude}` : config.endereco;

$('#contact-address').textContent = config.endereco;
$('#location-map').src = `https://www.google.com/maps?q=${encodeURIComponent(destino)}&z=18&output=embed`;
$('#map-open').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destino)}`;
$('#map-directions').href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`;
$('#year').textContent = new Date().getFullYear();

const whatsapp = config.whatsapp.replace(/\D/g, '');
const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email);

if (config.telefone) {
  $('[data-contact="telefone"]').hidden = false;
  $('#contact-phone').textContent = config.telefone;
  $('#contact-phone').href = `tel:${config.telefone.replace(/[^+\d]/g, '')}`;
}

if (emailValido) {
  $('[data-contact="email"]').hidden = false;
  $('#contact-email').textContent = config.email;
  $('#contact-email').href = `mailto:${config.email}`;
}

$$('[data-social]').forEach(a => {
  const value = a.dataset.social === 'whatsapp'
    ? (whatsapp ? `https://wa.me/${whatsapp}` : '')
    : config[a.dataset.social];

  if (value && /^https:\/\//.test(value)) {
    a.href = value;
    a.hidden = false;
  }
});

/* Não informa envio sem envio real. Nenhum dado é descartado após preparar. */
const form = $('#form');

$('#form-submit').firstChild.textContent = whatsapp
  ? 'Preparar WhatsApp '
  : emailValido ? 'Preparar e-mail ' : 'Preparar mensagem ';

form.addEventListener('submit', e => {
  e.preventDefault();

  const nome = form.elements.nome;
  const telefone = form.elements.tel;

  nome.setCustomValidity(nome.value.trim().length >= 2 ? '' : 'Informe seu nome.');
  telefone.setCustomValidity(/^(?:55)?\d{10,11}$/.test(telefone.value.replace(/\D/g, ''))
    ? ''
    : 'Informe um telefone com DDD, com 10 ou 11 dígitos.');

  if (!form.reportValidity()) return;

  const texto = `Olá! Gostaria de informações sobre o ${config.nome}.\nNome: ${nome.value.trim()}\nTelefone: ${telefone.value.trim()}\n${form.elements.msg.value.trim()}`;
  const enviar = $('#form-send');
  const preview = $('#message-preview');

  preview.value = texto;
  preview.hidden = false;

  if (whatsapp || emailValido) {
    enviar.href = whatsapp
      ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`
      : `mailto:${config.email}?subject=${encodeURIComponent('Informações e visita ao residencial')}&body=${encodeURIComponent(texto)}`;

    enviar.textContent = whatsapp ? 'Continuar no WhatsApp ↗' : 'Abrir aplicativo de e-mail ↗';
    enviar.hidden = false;
    $('#form-status').textContent = 'Mensagem preparada. Continue pelo botão abaixo e confirme o envio no aplicativo.';
  } else {
    enviar.hidden = true;
    $('#form-status').textContent = 'O canal de contato ainda não está disponível. Você pode copiar a mensagem abaixo. Nenhuma mensagem foi enviada.';
  }
});

$$('input', form).forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));

form.addEventListener('input', () => {
  $('#form-send').hidden = true;
  $('#message-preview').hidden = true;
  $('#form-status').textContent = '';
});
