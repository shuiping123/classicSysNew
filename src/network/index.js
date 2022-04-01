import axios from 'axios'
import store from '@/store'
import context from '@/main'
import current from '@/assets/js/current'

let isLogout = false;//防止登录超时的时候，alert执行多次
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
      if (!isLogout) {
        isLogout = true;
        current.alertMine(res.data.reMsg, () => {
          if (context.$route.path == '/dashboard') {
            current.toLogOut();
          }else {
            store.dispatch('user/logout').then(() => {
              isLogout = true;
            });
          }

        });
      }
      return res.data;
    } else {
      isLogout = false;
      return res.data;
    }
  }, error => {
    current.alertMine(error);
    return false;
  });
  return instance(config);
}

