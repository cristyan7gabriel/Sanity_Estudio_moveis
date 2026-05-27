import { defineField, defineType } from 'sanity'

export const category = defineType({
    name: 'category',
    title: 'Categoria',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nome da Categoria (ex: Mesas)',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'id',
            title: 'Identificador (ex: mesas, area-externa)',
            description: 'Usado na URL do site. Gere automaticamente baseado no nome.',
            type: 'slug',
            options: { source: 'name' },
            validation: (Rule) => Rule.required(),
        })
    ]
})
