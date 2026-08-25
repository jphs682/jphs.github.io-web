---
title: "Controle Total: Dominando Permissões no Linux"
date: 2024-10-08
description: "Uma caminhada pelas permissões do Linux, entendendo como arquivos, usuários e grupos definem quem pode acessar, modificar ou executar alguma coisa."
categories:
  - linux
  - segurança
tags:
  - linux
  - permissões
  - chmod
  - chown
draft: false
---

Imagine que você acabou de instalar um Linux.

O sistema inicia.

O terminal está esperando por você.

Os arquivos estão no lugar.

Os programas funcionam.

Tudo parece tranquilo.

Mas existe uma pergunta silenciosa acontecendo o tempo inteiro:

> **Quem pode fazer o quê neste sistema?**

Você pode abrir um arquivo, mas será que outro usuário também pode?

Você consegue modificar uma configuração, mas será que qualquer processo consegue fazer o mesmo?

E aquele script que você baixou da internet?

Ele pode ser executado?

O Linux não responde essas perguntas com confiança cega.

Antes de permitir determinadas ações, ele verifica as permissões.

É um pequeno sistema de regras que funciona silenciosamente enquanto usamos o computador.

E talvez essa seja uma das coisas mais interessantes do Linux: enquanto estamos preocupados com o que aparece na tela, o sistema está preocupado com aquilo que **não deveria acontecer**.

---

## Uma pequena história escondida em nove caracteres

Execute:

```bash
ls -l
```

Em algum momento você provavelmente encontrará algo parecido com:

```text
-rw-r----- 1 usuario usuarios 1024 Out 10 08:15 plano.txt
```

Para quem está começando, isso pode parecer apenas uma sequência de letras.

Mas o Linux está contando uma história.

```text
-rw-r-----
```

Esses caracteres informam quem pode ler o arquivo, quem pode modificá-lo e quem deve permanecer do lado de fora.

É quase como uma placa na porta de uma sala:

> **O proprietário pode entrar.**
>
> **O grupo possui algumas permissões.**
>
> **Os demais precisam ficar do lado de fora.**

Para entender essa linguagem, precisamos separar as peças.

---

## Os três personagens

As permissões do Linux trabalham principalmente com três categorias:

### Proprietário

É o usuário associado ao arquivo.

Podemos alterar o proprietário usando:

```bash
chown
```

### Grupo

É um conjunto de usuários que pode compartilhar determinadas permissões.

Para alterar o grupo associado a um arquivo:

```bash
chgrp
```

### Outros

São todos os usuários que não são o proprietário e não pertencem ao grupo associado ao arquivo.

Parece simples.

E realmente é.

Mas existe outra pergunta:

> **O que cada um desses usuários pode fazer?**

---

## Três poderes: ler, escrever e executar

O Linux possui três permissões básicas:

| Permissão | Símbolo | Em arquivos          | Em diretórios       |
| --------- | ------- | -------------------- | ------------------- |
| Leitura   | `r`     | Ler o conteúdo       | Listar os itens     |
| Escrita   | `w`     | Modificar o conteúdo | Criar/remover itens |
| Execução  | `x`     | Executar o programa  | Acessar o diretório |

É importante perceber uma diferença que costuma confundir quem está começando.

Em um arquivo, `x` significa que ele pode ser executado.

Em um diretório, `x` significa que você pode **acessá-lo**.

Por isso, permissões em diretórios não devem ser interpretadas exatamente da mesma maneira que em arquivos.

---

## Decifrando o `ls -l`

Voltemos ao nosso exemplo:

```text
-rw-r----- 1 usuario usuarios 1024 Out 10 08:15 plano.txt
```

Podemos dividir a primeira parte assim:

```text
- rw- r-- ---
│ │   │   │
│ │   │   └── Outros
│ │   └────── Grupo
│ └────────── Proprietário
└──────────── Tipo
```

O primeiro caractere informa o tipo do recurso.

Por exemplo:

```text
-    arquivo
d    diretório
l    link simbólico
```

Depois aparecem nove caracteres divididos em três grupos:

```text
rw- r-- ---
```

O primeiro grupo pertence ao proprietário:

```text
rw-
```

Ele pode:

* ler;
* escrever;
* não pode executar.

O segundo pertence ao grupo:

```text
r--
```

O grupo pode apenas ler.

O terceiro pertence aos outros usuários:

```text
---
```

Eles não possuem nenhuma dessas permissões.

De repente, aquela sequência aparentemente estranha começa a fazer sentido.

---

## Quando o símbolo vira número

Existe outra maneira bastante conhecida de trabalhar com permissões no Linux: a representação octal.

Cada permissão possui um valor:

| Valor | Permissões |
| ----: | :--------: |
|   `0` |    `---`   |
|   `1` |    `--x`   |
|   `2` |    `-w-`   |
|   `3` |    `-wx`   |
|   `4` |    `r--`   |
|   `5` |    `r-x`   |
|   `6` |    `rw-`   |
|   `7` |    `rwx`   |

Assim:

```text
7 = rwx
6 = rw-
5 = r-x
4 = r--
```

Por isso podemos encontrar comandos como:

