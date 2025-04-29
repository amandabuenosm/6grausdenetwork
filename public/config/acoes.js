// carga da lista de atores e preenchimento dos selects
fetch('/atores')
.then(response => response.json())
.then(data => {
    const selecao_origem = document.getElementById('atorInicio');
    const selecao_alvo = document.getElementById('atorAlvo');

    data.atores.forEach(ator => {
        const primeiraSelecao = document.createElement('option');
        primeiraSelecao.value = ator;
        primeiraSelecao.textContent = ator;
        selecao_origem.appendChild(primeiraSelecao);

        const segundaSelecao = document.createElement('option');
        segundaSelecao.value = ator;
        segundaSelecao.textContent = ator;
        selecao_alvo.appendChild(segundaSelecao);
    });
});

// botão de busca do menor caminho
document.getElementById('buscabfs').addEventListener('click', () => {
    const comeco = document.getElementById('atorInicio').value;
    const final = document.getElementById('atorAlvo').value;


    
});
