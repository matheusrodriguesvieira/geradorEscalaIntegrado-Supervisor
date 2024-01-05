var DADOS_USUARIO;
var turma;

var equipamentos;
var operadoresDaTurma;
var listaEscalaDaTurma;
// -----------------------------VARIÁVEIS DE BANCO DE DADOS-----------------------------
// USADA PARA GUARDAR OS EQUIPAMENTOS DISPONÍVEIS DO BANCO DE DADOS;
var equipamentosDisponiveis;
var equipamentosIndisponiveis;

// USADA PARA GUARDAR OS OPERADORES DISPONÍVEIS DO BANCO DE DADOS;
var operadoresDisponiveis;

// USADA PARA GUARDAR A ESCALA FINAL;
var escala;

// USADA PARA GUARDAR TODAS AS ESCALAS
var listaEscalas = [];
// ---------------------------------------------------------------------------------------


// -----------------------------VARIÁVEIS DE EVENTOS-----------------------------
var btnVoltarConfiguracao = document.querySelector('[voltar]');
var btnMostrarConfiguracao = document.querySelector('[configuracao]');
var btnMostrarTela2 = document.querySelector('[novaEscala]');


var telaConfiguracao = document.querySelector('.bodyConfiguracoesContainer');
var tituloEscalas = document.querySelector('[tituloEscalas]');

// var tela2 = document.querySelector('.bodyEscalaContainer');
var btnTela2Voltar = document.querySelector('[tela2Voltar]');


let select = document.querySelector('[name = selectTurmas]');


var ulListaEscalas = document.querySelector('.listaContainer > ul');


// ---------------------------------------------------------------------------------------

// FUNÇÕES DO BANCO DE DADOS
// ---------------------------------------------------------------------------------------
async function fetchData() {
    // URL da API que você deseja consultar
    const equipamentosUrl = `https://backend-gerador-integrado.vercel.app/equipamentos/index?login=${DADOS_USUARIO.matricula}&&gerencia=${DADOS_USUARIO.gerencia}`;
    const operadoresUrl = `https://backend-gerador-integrado.vercel.app/operadores/index?login=${DADOS_USUARIO.matricula}&&turma=${turma}&&gerencia=${DADOS_USUARIO.gerencia}`;
    const listaEscalaUrl = `https://backend-gerador-integrado.vercel.app/listaEscalas/index?login=${DADOS_USUARIO.matricula}&&turma=${turma}&&gerencia=${DADOS_USUARIO.gerencia}`;


    await fetch(equipamentosUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': DADOS_USUARIO.token
        },
    })
        .then(response => {
            // Verifica se a requisição foi bem-sucedida (status 200-299)
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            // Converte a resposta para JSON
            return response.json();
        })
        .then(dados => {
            // Trabalha com os dados recebidos

            if (dados.error) {
                Toastify({
                    text: dados.message,
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "rgba(192, 57, 43,1.0)",
                    }
                }).showToast();
                setTimeout(() => {
                    window.location.replace('../login/index.html');
                }, 3000);
            } else {
                equipamentos = dados;

            }


        })
        .catch(error => {
            // Lida com erros durante a requisição
            console.error(error);
            console.error('Erro na requisição:', error);
            console.error('Resposta do servidor:', error.response);
        });


    await fetch(operadoresUrl, {
        method: 'GET',
        headers: {
            authorization: DADOS_USUARIO.token
        },
    })
        .then(response => {
            // Verifica se a requisição foi bem-sucedida (status 200-299)
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            // Converte a resposta para JSON
            return response.json();
        })
        .then(dados => {

            if (dados.error) {
                Toastify({
                    text: dados.message,
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "rgba(192, 57, 43,1.0)",
                    }
                }).showToast();
                setTimeout(() => {
                    window.location.replace('../login/index.html');
                }, 3000);
            } else {
                operadoresDaTurma = dados;
            }


        })
        .catch(error => {
            // Lida com erros durante a requisição
            console.error(error);
        });

    await fetch(listaEscalaUrl, {
        method: 'GET',
        headers: {
            authorization: DADOS_USUARIO.token
        },
    })
        .then(response => {
            // Verifica se a requisição foi bem-sucedida (status 200-299)
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            // Converte a resposta para JSON
            return response.json();
        })
        .then(dados => {
            // Trabalha com os dados recebidos
            if (dados.error) {
                Toastify({
                    text: dados.message,
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "rgba(192, 57, 43,1.0)",
                    }
                }).showToast();
                setTimeout(() => {
                    window.location.replace('../login/index.html');
                }, 3000);
            } else {
                listaEscalaDaTurma = dados;
            }
        })
        .catch(error => {
            // Lida com erros durante a requisição
            console.error(error);
            console.error('Erro na requisição:', error);
            console.error('Resposta do servidor:', error.response);
        });

}


