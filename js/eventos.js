"use strict";

/* Eventos cadastrados pela instituição */
const eventos = [
  // Exemplo de cadastro:
  // {
  //   data: "2026-11-15",
  //   titulo: "Nome do evento",
  //   horario: "14h",
  //   descricao: "Descrição da atividade"
  // }
];

const grade = document.querySelector("#grade-calendario");
const tituloMes = document.querySelector("#mes-atual");
const proximos = document.querySelector("#proximos-eventos");
const detalhes = document.querySelector("#detalhes-dia");

let mesExibido = new Date();
mesExibido.setDate(1);

/* Criação dos elementos */
function criar(tag, classe, texto) {
  const elemento = document.createElement(tag);

  if (classe) elemento.className = classe;
  if (texto) elemento.textContent = texto;

  return elemento;
}

/* Converte a data para exibição */
function formatarData(data) {
  const [ano, mes, dia] = data.split("-").map(Number);

  return new Date(ano, mes - 1, dia)
    .toLocaleDateString("pt-BR");
}

/* Exibe as atividades de um dia */
function mostrarDia(lista) {
  detalhes.replaceChildren();

  lista.forEach(evento => {
    const item = criar("div", "agenda-evento");

    item.appendChild(criar("strong", "", evento.titulo));

    const informacoes = [
      formatarData(evento.data),
      evento.horario,
      evento.descricao
    ].filter(Boolean).join(" • ");

    item.appendChild(criar("p", "", informacoes));
    detalhes.appendChild(item);
  });
}

/* Monta os dias do mês */
function renderizarCalendario() {
  const ano = mesExibido.getFullYear();
  const mes = mesExibido.getMonth();


  const nomeMes = mesExibido.toLocaleDateString(
    "pt-BR",
    { month: "long", year: "numeric" }
  );

  tituloMes.textContent =
    nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

  grade.replaceChildren();
  detalhes.replaceChildren();

  const semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  semana.forEach(dia => {
    grade.appendChild(criar("span", "dia-semana", dia));
  });

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const hoje = new Date();

  for (let i = 0; i < primeiroDia; i++) {
    grade.appendChild(criar("span", "dia-vazio"));
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    const data = [
      ano,
      String(mes + 1).padStart(2, "0"),
      String(dia).padStart(2, "0")
    ].join("-");

    const lista = eventos.filter(evento => evento.data === data);

    const ehHoje =
      ano === hoje.getFullYear() &&
      mes === hoje.getMonth() &&
      dia === hoje.getDate();

    if (lista.length > 0) {
      const botao = criar("button", "dia-calendario tem-evento", String(dia));

      if (ehHoje) {
        botao.classList.add("hoje");
        botao.setAttribute("aria-current", "date");
      }

      botao.type = "button";
      const descricao = lista.length === 1 ? "evento" : "eventos";
      botao.setAttribute("aria-label", `${dia}: ${lista.length} ${descricao}`);

      botao.addEventListener("click", () => mostrarDia(lista));

      grade.appendChild(botao);
    } else {
      const celula = criar("span", "dia-calendario", String(dia));

      if (ehHoje) {
        celula.classList.add("hoje");
        celula.setAttribute("aria-current", "date");
      }

      grade.appendChild(celula);
    }
  }

  if (!eventos.some(evento =>
    evento.data.startsWith(
      `${ano}-${String(mes + 1).padStart(2, "0")}-`
    )
  )) {
    detalhes.textContent = "Nenhum evento cadastrado neste mês.";
  }
}

/* Exibe os próximos três eventos */
function renderizarProximos() {
  proximos.replaceChildren();

  const hoje = new Date();

  const dataHoje = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0")
  ].join("-");

  const lista = eventos
    .filter(evento => evento.data >= dataHoje)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 3);


  if (lista.length === 0) {
    /* Estado visual sem eventos confirmados */
    const vazio = criar("div", "agenda-vazia");

    const icone = criar("i", "fa-regular fa-calendar-days");
    icone.setAttribute("aria-hidden", "true");

    vazio.appendChild(icone);

    vazio.appendChild(
      criar("h4", "", "Novas datas em breve")
    );

    vazio.appendChild(
      criar("p", "",
        "A programação será divulgada assim que os próximos eventos forem confirmados.")
    );

    const link = criar(
      "a",
      "agenda-vazia-link",
      "Tire suas dúvidas"
    );

    link.href = "#contato";

    vazio.appendChild(link);
    proximos.appendChild(vazio);

    return;
  }


  lista.forEach(evento => {
    const card = criar("article", "proximo-evento");

    card.appendChild(criar("strong", "", formatarData(evento.data)));
    card.appendChild(criar("h4", "", evento.titulo));

    const texto = [evento.horario, evento.descricao]
      .filter(Boolean).join(" • ");

    card.appendChild(criar("p", "", texto));
    proximos.appendChild(card);
  });
}

/* Navegação entre os meses */
document.querySelector("#mes-anterior")
  .addEventListener("click", () => {
    mesExibido.setMonth(mesExibido.getMonth() - 1);
    renderizarCalendario();
  });

document.querySelector("#mes-proximo")
  .addEventListener("click", () => {
    mesExibido.setMonth(mesExibido.getMonth() + 1);
    renderizarCalendario();
  });

renderizarCalendario();
renderizarProximos();

