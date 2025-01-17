const router=require('express').Router();
const Controller=require('./branchController');


router.get('/',Controller.getBranchs);
router.post('/',Controller.createBranch);
router.put('/:BranchId',Controller.updateBranch);
router.delete('/:BranchId',Controller.deleteBranch);

//
router.get('/bank',Controller.getBankInfo);
router.get('/bank/:BranchId',Controller.getByIdBank);
router.post('/bank',Controller.AddBank);
router.put('/bank/:BranchId',Controller.updateBank);
router.delete('/bank/:id',Controller.deleteBankInfo);



module.exports=router;