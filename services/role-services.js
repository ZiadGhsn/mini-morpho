const roleSchema = require("../models/roleModel")


const getAllRoles = async () => {
    const rolesArray = await roleSchema.find({}, { _id: 1, role: 1 });
    const rolesObject = rolesArray.reduce((acc, { _id, role }) => {
        acc[_id.toString()] = role;
        return acc;
    }, {});
    return rolesObject;
}


module.exports = { getAllRoles }