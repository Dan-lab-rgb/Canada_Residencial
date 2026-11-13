'use strict';

const config = window.SITE_CONFIG;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');


/* Fotografias organizadas por seção */
const colecoesFotos = {
  sobre: [
    'img/institucional/recepcao.webp',
    'img/institucional/sala-acolhimento.webp',
    'img/ambientes/poltronas-decoradas.webp'
  ],

  cuidados: [
    'img/ambientes/cantinho-poltronas.webp',
    'img/ambientes/sala-convivencia-ampla.webp',
    'img/ambientes/espaco-refeicoes.webp'
  ],

  estrutura: [
    'img/ambientes/terraco.webp',
    'img/ambientes/area-externa-coberta.webp',
    'img/ambientes/sala-televisao.webp',
    'img/ambientes/espaco-refeicoes.webp'
  ],

  galeria: [
    'img/institucional/recepcao.webp',
    'img/ambientes/sala-convivencia-ampla.webp',
    'img/ambientes/terraco.webp',
    'img/ambientes/area-externa-coberta.webp',
    'img/ambientes/espaco-refeicoes.webp',
    'img/ambientes/sala-televisao.webp',
    'img/ambientes/cantinho-poltronas.webp',
    'img/ambientes/ambiente-rosa.webp',
    'img/ambientes/aparador-azul.webp'
  ]
};

