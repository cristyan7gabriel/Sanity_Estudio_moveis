import { defineField, defineType } from 'sanity'

export const product = defineType({
    name: 'product',
    title: 'Produto',
    type: 'document', // 'document' significa que este item aparecerá no menu lateral
    fields: [
        defineField({
            name: 'name',
            title: 'Nome do Produto',
            type: 'string',
            validation: (Rule) => Rule.required().error('O nome é obrigatório.'),
        }),
        defineField({
            name: 'price',
            title: 'Preço',
            type: 'number',
        }),
        defineField({
            name: 'image',
            title: 'Foto do Produto',
            type: 'image',
            options: {
                hotspot: true, // Permite que o cliente recorte e dê zoom na imagem dentro do painel
            }
        })
    ]
})