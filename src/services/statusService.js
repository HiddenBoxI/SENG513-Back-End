import {getStatusInfoByID} from '#src/daos/statusDao.js';

export const getStatusInfo = async (id) => {
    try {
        const resArr = await getStatusInfoByID(id);
        console.log(resArr);
        if (resArr.length === 0) {
            throw Error(403);
        }
        return resArr;
    } catch (err) {
        console.log(err);
    }
}
// getStatusInfo(1).then((res => {
//     console.log(res);
// })).catch((err) => {
//     console.log(err);
// })


