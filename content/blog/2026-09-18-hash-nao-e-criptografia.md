---
title: "Aquela vez em que descobri que hash não era criptografia"
date: 2026-09-18
description: "Hash e criptografia embaralham bits, e por isso parecem a mesma coisa. Não são. Um é uma impressão digital; o outro é um cadeado com chave. Confundi-los muda o que dá para proteger — e o que dá para recuperar."
categories:
  - segurança
  - linux
tags:
  - hash
  - criptografia
  - sha256
  - senhas
  - seguranca
  - md5
draft: false
---

Eu queria esconder uma senha.

Não uma senha importante. Só uma daquelas que a gente anota “só por enquanto” e depois esquece que anotou.

Alguém tinha dito:

> “Não guarda senha em texto puro. Criptografa.”

Parecia um conselho adulto.

Abri o terminal e fiz a primeira coisa que o próprio Linux me entregou:

```bash
echo -n "senha123" | sha256sum
```

A resposta veio imediatamente:

```text
55a5e9e78207b4df8699d60886fa070079463547b095d1a05bc719bb4e6cd251  -
```

Pronto.

A senha tinha virado um emaranhado de letras e números.

Guardei aquele hash num arquivo, apaguei a senha original e fiquei com a sensação de ter feito a coisa certa.

Semanas depois, precisei da senha de volta.

Foi aí que a internet me devolveu uma frase que, na época, soou quase ofensiva:

> **Você não descriptografa um hash.**

Eu tinha certeza de que tinha criptografado a senha.

Só que não tinha.

---

## O que eu achava que tinha acontecido

Na minha cabeça, o computador tinha feito isto:

```text
senha123  →  embaralha  →  55a5e9e7...
                 ↓
         depois dá para voltar
```

Afinal, criptografar é isso, não é?

Pegar uma informação, torná-la ilegível, e depois — com a chave certa — recuperar o original.

O `sha256sum` tinha me dado um texto ilegível.

Então eu estava seguro.

O erro estava exatamente aí.

**Ilegível não é o mesmo que criptografado.**

---

## O que um hash realmente é

Um hash é mais parecido com uma **impressão digital** do que com um cadeado.

Você coloca um dado qualquer de um lado:

```text
uma senha
um arquivo
uma mensagem
um commit inteiro
```

Do outro lado, sai um resumo de tamanho fixo.

No caso do SHA-256, esse resumo tem sempre 256 bits.

Em hexadecimal, isso vira 64 caracteres.

Sempre.

Uma letra:

```bash
echo -n "a" | sha256sum
```

```text
ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb  -
```

Uma senha:

```bash
echo -n "senha123" | sha256sum
```

```text
55a5e9e78207b4df8699d60886fa070079463547b095d1a05bc719bb4e6cd251  -
```

Dez mil letras:

```python
import hashlib
print(hashlib.sha256(("x" * 10000).encode()).hexdigest())
```

Ainda assim, 64 caracteres.

O hash não cresce junto com o arquivo.

Ele não guarda o conteúdo.

Ele **identifica** o conteúdo.

---

## Uma mudança pequena, um resultado completamente diferente

Isso fica mais fácil de ver com duas senhas quase iguais.

```bash
echo -n "senha123" | sha256sum
echo -n "senha124" | sha256sum
```

```text
55a5e9e78207b4df8699d60886fa070079463547b095d1a05bc719bb4e6cd251  -
5bbc0ec9815106b520475fd75f82c4b25e8d509348764255ad9563e8854fd5b0  -
```

Só um dígito mudou.

O hash mudou inteiro.

Não existe “quase o mesmo hash”.

Não dá para olhar os primeiros caracteres e adivinhar o original.

Essa propriedade tem um nome bonito — **efeito avalanche** — mas a ideia é simples:

> se o dado muda um pouco, a impressão digital muda completamente.

É por isso que hashes servem tão bem para responder uma pergunta específica:

