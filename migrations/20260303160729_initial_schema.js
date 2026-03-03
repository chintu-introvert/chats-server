/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema
        .createTable('users', table => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('email').unique().notNullable();
            table.string('password').notNullable();
            table.timestamps(true, true);
        })
        .createTable('rooms', table => {
            table.increments('id').primary();
            table.string('name').nullable();
            table.enum('type', ['group', 'direct']).defaultTo('group');
            table.timestamps(true, true);
        })
        .createTable('user_rooms', table => {
            table.integer('userid').unsigned().references('id').inTable('users').onDelete('CASCADE');
            table.integer('roomid').unsigned().references('id').inTable('rooms').onDelete('CASCADE');
            table.integer('receiverid').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
            table.primary(['userid', 'roomid']);
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
        .createTable('messages', table => {
            table.increments('id').primary();
            table.integer('roomid').unsigned().references('id').inTable('rooms').onDelete('CASCADE');
            table.integer('userid').unsigned().references('id').inTable('users').onDelete('CASCADE');
            table.text('content').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
    return knex.schema
        .dropTableIfExists('messages')
        .dropTableIfExists('user_rooms')
        .dropTableIfExists('rooms')
        .dropTableIfExists('users');
};
