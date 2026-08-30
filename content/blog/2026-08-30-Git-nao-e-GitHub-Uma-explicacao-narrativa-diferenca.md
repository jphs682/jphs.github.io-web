---
title: 'Aquela vez em que descobri que Git não era GitHub'
date: '2026-08-30T19:34:26-03:00'
description: "Git e GitHub aparecem quase sempre na mesma conversa, mas não são a mesma coisa. Nesta crônica, vamos entender onde termina o Git, onde começa o GitHub e por que essa diferença importa."
categories: 
  - programação
  - código-aberto
tags:
  - git
  - github
  - controle-de-versao
  - repositorio
  - codigo-aberto

draft: false
---

Era uma daquelas coisas que pareciam óbvias.

Eu tinha um projeto, alguns arquivos espalhados pelo computador e uma vontade bastante simples: não perder o trabalho.

Então alguém falou:

> "Coloca no GitHub."

Pronto.

Na minha cabeça, a solução estava resolvida.

Instalar o Git, criar uma conta no GitHub, mandar os arquivos para lá e continuar programando.

Só havia um pequeno problema.

**Git não é GitHub.**

Durante muito tempo, essa diferença parece desnecessária. Afinal, os dois nomes aparecem juntos o tempo inteiro. Você usa `git`, envia para o GitHub e vê seus arquivos no navegador.

Parece uma coisa só.

Mas não é.

E entender essa diferença muda bastante a forma como enxergamos o desenvolvimento de software.

---

## Primeiro vamos esquecer o GitHub

Imagine que você esteja trabalhando em um projeto chamado `meu-programa`.

Você cria a pasta:

```bash
mkdir meu-programa
cd meu-programa
```

Cria um arquivo:

```bash
vim main.py
```

E escreve:

```python
print("Olá, mundo!")
```

Nesse momento, existe apenas uma pasta no seu computador.

Nenhum GitHub.

Nenhum servidor.

Nenhuma conta.

Nada disso.

Agora você pode transformar aquela pasta em um repositório Git:

```bash
git init
```

O Git responde:

```text
Initialized empty Git repository...
```

E é aqui que começa a história.

---

# Então o que é Git?

O **Git é um sistema de controle de versão distribuído**.

Em palavras menos assustadoras:

> Git é uma ferramenta que acompanha as mudanças feitas nos arquivos de um projeto.

Ele permite saber:

* o que mudou;
* quando mudou;
* quem fez a mudança;
* qual era o estado anterior;
* voltar para uma versão antiga;
* criar ramificações;
* juntar mudanças diferentes;
* trabalhar com outras pessoas.

E existe uma característica importante:

**Git funciona no seu computador.**

Você não precisa de GitHub para usar Git.

Depois do:

```bash
git init
```

você pode verificar o estado do projeto:

```bash
git status
```

Talvez apareça algo parecido com:

```text
Untracked files:
    main.py
```

O Git encontrou o arquivo.

Mas ainda não registrou a mudança.

---

# O primeiro registro

Agora podemos adicionar o arquivo:

```bash
git add main.py
```

E depois criar um commit:

```bash
git commit -m "Adiciona programa inicial"
```

Pronto.

Você acabou de criar uma fotografia do estado do projeto.

O Git passou a saber:

```text
Projeto
  │
  └── Commit 1
       │
       └── main.py
```

Ainda não existe GitHub.

E está tudo funcionando.

---

# "Mas onde está o GitHub?"

Essa é justamente a parte interessante.

O GitHub entra quando queremos colocar nosso repositório em outro lugar.

Imagine que o Git seja o caderno onde você registra a história do projeto.

O GitHub seria uma espécie de **casa na internet onde você pode hospedar esse repositório e compartilhá-lo com outras pessoas**.

Você pode ter:

```text
Seu computador
      │
      │ Git
      ▼
Repositório local
      │
      │ git push
      ▼
GitHub
      │
      ├── colaboradores
      ├── issues
      ├── pull requests
      └── página do projeto
```

São coisas diferentes.

---

# O Git trabalha localmente

Uma das ideias mais importantes do Git é que o repositório é distribuído.

Quando você clona um projeto:

```bash
git clone https://exemplo.com/projeto.git
```

você não está simplesmente baixando uma pasta.

Você está recebendo uma cópia do repositório Git.

Isso significa que grande parte da história do projeto está disponível localmente.

Por isso você pode executar:

```bash
git log
```

mesmo sem estar conectado ao GitHub.

Pode criar commits:

```bash
git commit -m "Corrige erro no programa"
```

Pode criar uma branch:

```bash
git switch -c nova-funcionalidade
```

