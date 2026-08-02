const lista = document.getElementById("lista-livros");

const botao = document.getElementById("adicionar");

botao.addEventListener("click", () => {

    const titulo = document.getElementById("titulo").value;

    const autor = document.getElementById("autor").value;

    const imagem = document.getElementById("imagem").value;

    const frase = document.getElementById("frase").value;

    if(
        titulo === "" ||
        autor === "" ||
        imagem === "" ||
        frase === ""
    ){
        alert("Preencha todos os campos!");
        return;
    }

    const livro = document.createElement("section");

    livro.className = "livro";

    livro.innerHTML = `
        <figure>
            <img src="${imagem}" alt="${titulo}">
            <figcaption>${autor}</figcaption>
        </figure>

        <div>
            <h2>${titulo}</h2>
            <p>${frase}</p>
        </div>
    `;

    lista.appendChild(livro);

    document.getElementById("titulo").value = "";
    document.getElementById("autor").value = "";
    document.getElementById("imagem").value = "";
    document.getElementById("frase").value = "";

});
