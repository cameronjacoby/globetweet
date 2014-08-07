module.exports = {

  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.addColumn(
      'users',
      'defaultSearch',
      DataTypes.STRING
    )
    .complete(done);
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.removeColumn('users', 'defaultSearch')
    .complete(done);
  }

};