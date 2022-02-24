import axios from 'axios'
import current from '@/assets/js/current'

let isLogin = false;//防止登录超时的时候，alert执行多次
export function request(config) {
  const instance = axios.create({
    baseURL: 'api/Ashx',
    // baseURL: '/Ashx',
    method: 'post',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  instance.interceptors.response.use(res => {
    if (res.data.reCode && res.data.reCode == 2) {
      if (!isLogin) {
        current.alertMine(res.data.reMsg, () => {
          current.toLogOut();
        });
        isLogin = true;
      }
      return res.data;
    } else {
      isLogin = false;
      return res.data;
    }
  }, error => {
    current.alertMine(error);
    return false;
  });
  return instance(config);
}

