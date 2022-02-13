let mensagens = [];                         // Array que segura todas as mensagens da API
let contador = 0;                           // Contador que diz qual a primeira mensagem que aparecerá na tela
let TipoDeMensagem = 'message';             // Tipo de mensagem inicial selecionada
let Remetente = 'Todos';                    // Remetente inicial selecionado
let UltimaMensagem;                         // Guarda a ultima mensagem para poder colocar as novas mensagens na tela
let chat = document.querySelector('main');  // Pega o main do html para colocar mensagens
let contadorScroll = 0;                     // Contador para manter as mensagens scrolladas
let NomeUsuário = [];                       // Nome que o usuário escolhe



//Iniciar o chat
function IniciarChat(){
    TrazerMensagensServidor();
    setInterval(TrazerMensagensServidor,3000);
    // setInterval(MostrarMensagens,500);
}

//Trazer mensagens do servidor
function TrazerMensagensServidor(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promessa.then(CarregarMensagens);
    promessa.catch(ErroCarregamento);
    MostrarMensagens();
}


//Colocar as mensagens dentro do array na página
function CarregarMensagens(mensagem) {
    mensagens = mensagem.data;
    MostrarMensagens();
}


//Caso carregamento de mensagens de erro
function ErroCarregamento(){
    alert('Houve um erro de carregamento das mensagens!');
    window.location.reload();
}

function MostrarMensagens(){
    chat.innerHTML = ''
    for(contador=0;contador<mensagens.length;contador++){
        SelecionarMensagem();
    }
}


//Funçao para mostrar as mensagens na tela
// function MostrarMensagens(){
//     if(contador<mensagens.length){
//         SelecionarMensagem();
//         UltimaMensagem = mensagens[contador];
//         contador++;
//     } else{
//         if(mensagens[contador-1] !== UltimaMensagem){
//             contador = procurarIndice(UltimaMensagem.name,UltimaMensagem.text);
//         }
//     }
// }


//Procurar ultima mensagem enviada no array anterior
// function procurarIndice(nome, mensagem){
//     let indice;
//     for(let i=0;i<mensagens.length;i++){
//        if(mensagens[i].name==nome&&mensagens[i].text==mensagem){
//           indice=i;
//        }
//     }
//     return indice+1;
//  }


//Selecionar qual o tipo de mensagem
function SelecionarMensagem(){
    if(mensagens[contador].type === 'status'){
        mensagemDeStatus();
    }else{
        MensagemDeTexto();
    }
}

//Formato da mensagem de status
function mensagemDeStatus(){
    chat.innerHTML += `<div data-identifier="message" class="${mensagens[contador].type}"><span class="s${contadorScroll}">(${mensagens[contador].time}) </span> <p> <strong>${mensagens[contador].from}</strong> ${mensagens[contador].text}</p></div>`;
    const tempo = chat.querySelector(`.s${contadorScroll}`);
    tempo.scrollIntoView();
    contadorScroll++;
}


//Formato da mensagem de texto
function MensagemDeTexto(){
    if(mensagens[contador].type==='message'||mensagens[contador].from===NomeUsuário.name||mensagens[contador].to===NomeUsuário.name){
    chat.innerHTML += `<div data-identifier="message" class="${mensagens[contador].type}"><span class="s${contadorScroll}">(${mensagens[contador].time})</span> <p>  <strong>${mensagens[contador].from}</strong> para <strong>${mensagens[contador].to}</strong>: ${mensagens[contador].text}</p></div>`;
    const tempo = chat.querySelector(`.s${contadorScroll}`);
    tempo.scrollIntoView();
    contadorScroll++;
}
}


// Função para validar o nome colocado na tela de entrada
function ValidarNome(){
    const Nome = document.querySelector('input.Nome').value;

    NomeUsuário = {
        name: Nome
    }

    if(NomeUsuário){
        PostNome();
    }
}

function loading(){
    const loadingScreen = document.querySelector('.loading');
    const entrada = document.querySelector('.entrada');
    console.log(entrada);
    entrada.classList.toggle('escondido');
    loadingScreen.classList.toggle('escondido');
}


//Função para dar post no nome do usuário
function PostNome(){
    let request = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants',NomeUsuário);
    loading();
    request.then(NomeDisponivel);
    request.catch(NomeIndisponivel);
}


//Função acionada se o nome está disponivel
function NomeDisponivel(mensagem){
    if(mensagem.status==200){
        document.querySelector('.Tela-Entrada').classList.add('escondido');
        IniciarChat();
        setInterval(MaintainConection,5000);
    } else{
        alert('Algo deu errado!');
    }
}

