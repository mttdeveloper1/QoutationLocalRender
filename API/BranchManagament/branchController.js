const BranchModel = require('./Models/branchModel');
const BankModel = require('./Models/BankModel');
const NodeChache = require('node-cache');

const BranchCache = new NodeChache({ stdTTL: 600, checkperiod: 600 });//10 minutes

exports.createBranch = async (req, res) => {
    try {
        const { BranchName, BranchAddress, BranchEmail, BranchContact } = req.body;
        if (!BranchName || !BranchAddress || !BranchEmail || !BranchContact) {
            const MissField = BranchName ? (BranchAddress ? (BranchEmail ? (BranchContact ? "" : "Contact Number") : "Email") : "Address") : "Name";
            return res.status(400).json({ error: `All fields are required . Miss field is ${MissField}` });
        }
        const branch = await BranchModel.create({ BranchName, BranchAddress, BranchEmail, BranchContact});
        res.status(200).json(branch);
    } catch (error) {
        console.error('Error creating branch:', error);
        res.status(500).json({ error: 'Failed to create branch' });
    }
}

exports.getBranchs = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limitParam = req.query.limit;
        const limit = limitParam === 'ALL' ? null : Math.max(parseInt(limitParam, 10) || 100, 1);
        const offset = limit ? (page - 1) * limit : null;

        const cacheKey = `branchesPage_${page}_limit_${limit || 'ALL'}`;
        const cachedData = BranchCache.get(cacheKey);
        if (cachedData) {
            console.log("Cache hit");
            return res.status(200).json(JSON.parse(cachedData));
        }

        const { rows: branches, count: totalItems } = await BranchModel.findAndCountAll({
            include: [{ model: BankModel ,as:'bankinfo'}],
            limit,
            offset,
            plain:true
        });

        const totalPages = limit ? Math.ceil(totalItems / limit) : 1;

        const responseData = {
            totalItems,
            totalPages,
            currentPage: page,
            data: branches,
        };

        BranchCache.set(cacheKey, JSON.stringify(responseData)); // Cache for 600 seconds (10 minutes)

        return res.status(200).json(responseData);
    } catch (error) {
        console.error('Error getting branches:', error);
        return res.status(500).json({ error: 'Failed to get branches' });
    }
};

exports.getBranchById=async (req,resp)=>{
    try {
        const {BrachId}=req.params;
        const getData= await BranchModel.findOne({where:{BrachId}});
        resp.status(200).json(getData);
    } catch (error) {
        console.log(error)        
        resp.status(500).json(error);
    }
}

exports.updateBranch = async (req, res) => {
    try {
        const {BranchId}=req.params;
        const {  BranchName, BranchAddress, BranchEmail, BranchContact } = req.body;
        if (!BranchId || !BranchName || !BranchAddress || !BranchEmail || !BranchContact) {
            const MissField = BranchName ? (BranchAddress ? (BranchEmail ? (BranchContact ? "" : "Contact Number") : "Email") : "Address") : "Name";
            return res.status(400).json({ error: `All fields are required . Miss field is ${MissField}` });
        }
        const branch = await BranchModel.findOne({ where: { BranchId } });
        if (!branch) {
            return res.status(404).json({ error: 'Branch not found' });
        }
        await branch.update({ BranchName, BranchAddress, BranchEmail, BranchContact });
        invalidateBranchCache();
        res.status(200).json(branch);
    } catch (error) {
        console.error('Error updating branch:', error);
        res.status(500).json({ error: 'Failed to update branch' });
    }
}

exports.deleteBranch = async (req, res) => {
    try {
        const { BranchId } = req.params;
        if (!BranchId) {
            return res.status(400).json({ error: 'BranchId is required' });
        }
        const branch = await BranchModel.findOne({ where: { BranchId } });
        if (!branch) {
            return res.status(404).json({ error: 'Branch not found' });
        }
        await branch.destroy();
        await invalidateBranchCache();
        res.status(200).json({ message: 'Branch deleted successfully' });
    } catch (error) {
        console.error('Error deleting branch:', error);
        res.status(500).json({ error: 'Failed to delete branch' });
    }
}




exports.AddBank = async (req, res) => {
    try {
        const { BranchId, BankName, AccountNumber, IFSC, PanNumber } = req.body;
        if (!BranchId || !BankName || !AccountNumber || !IFSC || !PanNumber) {
            const MissField = BranchId ? (BankName ? (AccountNumber ? (IFSC ? (PanNumber ? "" : "Pan Number") : "IFSC") : "Account Number") : "Bank Name") : "Branch Id";
            return res.status(400).json({ error: `All fields are required . Miss field is ${MissField}` });
        }
        const bank = await BankModel.create({ BranchId, BankName, AccountNumber, IFSC, PanNumber });
        res.status(200).json(bank);
    } catch (error) {
        console.error('Error creating bank:', error);
        res.status(500).json({ error: 'Failed to create bank', err: error });

    }
}

exports.getBankInfo=async(req,resp)=>{
    try {
        
        const getData=await BankModel.findAll()
        resp.status(200).json(getData);
    } catch (error) {
        resp.status(500).json(error);
    }
}

exports.getByIdBank=async (req,resp)=>{
    try {
        const {BranchId,Id}=req.params;
        const getData=await BankModel.findAll({where:{
            BranchId:BranchId
        }});
        resp.status(200).json(getData)
    } catch (error) {
        resp.status(500).json(error);
    }
}


exports.updateBank = async (req, res) => {
    try {
        const { BranchId } = req.params;
        const updateBankInfo = await BankModel.findOne({ where: { id:BranchId } });
        if (!updateBankInfo) {
            return res.status(404).json({ message: "For this id not exist bank info." })
        }
        await updateBankInfo.update(req.body, {
            where: {
               id:BranchId
            }
        });
        res.status(200).json(updateBankInfo);

    } catch (error) {
        return res.status(500).json({ message: `not update , ${error}` })
    }
}



exports.deleteBankInfo = async (req, resp) => {
    try {
        const { id } = req.params;
        await BankModel.destroy({ where: { id } })
        return resp.status(200);

    } catch (error) {
        console.log(error);
        return resp.status(500).json(BankModel)
    }
}

function invalidateBranchCache() {
    BranchCache.flushAll();
}