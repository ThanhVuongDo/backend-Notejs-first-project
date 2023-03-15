import bcrypt from 'bcryptjs';
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'roleId', 'password'],
                    raw: true,

                });
                if (user) {
                    // compare password
                    let check = await bcrypt.compareSync(password, user.password); // false   

                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found~`;
                }

            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your's Email is'nt exist in your system. Plz try other email`
            }
            resolve(userData)
        } catch (e) {
            reject(e);
        }
    })
}
// let checkUserEmail = (emailUser) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let user = await db.User.findOne({
//                 where: { email: emailUser }
//             });
//             if (user) {
//                 resolve(true);
//             } else {
//                 resolve(false);
//             }
//         } catch (e) {
//             reject(e);
//         }
//     })
// }
let checkUserEmail = async (emailUser) => {
    try {
        let user = await db.User.findOne({
            where: { email: emailUser }
        });
        return user ? true : false;
    } catch (e) {
        throw e;
    }
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }

                });
            } if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exist ??
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email used, Plz try another email!'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,
                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                })

            }

        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            }
            )
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'The user is not exist'
                });

            }
            else {
                await db.User.destroy({
                    where: { id: userId }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'The user deleted'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save()
                // await db.User.save({
                //     where: { id: data.id }
                // })

                resolve({
                    errCode: 0,
                    errMessage: 'Update the user success'
                });
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData
}