
'use strict';

/* Informações dos setores */
const dadosSetores = {
    nutricao: {
        titulo: 'Nutrição',
        descricao: 'O acompanhamento nutricional considera as necessidades alimentares e o bem-estar dos residentes.',
        pontos: [
            'Atenção às necessidades nutricionais individuais.',
            'Orientação para adequações alimentares.',
            'Integração com a rotina de refeições.'
        ]
    },

    cozinha: {
        titulo: 'Cozinha',
        descricao: 'A cozinha participa da preparação e da organização das refeições oferecidas no residencial.',
        pontos: [
            'Preparo e organização das refeições.',
            'Apoio às orientações nutricionais.',
            'Atenção à rotina alimentar dos residentes.'
        ]
    },

    cuidadoras: {
        titulo: 'Cuidadoras',
        descricao: 'As cuidadoras oferecem acompanhamento e apoio nas atividades do dia a dia, respeitando a individualidade dos residentes.',
        pontos: [
            'Apoio nas rotinas diárias.',
            'Atenção ao conforto e bem-estar.',
            'Acompanhamento humanizado.'
        ]
    },

    enfermagem: {
        titulo: 'Enfermagem',
        descricao: 'O residencial conta com acompanhamento de enfermagem presencial 24 horas.',
        pontos: [
            'Equipe de enfermagem em tempo integral.',
            'Acompanhamento dos cuidados diários.',
            'Atenção às necessidades de saúde dos residentes.'
        ]
    },

    administracao: {
        titulo: 'Administração',
        descricao: 'O setor administrativo contribui para a organização do residencial e para a comunicação institucional.',
        pontos: [
            'Organização de atividades administrativas.',
            'Informações institucionais.',
            'Apoio ao atendimento e à comunicação.'
        ]
    },

    fisioterapia: {
        titulo: 'Fisioterapia',
        descricao: 'A fisioterapia contribui para a mobilidade, a funcionalidade e o bem-estar físico dos residentes.',
        pontos: [
            'Atividades voltadas à mobilidade.',
            'Atenção à funcionalidade física.',
            'Acompanhamento conforme as necessidades individuais.'
        ]
    },

    lavanderia: {
        titulo: 'Lavanderia',
        descricao: 'O setor de lavanderia contribui para a higiene e a organização das roupas utilizadas no residencial.',
        pontos: [
            'Cuidados com a higienização das roupas.',
            'Organização das peças.',
            'Apoio à rotina de hotelaria.'
        ]
    },

    limpeza: {
        titulo: 'Limpeza',
        descricao: 'A limpeza contribui para manter os ambientes organizados, higienizados e agradáveis.',
        pontos: [
            'Higienização dos ambientes.',
            'Organização dos espaços.',
            'Conservação das áreas de convivência.'
        ]
    }
};

/* Atualiza o conteúdo do modal */
const modalSetor = document.querySelector('#modalSetor');

if (modalSetor) {
    modalSetor.addEventListener('show.bs.modal', event => {
        const chave = event.relatedTarget?.dataset.setor;
        const setor = dadosSetores[chave];

        if (!setor) {
            event.preventDefault();
            return;
        }

        const titulo = modalSetor.querySelector('#modalSetorTitulo');
        const descricao = modalSetor.querySelector('#modalSetorDescricao');
        const lista = modalSetor.querySelector('#modalSetorPontos');

        titulo.textContent = setor.titulo;
        descricao.textContent = setor.descricao;

        lista.replaceChildren();

        setor.pontos.forEach(ponto => {
            const item = document.createElement('li');
            item.textContent = ponto;
            lista.appendChild(item);
        });
    });
}
