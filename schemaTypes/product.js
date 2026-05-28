import { defineField, defineType } from 'sanity'

export const product = defineType({
    name: 'product',
    title: 'Produto',
    type: 'document',
    fields: [
        defineField({
            name: 'id',
            title: 'ID do Produto (ex: sofa-horizonte)',
            type: 'slug',
            options: { source: 'title' },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'categoryId',
            title: 'Categoria',
            type: 'reference',
            to: [{ type: 'category' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title',
            title: 'Título (Nome do Produto)',
            type: 'string',
            validation: (Rule) => Rule.required().error('O título é obrigatório.'),
        }),
        defineField({
            name: 'description',
            title: 'Descrição Curta',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'longDescription',
            title: 'Descrição Longa',
            type: 'text',
        }),
        defineField({
            name: 'price',
            title: 'Preço (Texto)',
            description: 'Ex: "R$ 4.580,00" ou "Sob Consulta"',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Foto Principal',
            type: 'image',
            options: {
                hotspot: true,
            }
        }),
        defineField({
            name: 'images',
            title: 'Galeria de Imagens e Vídeos',
            type: 'array',
            of: [
                { type: 'image', options: { hotspot: true } },
                { type: 'file', options: { accept: 'video/mp4' } }
            ]
        }),
        defineField({
            name: 'especificacoes_mesa',
            title: 'Especificações da Mesa',
            type: 'object',
            fields: [
                {name: 'modelo', title: 'Modelo', type: 'string'},
                {name: 'medidas', title: 'Medidas (ex: 2,20x1,00m)', type: 'string'},
                {name: 'altura', title: 'Altura', type: 'string'},
                {name: 'largura', title: 'Largura', type: 'string'},
                {name: 'profundidade', title: 'Profundidade', type: 'string'},
                {name: 'comprimento', title: 'Comprimento', type: 'string'},
                {name: 'formato', title: 'Formato', type: 'string'},
                {name: 'base', title: 'Base (Estrutura)', type: 'string'},
                {name: 'tampo', title: 'Tampo (Acabamento)', type: 'string'},
                {name: 'material_tampo', title: 'Material do Tampo', type: 'string'},
                {name: 'estrutura_pes', title: 'Estrutura dos Pés', type: 'string'},
                {name: 'cor', title: 'Cor', type: 'string'},
                {name: 'capacidade', title: 'Capacidade (Lugares)', type: 'string'},
                {name: 'estilo', title: 'Estilo', type: 'string'},
            ]
        }),
        defineField({
            name: 'especificacoes_cadeira',
            title: 'Especificações da Cadeira',
            type: 'object',
            fields: [
                {name: 'modelo', title: 'Modelo', type: 'string'},
                {name: 'quantidade', title: 'Quantidade', type: 'number'},
                {name: 'estrutura', title: 'Estrutura', type: 'string'},
                {name: 'encosto', title: 'Encosto', type: 'string'},
                {name: 'assento', title: 'Assento', type: 'string'},
                {name: 'revestimento', title: 'Revestimento', type: 'string'},
                {name: 'tecido', title: 'Tecido', type: 'string'},
                {
                    name: 'opcoes_tecido', 
                    title: 'Opções de Tecido', 
                    type: 'array', 
                    of: [{type: 'string'}]
                },
                {
                    name: 'opcoes_acabamento', 
                    title: 'Opções de Acabamento', 
                    type: 'array', 
                    of: [{type: 'string'}]
                },
                {name: 'estilo', title: 'Estilo', type: 'string'},
                {
                    name: 'dimensoes', 
                    title: 'Dimensões (Objeto Aninhado)', 
                    type: 'object',
                    fields: [
                        {name: 'altura', title: 'Altura', type: 'string'},
                        {name: 'largura', title: 'Largura', type: 'string'},
                        {name: 'profundidade', title: 'Profundidade', type: 'string'}
                    ]
                },
                {
                    name: 'caracteristicas', 
                    title: 'Características', 
                    type: 'array', 
                    of: [{type: 'string'}]
                },
                {name: 'detalhes', title: 'Detalhes', type: 'string'},
                {name: 'uso_indicado', title: 'Uso Indicado', type: 'string'},
                {
                    name: 'modelos_disponiveis', 
                    title: 'Modelos Disponíveis', 
                    type: 'array', 
                    of: [{type: 'string'}]
                }
            ]
        }),
        defineField({
            name: 'especificacoes_cozinha',
            title: 'Especificações da Cozinha',
            type: 'object',
            fields: [
                {name: 'modelo', title: 'Modelo', type: 'string'},
                {name: 'pecas', title: 'Quantidade de Peças', type: 'string'},
                {name: 'composicao', title: 'Composição (ex: 1 paneleiro, 2 aéreos)', type: 'string'},
                {name: 'estrutura', title: 'Estrutura (ex: 100% MDF)', type: 'string'},
                {name: 'acabamento', title: 'Acabamento/Pintura', type: 'string'},
                {
                    name: 'dimensoes', 
                    title: 'Dimensões (Objeto Aninhado)', 
                    type: 'object',
                    fields: [
                        {name: 'altura', title: 'Altura', type: 'string'},
                        {name: 'largura', title: 'Largura', type: 'string'},
                        {name: 'profundidade', title: 'Profundidade', type: 'string'}
                    ]
                },
                {name: 'cor', title: 'Cor', type: 'string'},
                {name: 'estilo', title: 'Estilo', type: 'string'}
            ]
        }),
        defineField({
            name: 'especificacoes_gerais',
            title: 'Especificações Gerais (Outros Produtos)',
            type: 'object',
            fields: [
                {name: 'modelo', title: 'Modelo', type: 'string'},
                {name: 'linha', title: 'Linha/Coleção', type: 'string'},
                {name: 'altura', title: 'Altura', type: 'string'},
                {name: 'largura', title: 'Largura', type: 'string'},
                {name: 'profundidade', title: 'Profundidade', type: 'string'},
                {name: 'peso', title: 'Peso', type: 'string'},
                {name: 'material', title: 'Material/Composição', type: 'string'},
                {name: 'acabamento', title: 'Acabamento/Pintura', type: 'string'},
                {name: 'cor', title: 'Cor', type: 'string'},
                {name: 'gavetas', title: 'Quantidade de Gavetas', type: 'string'},
                {name: 'portas', title: 'Quantidade de Portas', type: 'string'},
                {name: 'prateleiras', title: 'Quantidade de Prateleiras', type: 'string'},
                {name: 'garantia', title: 'Garantia', type: 'string'},
                {name: 'diferenciais', title: 'Diferenciais', type: 'string'},
                {name: 'observacoes', title: 'Observações', type: 'string'},
                {name: 'tamanho_colchao', title: 'Tamanho do Colchão', type: 'string', description: 'Ex: Queen, King, Casal, Solteiro'},
                {name: 'espuma', title: 'Tipo de Espuma/Densidade', type: 'string'},
                {name: 'medida_colchao', title: 'Medida do Colchão', type: 'string', description: 'Ex: 1,98x1,58m'},
                {name: 'tipo_colchao', title: 'Tipo de Colchão', type: 'string', description: 'Ex: Molas Ensacadas, Espuma'},
                {
                    name: 'atributos_extras',
                    title: 'Campos Coringa (Atributos Extras)',
                    description: 'Adicione qualquer outra especificação que não exista acima',
                    type: 'array',
                    of: [{
                        type: 'object',
                        fields: [
                            { name: 'chave', title: 'Nome do Atributo', type: 'string', description: 'Ex: Tipo de Pés, Tipo de Dobradiça' },
                            { name: 'valor', title: 'Valor', type: 'string', description: 'Ex: Madeira Maciça, Metálica' }
                        ]
                    }]
                }
            ]
        })
    ]
})