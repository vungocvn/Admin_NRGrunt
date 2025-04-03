const apiHost = "http://127.0.0.1:8000/api/";

export enum api {
    getUsers = apiHost + "users",
    createUser = apiHost + "users/register",
    deleteUser = apiHost + "users",
    updateUser = apiHost + "users",
    changeUserRole = apiHost + "users/manager",
}

