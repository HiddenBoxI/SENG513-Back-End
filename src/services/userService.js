import { getUserByNickname, insertUser } from '#src/daos/userDao.js';

export const login = async (nickname, password) => {
    // const [rows] = userResult();
    // return rows;
    const resArr = await getUserByNickname(nickname);
    if (resArr.length === 0) {
        throw Error(400);
    }

    if (resArr[0].password !== password) {
        throw Error(401);
    }
};

export const signin = async (nickname, password) => {
    try {
        const affectedRows = await insertUser(nickname, password);
        if (affectedRows !== 1) {
            throw Error(500);
        }
    } catch ({message}) {
        if(message === '1062'){
            throw Error(402);
        }
    }
};


