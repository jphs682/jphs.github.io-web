---
title: "A viagem de um arquivo até virar um commit"
date: '2026-09-03T20:01:38-03:00'
description: "Um arquivo não vai direto do editor para o Git. Entre a primeira alteração e o repositório remoto existe uma pequena viagem: working tree, staging, commit e remote."
categories: 
- programação
- código-aberto
tags: 
- git
- commit
- staging
- working-tree
- remote
- controle-de-versao
draft: false
---

Era só uma pequena alteração.

Pelo menos foi o que eu pensei.

Abri um arquivo, mudei algumas linhas, salvei e continuei trabalhando.

Até que veio aquela pergunta:

> "E agora, como eu coloco isso no Git?"

A primeira resposta parece simples:

```bash
git commit
```

Só que o Git não funciona exatamente assim.

Antes de um `commit`, existe uma pequena viagem.

O arquivo passa por diferentes lugares e estados:

```text
Working Tree
     ↓
  Staging
     ↓
   Commit
     ↓
  Remote
```

Entender esse caminho é uma das coisas que fazem o Git deixar de parecer uma coleção de comandos estranhos.

---

## A casa onde tudo começa

Vamos imaginar um projeto:

```text
meu-projeto/
├── main.py
├── README.md
└── config.py
```

Dentro dessa pasta existe um repositório Git.

Podemos verificar:

```bash
git status
```

Se nada foi alterado, talvez apareça:

```text
nothing to commit, working tree clean
```

Essa frase é importante.

O Git está dizendo:

> "Eu conheço o estado atual dos seus arquivos e não encontrei nenhuma mudança nova."

Mas então abrimos:

```bash
vim main.py
```

E modificamos o programa.

Talvez tenhamos:

```python
print("Olá, mundo!")
```

e mudamos para:

```python
print("Olá, mundo do Linux!")
```

Salvamos.

Agora alguma coisa mudou.

---

# Primeira parada: Working Tree

Quando modificamos `main.py`, estamos trabalhando naquilo que o Git chama de **working tree**.

É o estado dos arquivos que estão no nosso diretório de trabalho.

Podemos perguntar ao Git:

```bash
git status
```

E ele poderá responder:

```text
Changes not staged for commit:

    modified: main.py
```

Aqui está a primeira grande ideia:

**Modificar um arquivo não significa preparar um commit.**

O arquivo mudou.

O Git percebeu.

Mas o Git ainda não recebeu a ordem:

> "Quero colocar essa alteração no próximo commit."

---

# O Git está olhando, mas não está levando

Essa é uma maneira interessante de imaginar a situação.

A working tree é a nossa mesa.

Estamos trabalhando nela.

Podemos alterar dez arquivos:

```text
main.py
config.py
README.md
teste.py
```

Mas talvez só queiramos registrar dois deles.

Por exemplo:

```bash
git status
```

pode mostrar:

```text
modified: main.py
modified: config.py
modified: README.md
modified: teste.py
```

Talvez `main.py` e `config.py` façam parte de uma única mudança.

O README é outra coisa.

E `teste.py` ainda está incompleto.

Se fizermos:

```bash
git add .
```

mandamos tudo para a próxima etapa.

Talvez não seja isso que queremos.

É aí que aparece o **staging area**.

---

# Segunda parada: Staging

Podemos escolher exatamente o arquivo que queremos preparar:

```bash
git add main.py
```

Agora:

```bash
git status
```

pode mostrar:

```text
Changes to be committed:

    modified: main.py

Changes not staged for commit:

    modified: config.py
    modified: README.md
    modified: teste.py
```

Isso é muito interessante.

O Git agora está separando as coisas.

```text
WORKING TREE
│
├── config.py       ← ainda não preparado
├── README.md       ← ainda não preparado
└── teste.py        ← ainda não preparado
       
STAGING
│
└── main.py         ← preparado
```

O `git add` não significa:

> "salvar definitivamente o arquivo."

Ele significa:

> "colocar esta alteração na área que será usada para o próximo commit."

---

# Por que existe o staging?

No começo, pode parecer burocracia.

Se eu quero fazer um commit, por que não simplesmente:

```bash
git commit
```

e pronto?

Porque o staging nos dá controle.

Imagine que você passou duas horas trabalhando.

Durante esse tempo:

```text
main.py       → corrigiu um erro
config.py     → adicionou configuração
README.md     → começou uma documentação
teste.py      → fez um experimento
```

Tudo aconteceu ao mesmo tempo.

Mas são quatro histórias diferentes.

Você pode preparar somente:

```bash
git add main.py
git add config.py
```

E criar um commit que represente uma ideia coerente.

O README e o experimento ficam de fora.

---

# Podemos até escolher pedaços de um arquivo

E aqui o Git começa a ficar realmente interessante.

Imagine que `main.py` tenha duas alterações diferentes.

Podemos usar:

