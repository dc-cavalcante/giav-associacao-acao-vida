# GIAV - Associação Ação Vida

MVP desenvolvido para a gestão de assistência social da Associação Ação Vida (GIAV).

## Tecnologias Utilizadas
* **Linguagem:** Java 17
* **Framework:** Spring Boot
* **Gestor de Dependências:** Maven
* **Controlo de Versões:** Git e GitHub (com o padrão *Conventional Commits*)

## Estrutura do Projeto
* `src/main/java/com/giav`: Pacote principal da aplicação.
  * `controller/`: Controladores REST / Web responsáveis pelas rotas.
  * `model/`: Entidades de domínio do sistema (ex: `Beneficiario`).

## Arquitetura e Boas Práticas
* Arquitetura em camadas para garantir o desacoplamento e a escalabilidade.
* Histórico de commits auditável e limpo, sem mensagens genéricas.
