/*
* Nessa tela ficam definidas as estruturas das "tabelas" do firebase. Essas esturuturas controlaram as inserções e
* updates. Assim as tabelas ficam protegidas de inserções e modificações errôneas
* */

const collections = {
    user: [
      {
          desc: 'name',
          type: 'string',
        required: true,
      },
      {
          desc: 'email',
          type: 'string',
        required: true,
      },
      {
        desc: 'user_image',
        type: 'string',
      },
      {
        desc: 'uid',
        type: 'string',
        required: true,
      },
      {
        desc: 'creation_date',
        type: 'number',
        required: true,
      },
      {
        desc: 'phone',
        type: 'string',
        required: true,
      },
      {
        desc: 'active',
        type: 'number',
        required: true,
      },
      {
        desc: 'deactivation_date',
        type: 'timestamp',
      },
      {
        desc: 'password',
        type: 'string',
        required: true,
      }
    ],
		comment: [
			{
				desc: 'pid',
				type: 'string',
				required: true,
			},
			{
				desc: 'cid',
				type: 'string',
				required: true,
			},
			{
				desc: 'id_user',
				type: 'string',
				required: true,
			},
			{
				desc: 'comment',
				type : 'string',
				required: false,
			},
			{
				desc: 'user_name',
				type: 'string',
				required: true,
			},
			{
				desc: 'date',
				type: 'number',
				required: true,
			},
			{
				desc: 'user_image',
				type: 'string',
				required: false,
      },
      {
        desc: 'images',
        type: 'array',
        required: false,
      },
      {
        desc: 'video',
        type: 'boolean',
        required: false,
      },
			{
				desc: 'gif',
				type: 'boolean',
				required: false,
			},
      {
        desc: 'taggedUsers',
        type: 'array',
        required: false,
      },
      {
        desc: 'anonymous',
        type: 'boolean'
      }
		],
    post: [
        {
            desc: 'user_name',
            type: 'string',
            require: true,
        },
      {
        desc: 'liked_by',
        type: 'array',
        required: false,
      },
      {
        desc: 'likes',
        type: 'number',
        required: false,
      },
      {
        desc: 'pid',
        type: 'string',
        required: true,
      },
        {
            desc: 'user_image',
            type: 'string',
            require: true,
        },
      {
        desc: 'comments',
        type: 'number',
      },
        {
            desc: 'uid',
            type: 'string',
            require: true,
        },
        {
            desc: 'text',
            type: 'string',
        },
        {
            desc: 'active',
            type: 'number',
            required: true,
        },
        {
          desc: 'date',
          type: 'number',
          required: true,
        },
      {
        desc: 'sort_value',
        type: 'number',
        required: false
      },
      {
          desc: 'images',
          type: 'array',
          required: false,
      },
      {
        desc: 'gif',
        type: 'boolean',
        required: false,
      },
      {
        desc: 'video',
        type: 'boolean',
        required: false,
      },
      {
        desc: 'taggedUsers',
        type: 'array',
        required: false,
      },
      {
          desc: 'anonymous',
          type: 'boolean'
      }
    ],
        dev_post: [
          {
            desc: 'user_name',
            type: 'string',
            require: true,
          },
          {
            desc: 'liked_by',
            type: 'array',
            required: false,
          },
          {
            desc: 'likes',
            type: 'number',
            required: false,
          },
          {
            desc: 'pid',
            type: 'string',
            required: true,
          },
          {
            desc: 'user_image',
            type: 'string',
            require: true,
          },
          {
            desc: 'comments',
            type: 'number',
          },
          {
            desc: 'uid',
            type: 'string',
            require: true,
          },
          {
            desc: 'text',
            type: 'string',
          },
          {
            desc: 'active',
            type: 'number',
            required: true,
          },
          {
            desc: 'date',
            type: 'number',
            required: true,
          },
          {
            desc: 'sort_value',
            type: 'number',
            required: false
          },
          {
            desc: 'images',
            type: 'array',
            required: false,
          },
          {
            desc: 'gif',
            type: 'boolean',
            required: false,
          },
          {
            desc: 'video',
            type: 'boolean',
            required: false,
          },
          {
            desc: 'anonymous',
            type: 'boolean'
          }
        ],
        boardPost : [
            {
                desc: 'user_name',
                type: 'string',
                require: true,
            },
	        {
	        	desc: 'pid',
		        type: 'string',
		        required: true,
	        },
            {
                desc: 'user_image',
                type: 'string',
                require: true,
            },
            {
                desc: 'uid',
                type: 'string',
                require: true,
            },
            {
                desc: 'text',
                type: 'string',
            },
            {
                desc: 'active',
                type: 'number',
                required: true,
            },
            {
              desc: 'date',
              type: 'number',
	            required: true,
            },
            {
                desc: 'images',
                type: 'array',
                required: false,
            },
	        {
		        desc: 'gif',
		        type: 'boolean',
		        required: false,
	        },
	        {
	        	desc: 'video',
		        type: 'boolean',
		        required: false,
	        },
            {
                desc: 'day_counter',
                type:  'number',
                required: true
            },
            {
                desc: 'docName',
                type: 'string',
                required: true
            },
            {
                desc: 'title',
                type: 'string',
                required: true
            }

        ],
		unverified_post: [
			{
				desc: 'user_name',
				type: 'string',
				require: true,
			},
			{
				desc: 'pid',
				type: 'string',
				required: true,
			},
			{
				desc: 'user_image',
				type: 'string',
				require: true,
			},
			{
				desc: 'comments',
				type: 'number',
			},
			{
				desc: 'uid',
				type: 'string',
				require: true,
			},
			{
				desc: 'text',
				type: 'string',
			},
			{
				desc: 'active',
				type: 'number',
				required: true,
			},
			{
				desc: 'date',
				type: 'number',
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
                require: true,
            },
            {
                desc: 'date',
                type:'object',
                required: true,
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
                require: true,
            },
            {
                desc: 'date',
                type: 'object',
                required: true,
            },
            {
                desc: 'solved',
                type: 'number',
                required: true,
            },
            {
                desc: 'report_category',
                type: 'number',
                required: true,
            }
        ],
        report_category: [
            {
                desc: 'id_report_category',
                type: 'number'
            },
            {
                desc: 'description',
                type: 'string',
            },
            {
                desc: 'creation_date',
                type: 'timestamp'
            }
        ],
        notification: [
            {
                desc: 'eid',
                type: 'string'
            },
            {
                desc: 'uid',
                type: 'string'
            },
            {
                desc: 'uid_notification',
                type: 'string'
            },
            {
                desc: 'user_name',
                type: 'string'
            },
            {
                desc:'user_image',
                type:'string'
            },
            {
                desc: 'content',
                type: 'string'
            },
            {
                desc: 'nid',
                type: 'string'
            },
            {
                desc: 'date',
                type: 'timestamp'
            },
            {
                desc: 'visualized',
                type: 'number'
            },
            {
                desc: 'entity',
                type: 'string'
            },
            {
                desc: 'anonymous',
                type: 'boolean'
            }
        ],
        post_report: [
            {
                desc: 'author',
                type: 'string'
            },
	        {
	        	desc: 'pid',
		        type: 'string',
	        },
            {
                desc: 'category',
                type: 'string'
            },
            {
                desc: 'date',
                type: 'timestamp'
            },
	        {
	        	desc: 'description',
		        type: 'string'
	        }
        ],
		board_report: [
			{
				desc: 'author',
				type: 'string'
			},
			{
				desc: 'pid',
				type: 'string',
			},
			{
				desc: 'category',
				type: 'string'
			},
			{
				desc: 'date',
				type: 'timestamp'
			},
			{
				desc: 'description',
				type: 'string'
			}
		],
        commentary_report: [
            {
                desc: 'pid',
                type: 'string'
            },
	        {
	        	desc: 'cid',
		        type: 'string'
	        },
            {
                desc: 'author',
                type: 'string'
            },
            {
                desc: 'category',
                type: 'string'
            },
            {
                desc: 'date',
                type: 'timestamp'
            },
	        {
	        	desc: 'description',
		        type: 'string'
	        }
        ],
		board_commentary_report: [
			{
				desc: 'pid',
				type: 'string'
			},
			{
				desc: 'cid',
				type: 'string'
			},
			{
				desc: 'author',
				type: 'string'
			},
			{
				desc: 'category',
				type: 'string'
			},
			{
				desc: 'date',
				type: 'timestamp'
			},
			{
				desc: 'description',
				type: 'string'
			}
		]

};

export default collections;
