const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

// Preparamos as informações de acesso ao banco de dados
const dbUrl = "mongodb+srv://admin:K92jkn98knTER9168@cluster0.etwvjn2.mongodb.net";
const dbName = "mongodb-intro-e-implementacao";

// Declaramos a função main
async function main() {
  const client = new MongoClient(dbUrl);

  console.log("Conectando ao banco de dados...");
  await client.connect();
  console.log("Banco de dados conectado com suesso!");

  const db = client.db(dbName)
  const collection = db.collection('personagem')

  const app = express();

  app.get("/", function (req, res) {
    res.send("Hello World!");
  });

  const lista = ["Java", "Kotlin", "Android"];
  //              0       1         2

  // Endpoint Read All [GET] /personagem
  app.get("/personagem", async function (req, res) {
    // Acessamos a lista de itens na collection do MongoDB
    const itens = await collection.find().toArray()

    // Enviamos a lista de intens como resultado
    res.send(itens);
  });

  // Endpoint Read By ID [GET] /personagem/:id
  app.get("/personagem/:id", async function (req, res) {
    // Acessamos o parâmetro de rota ID
    const id = req.params.id;

    // Acessa o item na collection usando o ID -1
    const item = await collection.findOne({ _id: new ObjectId(id)})

    // Checamos se o item obtido existe
    if (!item) {
      return res.status(404).send("Item não encontrado");
    }

    // Enviamos o item como resposta
    res.send(item);
  });

  // Sinalizo para o Express que estou utilizando JSON no Body
  app.use(express.json());

  // Endpoint Create [POST] /personagem
  app.post("/personagem", function (req, res) {
    // Acessamos o Body da Requisição
    const body = req.body;

    // Acessamos a propriedade 'nome' do body
    const novoItem = body.nome;

    // Checar se o 'nome' está presente no body da requisição
    if (!novoItem) {
      return res
        .status(400)
        .send('Requisição deve conter a propriedade "nome".');
    }

    // Checar se o novoItem já existe na lista ou não
    if (lista.includes(novoItem)) {
      return res.status(409).send("Item já existe na lista");
    }

    // Adicionamos na Lista
    lista.push(novoItem);

    // Exibimos uma mensagem de sucesso
    res.status(201).send("Item adicionado com sucesso: " + novoItem);
  });

  // Endpoint Update [PUT] /personagem/:id
  app.put("/personagem/:id", function (req, res) {
    // Acessamos o ID dos parâmetros de rota
    const id = req.params.id;

    // Checamos se o item com o ID - 1 está na lista, exibindo
    // uma mensagem caso não esteja
    if (!lista[id - 1]) {
      return res.status(404).send("Item não encontrado");
    }

    // Acessamos o Body da requisição
    const body = req.body;

    // Acessamos a propriedade 'nome' do body
    const novoItem = body.nome;

    // Checar se o 'nome' está presente no body da requisição
    if (!novoItem) {
      return res
        .status(400)
        .send('Requisição deve conter a propriedade "nome".');
    }

    // Checar se o novoItem já existe na lista ou não
    if (lista.includes(novoItem)) {
      return res.status(409).send("Item já existe na lista");
    }

    // Atualizamos na lista o item pelo ID - 1
    lista[id - 1] = novoItem;

    // Exibimos uma mensagem de sucesso
    res.status(200).send("Item atualizado com sucesso: " + id + " - " + novoItem);
  });

  // Endpoint Delete [DELETE] /personagem/:id
  app.delete("/personagem/:id", function (req, res) {
    // Acessamos o ID dos parâmetros de rota
    const id = req.params.id;

    // Checamos se o item com o ID - 1 está na lista, exibindo
    // uma mensagem caso não esteja
    if (!lista[id - 1]) {
      return res.status(404).send("Item não encontrado");
    }

    // Remover o item da lista usando o ID - 1
    delete lista[id - 1];

    // Enviamos uma mensagem de suceeso
    res.send("Item removido com sucesso: " + id);
  });

  app.listen(3000, function () {
    console.log("rodando na porta http://localhost:3000");
  });
}

// Executando a função main()
main();
