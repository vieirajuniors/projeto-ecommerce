/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho temos que atualizar o contador, adicionar o produto no localStorage e atualizar o HTML do carrinho
    passo 1- pegar os botões de adicionar ao carrinho do html
    passo 2- adicionar um evento de escuta nesses botões para quando o usuário clicar, disparar uma ação
    passo 3- pegar as informações do produto clicado e adicionar no localstorage
    passo 4- atualizar o contador do carrinho de compras
    passo 5- renderizar a tabela do carrinho de compras

Objetivo 2 - remover produtos do carrinho:
    passo 1- pegar o botão de deletar do html
    passo 2- adicionar um evento de escuta no botão
    passo 3- remover o produto do localstorage
    passo 4- atualizar o html do carrinho retirando o produto
    passo 5- atualizar o valor

Objetivo 3 - atualizar valores do carrinho:
    passo 1- pegar o input de quantidade do carrinho
    passo 2- adicionar um evento de escuta no input
    passo 3- atualizar o valor total do produto
    passo 4- atualizar o valor total do carrinho
*/

// Objetivo 1 - quando clicar no botão de adicionar ao carrinho temos que atualizar o contador, adicionar o produto no localStorage e atualizar o HTML do carrinho

// passo 1- pegar os botões de adicionar ao carrinho do html
const botoesAdicionarAoCarrinho = document.querySelectorAll('.adicionar-ao-carrinho');

// passo 2- adicionar um evento de escuta nesses botões para quando o usuário clicar, disparar uma ação
botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener("click", (evento) => {
        console.log("Botão de adicionar ao carrinho clicado!");

        // passo 3- pegar as informações do produto clicado e adicionar no localstorage
        const elementoProduto = evento.target.closest(".produto");
        console.log(elementoProduto);
        const produtoId = elementoProduto.dataset.id;
        const produtoNome = elementoProduto.querySelector(".nome").textContent;
        const produtoImagem = elementoProduto.querySelector("img").getAttribute("src");
        const produtoPreco = parseFloat(elementoProduto.querySelector(".preco").textContent.replace("R$ ", "").replace(".", "").replace(",", "."));

        // buscar a lista de produtos no localStorage
        const carrinho = obterProdutosDoCarrinho();
        // testar se o produto já existe no carrinho
        const existeProduto = carrinho.find(produto => produto.id === produtoId);
        // se existe produto, incrementar a quantidade
        if (existeProduto) {
            existeProduto.quantidade += 1;
        } else {
            // se não existe, adicionar o produto com quantidade 1
            const produto = {
                id: produtoId,
                nome: produtoNome,
                imagem: produtoImagem,
                preco: produtoPreco,
                quantidade: 1
            };
            carrinho.push(produto);
        }

        salvarProdutosNoCarrinho(carrinho);
    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}