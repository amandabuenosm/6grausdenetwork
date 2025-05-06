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

    fetch(`/search?comeco=${comeco}&final=${final}`)
    .then(response => response.json())
    .then(data => {
        const resultBusca = document.getElementById('result');
        if (data.error) {
            resultBusca.innerHTML = `<p>${data.error}</p>`;
        } else {
            resultBusca.innerHTML = `<p><strong>MENOR CAMINHO:</strong> ${data.caminho.join(' -> ')}</p>
            <p><strong>COMPRIMENTO DO MENOR CAMINHO:</strong> ${data.length} aresta(s)</p>`;
        }
    });
});

// botão de busca de todos os caminhos em até 6 arestas
document.getElementById('buscadfs').addEventListener('click', () => {
    const comeco = document.getElementById('atorInicio').value;
    const final = document.getElementById('atorAlvo').value;

    fetch(`/searchAll?comeco=${comeco}&final=${final}`)
    .then(response => response.json())
    .then(data => {
        const resultBusca = document.getElementById('result');
        if (data.error) {
            resultBusca.innerHTML = `<p>${data.error}</p>`;
        } else {
            let html = `<h3>CAMINHOS ENCONTRADOS EM ATÉ 6 ARESTAS:</h3>`;
            data.caminhos.forEach((item, index) => {
                html += `<p><strong>CAMINHO ${index + 1}:</strong> ${item.caminho.join(' -> ')}
                (COMPRIMENTO DO CAMINHO: ${item.length} aresta(s))</p>`;
            });
            resultBusca.innerHTML = html;
        }
    });
});
