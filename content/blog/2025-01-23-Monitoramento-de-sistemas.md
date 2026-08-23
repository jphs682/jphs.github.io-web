---
title: "Quando o Computador Começa a Reclamar: Monitorando um Sistema Linux"
date: 2025-01-23
description: "CPU, memória, disco e rede contam histórias sobre o que está acontecendo dentro de um computador. Aprendendo a ouvir essas histórias com as ferramentas do Linux."
categories:
  - linux
  - administração-de-sistemas
tags:
  - linux
  - monitoramento
  - top
  - ps
  - iostat
  - vmstat
draft: false
---

É segunda-feira.

O servidor está funcionando.

Pelo menos, é o que deveria estar fazendo.

Até que alguém liga:

> “O sistema está lento.”

Essa frase parece simples.

Mas, para quem administra servidores, ela pode esconder dezenas de problemas diferentes.

Pode ser CPU.

Pode ser memória.

Pode ser disco.

Pode ser rede.

Pode ser um processo consumindo recursos demais.

Pode ser simplesmente falta de espaço.

E existe uma pergunta que aparece quase imediatamente:

**“O que está acontecendo com o servidor?”**

A primeira reação de quem está começando pode ser reiniciar a máquina.

Às vezes funciona.

Mas reiniciar também pode apagar pistas importantes.

O administrador experiente geralmente faz outra coisa.

Ele abre o terminal.

E começa a perguntar ao sistema.

## O Linux está sempre contando alguma coisa

Um servidor não costuma dizer:

> “Estou com pouca memória.”

Ele mostra números.

Não diz:

> “Este processo está me deixando lento.”

Ele mostra um PID consumindo CPU.

Não diz:

> “O disco está sofrendo.”

Ele apresenta tempos de espera e operações de I/O.

O trabalho do administrador é transformar esses números em uma história.

E o Linux oferece várias ferramentas para isso.

Não precisamos de uma solução gigantesca para começar.

Às vezes, alguns comandos são suficientes para encontrar a primeira pista.

## Primeiro: quem está usando o sistema?

Um bom diagnóstico pode começar de maneira simples:

```bash
w
```

O comando `w` mostra informações sobre os usuários atualmente conectados, quanto tempo estão ociosos e o que estão executando.

Parece simples.

Mas, em um servidor compartilhado, essa informação pode ser importante.

Imagine descobrir que alguém iniciou uma tarefa pesada exatamente no momento em que o sistema começou a ficar lento.

A investigação já ganhou uma direção.

## Depois: o que está acontecendo agora?

Se queremos uma visão dinâmica dos processos, um dos comandos clássicos é:

```bash
top
```

Ao executar `top`, o terminal deixa de ser apenas uma tela de comandos.

Ele começa a se movimentar.

Processos aparecem.

Números mudam.

A CPU sobe e desce.

A memória é consumida.

É quase como olhar para os batimentos cardíacos de uma máquina.

Dentro do `top`, algumas teclas são particularmente úteis:

* `P` — ordenar por uso de CPU;
* `M` — ordenar por uso de memória;
* `k` — enviar um sinal para um processo;
* `1` — mostrar o uso individual das CPUs.

A pergunta agora é outra:

**Existe algum processo roubando recursos demais?**

## Quando um processo vira suspeito

Se o `top` apontar para um processo específico, podemos investigá-lo melhor.

O comando `ps` é um dos clássicos para isso:

```bash
ps aux --sort=-%cpu | head
```

Aqui estamos ordenando os processos pelo uso de CPU.

Se o problema for memória:

```bash
ps aux --sort=-%mem | head
```

Agora os maiores consumidores de memória aparecem primeiro.

É uma diferença pequena no comando.

Mas muda completamente a pergunta que estamos fazendo.

Não estamos mais perguntando:

> “Quais processos existem?”

Estamos perguntando:

> **“Quem está consumindo meus recursos?”**

## CPU alta não significa necessariamente problema

Existe uma armadilha comum no monitoramento.

Ver a CPU em 100% e concluir imediatamente:

> “O servidor está com problema.”

Nem sempre.

Um servidor pode utilizar praticamente toda a CPU e estar funcionando perfeitamente.

O problema aparece quando o uso elevado está relacionado a uma situação anormal: processos presos, tarefas inesperadas, filas crescendo ou usuários enfrentando lentidão.

Monitoramento não é decorar números mágicos.

É entender o contexto.

## E a memória?

Agora imagine que a CPU não está particularmente alta.

Mas o sistema continua lento.

A próxima suspeita pode ser memória.

Um comando simples para começar:

```bash
free -h
```

Ele mostra informações sobre memória RAM e swap em um formato legível.

Mas existe um detalhe importante.

No Linux, **“memória livre” não deve ser interpretada simplesmente como “memória disponível”**.

O sistema utiliza RAM para cache e buffers e pode liberar parte desses recursos quando necessário.

Por isso, ao analisar memória, precisamos observar o conjunto das informações, especialmente a memória disponível e o comportamento da swap.

Se quisermos acompanhar o comportamento ao longo do tempo, podemos utilizar:

```bash
vmstat 1
```

Agora não estamos vendo apenas uma fotografia.

Estamos vendo uma sequência.

E sequência é importante.

Uma máquina pode parecer saudável em um instante e apresentar um problema alguns segundos depois.

## Quando a memória vai para o disco

Entre os dados apresentados pelo `vmstat`, existem indicadores relacionados à troca entre memória e swap.

Os campos `si` e `so`, por exemplo, ajudam a observar movimentações de swap.

Se o sistema está constantemente recorrendo à swap, isso pode ser um sinal de pressão de memória.

Mas, novamente:

**um único número raramente conta a história inteira.**

É preciso observar o comportamento.

Durante alguns segundos.

Durante alguns minutos.

Durante períodos de carga.

É aí que o monitoramento começa a se aproximar de uma investigação.

## E se o problema for o disco?

Agora imagine outro cenário.

CPU normal.

Memória razoável.

Mas tudo parece lento.

Abrir arquivos demora.

Uma aplicação responde lentamente.

O banco de dados parece travado.

Talvez o problema esteja no armazenamento.

É aqui que entra o `iostat`.

Primeiro, em sistemas Debian ou Ubuntu, ele normalmente é disponibilizado pelo pacote `sysstat`:

```bash
sudo apt install sysstat
```

Em sistemas Fedora, RHEL e derivados, o gerenciador de pacotes pode variar conforme a distribuição e a versão.

Depois podemos consultar estatísticas de I/O:

```bash
iostat -xz 1
```

Entre os campos que merecem atenção estão indicadores como:

* `%util` — tempo em que o dispositivo esteve ocupado;
* `await` — tempo médio de espera de I/O;
* `tps` — operações por segundo, dependendo do dispositivo e da versão da ferramenta.

Esses números podem ajudar a responder uma pergunta importante:

**o armazenamento está sendo o gargalo?**

## Espaço livre é outra história

Às vezes o disco não está lento.

Ele simplesmente está cheio.

O comando:

```bash
df -h
```

é um dos primeiros que devemos lembrar.

Se quisermos visualizar também o tipo de sistema de arquivos:

```bash
df -hT
```

Agora podemos descobrir algo como:

```text
Filesystem      Size  Used Avail Use%
/dev/sda1       100G   98G    2G  98%
```

Noventa e oito por cento.

Talvez seja hora de investigar.

## Mas quem está ocupando o espaço?

O `df` responde:

> “Quanto espaço está sendo utilizado?”

O `du` ajuda a responder:

> **“Onde esse espaço está sendo utilizado?”**

Por exemplo:

```bash
du -sh /var/log
```

Ou podemos analisar os diretórios de um nível específico:

```bash
du -h --max-depth=1 /home
```

Em sistemas com muitos arquivos, ferramentas interativas como `ncdu` também podem facilitar bastante essa investigação.

De repente, descobrimos que um diretório de logs cresceu para dezenas de gigabytes.

O problema que parecia misterioso começa a fazer sentido.

## E a rede?

Talvez o servidor esteja saudável.

CPU normal.

Memória normal.

Disco normal.

Mas ninguém consegue acessar determinada aplicação.

Agora precisamos olhar para a rede.

Durante muito tempo, administradores utilizaram o `netstat` para consultar conexões e portas.

Ainda é possível encontrá-lo em muitos sistemas, mas atualmente o comando `ss` é geralmente a escolha preferida.

Por exemplo:

```bash
ss -tulnp
```

Podemos utilizá-lo para observar sockets TCP e UDP em escuta e, quando permitido, os processos associados.

Para conexões estabelecidas:

```bash
ss -tunp
```

Agora a pergunta muda novamente:

**O serviço está realmente ouvindo na porta esperada?**

## Uma porta aberta não significa que tudo está funcionando

Essa é outra armadilha.

Encontrar uma porta aberta não significa que a aplicação esteja saudável.

Pode existir um processo ouvindo na porta, mas a aplicação estar travada.

