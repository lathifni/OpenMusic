exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },albums:{
            type: 'VARCHAR(50)',
            foreignKey: true,
            notNull: false
        },title: {
            type: 'VARCHAR(50)',
            notNull: true,
        },year: {
            type: "INTEGER",
            notNull: true
        },genre: {
            type: 'VARCHAR(50)',
            notNull: true
        },performer: {
            type: 'VARCHAR(50)',
            notNull: true
        },duration: {
            type: "INTEGER",
            notNull: false
        },
    })
};

exports.down = pgm => {
    pgm.dropTable('songs')
};
