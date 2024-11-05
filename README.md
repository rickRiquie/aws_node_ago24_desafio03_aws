# AWS_NODE_AGO24_DESAFIO03_AWS

Anteriormente foi craida uma API RESTful projetada para o gerenciamento da locação de carros. Que permite o gerenciamento de usuários, o cadastro de clientes, o controle de carros disponíveis para locação e a criação e acompanhamento de pedidos de locação.

Nesta etapa será realizada o deploy dessa API utilizando serviços da AWS.

## Pré-requisitos

Antes de começar, verifique se você tem os seguintes pré-requisitos:

- **Uma conta na AWS**: Uma conta na AWS para criar e gerenciar recursos como EC2, S3, etc.
- **AWS CLI**: A AWS Command Line Interface instalada e configurada em sua máquina local para facilitar a interação com os serviços da AWS.
- **Instância EC2**: O deploy da aplicação será realizado em uma instância EC2. Você pode criar uma instância seguindo as instruções na seção [Usar EC2](#2-usar-ec2).
- **Amazon S3**: Uma configuração de bucket no S3 para armazenar e disponibilizar o Swagger. Certifique-se de que o bucket esteja criado e configurado para acesso público, conforme descrito na seção [Configuração do S3](#1-configuração-do-s3).
- **Git**: O Git instalado em sua máquina local para clonar o repositório e gerenciar o código-fonte.


## **Observação**
**Os arquivos html para fazer o upload no bucket estão reposiotório do projeto no diretório bucket**


## Estrutura do Projeto

A estrutura do projeto é organizada da seguinte maneira:

- **src/**: Contém o código fonte da aplicação.
- **controllers/**: Responsável pela lógica que manipula as requisições e respostas da API.
- **services/**: Implementa a lógica de negócio e interage com os repositórios.
- **repositories/**: Este diretório contém os repositórios que gerenciam a interação com o banco de dados.
- **routes/**: Define as rotas da API e associa cada rota ao seu respectivo controlador.
- **shared/**: Inclui middlewares, erros para manipulação de requisições e respostas. E routes que define as rotas da API e associa cada rota ao seu respectivo controlador .
- **server.ts**: Arquivo principal que inicializa o servidor e configura as rotas.
- **test/**: Contém testes automatizados para garantir a qualidade do código.
- **db/**: Contém arquivo do banco de dados, que são usados para garantir a conexão.

### Descrição dos Arquivos de Configuração

- **.prettierrc**: Contém as configurações do Prettier, que definem as regras de formatação do código, como largura da linha e estilo de aspas.
- **.prettierignore**: Lista os arquivos e diretórios que devem ser ignorados pelo Prettier durante a formatação.
- **eslint.config.mjs**: Configuração do ESLint, que ajuda a identificar e corrigir problemas de estilo e erros no código.
- **jest.config.js**: Configurações do Jest, que definem como os testes automatizados devem ser executados.
- **swagger.yaml**: Arquivo de configuração para o Swagger, que descreve a API e suas rotas, permitindo a geração de documentação interativa.
- **.env.example**: Um exemplo do arquivo de configuração de variáveis de ambiente.

- **.gitignore**: Arquivo que especifica quais arquivos e diretórios devem ser ignorados pelo Git.

- **package.json**: Contém informações sobre o projeto, dependências e scripts.

- **tsconfig.json**: Configuração do TypeScript, que define as opções do compilador e o comportamento da transpilação.


## Passos para o Deploy


##**Configuração do S3**

#### 1.1 Criar um Bucket no S3
1. Acesse o console do Amazon S3.
2. Selecione a **região** onde deseja criar o bucket.
3. Clique em **"Criar bucket"**.
4. Escolha um **nome único** para o bucket (por exemplo, `meu-bucket-swagger`).



#### 1.2 Configurar bucket
1. Na aba de **Propreidade de objeto** deixe as ACLs desabilitadas (recomendado)
2. Em **Configuração de bloqueio do acesso público deste bucket**, desmareque a opção de **Bloquear todo o acesso público**.
3. Depois clique em **Criar bucket**.


### 1.3 Configurar Permissões
1. No console do S3, selecione o bucket que você acabou de criar.
2. Vá até a aba **"Permissões"**.
3. Adicione uma política de bucket para permitir acesso público. Uma política básica pode ser assim:
   
   ```json
   {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::sua-bucket/*"
        }
      ]
   }


### 1.4 Hospedagem de site estático
1. No console do S3, selecione o bucket que você criou.
2. Vá até **Propriedades**.
3. E selecione **Hospedagem de site estático**, e clique em **editar**.
4. Ao abrir a nova aba, ative a opção de **Hospedagem de site estático**
5. Em **Documneto de ídice**, adicione o html do swagger e em documento de erro adicione o html de erro (opcional).
6. Salve as alterações e volte para a Console do S3.


### 1.5 Adicionar arquivos ao bucket
1. No console do S3, clique em **Carregar**.
2. Selecione os arquivos que havia configurado no passo anterior.
3. Desça a tela até **Propriedades** e clique.
4. Procure por **Metadados** e adicione o seguinte metadado ( **Tipo: Definido pelo sistema** | **Chave: Content-Type** | Valor: **text/html; charset=UTF-8** ) e finalize clicando em **Carregar**.
5. Pronto o seu html já está na web, para ver ele basta selecionar sua bucket ir em **Propriedades** ir até **Hospedagem de site estático** e lá estará a URL, cole no seu navegador e pronto.




