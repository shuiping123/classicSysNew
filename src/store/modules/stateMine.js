import {resetRouter} from '@/router'
import Vue from 'vue'

const state = {
  /**
   * 当前是否是登录状态
   * @value login/logout
   * */
  logState: 'login',
  /**
   * 当前登录的用户权限
   * nav 当前可访问的目录导航
   * usrInfo 当前用户的信息
   * optionRole 操作权限
   * */
  UsrRole: {
    nav: [],
    usrInfo: {},
    optionRole: {}
  },
  // /**
  //  * 判定loading是否显示
  //  * 通用loading
  //  * 注：App.vue，如需修改，在App.vue中修改
  //  * @show true显示/false不显示
  //  * @title loading的标题
  //  * @msg loading的内容
  //  * */
  // loadingModal:{
  //   show:false,
  //   title:'加载中',
  //   msg:'加载中'
  // },
}

const mutations = {
  // 修改登录状态
  changeLogState(state, data) {
    state.logState = data;
  },
  // 修改用户权限
  changeUsrRole(state, data) {
    let {nav,ADId,UsrId,DepName,UsrName,UsrRoleId,UsrRealName,RoleName,UsrState,Auth} = data;
    nav = nav.length > 0 ? nav : [];
    Vue.set(state.UsrRole, 'nav', nav);
    resetRouter(nav);
    Vue.set(state.UsrRole, 'usrInfo', {
      ADId,UsrId,DepName,UsrName,UsrRoleId,UsrRealName,RoleName,UsrState
    });

    Vue.set(state.UsrRole, 'optionRole', Auth);
  },
  // 修改用户权限 不更新路由
  changeUsrInfo(state, data) {
    let {nav,ADId,UsrId,DepName,UsrName,UsrRoleId,UsrRealName,RoleName,UsrState,Auth} = data;
    Vue.set(state.UsrRole, 'usrInfo', {
      ADId,UsrId,DepName,UsrName,UsrRoleId,UsrRealName,RoleName,UsrState
    });

    Vue.set(state.UsrRole, 'optionRole', Auth);
  },
  // // 是否显示loading弹框
  // showLoading(state,data){
  //   Vue.set(state.loadingModal,'show',data.show?data.show:false);
  //   Vue.set(state.loadingModal,'title',data.title?data.title:'加载中');
  //   Vue.set(state.loadingModal,'msg',data.msg?data.msg:"加载中");
  // },
};

export default {
  namespaced: true,
  state,
  mutations,
}


