import { login, logout, getInfo,checklog,getpower } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import context from "@/main";

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ UsrName: username, UsrPwd: password }).then(response => {
        if (response.reCode==0){
          commit('SET_TOKEN', 'admin-token')
          commit('stateMine/changeLogState', 'login',{ root: true });
          setToken('admin-token')
        }
        resolve(response)
        // const { data } = response
        // commit('SET_TOKEN', data.token)
        // setToken(data.token)
        // resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        // resetRouter()
        commit('stateMine/changeUsrRole', {nav:[]},{ root: true });
        commit('stateMine/changeLogState', 'logout',{ root: true })

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 查看超时
  checklog({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      checklog().then((res) => {
       if (res.reCode==2||res.reCode==1){
         commit('SET_TOKEN', '')
         commit('SET_ROLES', [])
         removeToken()
         // resetRouter()
         // commit('stateMine/changeUsrRole', {nav:[]},{ root: true });
         commit('stateMine/changeLogState', 'logout',{ root: true })

         // reset visited views and cached views
         // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
         dispatch('tagsView/delAllViews', null, { root: true })
        }else{
         commit('stateMine/changeLogState', 'login',{ root: true })
       }
        resolve();
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 查看权限
  getpower({ commit, state, dispatch }){
    return new Promise((resolve, reject) => {
      getpower().then((res) => {
        if (res.reCode==0){
          commit('stateMine/changeLogState', 'login',{ root: true });
          commit("stateMine/changeUsrRole",res.reData,{ root: true });
        }else{
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          // resetRouter();
          commit('stateMine/changeUsrRole', {nav:[]},{ root: true });
          commit('stateMine/changeLogState', 'logout',{ root: true });

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })
        }
        resolve();
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    // const { roles } = await dispatch('getInfo')
    //
    // resetRouter()
    //
    // // generate accessible routes map based on roles
    // const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // // dynamically add accessible routes
    // router.addRoutes(accessRoutes)
    //
    // // reset visited views and cached views
    // dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}