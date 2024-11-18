Dashboard de Dados Financeiros

Esta aplicação é uma dashboard desenvolvida para exibir e analisar dados financeiros de forma dinâmica, com gráficos interativos e filtros personalizados.

Funcionalidades

	•	Autenticação de Usuário: Página de login integrada ao Firebase Authentication, com gerenciamento de token para persistência de sessão por 1 hora.
	•	API Personalizada: Criação de uma API para gerenciar tokens de acesso, armazenados nos cookies do navegador para proteger as sessões.
	•	Exibição de Dados: Os dados financeiros são lidos de um arquivo JSON armazenado em uma API personalizada.
	•	Gráficos Dinâmicos: Utilização de gráficos interativos com a biblioteca ApexCharts para melhor visualização dos dados.
	•	Estilização Responsiva: Integração do Tailwind CSS para estilização e Material UI para componentes adicionais.
	•	Resumo em Cards: Exibição de valores totais somados do JSON em cards informativos.
	•	Filtros Avançados: Filtros dinâmicos para refinar a visualização e análise dos dados.

Tecnologias Utilizadas

	•	Front-end: React, Tailwind CSS, Material UI, ApexCharts
	•	Back-end: Firebase, API customizada para gerenciamento de tokens e dados
	•	Deploy: Vercel

Como acessar

A aplicação está hospedada na Vercel. Para acessar os dados JSON diretamente, utilize a rota: /api/dados.