```bash
chmod 644 arquivo.txt
```

Nesse caso:

```text
6 → proprietário → rw-
4 → grupo         → r--
4 → outros       → r--
```

Ou seja:

```text
rw-r--r--
```

É uma maneira compacta de dizer ao Linux quais portas devem permanecer abertas.

---

## O comando que muda as regras

O protagonista dessa história é o:

```bash
chmod
```

Com ele podemos alterar as permissões.

Por exemplo:

```bash
chmod u+x script.sh
```

Aqui estamos dizendo:

> Adicione (`+`) execução (`x`) ao proprietário (`u`).

Também podemos remover:

```bash
chmod g-w relatorio.txt
```

Nesse caso:

> Remova (`-`) escrita (`w`) do grupo (`g`).

Ou simplesmente definir:

```bash
chmod o= arquivo.conf
```

Aqui:

> Outros (`o`) não terão nenhuma permissão.

Também existe a forma octal:

```bash
chmod 700 ~/.ssh/
```

Que resulta em:

```text
rwx------
```

O proprietário possui controle total.

Grupo e outros não possuem permissões.

---

## E então aparecem os bits especiais

Quando você começa a entender `r`, `w` e `x`, descobre que a história não termina aí.

Existem permissões especiais.

Entre elas estão:

* **setuid**
* **setgid**
* **sticky bit**

Por exemplo:

```bash
chmod u+s programa
```

pode ativar o **setuid**.

Um exemplo clássico é o programa `passwd`, que precisa realizar determinadas operações que envolvem arquivos protegidos.

Também existe o **setgid**, bastante útil em diretórios compartilhados:

```bash
chmod g+s projeto/
```

E temos o famoso **sticky bit**, muito conhecido por aparecer no `/tmp`:

```text
drwxrwxrwt
```

Ele ajuda a controlar a remoção de arquivos em diretórios compartilhados.

São mecanismos que mostram como o modelo de permissões do Linux vai muito além de simplesmente dizer "pode" ou "não pode".

---

## Quando o poder vira perigo

Toda ferramenta poderosa possui um lado perigoso.

E `chmod` não é exceção.

Talvez você já tenha visto alguém resolver um problema de permissão desta maneira:

```bash
chmod 777 arquivo
```

Funciona?

Muitas vezes, sim.

É uma boa solução?

Geralmente, não.

`777` significa:

```text
rwx rwx rwx
```

Proprietário, grupo e outros recebem todas as permissões.

É como resolver um problema de segurança retirando a porta.

Por isso, evite comandos como:

```bash
sudo chmod -R 777 /
```

**Nunca execute isso em um sistema real.**

Alterações recursivas de permissões em diretórios importantes podem destruir o funcionamento do sistema.

O mesmo cuidado vale para alterações de propriedade:

```bash
sudo chown -R root:root /home/usuario/
```

Uma mudança indiscriminada pode impedir que o usuário acesse ou modifique seus próprios arquivos.

No Linux, ter poder não significa que devemos usá-lo todo.

---

## O princípio do menor privilégio

É aqui que as permissões deixam de ser apenas uma questão técnica.

Elas passam a ser uma questão de segurança.

Imagine uma pessoa que precisa apenas ler um relatório.

Por que permitir que ela também o modifique?

Imagine um programa que precisa acessar apenas uma pasta.

Por que permitir acesso ao sistema inteiro?

A ideia é simples:

> **Conceda somente as permissões necessárias para realizar determinada tarefa.**

Esse princípio é conhecido como **menor privilégio**.

Ele aparece em sistemas Linux, servidores, bancos de dados, aplicações e praticamente qualquer ambiente onde segurança seja importante.

Quanto menor o acesso desnecessário, menor a superfície de ataque.

---

## Quando as permissões tradicionais não são suficientes

Em algum momento, você pode encontrar uma situação mais complexa.

Imagine:

* João precisa ler o arquivo;
* Maria precisa modificar;
* o grupo precisa executar;
* os demais usuários não devem ter acesso.

As permissões tradicionais podem começar a ficar limitadas.

É aí que entram as **ACLs — Access Control Lists**.

Podemos conceder permissões específicas:

```bash
setfacl -m u:colaborador:rwx projeto/
```

E consultar:

```bash
getfacl projeto/
```

As ACLs permitem criar regras mais detalhadas sem abandonar o modelo tradicional de permissões do Linux.

---

## E existe ainda o `umask`

Existe outro personagem silencioso nessa história.

O:

```bash
umask
```

Ele influencia as permissões padrão utilizadas na criação de novos arquivos e diretórios.

Por exemplo:

```bash
umask 0077
```

é uma configuração comum quando queremos um ambiente mais restritivo.

Em termos gerais, ela faz com que novos arquivos e diretórios sejam criados com acesso limitado ao próprio usuário.

Podemos verificar a configuração atual com:

```bash
umask
```

É mais uma camada de proteção trabalhando sem chamar muita atenção.

---

## Quando alguma coisa dá errado

Imagine a cena.

Você tenta executar:

```bash
./script.sh
```

E o Linux responde:

```text
Permission denied
```