E pode consultar diferenças:

```bash
git diff
```

Tudo isso pode acontecer sem abrir o navegador.

---

# Então para que serve o GitHub?

Agora chegamos ao outro lado da história.

O GitHub é uma **plataforma de hospedagem e colaboração em torno de repositórios Git**.

Ele oferece muito mais do que simplesmente guardar arquivos.

Por exemplo:

* hospedagem de repositórios;
* colaboração entre desenvolvedores;
* Pull Requests;
* Issues;
* revisão de código;
* Actions;
* releases;
* páginas de projetos;
* integração com outras ferramentas.

É por isso que Git e GitHub aparecem tanto juntos.

O Git controla a história.

O GitHub ajuda pessoas a **compartilhar, colaborar e trabalhar em cima dessa história**.

---

# A primeira ponte: `remote`

Depois de criar um repositório no GitHub, podemos ligar o nosso projeto local a ele.

Por exemplo:

```bash
git remote add origin https://github.com/usuario/meu-programa.git
```

Agora existe uma relação:

```text
meu computador
     │
     │ origin
     ▼
GitHub
```

Podemos conferir:

```bash
git remote -v
```

E veremos algo parecido com:

```text
origin  https://github.com/usuario/meu-programa.git (fetch)
origin  https://github.com/usuario/meu-programa.git (push)
```

O nome `origin` é apenas um nome convencional para o repositório remoto.

Não é sinônimo de GitHub.

Isso é importante.

Você poderia chamar o remoto de:

```bash
git remote add servidor ...
```

ou:

```bash
git remote add escola ...
```

ou:

```bash
git remote add origin ...
```

O Git não se importa.

---

# `push`: levando mudanças para o remoto

Agora suponha que fizemos um commit:

```bash
git add .
git commit -m "Adiciona primeira versão"
```

Para enviar esse commit para o repositório remoto:

```bash
git push origin main
```

Aqui aparece uma palavra que causa muita confusão:

**push.**

Push significa, de forma simplificada:

> enviar os commits do seu repositório local para o repositório remoto.

O Git faz o trabalho.

O GitHub é apenas um dos possíveis lugares onde esse repositório remoto pode estar.

---

# `pull`: trazendo mudanças

Agora imagine o contrário.

Outra pessoa alterou o projeto e enviou mudanças para o remoto.

Você pode trazer essas mudanças com:

```bash
git pull
```

Nesse momento:

```text
GitHub
  │
  │ pull
  ▼
Seu computador
```

Mais uma vez:

**Git executa a operação.**

O GitHub fornece o repositório remoto.

---

# Git não depende do GitHub

Essa talvez seja a ideia mais importante deste texto.

Você pode usar Git com:

* GitHub;
* GitLab;
* Codeberg;
* Bitbucket;
* servidor próprio;
* servidor SSH;
* computador de outra pessoa;
* rede local;
* praticamente qualquer lugar que possa funcionar como remoto Git.

Inclusive, você pode usar Git sem nenhum remoto.

Por exemplo:

```bash
git init
git add .
git commit -m "Primeiro commit"
```

E continuar trabalhando durante meses.

Seu projeto continuará sendo um projeto Git.

Mesmo que nunca exista uma conta no GitHub.

---

# E GitHub pode trabalhar com outras coisas

O GitHub foi construído em torno do Git, mas ele não é simplesmente "o Git na internet".

A plataforma adiciona ferramentas para colaboração.

Imagine uma equipe.

Uma pessoa cria uma funcionalidade:

```text
feature-login
```

Faz seus commits e envia a branch:

```bash
git push origin feature-login
```

No GitHub, essa pessoa pode abrir uma **Pull Request**.

Agora outras pessoas podem:

* revisar o código;
* comentar;
* sugerir alterações;
* discutir a implementação;
* aprovar;
* solicitar mudanças.

Isso é uma camada de colaboração construída ao redor do Git.

---

# Branch também é Git

Outro erro comum é pensar que branch é uma função do GitHub.

Não é.

Branch é um conceito do Git.

Você pode criar uma:

```bash
git switch -c desenvolvimento
```

Listar:

```bash
git branch
```

Trocar:

```bash
git switch main
```

E juntar:

```bash
git merge desenvolvimento
```

Tudo isso pode acontecer localmente.

O GitHub pode ajudar a compartilhar essas branches, revisar mudanças e organizar o trabalho da equipe.

Mas o conceito de branch pertence ao Git.

---

# Git é uma ferramenta. GitHub é uma plataforma.

Talvez essa seja a maneira mais simples de guardar tudo isso.

Pense assim:

