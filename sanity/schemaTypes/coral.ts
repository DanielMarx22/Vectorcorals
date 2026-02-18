import { defineType, defineField } from 'sanity';

export const coral = defineType({
    name: 'coral',
    title: 'Coral Inventory',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Coral Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'URL Slug',
            type: 'slug',
            options: { source: 'name', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'price',
            title: 'Price ($)',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'category',
            title: 'Main Category',
            type: 'string',
            options: {
                list: [
                    { title: 'LPS', value: 'lps' },
                    { title: 'SPS', value: 'sps' },
                    { title: 'Soft Coral', value: 'soft' },
                    { title: 'Misc', value: 'misc' },
                ],
                layout: 'radio',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'filterTags',
            title: 'Filter Tags (e.g., Torch, Zoa, Mushroom)',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags', // Allows you to just type and hit enter
            },
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Detailed Description',
            type: 'text',
            rows: 4,
            description: 'Lighting, flow requirements, or lineage notes.',
        }),
        defineField({
            name: 'tag',
            title: 'Visual Badge (Optional)',
            type: 'string',
            options: {
                list: [
                    { title: 'None', value: '' },
                    { title: 'WYSIWYG', value: 'WYSIWYG' },
                    { title: 'Rare', value: 'RARE' },
                    { title: 'New', value: 'NEW' },
                    { title: 'Showpiece', value: 'SHOWPIECE' },
                ],
            },
            initialValue: '',
        }),
        defineField({
            name: 'status',
            title: 'Inventory Status',
            type: 'string',
            options: {
                list: [
                    { title: 'In Stock', value: 'in-stock' },
                    { title: 'Sold Out', value: 'sold-out' },
                ],
                layout: 'radio',
            },
            initialValue: 'in-stock',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'price',
            media: 'image',
        },
        prepare(selection) {
            const { title, subtitle, media } = selection;
            return {
                title: title,
                subtitle: `$${subtitle}`,
                media: media,
            };
        },
    },
});