**isso ainda é a mesma coisa?**

---

## Podemos conferir um arquivo inteiro

Imagine que você baixou uma imagem ISO.

O site da distribuição publica:

```text
SHA256: adda494f1bf7919268c0120be1c6e6ebf5dd92145d5bfbe320ec3948871c2d4b
```

No seu computador:

```bash
sha256sum debian.iso
```

Se o resultado bater, o arquivo que chegou é o mesmo que foi publicado.

Se um único bit tiver mudado no caminho — um download cortado, um espelho estranho, um pendrive com mau contato — o hash não vai coincidir.

O hash não esconde a ISO.

Ele **testemunha** a ISO.

Isso já é uma diferença enorme em relação à criptografia.

A criptografia pergunta:

> **quem pode ler isso?**

O hash pergunta:

> **isso ainda é o que eu penso que é?**

---

## A porta de um lado só

Aqui está o ponto que eu não tinha entendido.

Uma função de hash criptográfica é feita para ser **de uma direção só**.

```text
dado  ──────────────────────►  hash
                                 │
                                 X
                           não dá para voltar
```

Dado o hash:

```text
55a5e9e78207b4df8699d60886fa070079463547b095d1a05bc719bb4e6cd251
```

não existe uma operação inversa do tipo:

```bash
sha256sum --decrypt
```

Esse comando não existe.

Não porque o Linux esqueceu de implementar.

Porque a matemática do hash **descarta informação**.

Vários textos diferentes poderiam, em tese, produzir o mesmo resumo de 256 bits. O espaço de entradas é infinito. O espaço de hashes não é.

Então o hash não “guarda a senha embaralhada”.

Ele guarda um **rastro**.

Um rastro suficiente para reconhecer a senha se ela aparecer de novo.

Insuficiente para reconstruí-la.

---

## Então o que é criptografia?

Criptografia é outro ofício.

Ela também embaralha.

Mas ela embaralha **com uma chave**, e a intenção é exatamente a oposta da do hash:

```text
texto  +  chave  ────►  texto cifrado
texto cifrado  +  chave  ────►  texto
```

Dá para ir.

Dá para voltar.

Se você tem a chave.

No Linux, uma demonstração pequena com AES fica assim:

```bash
echo -n "ola" | openssl enc -aes-256-cbc -pbkdf2 -iter 10000 -pass pass:segredo -base64 -A
```

Pode sair algo como:

```text
U2FsdGVkX183s6vVms3TVWbDcmIL++CHx+vxfdzyNQ4=
```

Parece um hash.

Não é.

Porque existe o caminho de volta:

```bash
echo -n "U2FsdGVkX183s6vVms3TVWbDcmIL++CHx+vxfdzyNQ4=" \
  | openssl enc -d -aes-256-cbc -pbkdf2 -iter 10000 -pass pass:segredo -base64 -A
```

```text
ola
```

A mensagem voltou.

Isso é criptografia.

Sem a senha `segredo`, aquele emaranhado continua ilegível.

Com a senha, o original reaparece.

Um hash nunca faz essa segunda metade.

---

## Outra pista: o mesmo texto, resultados diferentes

Se você rodar o `sha256sum` duas vezes na mesma frase, o resultado é idêntico.

Sempre.

```bash
echo -n "hello" | sha256sum
echo -n "hello" | sha256sum
```

```text
2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824  -
2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824  -
```

Hash é **determinístico**.

A mesma entrada produz a mesma impressão digital.

Criptografia boa, em geral, não se comporta assim.

Se você criptografar `ola` duas vezes com a mesma senha, o OpenSSL coloca um sal aleatório no começo. Os textos cifrados saem diferentes:

```text
U2FsdGVkX1/Kh8F+/ZBaoaD3wlxWEluRzQVvcuq/lRw=
U2FsdGVkX18ZIJkgdZiZPq8K3yGlwFe3Lr2PLzKIZCg=
```

