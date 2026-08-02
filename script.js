// ===============================
// Lista de livros
// ===============================

const livros = [];

// ===============================
// Elementos da página
// ===============================

const listaLivros = document.getElementById("lista-livros");
const ultimosLivros = document.getElementById("ultimos-livros");

const inputTitulo = document.getElementById("titulo");
const inputAutor = document.getElementById("autor");
const inputImagem = document.getElementById("imagem");
const inputFrase = document.getElementById("frase");

const btnAdicionar = document.getElementById("adicionar");

// ===============================
// Adicionar livro
// ===============================

btnAdicionar.addEventListener("click", adicionarLivro);

function adicionarLivro() {

    const titulo = inputTitulo.value.trim();
    const autor = inputAutor.value.trim();
    const imagem = inputImagem.value.trim();
    const frase = inputFrase.value.trim();

    if (!titulo || !autor || !imagem || !frase) {

        alert("Preencha todos os campos!");

        return;

    }

    const livro = {

        titulo,
        autor,
        imagem,
        frase

    };

    livros.push(livro);

    atualizarPagina();

    limparFormulario();

}

// ===============================
// Atualizar página
// ===============================

function atualizarPagina() {

    atualizarListaLivros();

    atualizarSidebar();

}

// ===============================
// Mostrar livros
// ===============================

function atualizarListaLivros() {

    listaLivros.innerHTML = "";

    livros.forEach((livro) => {

        const artigo = document.createElement("article");

        artigo.className = "livro";

        artigo.innerHTML = `
        
            <figure>

                <img src="${livro.imagem}" alt="${livro.titulo}">

                <figcaption>${livro.autor}</figcaption>

            </figure>

            <div>

                <h2>${livro.titulo}</h2>

                <p>${livro.frase}</p>

            </div>

        `;

        listaLivros.appendChild(artigo);

    });

}

// ===============================
// Atualizar Sidebar
// ===============================

function atualizarSidebar() {

    document.getElementById("total-livros").textContent = livros.length;

    ultimosLivros.innerHTML = "";

    const ultimos = livros.slice(-5).reverse();

    ultimos.forEach((livro) => {

        const li = document.createElement("li");

        li.textContent = livro.titulo;

        ultimosLivros.appendChild(li);

    });

    atualizarAutorMaisLido();

}

// ===============================
// Autor mais lido
// ===============================

function atualizarAutorMaisLido() {

    const contador = {};

    livros.forEach((livro) => {

        contador[livro.autor] = (contador[livro.autor] || 0) + 1;

    });

    let maior = 0;
    let autor = "-";

    for (const nome in contador) {

        if (contador[nome] > maior) {

            maior = contador[nome];

            autor = nome;

        }

    }

    document.getElementById("autor-mais-lido").textContent = autor;

    document.getElementById("total-autores").textContent =
        Object.keys(contador).length;

}

// ===============================
// Limpar formulário
// ===============================

function limparFormulario() {

    inputTitulo.value = "";
    inputAutor.value = "";
    inputImagem.value = "";
    inputFrase.value = "";

}