async function resetarParametros() {
    await fetchData();

    equipamentosDisponiveis = equipamentos.filter((equipamento) => equipamento.disponivel == true);
    equipamentosIndisponiveis = equipamentos.filter((equipamento) => equipamento.disponivel == false);
    operadoresDisponiveis = operadoresDaTurma.filter((operador) => operador.disponivel == true);
    escala = [];


    equipamentos.sort((a, b) => {
        return a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0;
    })
    operadoresDaTurma.sort((a, b) => {
        return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
    })
}

// ATUALIZA O TÍTULO E O PARAMETRO DA TURMA
function atualizarTituloEscalas() {
    turma = select.value;
    tituloEscalas.innerHTML = '';
    tituloEscalas.innerHTML = `Escalas ${DADOS_USUARIO.gerencia.toUpperCase()} - Turma ${turma.toUpperCase()}`;
}

function atualizarTelaEscalas() {
    ulListaEscalas.innerHTML = '';

    if (listaEscalaDaTurma.message != null) {
        ulListaEscalas.innerHTML += `
        <li>
            ${listaEscalaDaTurma.message}
        </li>
        `;
    } else {
        listaEscalaDaTurma.forEach((escala, index) => {
            ulListaEscalas.innerHTML += `
            <li id="${escala.idlista}">
                <div class="liContainer">
                    <div id="nome-lista-${index}">${escala.nome}</div>
                    <div>${escala.horariocriacao}</div>
                    <div class="controlesContainer">
                        <a class="icon" deletarEscala${index}>
                            <img src="../../assets/images/delete.png" alt="" srcset="">
                        </a>
                        <a class="icon" infoEscala${index}>
                            <img src="../../assets/images/info.png" alt="" srcset="">
                        </a>
                    </div>
                </div>
            </li>
            `;
        });

        let lis = document.querySelectorAll(`.listaContainer > ul > li`);
        lis.forEach((li, index) => {
            let btnDeletarEscala = document.querySelector(`[deletarEscala${index}]`);
            let btnInfoEscala = document.querySelector(`[infoEscala${index}]`);
            let nomeLista = document.querySelector(`#nome-lista-${index}`);

            // PARTE RESPONSÁVEL POR DELETAR A ESCALA
            btnDeletarEscala.addEventListener('click', async (e) => {

                // alert('deletar');

                // // FOI PRECISO ADAPTAR O CÓDIGO, POIS O SPLICE NÃO FUNCIONOU, SENDO ASSIM UM ARRAY CÓPIA FOI PREENCHIDO SEM O ELEMENTO A SER REMOVIDO
                let elementoParaRemover = listaEscalaDaTurma[index];

                const URI = `https://backend-gerador-integrado.vercel.app/listaEscalas/delete/${elementoParaRemover.idlista}?login=${DADOS_USUARIO.matricula}`;
                const CONFIGURAÇÃO = {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': DADOS_USUARIO.token
                    }
                }


                await fetch(URI, CONFIGURAÇÃO)
                    .then(response => {
                        return response.json();
                    })
                    .then(dados => {
                        if (dados.error != null) {

                            Toastify({
                                text: dados.message,
                                duration: 3000,
                                gravity: "top", // `top` or `bottom`
                                position: "right", // `left`, `center` or `right`
                                stopOnFocus: true, // Prevents dismissing of toast on hover
                                style: {
                                    background: "rgba(192, 57, 43,1.0)",
                                }
                            }).showToast();
                            setTimeout(() => {
                                window.location.replace('../login/index.html');
                            }, 3000);
                        } else {
                            let indice = listaEscalaDaTurma.indexOf(elementoParaRemover);
                            listaEscalaDaTurma.splice(indice, 1);
                            atualizarTelaEscalas();
                            Toastify({
                                text: "Escala deletada com sucesso",
                                duration: 1500,
                                gravity: "top", // `top` or `bottom`
                                position: "right", // `left`, `center` or `right`
                                stopOnFocus: true, // Prevents dismissing of toast on hover
                                style: {
                                    background: "rgba(39, 174, 96,1.0)",
                                }
                            }).showToast();
                        }
                    })
                    .catch(error => error.response);




            });

            // PARTE RESPONSÁVEL POR DETALHES DA ESCALA
            btnInfoEscala.addEventListener('click', () => {
                let idLista = listaEscalaDaTurma[index].idlista;
                sessionStorage.setItem('idLista', JSON.stringify(idLista));
                mostrarTela2();
            });

            nomeLista.addEventListener('click', () => {
                let idLista = listaEscalaDaTurma[index].idlista;
                sessionStorage.setItem('idLista', JSON.stringify(idLista));
                mostrarTela2();
            });

        });
    }




}

