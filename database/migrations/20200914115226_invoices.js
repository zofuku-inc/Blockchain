
exports.up = function(knex) {
  return knex.schema.createTable('invoices', tbl => {
      tbl.increments()
      tbl.string('place_number').notNullable()
      tbl.float('original_price').notNullable()
      tbl.float('usage').notNullable()
      tbl.date('bill_date').notNullable()
      tbl.date('expire_zofuku_pay')
      tbl.date('expire_neukind_pay')
      tbl.string('bill_image')
      tbl.string('hash').unique().notNullable()
      tbl.boolean('paid')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('invoices')
};