Os dois, no entanto, voltam para `ola` com a mesma chave.

Isso não é um defeito.

É proteção.

Se o mesmo texto sempre produzisse o mesmo cifrado, um observador poderia começar a reconhecer padrões: “essa mensagem de novo”, “essa senha de novo”, “esse arquivo de novo”.

Hash quer reconhecimento.

Criptografia quer sigilo.

Por isso um precisa ser estável, e o outro, não.

---

## A tabela que eu gostaria de ter visto antes

```text
                 HASH                         CRIPTOGRAFIA
────────────────────────────────────────────────────────────────
intenção         identificar                  esconder
direção          só ida                       ida e volta
chave            não usa (o hash puro)        precisa de chave
tamanho          fixo                         cresce com o dado
mesmo dado       sempre o mesmo hash          cifrado pode variar
pergunta         "é o mesmo?"                 "quem pode ler?"
recuperar        não                          sim, com a chave
exemplo          sha256sum, Git, senhas       AES, GPG, HTTPS
```

Quando alguém diz:

> “Vou criptografar a senha com SHA-256.”

está misturando as duas colunas.

O SHA-256 não criptografa.

Ele hasheia.

E essa diferença não é pedantismo de dicionário.

Ela muda o que você ainda consegue fazer depois.

---

## Por que a confusão é tão comum?

Porque, de fora, os dois produzem o mesmo tipo de coisa:

```text
um bloco de caracteres sem sentido
```

E a linguagem cotidiana não ajuda.

A gente diz “embaralhar”, “codificar”, “proteger”, “esconder”.

Em fóruns, em código legado, em comentários de banco de dados, aparece o tempo inteiro:

```sql
password_encrypted
```

quando o que está lá é um hash.

Codificar também não é criptografar.

Base64, por exemplo, só muda a representação:

```bash
echo -n "ola" | base64
```

```text
b2xh
```

Qualquer pessoa reverte:

```bash
echo -n "b2xh" | base64 -d
```

```text
ola
```

Não há segredo.

Há só um alfabeto diferente.

Então vale guardar três palavras em gavetas separadas:

```text
codificar      →  mudar a forma, dá para voltar sem chave
hashear        →  gerar uma impressão digital, não dá para voltar
criptografar   →  esconder com chave, dá para voltar com a chave
```

Elas não são sinônimos.

Só parecem, enquanto a gente não precisa do original de volta.

---

## E as senhas? Aí o hash entra de propósito

Depois daquela tentativa frustrada de “descriptografar” minha senha, a pergunta virou outra:

> Se não dá para voltar, como um site sabe que eu digitei a senha certa?

Ele não guarda a senha.

Ele guarda o hash.

No login, o caminho é:

```text
você digita a senha
        ↓
o servidor calcula o hash
        ↓
compara com o hash guardado
        ↓
bateu? entra
não bateu? recusa
```

O servidor nunca precisa ver a senha original de novo.

Se o banco vazar, o atacante não ganha automaticamente a lista de senhas.

Ganha uma lista de hashes.

Isso já é melhor do que texto puro.

Mas ainda não é o fim da história.

---

## SHA-256 sozinho é um hash ruim para senha

Aqui eu tropecei de novo.

Pensei:

> “Beleza. Então eu guardo SHA-256 da senha e estou seguro.”

Não está.

O SHA-256 é rápido.

Isso é uma virtude quando você quer conferir um arquivo de 4 GB.

É um problema quando alguém tenta adivinhar senhas.

Um atacante não precisa “desfazer” o hash.

Ele faz o caminho de ida, milhões de vezes:

```text
123456      → hash → compara
senha       → hash → compara
senha123    → hash → compara
qwerty      → hash → compara
```

Com hardware comum, dá para testar quantidades absurdas de tentativas.

E tem pior.

Se duas pessoas usam `senha123`, o SHA-256 delas é **idêntico**.

