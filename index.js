const express = require('express');
const fs = require('fs');
const app = express();
const porta = 3000;

app.use(express.json());
app.use(express.static('public'));

let dados_FilmesAtores = []; 

// leitura do arquivo JSON
try { 
  dados_FilmesAtores = JSON.parse(fs.readFileSync('latest_movies.json', 'utf8'));
} catch (err) {
  console.error('Erro ao parsear e realizar a leitura do arquivo "latest_movies.json":', err);
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

// percorrer o grafo baseado nos dados do JSON
const grafoFilho = new GrafoPai();

dados_FilmesAtores.forEach(filme => {
  const nomefilme = filme.title;
  grafoFilho.adicionarVert(nomefilme);

  // para cada ator do filme = cria aresta entre filme e ator
  if (filme.cast && Array.isArray(filme.cast)) {
    filme.cast.forEach(atorPercorrido => {
      grafoFilho.adicionarAresta(nomefilme, atorPercorrido);
    });
  }
});

// função de listagem dos atores
app.use('/atores', (req, res) => {
  let atores = []; 
  dados_FilmesAtores.forEach(filme => {
    if (filme.cast && Array.isArray(filme.cast)) {
      filme.cast.forEach(atorPercorrido => {
        if (!atores.includes(atorPercorrido)) {
          atores.push(atorPercorrido);
        }
      });
    }
  }); res.json({ atores });
});

// função de busca do menor caminho entre dois atores
app.get('/search', (req, res) => {
  const { comeco, final } = req.query;
  if (!comeco || !final) {
    return res.status(400).json({ error: "Os parâmetros principais Ator Origem e Ator Alvo são obrigatórios!"});
  }
  const caminho = grafoFilho.buscaLarg(comeco, final);
  if (caminho) {
    res.json({ caminho, length: caminho.length - 1 });
  } else {
    res.status(404).json({ error: "Nenhuma relação encontrada dentro de 6 graus!" });
  }
});

// função para buscar todos os caminhos em até 6 graus entre dois atores
app.get('/searchAll', (req, res) => {
  const { comeco, final } = req.query;
  if (!comeco || !final) {
    return res.status(400).json({ error: "Os parâmetros principais Ator Origem e Ator Alvo são obrigatórios!"});
  }
  const todoscaminhos = grafoFilho.buscaTodosCaminhos(comeco, final, 6);
  if (todoscaminhos && todoscaminhos.length > 0) {

    // para cada caminho, existe um comprimento
    const result = todoscaminhos.map(caminho => ({
      caminho, length: caminho.length - 1
    })); res.json({ caminhos: result });
  } else {
    res.status(404).json({ error: "Nenhuma relação encontrada dentro de 6 graus!" });
  }
});

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
