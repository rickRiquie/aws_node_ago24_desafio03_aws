# API CompassCar - Deploy AWS 

Anteriormente foi craida uma API RESTful projetada para o gerenciamento da locação de carros. Que permite o gerenciamento de usuários, o cadastro de clientes, o controle de carros disponíveis para locação e a criação e acompanhamento de pedidos de locação.

Nesta etapa será realizada o deploy dessa API utilizando serviços da AWS.

## Pré-requisitos

Antes de começar, verifique se você tem os seguintes pré-requisitos:

- **Uma conta na AWS**: Uma conta na AWS para criar e gerenciar recursos como EC2, S3, etc.
- **Amazon S3**: Uma configuração de bucket no S3 para armazenar e disponibilizar o Swagger. Certifique-se de que o bucket esteja criado e configurado para acesso público, conforme descrito na seção [Configuração do S3](#configuração-do-s3).
- **Instância EC2**: O deploy da aplicação será realizado em uma instância EC2. Você pode criar uma instância seguindo as instruções na seção [Criando instância EC2](#criando-instância-ec2).
- **Git**: O Git será instalado diretamente na instância EC2 para clonar o repositório e gerenciar o código-fonte.


### **Gerando o HTML do Swagger**

Para gerar o HTML do Swagger, utilizei a biblioteca **Redocly**, que permite a criação de uma interface interativa para visualizar a documentação da API. Abaixo estão os passos para gerar o arquivo `index.html` com base no arquivo `swagger.yml`:

Redocly pode ser utilizado diretamente via **npx**, portanto, não é necessário instalar a biblioteca globalmente. O comando abaixo utiliza **npx** para executar o Redocly:

```bash
npx @redocly/cli build-docs ./swagger.yml -o ./index.html
```
## Configuração do S3

#### 1.1 Criar um Bucket no S3
1. Acesse o console do Amazon S3.
2. Selecione a **região** onde deseja criar o bucket.
3. Clique em **"Criar bucket"**.
4. Escolha um **nome único** para o bucket ( por exemplo, `meu-bucket-swagger` ).



#### 1.2 Configurar bucket
1. Na aba de **Propreidade de objeto** deixe as ACLs desabilitadas ( recomendado )
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
5. Em **Documneto de ídice**, adicione o html do swagger.
6. Salve as alterações e volte para a Console do S3.


### 1.5 Adicionar arquivos ao bucket
1. No console do S3, clique em **Carregar**.
2. Selecione os arquivos que havia configurado no passo anterior.
3. Desça a tela até **Propriedades** e clique.
4. Procure por **Metadados** e adicione o seguinte metadado ( **Tipo: Definido pelo sistema** | **Chave: Content-Type** | Valor: **text/html; charset=UTF-8** ) e finalize clicando em **Carregar** ).
5. Pronto o seu html já está na web, para ver ele basta selecionar sua bucket ir em **Propriedades** ir até **Hospedagem de site estático** e lá estará a URL, cole no seu navegador e pronto.


## Configuração da EC2

### Configuração da VPC

A VPC é fundamental para isolar a infraestrutura de rede, fornecendo controle sobre os endereços IP, sub-redes e segurança da sua aplicação.

1. Abra a console da AWS.
2. Na barra de pesquisa, procure por **VPC**.
3. Clique em **Criar VPC**.
4. Selecione **VPC e muito mais** para criar a VPC e outros recursos de rede.
5. Escolha um nome para sua VPC.
6. No final da tela, clique em **Criar VPC** para finalizar o processo.

### Configuração Security Group

#### Detalhes básicos 

1. No console da EC2, vá para **Security groups**.
2. Clique em **Criar grupo de segurança**.
3. Escolha um nome para o security group.
4. Em **Descrição** insira uma breve descrição.
5. Em **VPC** selecione a VPC que você criou.

#### Regras de entrada

1. **Entrada SSH**:
      Adicione uma regra: Selecione **SSH**.
      Defina a **Origem**: **Qualquer IPv4**.

2. **Entrada TCP**:
      Adicone uma regra: Selecione **TCP**.
      Informe uma porta: 8080 (recomendado).
      Defina a **Origem**: **Qualquer IPv4**.

#### Regras de saída

1. **Todo o tráfego**:
      Defina o **Destino**: **Qualquer IPv4**.

2. Clique em **Criar grupo de segurança**.


### Configuração de Key Pair

1. No console da EC2, vá para **Pares de chaves**.
2. Clique em **Criar par de chaves**.
3. Escolha um nome para seu par de chaves.
4. Tipo de par de chaves deixe como **RSA**.
5. Formato de arquivo de chave privada deixe como `.pem`
6. Clique em **Criar par de chaves**

Após esses passo um arquivo será baixado em seu computador, será a sua chave.
Guarde ela o lugar onde ela está.

Se você for utilizar o **PuTTy** siga esses passos:

#### Baixar e Instalar PuTTy e PuTTYgen

1. Baixe [PuTTY e PuTTYgen](https://www.putty.org/)
2. Instale os programas

#### Converter a Chave PEM para PPK

1. Abra o **PuTTYgen**.
2. Carregue o arquivo PEM da sua chave. ( Passo realizado em [Configuração de Key Pair](#configuração-de-key-pair) ).
3. Para carregar o arquivo PEM, clique em **Load** e depois selecione o arquivo `.pem` ( mude o tipo de arquivo para "All Files" ).
4. Salve o arquivo PPK, após carregar o `.pem `, clique em **Save private key** e guarde o arquivo `bash .ppk `.

#### Acessar a Instância com PuTTY

1. Abra o **PuTTY**.
2. No campo **Host Name (or IP address)**, insira `bash ec2-user@{your-ec2-public-dns}`
3. Em **Connection** > **SSH** > **Auth**, selecione o arquivo  `.ppk`.
4. Em Session, salve a configuração para reutilizar e clique em Open para conectar-se.


Se for utilizar o **MobaXterm** siga esses passos:

#### Baixar e Instalar MobaXterm

1. Baixe o [MobaXterm](https://mobaxterm.mobatek.net/download.html).
2. Instale o MobaXterm no seu sistema.
3. Abra o MobaXterm e vá para a opção **"Session"** no menu principal para iniciar uma nova conexão.
4. Clique em **"SSH"** para conectar à sua instância EC2.
5. Em **Remote host** insira o IP público de sua instância.
6. Marque a opção **Specify username** e digite **ec2-user**.
7. Clique **Advanced SSH settings**.
8. Marque a opção **Use private key** e selecione o arquivo `.pem` da sua chave.
9. Com a sessão configurada, clique duas vezes sobre ela no painel esquerdo do MobaXterm para iniciar a conexão.
   
## Criando instância EC2

1. Abra o Console AWS e vá até a página do **EC2**.
2. No painel EC2, clique em **Executar instância**.
3. Em seguida crie as Tags:

![Tags](images/tags.png)
    
**Importante**: Essas tags são importantes, pois estão de acordo com os atributos da política (ABAC) atribuída às contas do Scholarship Program. 



   