```bash
git add -p
```

O Git começa a perguntar quais partes queremos adicionar.

Algo parecido com:

```text
Stage this hunk [y,n,q,a,d,s,e,?]?
```

Isso permite montar o próximo commit com bastante precisão.

Não precisamos necessariamente adicionar o arquivo inteiro.

Podemos escolher **partes da alteração**.

É como separar uma pilha de documentos antes de arquivá-los.

---

# Mas onde está o arquivo original?

Uma dúvida comum é:

> "Quando faço `git add`, o arquivo sai da working tree?"

Não.

O arquivo continua exatamente onde estava.

O que muda é o estado que o Git está acompanhando.

Podemos imaginar:

```text
                 main.py
                    │
                    ▼
              Working Tree
                    │
                 git add
                    │
                    ▼
                 Staging
```

A mesma alteração passa a estar preparada para entrar no próximo commit.

---

# Terceira parada: Commit

Agora chegou a hora.

Temos:

```text
Changes to be committed:
    modified: main.py
```

Então executamos:

```bash
git commit -m "Melhora mensagem inicial"
```

O Git cria um novo commit.

Agora temos:

```text
Commit
   │
   ├── autor
   ├── data
   ├── mensagem
   └── estado dos arquivos
```

Podemos verificar:

```bash
git log --oneline
```

E veremos algo como:

```text
a83f91d Melhora mensagem inicial
```

Aquela alteração agora faz parte da história do repositório.

---

# Um commit não é simplesmente um arquivo

Aqui existe outra ideia importante.

Muita gente imagina que um commit seja:

```text
commit = arquivo salvo
```

Não exatamente.

Um commit representa um **estado do projeto naquele ponto da história**, junto com informações sobre essa mudança e seus ancestrais.

Podemos ter:

```text
A → B → C → D
```

Cada letra representa um commit.

Por exemplo:

```text
A
│
└── Projeto inicial

B
│
└── Adiciona login

C
│
└── Corrige autenticação

D
│
└── Adiciona documentação
```

O Git constrói uma história.

É por isso que podemos usar:

```bash
git log
```

para voltar no tempo e entender como o projeto chegou ao estado atual.

---

# O commit está no computador

E aqui aparece uma coisa que costuma confundir quem está começando.

Depois de:

```bash
git commit -m "Minha alteração"
```

o commit **ainda está apenas no seu repositório local**.

Você pode desligar a internet.

Pode fechar o navegador.

Pode até não ter uma conta no GitHub.

O commit continua existindo.

Podemos verificar:

```bash
git log
```

porque o commit está no repositório Git local.

Até aqui:

```text
Computador
│
├── Working Tree
├── Staging
└── Repository
       └── Commit
```

Ainda não chegamos ao remote.

---

# Quarta parada: Remote

Agora imaginemos que nosso projeto esteja conectado a um servidor.

Pode ser:

* GitHub;
* GitLab;
* Codeberg;
* servidor próprio;
* outro computador.

Podemos conferir:

```bash
git remote -v
```

Talvez apareça:

```text
origin  git@github.com:usuario/meu-projeto.git
```

Esse endereço é o nosso **remote**.

E o nome:

```text
origin
```

é apenas o nome tradicional dado ao remoto principal.

---

# A viagem continua com `push`

Agora temos:

```text
Working Tree
      ↓
   Staging
      ↓
    Commit
      ↓
   Remote
```

Para mandar nossos commits para o remoto:

```bash
git push origin main
```

Agora a viagem chega ao servidor.

O commit que existia somente no nosso computador passa a existir também no repositório remoto.

---

# `push` não é `commit`

Essa diferença é fundamental.

Quando fazemos:

```bash
git commit
```

estamos dizendo:

> "Registre esta alteração na história do meu repositório."

Quando fazemos:

```bash
git push
```

estamos dizendo:

> "Envie meus commits para o repositório remoto."

São operações diferentes.

Podemos fazer:

```bash
git commit
git commit
git commit
```

três vezes sem fazer nenhum `push`.

Teremos:

```text
LOCAL

A → B → C → D
```

Enquanto o remoto pode ainda estar em:

```text
REMOTE

A → B
```

Depois:

```bash
git push
```

e o remoto recebe:

```text
REMOTE

A → B → C → D
```

---

# E o caminho de volta?

A viagem também pode acontecer no sentido contrário.

Imagine que outra pessoa fez um commit:

```text
REMOTE

A → B → C
```

Enquanto nosso computador está:

```text
LOCAL

A → B
```

Podemos trazer as mudanças:

```bash
git pull
```

Agora nosso repositório recebe as novas informações.

A história passa a acompanhar o remoto.

---

# O mapa completo

Depois de algum tempo, aquela pequena sequência de comandos começa a fazer sentido:

