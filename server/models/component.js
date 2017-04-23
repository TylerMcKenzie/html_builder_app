'use strict';
module.exports = function(sequelize, DataTypes) {
  var Component = sequelize.define('Component', {
    name: {
      type: DataTypes.STRING,
      allowNull: DataTypes.FALSE
    },
    template: {
      type: DataTypes.STRING,
      allowNull: DataTypes.FALSE
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Component;
};
