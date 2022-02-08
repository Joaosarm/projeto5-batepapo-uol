let NomeUsuário;

function ValidarNome(){
    NomeUsuário = document.querySelector('input.Nome').value;
    if(NomeUsuário!==''){
        document.querySelector('.Tela-Entrada').classList.add('escondido');
    }
}

function Menu(){
    document.querySelector('.Menu').classList.remove('escondido');
}