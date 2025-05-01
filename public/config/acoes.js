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
            resultBusca.innerHTML = `<p><strong>Menor Caminho:</strong> ${data.caminho.join(' -> ')}</p>
            <p><strong>Comprimento do Caminho:</strong> ${data.length} aresta(s)</p>`;
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
            let html = `<h3>Todos os caminhos encontrados:</h3>`;
            data.caminhos.forEach((item, index) => {
                html += `<p><strong>Caminho ${index + 1}:</strong> ${item.caminho.join(' -> ')}
                (Comprimento: ${item.length} aresta(s))</p>`;
            });
            resultBusca.innerHTML = html;
        }
    });
});
