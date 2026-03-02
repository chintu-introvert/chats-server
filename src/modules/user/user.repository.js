import masterKnex from '../../config/knex.js';
import slaveKnex from '../../config/read_knex.js';

class UserRepository {
    // Uses Master Knex instance for writes, wrapped in a transaction
    async create(userData) {
        const result = await masterKnex.transaction(async (trx) => {
            await trx('users').insert({
                name: userData.name,
                email: userData.email,
                password: userData.passwordHash
            });
        });

        return result;
    }

    // Uses Slave Knex instance for reads, paired with automatic retries
    async findById(id) {
        return slaveKnex('users').where({ id }).first();
    }


    // Additional Read query hitting the slave
    async findAll() {
        return slaveKnex('users')
            .select('id', 'name', 'email');

    }
    // check if user is already exists
    async findByEmail(email) {
        return slaveKnex('users').where({ email }).first();
    }
}

export default new UserRepository();
