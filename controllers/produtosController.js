const { lerBanco, salvarBanco } = require('../dados/produtosRepositorio');

async function listar(req, res) {
  const banco = await lerBanco();
  res.json(banco.produtos);
}

async function buscarPorId(req, res) {
  const banco = await lerBanco();
  const id = Number(req.params.id);
  const produto = banco.produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado'});    
  }

  res.json(produto);
}

async function criar (req, res) {
  const {nome, preco} = req.body;

  if (!nome || !preco) {
    return res.status(400).json({ erro: 'Nome e preço são obrigatorios'});
  }

  const banco = await lerBanco();
  const novoProduto = {id: banco.proximoId, nome, preco};

  banco.produtos.push(novoProduto);
  banco.proximoId++;
  await salvarBanco(banco);

  res.status(201).json(novoProduto);
}

async function atualizar(req, res) {
  const banco = await lerBanco();
  const id = Number(req.params.id);
  const produto = banco.produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado'});
  }

  const { nome, preco } = req.body;
  if (nome !== undefined) produto.nome = nome;
  if (preco !== undefined) produto.preco = preco;

  await salvarBanco(banco);
  res.json(produto);
}

async function remover(req, res) {
  const banco = await lerBanco();
  const id = Number(req.params.id);
  const indice = banco.produtos.findIndex(p => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado'});
  }

  banco.produtos.splide(indice, 1);
  await salvarBanco(banco);
  res.status(204).send()
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };

