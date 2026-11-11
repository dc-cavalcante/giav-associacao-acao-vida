#  GIAV — Associação Ação Vida (Sistema de Gestão & Estoque)

> Sistema web desenvolvido para o gerenciamento de núcleos familiares assistidos e controle de doações/estoque, promovendo a redução das desigualdades (Alinhado aos Objetivos de Desenvolvimento Sustentável — **ODS 10**).

---

##  Acesso à Aplicação em Produção
* **Acesse o sistema online:** [https://giav-associacao-acao-vida.onrender.com](https://giav-associacao-acao-vida.onrender.com) *(Hospedado no Render)*

---

##  Tecnologias Utilizadas

Este projeto foi estruturado utilizando uma arquitetura moderna separada entre front-end responsivo e API RESTful:

* **Back-end:** Java 21, Spring Boot, Spring Data JPA, Hibernate.
* **Front-end:** HTML5, CSS3, JavaScript (Vanilla com Fetch API).
* **Banco de Dados:** MySQL (Hospedado na nuvem via Railway).
* **Hospedagem & Deploy:** Render (Web Service contínuo integrado ao GitHub).

---

##  Funcionalidades Principais

* **Gestão de Famílias e Membros:** Cadastro de titulares e dependentes com máscaras automáticas de CPF e Telefone.
* **Controle de Estoque (Doações):** Registo de entradas de donativos e controle de distribuição para as famílias assistidas.
* **Cálculo de Saldo em Tempo Real:** Monitoramento automático de itens recebidos versus distribuídos no armazém.
* **Relatórios Oficiais:** Geração e impressão instantânea de relatórios consolidados formatados para prestação de contas.

---

## Como Executar o Projeto Localmente

Se desejar clonar e rodar a aplicação no seu computador para testes:

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/dc-cavalcante/giav-associacao-acao-vida.git](https://github.com/dc-cavalcante/giav-associacao-acao-vida.git)
