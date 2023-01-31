const express = require('express');
const router = express.Router()
const { tryCatchWrapper } = require('../../helpers');
const { validateBody } = require("../../middlewares/validateBody")
const { authenticate } = require("../../middlewares/authenticate")
const { schemas } = require("../../models/user")
const { register, login, getCurrent, logout } = require("../../controllers/auth.controller")

router.post("/register", validateBody(schemas.registerAndLoginSchema), tryCatchWrapper(register))
router.post("/login", validateBody(schemas.registerAndLoginSchema), tryCatchWrapper(login))
router.get("/logout", authenticate, tryCatchWrapper(logout))
router.get("/current", authenticate, tryCatchWrapper(getCurrent))

module.exports = router