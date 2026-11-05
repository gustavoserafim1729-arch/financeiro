# Ativação do assistente com IA

A API está em `api/assistente.js`, preparada para publicação em uma hospedagem de funções Node (por exemplo, Vercel). **Ela ainda não está hospedada nem ativada.** O GitHub Pages publica somente a interface estática.

## Passos

1. Conecte a Vercel ao GitHub e importe o repositório `gustavoserafim1729-arch/financeiro` como um projeto. Configure o projeto como **Other**, na pasta raiz.
2. Crie uma chave de API em https://platform.openai.com/api-keys. A API é cobrada separadamente do ChatGPT.
3. Configure na hospedagem, sem publicar no GitHub:
   - `OPENAI_API_KEY`: chave privada da OpenAI.
   - `APP_ACCESS_TOKEN`: senha aleatória exclusiva, com pelo menos 32 caracteres.
   - `OPENAI_MODEL`: opcional, padrão `gpt-5-mini`.
4. Execute o deploy e copie a URL real `https://SEU-PROJETO.vercel.app/api/assistente`.
5. No Meu Financeiro do celular, abra **Ajustes → IA generativa**, informe essa URL e o token de acesso configurado no servidor. Salve.
6. Em **Assistente**, experimente: `Analise meus gastos e diga se vale comprar um jogo de R$ 100.`

A integração tem autenticação por token e restringe o CORS à origem do Meu Financeiro. Para uso público/múltiplos usuários serão necessários login, limites de requisição, controles de custo e proteção adicional contra abuso. Cada mensagem enviada à IA inclui um resumo financeiro; reveja a privacidade antes de usar.

## Banco automático

**Ainda não implementado.** Requer contratação/configuração de integrador ou instituição participante do Open Finance, conexão segura e consentimento do titular no fluxo bancário. Não informe senhas do banco. Até lá, use a importação CSV/OFX disponível na tela Ajustes, conferindo os lançamentos e evitando duplicidade de fatura/cartão.

**Importante:** depósitos, pagamentos, extratos ou tokens do banco não devem ser enviados ao GitHub público.
