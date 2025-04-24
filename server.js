const express = require('express');
const fs = require('fs');
const app = express();
const porta = 3000;

app.use(express.json());
app.use(express.static('public'));

let dados_FilmesAtores = []; 

// leitura do arquivo JSON
try { 
  dados_FilmesAtores = JSON.parse(fs.readFileSync('latest_filmes.json', 'utf8'));
} catch (err) {
  console.error('Erro ao parsear e realizar a leitura do arquivo "latest_filmes.json":', err);
}

// estrutura para o grafo
class GrafoPai {
  constructor() {
    this.adjacencyList = new Map();
  }

  adicionarVert(verticePai) {
    if (!this.adjacencyList.has(verticePai)) {
      this.adjacencyList.set(verticePai, new Set());
    }
  }

  adicionarAresta(vert1, vert2) {
    this.adicionarVert(vert1);
    this.adicionarVert(vert2);

    // grafo não direcionado
    this.adjacencyList.get(vert1).add(vert2);
    this.adjacencyList.get(vert2).add(vert1);
  }

  // menor caminho (BFS) respeitando o limite de 6 arestas
  buscaLarg(atorInicio, atorAlvo) {
    if (!this.adjacencyList.has(atorInicio) || !this.adjacencyList.has(atorAlvo)) return null;
    let arestaVisitada = new Set();
    let filaAtores = [[atorInicio]];

    while (filaAtores.length > 0) {
      let caminho = filaAtores.shift();
      let verticePai = caminho[caminho.length - 1];

      if (verticePai === atorAlvo) return caminho;

      if (!arestaVisitada.has(verticePai)) {
        arestaVisitada.add(verticePai);
        let vertVizinho = this.adjacencyList.get(verticePai);
        for (let vizinho of vertVizinho) {
          let novoCaminho = [...caminho, vizinho];
          if (novoCaminho.length - 1 <= 6) {
            filaAtores.push(novoCaminho);
          }
        }
      }
    } return null;
  }

  // todos os caminhos simples entre o ator de origem x ator de destino, com comprimento máximo de 6 arestas, usando a busca em profundidade e voltando se o caminho ultrapassa 6 arestas
  buscaTodosCaminhos(atorInicio, atorAlvo, maxCaminhos) {
    if (!this.adjacencyList.has(atorInicio) || !this.adjacencyList.has(atorAlvo)) return [];
    let caminhos = [];
    const buscaProfundidade = (vertAtual, caminho) => {
      if (caminho.length - 1 > maxCaminhos) return;
      if (vertAtual === atorAlvo) {
        caminhos.push([...caminho]);
        return;
      }

      for (let vizinho of this.adjacencyList.get(vertAtual)) {
        
        // não visita um vértice já presente no caminho
        if (!caminho.includes(vizinho)) {
          caminho.push(vizinho);
          buscaProfundidade(vizinho, caminho);
          caminho.pop();
        }
      }
    };  buscaProfundidade(atorInicio, [atorInicio]);
    return caminhos;
  }
}

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
