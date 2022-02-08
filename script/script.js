let NomeUsuário;


// Função para validar o nome colocado na tela de entrada
function ValidarNome(){
    NomeUsuário = document.querySelector('input.Nome').value;
    if(NomeUsuário!==''){
        document.querySelector('.Tela-Entrada').classList.add('escondido');
    }
}

// Função para acionar o menu ao clicar no ícone superior à direita
function Menu(){
    document.querySelector('.Menu').classList.remove('escondido');
}

// Função para voltar do menu à página do chat ao clicar no fundo
function Voltar(){
    document.querySelector('.Menu').classList.add('escondido');
}