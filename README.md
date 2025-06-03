Esse projeto da disciplina de Teoria de Grafos tem como foco a análise de conexões entre atores de cinema por meio de sua participação em filmes. A aplicação tem como objetivo identificar o caminho mínimo de relação entre dois atores distintos com base nos filmes em que atuaram, aplicando na prática o conceito dos "6 graus de separação". A arquitetura de dados é modelada em um grafo não-direcionado usando listas de adjacência, onde os vértices representam filmes e atores, e as arestas seriam as conexões entre eles (ator X que participou de um filme X). A interface foi desenvolvida apenas para a versão desktop, no momento não possui adaptação para dispositivos móveis. Atualmente, a aplicação está disponível para acesso público por meio do seguinte endereço: https://grafos-network.up.railway.app/.

OBJETIVO:
1. Montar um grafo a partir de uma base de dados ("latest_movies.json");
2. Desenvolver algoritmos de busca por largura (BFS) e busca por profundidade (DFS) para:
  - Localizar o menor caminho entre dois atores;
  - Exibir conexões com no máximo 6 arestas;
3. Listar os resultados em uma interface para o usuário. 