Pode haver problemas de firewall.

Pode existir uma falha de roteamento.

Pode haver perda de pacotes.

Por isso, monitorar rede não significa apenas olhar portas.

É preciso observar o caminho inteiro.

Dependendo do caso, ferramentas como `ping`, `traceroute` ou `tracepath` podem ajudar a investigar conectividade.

E, quando o serviço é gerenciado pelo `systemd`, os logs podem revelar o restante da história:

```bash
journalctl -u nome-do-servico
```

## Quando uma fotografia não é suficiente

Até agora estamos olhando para o sistema naquele momento.

Mas e se quisermos saber:

> “O que aconteceu ontem?”

É aí que ferramentas como o **sar**, do pacote `sysstat`, tornam-se interessantes.

Podemos consultar métricas de CPU:

```bash
sar -u 2 5
```

Memória:

```bash
sar -r 1 3
```

E atividade de dispositivos:

```bash
sar -d -p 1 3
```

O grande valor do `sar` está na possibilidade de trabalhar também com dados históricos quando a coleta está configurada.

Isso muda completamente a investigação.

Agora não precisamos depender apenas da memória de quem estava administrando o servidor.

Podemos olhar para os dados.

## O problema pode ter acontecido às três da manhã

Imagine que o sistema esteja normal agora.

O usuário, porém, afirma:

> “Às três da manhã ficou impossível trabalhar.”

Se não houver dados históricos, temos um problema.

A máquina já voltou ao normal.

O administrador chegou depois.

E não existe testemunha.

Ou melhor...

Existe.

O `sar`.

Quando configurado corretamente, o monitoramento histórico permite voltar no tempo e observar o comportamento dos recursos.

CPU.

Memória.

I/O.

Carga.

E outras métricas.

O servidor pode ter esquecido.

Mas os registros podem lembrar.

## O verdadeiro segredo é combinar ferramentas

Nenhum desses comandos é mágico.

O administrador não precisa escolher entre `top`, `free`, `iostat`, `ss`, `df` ou `sar`.

Na verdade, eles funcionam melhor juntos.

Imagine uma investigação:

```text
Sintoma
   ↓
O sistema está lento?
   ↓
top / w
   ↓
CPU está alta?
   ├── Sim → ps
   └── Não
        ↓
Memória está sob pressão?
   ├── Sim → free / vmstat
   └── Não
        ↓
I/O está lento?
   ├── Sim → iostat
   └── Não
        ↓
Disco está cheio?
   ├── Sim → df / du
   └── Não
        ↓
Problema de rede?
   ├── Sim → ss / ping / tracepath
   └── Não
        ↓
Investigar logs e histórico
```

Não é uma receita universal.

É uma maneira de organizar o pensamento.

## Monitoramento não é apenas olhar números

Talvez essa seja a principal lição.

Um iniciante pode aprender dez comandos.

Um administrador experiente aprende **quando usar cada um**.

Ele não executa `top` porque alguém disse que `top` é importante.

Ele executa porque existe uma pergunta:

> “Quem está consumindo CPU?”

Não usa `df` simplesmente porque conhece o comando.

Usa porque precisa descobrir:

> “Será que o sistema de arquivos está cheio?”

Não consulta `ss` por hábito.

Consulta porque quer saber:

> “O serviço está ouvindo onde deveria?”

Essa mudança parece pequena.

Mas é enorme.

## O servidor não fala português

O servidor não vai dizer:

> “João, o problema está no disco.”

Ele vai mostrar:

```text
await
%util
iowait
```

Não vai dizer:

> “Maria, estou ficando sem memória.”

Ele vai mostrar:

```text
available
swap
si
so
```

Não vai dizer:

> “A aplicação está ouvindo na porta errada.”

Ele vai mostrar sockets.

É responsabilidade do administrador aprender a traduzir esses sinais.

## E então encontramos o problema

Voltamos àquela segunda-feira.

O usuário continua esperando uma resposta.

Depois de alguns minutos investigando, encontramos a causa.

Não era a rede.

Não era a CPU.

Não era a memória.

O disco estava quase cheio.

Um arquivo de log havia crescido muito além do esperado.

Agora existe uma explicação.

Mais importante:

existe uma oportunidade de prevenção.

Podemos revisar a retenção.

Configurar rotação.

Criar alertas.

Acompanhar o crescimento.

Talvez, na próxima vez, o sistema avise antes de alguém perceber a lentidão.

E é aí que monitoramento deixa de ser apenas **apagar incêndios**.

