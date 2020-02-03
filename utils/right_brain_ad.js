const {
    request
} = require("../utils/request");
const POST_BIND_USER_UID="./";
/**
 * 绑定用户UID
 */
function bindUserUID(input) {
    return new Promise((resolve, reject) => {
        resolve({
            isSuccess: true
        });
    });
    return new Promise((resolve, reject) => {
        var param = input;
        request.post(this.POST_BIND_USER_UID, param).then((res) => {
            if (res.data.isError) {
                reject(res.data);
            } else {
                resolve(res.data.result);
            }
        }).catch((e) => {
            console.error(this.POST_BIND_USER_UID, e);
            reject(e);
        });
    });
}
module.exports = {
    bindUserUID: bindUserUID
}