//Função acionada se o nome ja existir  no chat
function NomeIndisponivel(erro){
    if(erro.response.status == 400){
        alert('Esse nome já foi escolhido por outra pessoa!! Escolha outro nome');
    } else{
        alert('Erro!(Não reconhecido)')
    }
    window.location.reload();
}

//Função para manter conexão, enviando o nome de usuário a cada 5 segundos
function MaintainConection(){
    let request = axios.post('https://mock-api.driven.com.br/api/v4/uol/status',NomeUsuário);
    request.catch(ErroDeConexão);
}

//Caso haja um erro na conexão
function ErroDeConexão(){
    alert('Houve um erro de conexão');
    window.location.reload();
}

// Função para enviar mensagem para servidor
function MandarMensagem(){
    const MensagemNova = document.querySelector('.MensagemNova').value;
    if(MensagemNova){

        const Mensagem = {
            from: NomeUsuário.name,
            to: Remetente,
            text: MensagemNova,
            type: TipoDeMensagem // ou "private_message" para o bônus
        }
    
        document.querySelector('.MensagemNova').value = '';

        const request = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', Mensagem);
        request.then(ConfirmaMensagem);
        request.catch(ErroMensagem);

    }
}

//Função para enviar mensagem apertando enter
function searchKeyPress(enter){
    if (enter.keyCode == 13){
        document.querySelector('footer button').click();
    }
}


//Função que diz que mensagem deu certo
function ConfirmaMensagem(){
    TrazerMensagensServidor();
}


//Função para caso a mensagem de erro de envio
function ErroMensagem(){
    alert('Erro ao enviar mensagem!');
    window.location.reload();
}



let participantes = [];

// Função para acionar o menu ao clicar no ícone superior à direita
function Menu(){
    document.querySelector('.Menu').classList.remove('escondido');
    request = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    request.then(Imprimirparticipantes);
    request.catch(ErroDeImpressãoUsuarios);
}

//Caso de erro na impressao dos usuários no menu
function ErroDeImpressãoUsuarios(){
    alert('Houve um erro na impressao dos usuários online!');
    window.location.reload();

}


//Função para imprimir os participantes online na tela de menu
function Imprimirparticipantes(dados){
    const online = document.querySelector('nav .PessoasOnline');
    online.innerHTML = '';
    participantes = dados.data;
    let contSelecionado=0;
    for(let i=0;i<participantes.length;i++){
        const Usuario = participantes[i].name;
        if(Usuario!==NomeUsuário.name){
            if(Remetente == Usuario){
                contSelecionado++;
                online.innerHTML += `<div data-identifier="participant" onclick="SelecionarParticipante(this,'${Usuario}')">
                <div> <img src="Images/Usuario.svg" alt="Usuário">${Usuario} </div>
                <div> <img src="Images/check.svg" class ="check selecionado" alt="Check"> </div> </div>`
            }else{
            online.innerHTML += `<div data-identifier="participant" onclick="SelecionarParticipante(this,'${Usuario}')">
            <div> <img src="Images/Usuario.svg" alt="Usuário">${Usuario} </div>
            <div> <img src="Images/check.svg" class ="check" alt="Check"> </div> </div> `
            }
        }
    }
    if(contSelecionado==0){
        document.querySelector('.Pessoas .check').classList.add('selecionado');

    }
}

//Selecionar o Remetente da mensagem
function SelecionarParticipante(elemento,nome){
    const participante = document.querySelector('.Pessoas .check.selecionado');
    if(participante){
    participante.classList.remove('selecionado');
    elemento.querySelector('.check').classList.add('selecionado');
    Remetente = nome;
    if(TipoDeMensagem=='private_message'){
        document.querySelector('footer p').innerHTML = `Enviando para ${Remetente} (reservadamente)`;
    }
    }
}

//Selecionar o Visibilidade da mensagem
function SelecionarVisibilidade(elemento,TipoMensagem){
    const participante = document.querySelector('.visibilidade .check.selecionado');
    participante.classList.remove('selecionado');
    elemento.querySelector('.check').classList.add('selecionado'); 
    TipoDeMensagem = TipoMensagem;
    if(TipoDeMensagem=='private_message'){
        document.querySelector('footer p').innerHTML = `Enviando para ${Remetente} (reservadamente)`;
    }else{
        document.querySelector('footer p').innerHTML = '';
    }
}

// Função para voltar do menu à página do chat ao clicar no fundo
function Voltar(){
    document.querySelector('.Menu').classList.add('escondido');
}