```text
GIT
│
├── commits
├── branches
├── merge
├── diff
├── log
├── clone
├── push
└── pull
```

Enquanto o GitHub oferece:

```text
GITHUB
│
├── repositórios Git
├── Pull Requests
├── Issues
├── Code Review
├── Actions
├── Releases
├── colaboração
└── hospedagem
```

Um depende fortemente do outro no fluxo moderno de desenvolvimento, mas eles não são a mesma coisa.

---

# E talvez essa confusão seja até compreensível

O problema é que hoje é muito comum começar a programar através do GitHub.

A pessoa cria uma conta.

Cria um repositório.

Clica em alguma opção.

Depois aprende:

```bash
git clone
git add
git commit
git push
```

E acaba associando tudo ao mesmo lugar.

Foi exatamente aí que muita gente começou.

Primeiro veio o GitHub.

Depois veio o Git.

Quando talvez fosse mais interessante conhecer primeiro a ferramenta que está por baixo.

---

# Uma pequena experiência

Se quiser entender isso de verdade, faça um teste.

Crie uma pasta:

```bash
mkdir experimento-git
cd experimento-git
```

Inicialize:

```bash
git init
```

Crie um arquivo:

```bash
echo "Minha primeira versão" > arquivo.txt
```

Veja:

```bash
git status
```

Adicione:

```bash
git add arquivo.txt
```

Faça o commit:

```bash
git commit -m "Primeira versão"
```

Agora altere:

```bash
echo "Minha segunda versão" >> arquivo.txt
```

Veja a diferença:

```bash
git diff
```

E consulte a história:

```bash
git log --oneline
```

Perceba o detalhe.

**Você não precisou do GitHub em nenhum momento.**

Foi apenas você, seu computador e o Git.

---

# Depois o GitHub entra em cena

Agora você pode criar um repositório remoto e conectar:

```bash
git remote add origin URL_DO_REPOSITORIO
```

E enviar:

```bash
git push -u origin main
```

Nesse momento o GitHub passa a fazer parte da história.

Mas ele entrou depois.

Essa ordem ajuda a entender a diferença:

```text
1. Projeto
      ↓
2. Git
      ↓
3. Commit
      ↓
4. Repositório remoto
      ↓
5. GitHub
```

Não é:

```text
Git = GitHub
```

É:

```text
Git + plataforma de hospedagem = fluxo colaborativo
```

---

# Existem outros "GitHubs"

E isso fica ainda mais claro quando percebemos que o GitHub não está sozinho.

Existem outras plataformas que trabalham com Git.

Por exemplo:

```text
Git
 │
 ├── GitHub
 ├── GitLab
 ├── Codeberg
 ├── Bitbucket
 └── servidor próprio
```

Você pode trocar o lugar onde hospeda seu repositório sem precisar abandonar o Git.

Seu conhecimento continua válido.

Os comandos continuam sendo, em grande parte:

```bash
git clone
git status
git add
git commit
git push
git pull
git branch
git merge
```

É justamente essa independência que torna o Git tão poderoso.

---

# No fim, é uma questão de entender onde cada peça está

Quando comecei a olhar dessa forma, aquela confusão inicial começou a desaparecer.

Git deixou de ser "a coisa que manda meus arquivos para o GitHub".

Ele passou a ser outra coisa.

Uma ferramenta para registrar a história do código.

O GitHub também deixou de ser "o Git".

Passou a ser uma plataforma onde essa história pode ser hospedada, compartilhada e discutida.

E essa diferença parece pequena até o dia em que você precisa trabalhar em um servidor próprio, migrar um projeto para outra plataforma ou simplesmente trabalhar sem internet.

Nesse momento, entender Git deixa de ser detalhe.

Vira conhecimento.

---

## Para guardar

Se você esquecer todo o resto deste texto, lembre apenas destas duas frases:

> **Git é o sistema de controle de versão.**

> **GitHub é uma plataforma que hospeda repositórios Git e oferece ferramentas de colaboração.**

E quando você executar:

```bash
git commit
```

estará conversando com o **Git**.

Quando executar:

```bash
git push
```

estará usando o **Git** para enviar seus commits para um remoto — que pode ser o **GitHub**, mas não precisa ser.

Talvez essa seja a melhor maneira de enxergar a diferença:

**Git conta a história do seu código.
GitHub ajuda você a contar essa história para outras pessoas.**

Esse formato já está adequado para virar um arquivo `content/blog/2026-08-30-git-nao-e-github.md`. Uma boa continuação para a série seria um artigo chamado **“O commit não é um salvamento: entendendo a história do Git”**, aprofundando `working tree`, `staging area`, `commit`, `branch` e `remote`.