```text
usuário A:  55a5e9e78207b4df8699d60886fa070079463547b095d1a05bc719bb4e6cd251
usuário B:  55a5e9e78207b4df8699d60886fa070079463547b095d1a05bc719bb4e6cd251
```

O vazamento conta uma história extra:

> essas duas contas usam a mesma senha.

Por isso senha não vai para o banco como:

```text
SHA-256(senha)
```

Vai com **sal**.

Um sal é um valor aleatório, diferente para cada usuário, misturado na senha antes do hash.

```text
usuário A:  SHA-256(sal_A + senha123)  →  hash diferente
usuário B:  SHA-256(sal_B + senha123)  →  hash diferente
```

Agora as duas contas deixam de parecer iguais.

E as tabelas prontas de hashes conhecidos — as famosas rainbow tables — perdem boa parte da graça.

Ainda assim, SHA-256 com sal continua rápido demais.

Para senha, o que se quer é um hash **propositalmente lento** e, de preferência, faminto por memória.

Nomes que existem exatamente para isso:

```text
Argon2id
scrypt
bcrypt
```

Eles não tentam ser rápidos.

Tentam tornar cada chute caro.

Quanto mais o hardware evolui, mais se aumenta o custo.

É o contrário de um `sha256sum`, que queremos instantâneo.

---

## MD5 também parece um hash. Só que já não se confia nele

Outra armadilha clássica:

```bash
echo -n "senha123" | md5sum
```

```text
e7d80ffeefa212b7c5c55700e4f7193e  -
```

O MD5 ainda aparece em tutoriais, em sistemas antigos, em checksums de arquivo.

Para conferir se um download se corrompeu por acidente, às vezes ainda se usa.

Para segurança, não.

O MD5 está quebrado para uso criptográfico: dá para fabricar colisões, ou seja, dois arquivos diferentes com o mesmo MD5.

Se a pergunta for:

> “alguém poderia ter trocado este arquivo de propósito e mantido o mesmo hash?”

MD5 não responde mais.

SHA-1 também já não é casa segura.

SHA-256, hoje, ainda é o hash “do dia a dia” para integridade: Git, assinaturas, conferência de arquivos, HTTPS por baixo dos panos.

Só não o coloque no lugar de um algoritmo de senha.

Nem no lugar de um algoritmo de criptografia.

---

## O Git já estava usando hash o tempo todo

Se você já fez:

```bash
git log --oneline
```

já viu hashes.

```text
a83f91d Melhora mensagem inicial
```

Aquele pedaço não é um nome bonito escolhido por alguém.

É o começo do hash do commit.

O Git identifica cada commit, cada árvore e cada arquivo por um resumo criptográfico.

Por isso uma alteração mínima muda o identificador.

Por isso “o mesmo commit” em dois computadores é realmente o mesmo objeto.

O Git não está criptografando o seu código.

Ele está **reconhecendo** o seu código.

Mais uma vez: impressão digital, não cadeado.

Quem quiser esconder o repositório usa outra ferramenta.

GPG, por exemplo, entra nessa outra conversa: cifrar um arquivo, assinar uma mensagem, verificar autoria.

Assinatura digital, aliás, mistura os dois mundos.

Primeiro o hash resume o documento.

Depois a chave privada assina aquele resumo.

Ninguém assina o arquivo inteiro bit a bit.

Assina a impressão digital.

E é por isso que um único bit alterado invalida a assinatura.

---

## HMAC: um hash que conhece um segredo

Existe ainda um primo que costuma entrar na mesma confusão.

HMAC.

Não é criptografia de conteúdo.

Não é o jeito certo de guardar senha.

É um hash combinado com uma **chave secreta**, para responder:

> “esta mensagem veio de quem conhece o segredo, e não foi alterada no caminho?”

APIs usam isso o tempo inteiro.

O servidor e o cliente compartilham uma chave.

