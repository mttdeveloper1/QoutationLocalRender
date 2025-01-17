const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/db');

const BankModel = require('./BankModel');

class Branch extends Model { }

Branch.init({
    BranchId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement:true
    },
    BranchName: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    BranchAddress: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    BranchEmail: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    BranchContact: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    BranchStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    BranchLogo: {
        type: DataTypes.STRING(600),
        allowNull: true
    }


}, {
    sequelize,
    modelName: "Branch",
    tableName: "branch"
});

Branch.hasMany(BankModel, { foreignKey: 'BranchId', sourceKey: 'BranchId' ,as:'bankinfo'});
BankModel.belongsTo(Branch, { foreignKey: 'BranchId', sourceKey: 'BranchId' ,as:'bankinfo'});

module.exports = Branch
