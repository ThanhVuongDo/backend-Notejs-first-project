import db from '../models/index';
import CRUDService from '../services/CRUDService';


let getHomepage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e)
    }

}

let getAboutpage = (req, res) => {
    return res.render('test/about.ejs');
}

let getMalaitpage = (req, res) => {
    return res.render('test/malai.ejs');
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}
let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message)
    return res.send('post crud from server');
}
let displayCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();

    return res.render('displayCRUD.ejs', {
        dataTable: data
    });
}
let editCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);

        return res.render('editCRUD.ejs', {
            user: userData
        });
    }
    else {
        return res.send('Users not found!');
    }

}
let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUsers
    });
}
let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id)
        return res.send('Delete the user successed')
    } else {
        return res.send('Users not found');
    }
}

module.exports = {
    getHomepage: getHomepage,
    getAboutpage: getAboutpage,
    getMalaitpage: getMalaitpage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayCRUD: displayCRUD,
    editCRUD: editCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}