Ele passa a ser prevenção.

## Aprender a ouvir

Administrar Linux é, em muitos aspectos, aprender uma nova linguagem.

No começo, vemos apenas comandos.

Depois começamos a enxergar sinais.

Um número sobe.

Outro cai.

Um processo aparece no topo.

Uma porta desaparece.

A swap começa a ser utilizada.

O disco fica cheio.

Um serviço reinicia.

E, aos poucos, aquilo deixa de ser apenas um monte de números.

Começa a formar uma história.

Talvez essa seja a verdadeira função do monitoramento.

Não saber todos os comandos.

Não decorar todas as opções.

Mas aprender a fazer perguntas ao sistema e interpretar as respostas.

Porque um servidor raramente fica em silêncio.

Ele está falando o tempo inteiro.

**Só precisamos aprender a escutar.**


## 📚 Referências Essenciais

### Documentação Oficial
1. **sysstat (iostat/sar)**  
   [https://github.com/sysstat/sysstat](https://github.com/sysstat/sysstat)  
   Repositório oficial com manuais detalhados

2. **procps (ps/top/free)**  
   [https://gitlab.com/procps-ng/procps](https://gitlab.com/procps-ng/procps)  
   Documentação dos comandos de processos

3. **iproute2 (ss)**  
   [https://wiki.linuxfoundation.org/networking/iproute2](https://wiki.linuxfoundation.org/networking/iproute2)  
   Sucessor moderno do netstat

### Manuais Online
4. **Linux man pages online**  
   [https://man7.org/linux/man-pages/](https://man7.org/linux/man-pages/)  
   Documentação completa de todos os comandos

5. **TLDR Pages**  
   [https://tldr.sh/](https://tldr.sh/)  
   Exemplos rápidos de uso para cada comando

### Guias Avançados
6. **Linux Performance Analysis in 60s**  
   [https://netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds-accc10403c55](https://netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds-accc10403c55)  
   Fluxo de diagnóstico da Netflix

7. **Brendan Gregg's Blog**  
   [http://www.brendangregg.com/linuxperf.html](http://www.brendangregg.com/linuxperf.html)  
   Ferramentas e técnicas de performance por especialista da Netflix

### Livros Recomendados
8. **Linux Bible**  
   Christopher Negus (ISBN: 978-1119578888)  
   Capítulos 8-10 dedicados a administração e monitoramento

9. **The Linux Command Line**  
   William Shotts (Disponível gratuitamente em: [https://linuxcommand.org/tlcl.php](https://linuxcommand.org/tlcl.php))

### Ferramentas Relacionadas
10. **Prometheus + Grafana**  
    [https://prometheus.io/](https://prometheus.io/)  
    Monitoramento moderno baseado em métricas

11. **htop**  
    [https://htop.dev/](https://htop.dev/)  
    Versão melhorada do top com interface colorida

### Documentação Oficial
12. **sysstat (iostat/sar)**  
   [https://github.com/sysstat/sysstat](https://github.com/sysstat/sysstat)  
   Manuais completos e exemplos avançados

13. **procps (ps/top/free)**  
   [https://gitlab.com/procps-ng/procps](https://gitlab.com/procps-ng/procps)  
   Documentação oficial dos comandos de processos

14. **Diagramas Mermaid**  
   [Documentação do GitHub](https://docs.github.com/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams#creating-mermaid-diagrams)  
   Guia completo para criação de diagramas técnicos

### Manuais e Guias
15. **Linux man pages online**  
   [https://man7.org/linux/man-pages/](https://man7.org/linux/man-pages/)  
   Referência autoritativa de todos os comandos

16. **Linux Performance Analysis in 60s**  
   [Netflix TechBlog](https://netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds-accc10403c55)  
   Metodologia prática para diagnóstico rápido

### Ferramentas Avançadas
17. **Prometheus + Grafana**  
   [https://prometheus.io/](https://prometheus.io/)  
   Monitoramento moderno baseado em métricas

18. **Brendan Gregg's Tools**  
   [http://www.brendangregg.com/linuxperf.html](http://www.brendangregg.com/linuxperf.html)  
   Coleção de ferramentas e técnicas de performance

### Livros Recomendados
19. **Linux Performance Tuning**  
   ISBN: 978-1492053500  
   Capítulos essenciais sobre monitoramento e otimização

20. **The Linux Command Line**  
   [Download gratuito](https://linuxcommand.org/tlcl.php)  
   Seções 10-12 dedicadas a administração de sistemas
