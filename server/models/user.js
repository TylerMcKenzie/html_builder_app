'use strict';
var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: DataTypes.FALSE
    },
    password: {
      type: DataTypes.STRING,
      allowNull: DataTypes.FALSE
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      },
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
  });
  return User;
};
