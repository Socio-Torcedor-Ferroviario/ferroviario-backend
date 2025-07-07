# Para iniciar o desenvolvimento:

- Primeiramente se faz necessário criar um .env em /backend e preencher com pelo menos as seguintes chaves:

```
NODE_ENV=local
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=stFerroviario
DB_PORT=5432
DB_HOST=postgres
DB_TYPE=postgres
SERVER_PORT=8500
JWT_SECRET=SEU_TOKEN_SECRETO
```

# Para subir o container:

- Tenha certeza que você tem o docker instalado na sua máquina e além disso no mesmo grupo do sudo (para testar, basta tentar executar "docker ps" sem o uso do sudo).

- Com isso, instale a extensão do VSCODE devContainer. Depois de instalada, aperte CTRL+SHIFT+P e selecione a opção: "Conteineres de Desenvolvimento: Abrir Pasta no Contêiner".

- Dessa forma, ele vai buildar todas as dependências necessárias como banco de dados postgres e as dependências para rodar o código. Para acessar o banco de dados, o usuário e senha são as mesmas definidas no seu arquivo .env em "POSTGRES_USER" e "POSTGRES_PASSWORD", respectivamente. O nome do banco de dados é o definido em "POSTGRES_DB". 

- O contêiner de desenvolvimento é basicamente um contêiner rodando na sua máquina, portanto, para acessar o banco de dados a partir da sua máquina, ela está mapeada para a porta 5450, se precisar trocar, basta ir no docker-compose.yaml, porém, peço que não faça commit dessa mudança.

- Após o contêiner terminar de instalar tudo, o seu setup de desenvolvimento estará pronto.