A requisição leva um código.

Quem não tem a chave não consegue forjar um HMAC válido.

Ainda assim, o corpo da mensagem pode estar visível.

Integridade e autenticidade não são sigilo.

Mais uma gaveta.

```text
hash     →  é o mesmo dado?
HMAC     →  é o mesmo dado, e veio de quem tem a chave?
AES/GPG  →  só lê quem tem a chave
senha    →  Argon2/bcrypt/scrypt, com sal, devagar
```

Quatro problemas.

Quatro ferramentas.

---

## Um pequeno laboratório no Python

Se quiser ver o hash nascer sem sair do interpretador:

```python
import hashlib

print(hashlib.sha256(b"senha123").hexdigest())
print(hashlib.sha256(b"senha124").hexdigest())
print(hashlib.md5(b"senha123").hexdigest())
```

A primeira linha deve devolver exatamente:

```text
55a5e9e78207b4df8699d60886fa070079463547b095d1a05bc719bb4e6cd251
```

A segunda, outra coisa completamente diferente.

A terceira, um MD5 de 32 caracteres.

Nenhuma dessas linhas devolve `senha123`.

Não existe `hashlib.sha256_decrypt()`.

Se o objetivo for guardar senha de verdade, não implemente o esquema na mão.

Use uma biblioteca feita para isso, que já embute sal, custo e formato:

```text
argon2-cffi
bcrypt
```

O código de login, grosso modo, só faz duas coisas:

```text
ao cadastrar:  gerar hash lento e guardar
ao entrar:     hashear de novo e comparar
```

Nunca:

```text
ao cadastrar:  criptografar a senha
ao entrar:     descriptografar e comparar com o que a pessoa digitou
```

O segundo caminho exige que o servidor saiba voltar à senha original.

Se o servidor consegue, um invasor com as mesmas chaves também consegue.

É precisamente o que não queremos.

---

## O mapa da confusão

Depois daquela senha que eu “criptografei” com `sha256sum`, o mapa ficou mais honesto:

```text
                    VOCÊ TEM UM DADO
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
        só conferir     esconder      guardar senha
            │              │              │
            ▼              ▼              ▼
          HASH         CRIPTOGRAFIA    HASH LENTO
       sha256sum          AES             Argon2
          Git             GPG            bcrypt
       download          HTTPS           scrypt
            │              │              │
            ▼              ▼              ▼
      dá para             dá para        não dá
      comparar            voltar         para voltar
      não dá              com a          de propósito
      para voltar         chave
```

Três setas.

Três destinos.

O erro foi ter pego a seta da esquerda achando que era a do meio.

---

## O que eu gostaria de ter dito para mim mesmo

Não era burrice.

Era vocabulário.

O computador tinha feito exatamente o que eu pedi.

Eu é que tinha pedido a ferramenta errada.

`sha256sum` não tranca porta.

Ele tira uma foto da fechadura.

Uma foto muito boa: se a porta mudar, a foto não bate.

Mas uma foto da fechadura não abre a casa, e também não impede ninguém de entrar.

Para esconder, criptografia.

Para reconhecer, hash.

Para senha, hash lento, com sal, feito por quem já errou isso por nós.

E da próxima vez que alguém disser:

> “criptografei com SHA-256”

vale a pena parar um segundo.

Talvez tenha só hasheado.

E, se hasheou, o original não vai voltar.

Não porque o comando falhou.

Porque, desta vez, o computador fez a coisa certa.

---

## Continua por aqui

A crônica do [GPG]({{< relref "2024-12-05-criptografia-gpg.md" >}}) é o outro lado desta história: lá o cadeado existe de verdade, com chave pública e chave privada.

As [variáveis de ambiente]({{< relref "2024-12-29-variaveis.md" >}}) mostram outro jeito clássico de vazar segredo — às vezes sem hash, sem cifra, só um arquivo `.env` no lugar errado.
