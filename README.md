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
1. Abra a console da AWS.
2. Na barra de pesquisa, procure por **S3**.


![S3](images/s3-pesquisa.png)

   
2. Selecione a **região** onde deseja criar o bucket.


![S3](images/s3-region.png)

   
4. Clique em **"Criar bucket"**.


![S3](images/s3-criar-bucket.png)

6. Escolha um **nome único** para o bucket ( por exemplo, `aws-node-ago-meu-bucket` ).


![S3](images/s3-name-bucket.png)


#### 1.2 Configurar bucket
1. Na aba de **Propreidade de objeto** deixe as ACLs desabilitadas ( recomendado )


![S3](images/s3-acl-bucket.png)

   
3. Em **Configuração de bloqueio do acesso público deste bucket**, desmareque a opção de **Bloquear todo o acesso público**.


![S3](images/s3-publico.png)


5. Depois clique em **Criar bucket**.


### 1.3 Configurar Permissões
1. No console do S3, selecione o bucket que você acabou de criar.


![S3](images/s3-selecionar-bucket.png)

   
3. Vá até a aba **"Permissões"**.


![S3](images/s3-bucket-ir-para-permi.png)


5. Adicione uma política de bucket para permitir acesso público. Uma política básica pode ser assim:
   
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


![S3](images/s3-bucket-ir-propriedade.png)


4. E selecione **Hospedagem de site estático**, e clique em **editar**.


![S3](images/s3-site-static.png)


5. Ao abrir a nova aba, ative a opção de **Hospedagem de site estático**


6. Em **Documneto de ídice**, adicione `index.html`.

7. Salve as alterações e volte para a Console do S3.


![S3](images/s3-hospedar-static.png)


### 1.5 Adicionar arquivos ao bucket

1. No console do S3, clique em **Carregar**.


![S3](images/s3-carregar.png)


2. Clique em **Adicionar arquivos**, selecione o arquivo html do swagger ( `index.html`)

3. Desça a tela até **Propriedades** e clique.

4. Procure por **Metadados** e adicione o seguinte metadado ( **Tipo: Definido pelo sistema** | **Chave: Content-Type** | Valor: **text/html; charset=UTF-8** ) e finalize clicando em **Carregar** ).
   

![S3](images/s3-meta-fim.png)



**Pronto o seu html já está na web, para ver ele basta selecionar sua bucket ir em **Propriedades** ir até **Hospedagem de site estático** e lá estará a URL, cole no seu navegador e pronto.**


## Configuração da EC2

### Configuração da VPC

A VPC é fundamental para isolar a infraestrutura de rede, fornecendo controle sobre os endereços IP, sub-redes e segurança da sua aplicação.

1. Abra a console da AWS.
2. Na barra de pesquisa, procure por **VPC**.


![VPC](images/vpc-pesquisa.png)


4. Clique em **Criar VPC**.


![VPC](images/criar-vpc-dps-de-pesquisa.png)

   
6. Selecione **VPC e muito mais** para criar a VPC e outros recursos de rede.


![VPC](images/vpc-e-mais.png)


8. Escolha um nome para sua VPC.


![VPC](images/nome-da-vpc.png)

   
10. No final da tela, clique em **Criar VPC** para finalizar o processo.


![VPC](images/criar-vpc-final.png)


### Configuração Security Group

#### Detalhes básicos 

1. No console da EC2, vá para **Security groups**.


![SEC-GROUP](images/acessar-sec.png)

   
3. Clique em **Criar grupo de segurança**.


![SEC-GROUP](images/acessar-sec.png)


5. Escolha um nome para o security group.
6. Em **Descrição** insira uma breve descrição.
7. Em **VPC** selecione a VPC que você criou.

![SEC-GROUP](images/nome-e-desc-sec.png)


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


![SEC-GROUP](images/regras-sec.png)


2. Clique em **Criar grupo de segurança**.


![SEC-GROUP](images/criar-sec-final.png)


### Configuração de Key Pair

1. No console da EC2, vá para **Pares de chaves**.


![KEYS](images/keys-ir-para.png)


3. Clique em **Criar par de chaves**.


![KEYS](images/keys-criar-init.png)


4. Escolha um nome para seu par de chaves.
5. Tipo de par de chaves deixe como **RSA**.
6. Formato de arquivo de chave privada deixe como `.pem`
7. Clique em **Criar par de chaves**


![KEYS](images/keys-par-de.png)


**Importante!** Após esses passo um arquivo será baixado em seu computador, será a sua chave.
Guarde o lugar onde ela está.

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

![Tags](images/exec-instance.png)

4. Em seguida crie as Tags:

![Tags](images/tags.png)
    
**Importante**: Essas tags são importantes, pois estão de acordo com os atributos da política (ABAC) atribuída às contas do Scholarship Program. 


5. Sugestão de criação da imagem da sua VM:

![Tags](images/distribuicao-aws-linux.png)

![Tags](images/tipo-instancia-t2micro.png)


6. Informe o par de chaves criado anteriormente ( [Configuração de Key Pair](#configuração-de-key-pair) ).

![Tags](images/par-de-chaves.png)


7. Em **Configuração de Rede** clique em **Editar**.

![Tags](images/edita-conf-rede.png)


8. Agora informe as suas configurações de rede e segurança:

- Informe sua **VPC** [Configuração da VPC](#configuração-da-vpc).
- Informe a **Sub-rede**.
- Habilite o **IP público**.
- Selecione o **Security Group** [Configuração Security Group](#configuração-do-security-group)

![Tags](images/conf-redes.png)

**Atenção!** Informe suas configurações com atenção, é importante que elas estejam corretas.


9. Ao lado, você verá o quadro Resumo. Agora, basta clicar em Executar instância.

![Tags](images/resumo-ec2.png)


   


