import { defineField, defineType } from 'sanity'

export const section = defineType({
    name: 'section',
    title: 'Seção',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nome da Seção (ex: SALA DE JANTAR)',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'id',
            title: 'Identificador (ex: sala-de-jantar)',
            description: 'Usado na URL e rotas. Gere automaticamente.',
            type: 'slug',
            options: { source: 'name' },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'order',
            title: 'Ordem de Exibição',
            type: 'number',
            description: 'Número para ordenar as seções no menu (ex: 1, 2, 3)',
        })
    ],
    orderings: [
        {
            title: 'Ordem Manual',
            name: 'manualOrder',
            by: [
                {field: 'order', direction: 'asc'}
            ]
        }
    ]
})