// FUNÇÃO RESPONSÁVEL POR CARREGAR TODOS OS EVENTOS E FUNCIONALIDADES DA APLICAÇÃO
async function carregarAplicacao() {

    atualizarTituloEscalas();

    await resetarParametros();

    renderizarConfiguracoes();

    atribuirEventos();


    atualizarTelaEscalas();

}

function renderizarConfiguracoes() {
    let ulListaOperadores = document.querySelector('[listaOperadores]');
    let ulListaEquipamentos = document.querySelector('[listaEquipamentos]');


    ulListaOperadores.innerHTML = '';
    ulListaEquipamentos.innerHTML = '';

    operadoresDaTurma.forEach((operador, index) => {
        ulListaOperadores.innerHTML += `
                                <li id="${index}">
                                    <div class="liConfiguracaoContainer">
                                        <div class="operadorEEquipamentoNome">${operador.nome.toUpperCase()}</div>
                                        <div class="operadorEEquipamentoStatus">${operador.disponivel ? "Disponível" : "Indisponível"}</div>
                                        <div class="controlesConfiguracaoContainer">
                                            
                                            <div class="switchContainer ${operador.disponivel ? "active" : ""}" operadorSwitch${index}>
                                                <span class='toggleButton'  ></span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
        `;
    });

    equipamentos.forEach((equipamento, index) => {
        ulListaEquipamentos.innerHTML += `
                                <li id="${index}">
                                <div class="liConfiguracaoContainer">
                                    <div class="operadorEEquipamentoNome">${equipamento.tag.toUpperCase()}</div>
                                    <div class="operadorEEquipamentoStatus">${equipamento.disponivel ? "Disponível" : "Indisponível"}</div>
                                   
                                    <div class="controlesConfiguracaoContainer">
                                        
                                            <div class="switchContainer ${equipamento.disponivel ? "active" : ""}" equipamentoSwitch${index}>
                                                <span class='toggleButton'  ></span>
                                            </div>                                        
                                    </div>
                                </div>
                            </li>
        `;
    });

    let lisEsquipamentos = document.querySelectorAll('[listaEquipamentos] > li');
    let lisOperadores = document.querySelectorAll('[listaOperadores] > li');


    lisEsquipamentos.forEach((li, index) => {
        let btnSwitch = document.querySelector(`[equipamentoSwitch${index}]`);

        btnSwitch.addEventListener('click', async () => {
            let divEquipamentoStatus = li.querySelector(`.operadorEEquipamentoStatus`);
            const URI = `https://backend-gerador-integrado.vercel.app/equipamentos/update/${equipamentos[index].tag}?login=${DADOS_USUARIO.matricula}`;
            const BODYDATA = { disponivel: equipamentos[index].disponivel ? "1" : "0" }
            const CONFIGURAÇÃO = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': DADOS_USUARIO.token
                },
                body: JSON.stringify(BODYDATA)
            }

            btnSwitch.classList.toggle('active');
            equipamentos[index].disponivel = !equipamentos[index].disponivel;

            divEquipamentoStatus.innerText = '';
            divEquipamentoStatus.innerText = equipamentos[index].disponivel ? "Disponível" : "Indisponível";


            btnVoltarConfiguracao.hidden = true;

            await fetch(URI, CONFIGURAÇÃO)
                .then(response => {
                    return response.json();
                })
                .then(dados => {
                    if (dados.error) {
                        Toastify({
                            text: dados.message,
                            duration: 3000,
                            gravity: "top", // `top` or `bottom`
                            position: "right", // `left`, `center` or `right`
                            stopOnFocus: true, // Prevents dismissing of toast on hover
                            style: {
                                background: "rgba(192, 57, 43,1.0)",
                            }
                        }).showToast();
                        setTimeout(() => {
                            window.location.replace('../login/index.html');
                        }, 3000);
                    } else {

                        Toastify({
                            text: "Atualizado com sucesso!",
                            duration: 1500,
                            gravity: "top", // `top` or `bottom`
                            position: "right", // `left`, `center` or `right`
                            stopOnFocus: true, // Prevents dismissing of toast on hover
                            style: {
                                background: "rgba(39, 174, 96,1.0)",
                            }
                        }).showToast();
                    }
                })
                .catch(error => error.response);

            btnVoltarConfiguracao.hidden = false;


        });


    });

    lisOperadores.forEach((li, index) => {
        let btnSwitch = document.querySelector(`[operadorSwitch${index}]`);

        btnSwitch.addEventListener('click', async () => {
            let divOperadorStatus = li.querySelector(`.operadorEEquipamentoStatus`);
            const URI = `https://backend-gerador-integrado.vercel.app/operadores/update/${operadoresDaTurma[index].matricula}?login=${DADOS_USUARIO.matricula}`;
            const BODYDATA = {
                disponivel: operadoresDaTurma[index].disponivel ? "1" : "0"
            }
            const CONFIGURAÇÃO = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': DADOS_USUARIO.token
                },
                body: JSON.stringify(BODYDATA)
            }
            btnSwitch.classList.toggle('active');
            operadoresDaTurma[index].disponivel = !operadoresDaTurma[index].disponivel;

            divOperadorStatus.innerText = '';
            divOperadorStatus.innerText = operadoresDaTurma[index].disponivel ? "Disponível" : "Indisponível";


            btnVoltarConfiguracao.hidden = true;

            await fetch(URI, CONFIGURAÇÃO)
                .then(response => {
                    return response.json();
                })
                .then(dados => {
                    if (dados.error) {
                        Toastify({
                            text: dados.message,
                            duration: 3000,
                            gravity: "top", // `top` or `bottom`
                            position: "right", // `left`, `center` or `right`
                            stopOnFocus: true, // Prevents dismissing of toast on hover
                            style: {
                                background: "rgba(192, 57, 43,1.0)",
                            }
                        }).showToast();

                        setTimeout(() => {
                            window.location.replace('../login/index.html');
                        }, 3000);
                    } else {

                        Toastify({
                            text: "Atualizado com sucesso!",
                            duration: 1500,
                            gravity: "top", // `top` or `bottom`
                            position: "right", // `left`, `center` or `right`
                            stopOnFocus: true, // Prevents dismissing of toast on hover
                            style: {
                                background: "rgba(39, 174, 96,1.0)",
                            }
                        }).showToast();
                    }
                })
                .catch(error => error.response);

            btnVoltarConfiguracao.hidden = false;
        });
    });


}

