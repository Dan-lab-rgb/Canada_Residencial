# 🍁 ConectaSênior — Canadá Residencial Sênior

<p align="center">
  <img src="https://img.shields.io/badge/Projeto-Extens%C3%A3o-B30F1B?style=for-the-badge" alt="Projeto de extensão"/>
  <img src="https://img.shields.io/badge/Vers%C3%A3o-V2-8F0A14?style=for-the-badge" alt="Versão 2"/>
  <img src="https://img.shields.io/badge/Status-Em%20desenvolvimento-22C55E?style=for-the-badge" alt="Em desenvolvimento"/>
  <img src="https://img.shields.io/badge/SENAI-ADS-166534?style=for-the-badge" alt="SENAI ADS"/>
</p>

<p align="center">
  <strong>Uma experiência digital dedicada ao cuidado, ao acolhimento e à qualidade de vida.</strong>
</p>

<p align="center">
  Site institucional desenvolvido para apresentar o Canadá Residencial Sênior, em Sertãozinho (SP),
  de forma acessível, moderna e acolhedora para residentes, familiares e visitantes.
</p>

---

## Sobre o projeto

O **ConectaSênior** é um projeto de extensão acadêmica do curso de **Análise e Desenvolvimento de Sistemas do SENAI**, voltado ao desenvolvimento de uma presença digital para o **Canadá Residencial Sênior — Unidade Sertãozinho**, integrante do Grupo Canadá Saúde.

A proposta é reunir em um único ambiente informações sobre a instituição, os cuidados oferecidos, a estrutura, as atividades de convivência e os canais de contato. O projeto busca unir uma apresentação institucional confiável à sensação de proximidade e acolhimento que faz parte da proposta do residencial.

A **V2** dá continuidade ao protótipo inicial, com melhorias visuais, organização dos conteúdos, navegação responsiva e recursos interativos.

## Objetivos

- Apresentar a instituição e seus serviços de maneira clara e organizada.
- Facilitar o acesso de familiares às informações sobre cuidados, estrutura e atividades.
- Valorizar a socialização, o bem-estar e a autonomia dos residentes.
- Destacar diferenciais, como as visitas com animais de estimação e os cuidados de beleza.
- Disponibilizar uma programação de eventos simples de consultar.
- Facilitar o contato com a instituição e a solicitação de informações sobre visitas.
- Aplicar conhecimentos de desenvolvimento web, responsividade e experiência do usuário em um projeto real.

## Funcionalidades e seções

| Área | Descrição |
|---|---|
| **Início** | Apresentação do residencial e acesso rápido às principais informações. |
| **Sobre nós** | Proposta de acolhimento, segurança e qualidade de vida. |
| **Cuidados e serviços** | Informações sobre enfermagem, fisioterapia, nutrição, terapia ocupacional e outros setores. |
| **Estrutura e equipe** | Apresentação dos ambientes e das áreas responsáveis pelo atendimento. |
| **Vivências** | Atividades de socialização, criatividade, movimento e estímulo cognitivo. |
| **Pet Friendly** | Destaque para as visitas acompanhadas por animais de estimação. |
| **Beleza e autoestima** | Apresentação dos cuidados com os cabelos e serviços de manicure. |
| **Galeria** | Área reservada às fotografias autorizadas dos ambientes e atividades. |
| **Eventos** | Calendário navegável por mês e listagem das próximas atividades cadastradas. |
| **Contato** | Informações de localização, mapa e formulário para preparar uma mensagem. |

## Tecnologias utilizadas

<p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?style=flat-square&logo=bootstrap&logoColor=white" alt="Bootstrap 5.3.8"/>
  <img src="https://img.shields.io/badge/Font_Awesome-528DD7?style=flat-square&logo=fontawesome&logoColor=white" alt="Font Awesome"/>
</p>

- **HTML5:** estrutura semântica e organização do conteúdo.
- **CSS3:** identidade visual, animações e personalização dos componentes.
- **Bootstrap 5:** grid responsivo e recursos de interface.
- **JavaScript:** menu, Scroll Spy, carrosséis, calendário e formulário de contato.
- **Font Awesome e Google Fonts:** ícones e tipografia.

O site é desenvolvido com tecnologias front-end, sem necessidade de banco de dados ou framework JavaScript adicional nesta versão.

## Layout e experiência

A identidade visual utiliza tons de vermelho associados à marca, combinados com fundos claros e elementos arredondados. A proposta é criar uma interface **profissional, acessível e acolhedora**, sem perder a personalidade do residencial.

Entre os recursos da V2 estão a navegação por âncoras com **Scroll Spy**, layouts adaptáveis a celular, tablet e computador, carrosséis e um calendário interativo de eventos.

## Organização do projeto

```text
site-v2/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   ├── script.js
│   └── eventos.js
└── README.md
```

As fotografias oficiais serão adicionadas à pasta `img/` quando estiverem disponíveis e autorizadas.

O projeto pode ser visualizado localmente abrindo o `index.html` com o **Live Server** do VS Code ou outro servidor estático. O Bootstrap, os ícones e as fontes são carregados por serviços externos.

## Evolução do projeto

| Versão | Etapa |
|---|---|
| **V1** | Estrutura inicial e apresentação das primeiras seções do site. |
| **V2 — atual** | Reformulação visual, Bootstrap, seções de diferenciais, calendário, responsividade e melhorias de navegação. |
| **V3 — planejada** | Fotografias oficiais, refinamento visual, organização da equipe e apresentação mais detalhada dos setores. |
| **V4 — possibilidade futura** | Páginas complementares e aprimoramentos de conteúdo e funcionalidades conforme as necessidades da instituição. |

As próximas versões são propostas de evolução e ainda não representam funcionalidades implementadas.

## Conteúdo institucional

Os dados de contato ficam centralizados em `js/config.js`, enquanto os eventos são cadastrados em `js/eventos.js`.

O calendário não contém eventos fictícios. As fotografias oficiais ainda estão pendentes, e a publicação de imagens, informações e contatos depende da confirmação ou autorização da instituição. O formulário **prepara uma mensagem** para o canal disponível; o envio é confirmado pelo visitante no aplicativo correspondente.

## Equipe e créditos

Projeto desenvolvido por estudantes de **Análise e Desenvolvimento de Sistemas do SENAI**, como parte das atividades de extensão acadêmica do **ConectaSênior**.

**Instituição atendida:** Canadá Residencial Sênior — Sertãozinho (SP)  
**Grupo:** Canadá Saúde  
**Área:** Desenvolvimento Web / Projeto de Extensão  
**Ano:** 2026

## Referências

- [Canadá Saúde — Unidade Sertãozinho](https://canadasaudestz.com.br/)
- [Grupo Canadá Saúde](https://grupocanadasaude.com.br/)
- [Bootstrap — Documentação oficial](https://getbootstrap.com/docs/5.3/)
- [MDN Web Docs — HTML, CSS e JavaScript](https://developer.mozilla.org/pt-BR/)

---

<p align="center">
  Desenvolvido para unir tecnologia, informação e acolhimento.
  <br/>
  <strong>ConectaSênior — Tecnologia a serviço de quem cuida.</strong>
</p>
