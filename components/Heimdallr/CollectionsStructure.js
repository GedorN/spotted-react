const collections = {
        user: [
            {
                desc: 'name',
                type: 'string',
            },
            {
                desc: 'email',
                type: 'string',
            },
            {
                desc: 'creation_date',
                type: 'timestamp',
            },
            {
                desc: 'birth_date',
                type: 'timestamp',
            },
            {
                desc: 'active',
                type: 'number',
            },
            {
                desc: 'deactivation_date',
                type: 'timestamp',
            },
            {
                desc: 'password',
                type: 'string'
            }
        ],
        post: [
            {
                desc: 'id_user',
                type: 'string',
                require: true,
            },
            {
                desc: 'text',
                type: 'string',
                required: true,
            },
            {
                desc: 'active',
                type: 'number',
                required: true,
            },
            {
              desc: 'date',
              type: 'object',
               required: true,
            },
            {
                desc: 'images',
                type: 'array',
                required: false,
            }
        ],
        answer: [
            {
                desc: 'id_user',
                type: 'string',
            },
            {
                desc: 'date',
                type:'timestamp',
            },
            {
                desc: 'text',
                type: 'string',
            },
            {
                desc: 'active',
                type: 'number',
            }
        ],
        report: [
            {
                desc: 'author',
                type: 'string',
            },
            {
                desc: 'date',
                type: 'timestamp'
            },
            {
                desc: 'solved',
                type: 'number',
            },
            {
                desc: 'report_category',
                type: 'string',
            }
        ],
        report_category: [
            {
                desc: 'description',
                type: 'string',
            },
            {
                desc: 'creation_date',
                type: 'timestamp'
            }
        ]

};

export default collections;