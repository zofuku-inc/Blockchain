
exports.up = function(knex) {
  return knex.schema.createTable('invoices', tbl => {
      tbl.increments()
      tbl.string('place_number')
      tbl.float('original_price')
      tbl.float('usage')
      tbl.date('bill_date')
      tbl.date('expire_zofuku_pay')
      tbl.date('expire_neukind_pay')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('invoices')
};