A primeira reação talvez seja:

> "O Linux está com problema."

Mas talvez não.

Verifique:

```bash
ls -l script.sh
```

Se não houver permissão de execução, você poderá usar:

```bash
chmod +x script.sh
```

Outro problema comum:

```text
Permission denied
```

ao acessar um diretório.

Nesse caso, é importante verificar as permissões do diretório e de seus diretórios ancestrais.

Para investigar:

```bash
ls -ld pasta/
```

E, quando necessário, analisar o caminho completo:

```bash
namei -l /caminho/para/arquivo
```

Esse tipo de investigação é muito mais seguro do que simplesmente sair executando `chmod 777`.

---

## Um pequeno ritual antes de mudar qualquer coisa

Quando encontrar um problema de permissão, tente seguir uma sequência:

### 1. Observe

```bash
ls -l arquivo
```

### 2. Descubra o proprietário

```bash
stat arquivo
```

### 3. Verifique o grupo

```bash
id
```

### 4. Entenda o caminho

```bash
namei -l /caminho/arquivo
```

### 5. Altere somente o necessário

```bash
chmod ...
```

ou:

```bash
chown ...
```

### 6. Teste novamente

Não existe motivo para mudar dez coisas quando apenas uma estava errada.

---

## O Linux não está tentando dificultar sua vida

No começo, as permissões podem parecer uma barreira.

Você tenta abrir um arquivo.

O Linux diz não.

Você tenta executar um programa.

O Linux diz não novamente.

É frustrante.

Mas depois de algum tempo começamos a perceber outra coisa.

O Linux não está simplesmente impedindo você.

Ele está perguntando:

> **"Você realmente deveria poder fazer isso?"**

Essa pergunta é uma das bases da segurança de sistemas.

---

## O verdadeiro significado de `chmod`

No fim, aprender permissões não é decorar:

```bash
chmod 755
```

ou:

```bash
chmod 644
```

É entender o que esses números representam.

É saber quem precisa acessar determinado recurso.

É compreender a diferença entre leitura, escrita e execução.

É evitar conceder privilégios desnecessários.

E, principalmente, é aprender a investigar antes de alterar.

Porque existe uma diferença enorme entre **ter controle** e **saber controlar**.

No Linux, os dois conceitos andam juntos.

---

## 🛡️ Kit de sobrevivência

Alguns comandos para guardar:

```bash
# Ver permissões
ls -l arquivo

# Ver informações detalhadas
stat arquivo

# Alterar permissões
chmod 644 arquivo

# Adicionar execução
chmod +x script.sh

# Alterar proprietário
chown usuario arquivo

# Alterar grupo
chgrp grupo arquivo

# Ver identidade do usuário
id

# Ver permissões ao longo do caminho
namei -l /caminho/arquivo

# Ver ACLs
getfacl arquivo

# Alterar ACL
setfacl -m u:usuario:rwx arquivo

# Ver umask
umask
```

---

## Uma última olhada antes de fechar o terminal

Talvez a maior lição das permissões do Linux não esteja em nenhum comando.

Ela está em uma maneira de pensar.

Antes de abrir uma porta, pergunte quem precisa entrar.

Antes de conceder acesso, pergunte por quê.

Antes de executar um comando poderoso, pergunte o que ele realmente fará.

E antes de usar:

```bash
chmod 777
```

pare por alguns segundos.

Talvez exista uma solução melhor.

Porque segurança, no Linux, não começa quando o ataque acontece.

Ela começa muito antes.

Começa quando alguém decide **quem pode fazer o quê**.

## 📚 Referências Técnicas Essenciais

### 1. Documentação Oficial
- 📜 **[Linux man-pages: chmod(1)](https://man7.org/linux/man-pages/man1/chmod.1.html)**  
- 📚 **[Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.html)**  
- 🔍 **[POSIX.1-2017 Standard](https://pubs.opengroup.org/onlinepubs/9699919799/)**

### 2. Segurança e Conformidade
- 🛡️ **[CIS Linux Benchmarks](https://www.cisecurity.org/cis-benchmarks/)**  
- 🔐 **[NIST SP 800-53: Access Control](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf)**  
- ⚖️ **[LGPD Art. 16](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)**

### 3. Guias Práticos
- 🔧 **[Red Hat: Managing File Permissions](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/managing_filesystems/managing-file-permissions_managing-file-systems)**  
- ⚙️ **[Linux Foundation: Filesystem Permissions](https://training.linuxfoundation.org/resources/learning-paths/linux-security-and-hardening/filesystem-permissions/)**  

### 4. Tópicos Avançados
- 🔐 **[SELinux vs AppArmor](https://www.redhat.com/sysadmin/selinux-apparmor)**  
- 🛠️ **[Linux ACL Deep Dive](https://www.ibm.com/docs/en/aix/7.2?topic=files-access-control-lists)**  

### 5. Boas Práticas
- 💼 **[OWASP File Permissions Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Permission_Cheat_Sheet.html)**  
- 🏢 **[Enterprise Linux Security Standards](https://www.nsa.gov/Resources/Commercial-Solutions/Commercial-Products/)**
