// Refatoração: removidos comentários redundantes e agrupados objetivos em funções bem definidas.
// Melhoria: comentários explicativos agora estão junto das funções para facilitar manutenção.

// Melhoria: extraída função para adicionar produto ao carrinho, facilitando reuso e testes.
function adicionarProdutoAoCarrinho(produto) {
    const carrinho = obterProdutosDoCarrinho();
    const existeProduto = carrinho.find(item => item.id === produto.id);
    if (existeProduto) {
        existeProduto.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}

// Melhoria: listener separado para clareza e manutenção.
document.querySelectorAll('.adicionar-ao-carrinho').forEach(botao => {
    botao.addEventListener("click", evento => {
        const elementoProduto = evento.target.closest(".produto");
        if (!elementoProduto) return;
        const produto = {
            id: elementoProduto.dataset.id,
            nome: elementoProduto.querySelector(".nome").textContent,
            imagem: elementoProduto.querySelector("img").getAttribute("src"),
            preco: parseFloat(
                elementoProduto.querySelector(".preco").textContent
                    .replace("R$ ", "")
                    .replace(".", "")
                    .replace(",", ".")
            )
        };
        adicionarProdutoAoCarrinho(produto);
    });
});

// Melhoria: funções utilitárias documentadas e simplificadas.
function salvarProdutosNoCarrinho(carrinho) {
    // Salva o carrinho no localStorage
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    // Recupera o carrinho do localStorage ou retorna array vazio
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

function atualizarContadorCarrinho() {
    // Atualiza o contador de itens do carrinho no ícone
    const produtos = obterProdutosDoCarrinho();
    const total = produtos.reduce((soma, produto) => soma + produto.quantidade, 0);
    document.getElementById("contador-carrinho").textContent = total;
}

function renderizarTabelaDoCarrinho() {
    // Renderiza a tabela do carrinho dinamicamente
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content table tbody");
    corpoTabela.innerHTML = "";
    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="td-produto">
                <img src="${produto.imagem}" alt="${produto.nome}" />
            </td>
            <td>${produto.nome}</td>
            <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
            <td class="td-quantidade">
                <input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1">
            </td>
            <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".",",")}</td>
            <td><button class="btn-remover" data-id="${produto.id}" id="deletar"></button></td>
        `;
        corpoTabela.appendChild(tr);
    });
}

// Melhoria: listener único para eventos do tbody, usando delegation para remover produtos.
const corpoTabela = document.querySelector("#modal-1-content table tbody");
corpoTabela.addEventListener("click", evento => {
    if (evento.target.classList.contains("btn-remover")) {
        removerProdutoDoCarrinho(evento.target.dataset.id);
    }
});

// Melhoria: listener para atualizar quantidade, com validação de valor mínimo.
corpoTabela.addEventListener("input", evento => {
    if (evento.target.classList.contains("input-quantidade")) {
        const produtos = obterProdutosDoCarrinho();
        const produto = produtos.find(p => p.id === evento.target.dataset.id);
        let novaQuantidade = Math.max(1, parseInt(evento.target.value) || 1); // Garante mínimo 1
        if (produto) {
            produto.quantidade = novaQuantidade;
        }
        salvarProdutosNoCarrinho(produtos);
        atualizarCarrinhoETabela();
    }
});

function removerProdutoDoCarrinho(id) {
    // Remove produto do carrinho pelo id
    const produtos = obterProdutosDoCarrinho();
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela();
}

function atualizarValorTotalCarrinho() {
    // Atualiza o valor total do carrinho
    const produtos = obterProdutosDoCarrinho();
    const total = produtos.reduce((soma, produto) => soma + produto.preco * produto.quantidade, 0);
    document.querySelector("#total-carrinho").textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
}

function atualizarCarrinhoETabela() {
    // Atualiza contador, tabela e valor total
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalCarrinho();
}

// Melhoria: inicialização clara do carrinho ao carregar a página.
atualizarCarrinhoETabela();