/* Seleciona as fotografias da seção correspondente */
function fotos(el) {
  const grupo = el.dataset.fotos;

  if (grupo && colecoesFotos[grupo]) {
    return colecoesFotos[grupo];
  }

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

  /* Identificação das fotografias */
  const nomes = [
    'Recepção',
    'Sala de convivência',
    'Terraço',
    'Área externa coberta',
    'Espaço de refeições',
    'Cantinho de descanso',
    'Vivência natural',
    'Ambiente decorado',
    'Detalhes do residencial'
  ];

  const dialog = document.createElement('dialog');
  dialog.className = 'lb';
  dialog.setAttribute('aria-label', 'Galeria de fotos do residencial');

  dialog.innerHTML = `
    <button type="button" class="lb-close" aria-label="Fechar galeria">×</button>
    <button type="button" class="lb-prev" aria-label="Foto anterior">‹</button>

    <img alt="">

    <button type="button" class="lb-next" aria-label="Próxima foto">›</button>

    <div class="lb-info">
      <span class="lb-titulo"></span>
      <span class="lb-counter" aria-live="polite"></span>
    </div>
  `;

  document.body.appendChild(dialog);

  let atual = 0;

  function mostrar(i) {
    atual = (i + lista.length) % lista.length;

    const nome = nomes[atual] || `Ambiente ${atual + 1}`;
    const foto = $('img', dialog);

    foto.src = lista[atual];
    foto.alt = nome;

    $('.lb-titulo', dialog).textContent = nome;
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

  /* Navegação por deslize em dispositivos móveis */
  const fotoAmpliada = $('img', dialog);

  let toqueInicioX = 0;
  let toqueInicioY = 0;

  fotoAmpliada.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;

    toqueInicioX = e.touches[0].clientX;
    toqueInicioY = e.touches[0].clientY;
  }, { passive: true });

  fotoAmpliada.addEventListener('touchend', e => {
    if (e.changedTouches.length !== 1) return;

    const diferencaX = e.changedTouches[0].clientX - toqueInicioX;
    const diferencaY = e.changedTouches[0].clientY - toqueInicioY;

    if (Math.abs(diferencaX) > 60 &&
      Math.abs(diferencaX) > Math.abs(diferencaY) * 1.3) {

      mostrar(atual + (diferencaX < 0 ? 1 : -1));
    }
  }, { passive: true });

  /* Construção dos cards da galeria */
  lista.forEach((src, i) => {
    const item = document.createElement('button');
    const nome = nomes[i] || `Ambiente ${i + 1}`;

    item.type = 'button';
    item.className = 'item';
    item.setAttribute('aria-label', `Ampliar fotografia: ${nome}`);
    item.disabled = true;

    placeholder(item);

    /* Fotografia */
    const img = imagem(src, i);
    img.alt = nome;

    /* Legenda */
    const legenda = document.createElement('span');
    legenda.className = 'galeria-legenda';
    legenda.textContent = nome;

    /* Ícone de ampliação */
    const zoom = document.createElement('span');
    zoom.className = 'galeria-zoom';
    zoom.setAttribute('aria-hidden', 'true');
    zoom.innerHTML = '<i class="fa-solid fa-expand"></i>';

    img.onload = () => {
      item.classList.remove('sem-foto');
      item.replaceChildren(img, legenda, zoom);
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

/* Agendamento de visitas pelo WhatsApp */
const mensagemVisita =
  `Olá! Gostaria de obter informações para agendar uma visita ao ${config.nome}, em Sertãozinho.`;

$$('[data-agendar="whatsapp"]').forEach(link => {
  if (!whatsapp) return;

  link.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagemVisita)}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

/* =====  ENVIO DO FORMULÁRIO PELO FORMSPREE ===== */

const form = $('#form');
const botaoEnviar = $('#form-submit');
const statusEnvio = $('#form-status');
const conteudoOriginalBotao = botaoEnviar.innerHTML;

/* Atualiza a mensagem e o estado visual do envio */
function mostrarStatus(mensagem, tipo = '') {
  statusEnvio.textContent = mensagem;

  statusEnvio.classList.remove(
    'status-enviando',
    'status-sucesso',
    'status-erro'
  );

  if (tipo) {
    statusEnvio.classList.add(`status-${tipo}`);
  }
}

/* Exibe ou remove os avisos de validação */
function mostrarErro(campo, mensagem) {
  const aviso = $(`#erro-${campo.id}`);

  aviso.textContent = mensagem;
  aviso.hidden = !mensagem;

  campo.classList.toggle('campo-invalido', Boolean(mensagem));

  if (mensagem) {
    campo.setAttribute('aria-invalid', 'true');
  } else {
    campo.removeAttribute('aria-invalid');
  }
}

/* Verifica os dados antes do envio */
function validarFormulario() {
  const nome = form.elements.nome;
  const telefone = form.elements.tel;
  const mensagem = form.elements.msg;

  const numeros = telefone.value.replace(/\D/g, '');

  const regras = [
    {
      campo: nome,
      erro: !nome.value.trim()
        ? 'Por favor, informe seu nome.'
        : nome.value.trim().length < 2
          ? 'O nome precisa ter pelo menos 2 caracteres.'
          : ''
    },
    {
      campo: telefone,
      erro: !telefone.value.trim()
        ? 'Por favor, informe seu telefone.'
        : !/^(?:55)?\d{10,11}$/.test(numeros)
          ? 'Informe um telefone válido com DDD.'
          : ''
    },
    {
      campo: mensagem,
      erro: !mensagem.value.trim()
        ? 'Por favor, escreva sua mensagem.'
        : ''
    }
  ];

  let primeiroErro = null;

  regras.forEach(({ campo, erro }) => {
    mostrarErro(campo, erro);

    if (erro && !primeiroErro) {
      primeiroErro = campo;
    }
  });

  if (primeiroErro) {
    primeiroErro.focus();
    return false;
  }

  return true;
}

/* Envio real das informações */
form.addEventListener('submit', async e => {
  e.preventDefault();

  const nome = form.elements.nome;
  const telefone = form.elements.tel;

  /* Validação dos campos */
  if (!validarFormulario()) return;

  /* Organiza os dados para o envio */
  const dados = new FormData(form);

  dados.set('nome', nome.value.trim());
  dados.set('tel', telefone.value.trim());
  dados.set('msg', form.elements.msg.value.trim());

  /* Desativa o botão durante o envio */
  botaoEnviar.disabled = true;
  botaoEnviar.textContent = 'Enviando...';

  mostrarStatus('Enviando sua mensagem...', 'enviando');

  try {
    /* Envia os dados ao Formspree */
    const resposta = await fetch(form.action, {
      method: 'POST',
      body: dados,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (resposta.ok) {
      /* Formspree confirmou o recebimento */
      mostrarStatus(
        'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        'sucesso'
      );

      form.reset();

    } else if (resposta.status === 429) {
      mostrarStatus(
        'Muitas tentativas de envio. Aguarde e tente novamente.',
        'erro'
      );

    } else {
      mostrarStatus(
        'Não foi possível enviar a mensagem. Tente novamente.',
        'erro'
      );
    }

  } catch (erro) {
    /* Problema de conexão */
    mostrarStatus(
      'Erro de conexão. Verifique sua internet e tente novamente.',
      'erro'
    );

  } finally {
    /* Restaura o botão */
    botaoEnviar.disabled = false;
    botaoEnviar.innerHTML = conteudoOriginalBotao;
  }
});

/* Remove avisos ao corrigir os campos */
form.addEventListener('input', e => {
  if (e.target.matches('input, textarea')) {
    mostrarErro(e.target, '');
  }

  mostrarStatus('');
});

