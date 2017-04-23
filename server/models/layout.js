'use strict';
module.exports = function(sequelize, DataTypes) {
  var Layout = sequelize.define('Layout', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    template: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Layout;
};
