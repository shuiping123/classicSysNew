import {request} from '@/network'
// import request from '@/utils/request'
import collections from '@/assets/js/collections'

export function login(data) {
  return request({
    url: collections.login.index,
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  // return request({
  //   url: '/vue-element-admin/user/info',
  //   method: 'get',
  //   params: { token }
  // })
  return new Promise(resolve => {
    var obj = {
      "code": 20000, "data": {
        "roles": ["admin"],
        "introduction": "I am a super administrator",
        "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        "name": "Super Admin"
      }
    };

    resolve(obj)
  })
}

export function checklog() {
  return request({
    url: collections.checkLog,
  })
}

let num=0;
export function getpower() {
  num++;
  // return request({
  //   url: collections.getPower,
  //   params:{
  //     ty:'GetMenuLstAll'
  //   }
  // })
  return new Promise(resolve => {
    // 注意cpath里的路径一定要写全，不用加.vue后缀，但是有index一定要写上
    var obj = num===1?{
      reCode: 0,
      reData: {
        nav:[
          {
            path: '/permission',
            cPath: 'Layout',
            name: 'Permission',
            title:'测试',
            title_en:'Permission',
            icon:'lock',
            children: [
              {
                path: 'page',
                cPath:'@/views/test/index',
                name: 'PagePermission',
                title:'测试1',
                title_en:'Page Permission 11',
                icon:'',
              },
              {
                path: 'directive',
                cPath:'@/views/table/complex-table',
                name: 'DirectivePermission',
                title:'测试2',
                title_en:'Directive Permission',
                icon:'',
              },
              {
                path: 'role',
                cPath:'@/views/table/drag-table',
                name: 'RolePermission',
                title:'测试3',
                title_en:'Role Permission',
                icon:'',
              },
            ]
          },
          {
            path: '/permission2',
            cPath: 'Layout',
            name: '',
            title:'测试2',
            title_en:'Permission',
            icon:'',
            children: [
              {
                path: 'index',
                cPath:'@/views/test/index2',
                name: 'PagePermission2',
                title:'测试233',
                title_en:'Page Permission 11',
                icon:'lock',
                affix: false
              },
            ]
          },
        ]
      },

    }:{
      reCode: 0,
      reData: {
        nav:[
          {
            path: '/permission',
            cPath: 'Layout',
            name: 'Permission',
            title:'权限',
            title_en:'Permission',
            icon:'lock',
            children: [
              {
                path: 'page',
                cPath:'@/views/permission/page',
                name: 'PagePermission',
                title:'巴拉巴拉',
                title_en:'Page Permission 11',
                icon:''
              },
              {
                path: 'directive',
                cPath:'@/views/permission/directive',
                name: 'DirectivePermission',
                title:'测试测试',
                title_en:'Directive Permission',
                icon:''
              },
            ]
          },
        ]
      }
    };

    resolve(obj)
  })
}

export function logout() {
  return request({
    url: collections.logOut.index + '?ty=signOut&time=' + new Date(),
    method: 'get'
  })
}
