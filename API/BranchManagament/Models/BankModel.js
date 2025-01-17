const {DataTypes,Model}=require('sequelize');
const sequelize=require('../../../config/db');
const BranchModel=require('./branchModel');

class Bank extends Model{}

Bank.init({
    id:{
        type:DataTypes.BIGINT,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    BranchId:{
        type:DataTypes.BIGINT,
        references:{
            model:"branch",
            key:"BranchId"
        }
    },
    BankName:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    AccountNumber:{
        type:DataTypes.STRING(100),
        allowNull:true
    },
    IFSC:{
        type:DataTypes.STRING(100),
        allowNull:true
    },
    PanNumber:{
        type:DataTypes.STRING(100),
        allowNull:true
    },
    GSTNO:{
        type:DataTypes.STRING(100),
        allowNull:true
    }
},
{
    sequelize,
    modelName: "BankInfo",
    tableName: "bankinfo",
    timestamps: false
});

module.exports = Bank