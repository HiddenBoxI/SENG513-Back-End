import { getStatusInfoByID, insertStatusInfoById } from '#src/daos/statusDao.js';

export const getStatusInfo = async id => {
    if(!!!id || JSON.stringify(id) === ''){
        throw Error(405);
    }

    const resArr = await getStatusInfoByID(id);

    // console.log(resArr);
    if (resArr.length === 0) {
        throw Error(403);
    }
    return resArr;
};

export const insertStatusInfo = async statusInfos => {
    if(!!!statusInfos.id || JSON.stringify(statusInfos.id) === ''){
        throw Error(405);
    }

    const res = await insertStatusInfoById(statusInfos);
    // console.log(res);
    if (res.affectedRows !== 1) {
        throw Error(406);
    }
};