```text
                    SEU COMPUTADOR
                  ┌─────────────────┐
                  │                 │
                  │  Working Tree   │
                  │       │         │
                  │    git add      │
                  │       ↓         │
                  │    Staging      │
                  │       │         │
                  │  git commit     │
                  │       ↓         │
                  │   Repository    │
                  │       │         │
                  └───────┼─────────┘
                          │
                       git push
                          │
                          ↓
                    ┌─────────────┐
                    │   Remote    │
                    │             │
                    │ GitHub/etc. │
                    └─────────────┘
```

É uma pequena viagem.

E cada parada tem uma função.

---

# Vamos fazer a viagem completa

Agora podemos simular tudo.

Criamos um projeto:

```bash
mkdir viagem-git
cd viagem-git
```

Inicializamos:

```bash
git init
```

Criamos um arquivo:

```bash
echo "# Minha aplicação" > README.md
```

Verificamos:

```bash
git status
```

O arquivo está na working tree.

Agora:

```bash
git add README.md
```

Ele entra no staging.

Verificamos:

```bash
git status
```

Agora fazemos:

```bash
git commit -m "Adiciona README"
```

O commit foi criado.

Verificamos:

```bash
git log --oneline
```

Temos nossa primeira versão.

Depois podemos conectar um remoto:

```bash
git remote add origin URL_DO_REPOSITORIO
```

E enviar:

```bash
git push -u origin main
```

A viagem terminou.

---

# Mas e se eu fizer `git add .`?

Essa é provavelmente uma das perguntas mais importantes.

Você pode fazer:

```bash
git add .
```

Isso adiciona as alterações encontradas no diretório atual ao staging.

É prático.

Muito prático.

Mas existe uma diferença entre:

```bash
git add .
```

e:

```bash
git add main.py
```

O primeiro diz:

> "Prepare todas essas alterações."

O segundo diz:

> "Prepare esta alteração específica."

Para projetos pequenos, `git add .` pode ser conveniente.

Para projetos maiores, vale a pena olhar primeiro:

```bash
git status
```

e decidir exatamente o que deve entrar no commit.

---

# Um bom commit conta uma história

Essa talvez seja a parte mais importante de todas.

Um commit não deveria ser simplesmente:

```text
"alterações"
```

ou:

```text
"coisas"
```

ou:

```text
"final"
```

Uma boa mensagem explica o que aconteceu.

Por exemplo:

```bash
git commit -m "Corrige validação de senha"
```

ou:

```bash
git commit -m "Adiciona suporte a configuração por ambiente"
```

ou:

```bash
git commit -m "Corrige cálculo do valor total"
```

Quando alguém olhar:

```bash
git log --oneline
```

deve conseguir entender a história do projeto.

---

# O erro de pensar que Git é uma pasta mágica

No começo, Git pode parecer uma espécie de pasta invisível que guarda versões.

Mas ele é mais interessante do que isso.

O Git está acompanhando uma história.

Temos:

```text
arquivo modificado
       ↓
   git add
       ↓
 alteração preparada
       ↓
  git commit
       ↓
    histórico
       ↓
   git push
       ↓
    remoto
```

E cada comando tem uma responsabilidade diferente.

---

# Uma analogia simples

Imagine uma biblioteca.

A **working tree** é sua mesa.

Você espalha os livros e trabalha neles.

O **staging** é o carrinho onde coloca os livros que serão arquivados.

O **commit** é o registro oficial de que aqueles livros foram catalogados naquele estado.

O **remote** é uma segunda biblioteca, em outro lugar.

E o `push` é o transporte que leva seus registros até lá.

Assim:

```text
Mesa
 ↓
Carrinho
 ↓
Registro
 ↓
Outra biblioteca
```

Ou, no mundo Git:

```text
Working Tree
 ↓
Staging
 ↓
Commit
 ↓
Remote
```

---

# No fim, o segredo está no caminho

Quando você entende essa viagem, vários comandos deixam de parecer mágicos.

`git status` pergunta:

> "Como está minha situação?"

`git add` diz:

> "Quero preparar isso."

`git commit` diz:

> "Quero registrar isso na história."

`git push` diz:

> "Quero enviar essa história para o remoto."

E `git pull` diz:

> "Quero trazer para cá o que aconteceu lá."

Não é uma sequência de comandos aleatórios.

É um fluxo.

```text
              ALTERAÇÃO
                  │
                  ▼
           Working Tree
                  │
               git add
                  │
                  ▼
              Staging
                  │
             git commit
                  │
                  ▼
             Repositório
                  │
              git push
                  │
                  ▼
               Remote
```

Da próxima vez que você digitar:

```bash
git commit
```

talvez valha a pena lembrar que aquele comando não apareceu sozinho.

Antes dele, existiu uma alteração.

Depois dela, houve uma seleção.

Então veio o registro.

E só depois, se você quiser, essa história pode viajar para outro computador.

**Essa é a viagem de um `git commit`.**
