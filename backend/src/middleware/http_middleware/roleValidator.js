const validateRole = (allowedRoles)=>{
    return (req,res,next)=>{
        if(!allowedRoles.includes(req.role)){
            return res.status(403).json({msg:"Access denied"})
        }
        next();
    }
}

module.exports = {validateRole}