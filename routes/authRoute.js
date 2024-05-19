const express = require('express');
const router = express.Router();
const {createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updateaUser, blockUser, unblockUser, handleRefreshToken, logoutUser, updatePassword} = require('../controller/userCtrl')
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');

router.post('/register', createUser);
router.put('/password',authMiddleware, updatePassword)
router.post('/login', loginUserCtrl);
router.get('/getall', getallUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logoutUser);
router.get('/:id', authMiddleware, isAdmin, getaUser);
router.delete('/:id', deleteaUser);
router.put('/edit-profile', authMiddleware, updateaUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);



module.exports = router;