function switchTelaConfiguracao() {
    telaConfiguracao.classList.toggle('mostrar');
}

function mostrarTela2() {
    sessionStorage.setItem('turma', turma);
    window.location.href = '../gerar-escala/index.html';



}

function atribuirEventos() {
    btnMostrarTela2.addEventListener('click', () => {
        sessionStorage.removeItem('idLista');
        sessionStorage.setItem('operadoresDaTurma', JSON.stringify(operadoresDaTurma));
        sessionStorage.setItem('equipamentos', JSON.stringify(equipamentos));
        mostrarTela2();
    })

    btnMostrarConfiguracao.addEventListener('click', switchTelaConfiguracao);

    btnVoltarConfiguracao.addEventListener('click', switchTelaConfiguracao);

    select.addEventListener('change', async () => {
        let componentLoading = document.querySelector('.component-loading-container');
        componentLoading.classList.toggle('mostrar');
        atualizarTituloEscalas();
        await resetarParametros();
        renderizarConfiguracoes();


        atualizarTelaEscalas();
        componentLoading.classList.toggle('mostrar');
    })




}


window.addEventListener('load', async () => {
    if (sessionStorage.getItem('data') == null) {
        window.location.replace('../login/index.html');
    } else {
        let loading = document.querySelector('.screen-loading-container');
        let data = JSON.parse(sessionStorage.getItem('data'));

        DADOS_USUARIO = { ...data };

        const URI = `https://backend-gerador-integrado.vercel.app/validate-token/supervisor?login=${DADOS_USUARIO.matricula}`;
        const CONFIGURAÇÃO = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'authorization': DADOS_USUARIO.token
            },
        }

        await fetch(URI, CONFIGURAÇÃO)
            .then(response => {
                return response.json();
            })
            .then(async dados => {
                if (dados.error) {
                    Toastify({
                        text: dados.message,
                        duration: 3000,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "rgba(192, 57, 43,1.0)",
                        }
                    }).showToast();

                    setTimeout(() => {
                        window.location.replace('../login/index.html');
                    }, 3000);
                } else {
                    await carregarAplicacao();
                }
            })
            .catch(error => error.response);

        loading.classList.toggle('mostrar');
    }

});
