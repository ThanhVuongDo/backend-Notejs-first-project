import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
let router = express.Router();

let initwebRoutes = (app) => {
    router.get('/', homeController.getHomepage);
    router.get('/about', homeController.getAboutpage);
    router.get('/malai', homeController.getMalaitpage);
    router.get('/crud', homeController.getCRUD);

    router.get('/TVcoder', (req, res) => {
        return res.send('Hello world with TVcoder')
    });
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayCRUD);

    router.get('/edit-crud', homeController.editCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);



    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);

    router.get('/api/allcode', userController.getAllCode);

    return app.use("/", router);
}

module.exports = initwebRoutes;