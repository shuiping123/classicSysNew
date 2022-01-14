import context from '@/main'
import {JSEncrypt} from 'jsencrypt'

export default {
  /**退出登录 【弃用】
   * @param path 退出登录之前的地址,如果没有,自动获取当前地址
   * */
  // toLogOut(path) {
  //   context.$store.commit('stateMine/changeUsrRole',0);
  //   context.$store.commit('changeLogState', 'logout')
  //   if (path) {
  //     context.$router.push(`/login?redirect=${path}`)
  //   } else {
  //     context.$router.push(`/login?redirect=${context.$route.fullPath}`)
  //   }
  // },

  async toLogOut() {
    await context.$store.dispatch('user/logout')
    context.$router.push(`/login?redirect=${context.$route.fullPath}`)
  },
  /**
   * 密码加密 直接返回密码值
   * @param msg 需要加密的内容
   * */
  setEncrypt(msg) {
    const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCC0hrRIjb3noDWNtbDpANbjt5Iwu2NFeDwU16Ec87ToqeoIm2KI+cOs81JP9aTDk/jkAlU97mN8wZkEMDr5utAZtMVht7GLX33Wx9XjqxUsDfsGkqNL8dXJklWDu9Zh80Ui2Ug+340d5dZtKtd+nv09QZqGjdnSp9PTfFDBY133QIDAQAB'

    var encrypt = new JSEncrypt()
    encrypt.setPublicKey(publicKey)
    return encrypt.encrypt(msg)
  },
  /**
   * confirm函数 - 为了保证通用，方便中英文切换
   * @param title 弹框标题
   * @param contentMsg 弹框内容
   * @param callback 点击确定后的回调函数 非必填
   * */
  confirmMine(title, contentMsg, callback) {
    let ok = context.$store.state.language === "zh" ? "确定" : "ok";
    let cancel = context.$store.state.language === "zh" ? "取消" : "cancel";
    context.$messager.confirm({
      title: title,
      msg: contentMsg,
      ok: "确定",
      cancel: '取消',
      result: r => {
        if (r) {
          if (callback) {
            callback();
          }
        }
      }
    });
  },
  /**
   * alert函数 - 为了保证通用，方便中英文切换
   * @param content 错误信息
   * @param callback 回调函数 非必填
   * */
  alertMine(content, callback) {
    // let title = context.$store.state.language === "zh" ? "提示信息" : "Tips Message";
    // let ok = context.$store.state.language === "zh" ? "确定" : "ok";
    context.$alert(content, context.$t("tips.alert.title"), {
      confirmButtonText: context.$t("tips.alert.determineBtn"),
      callback: action => {
        if (callback) {
          callback();
        }
      }
    });
  },
  /**
   * message函数 - 消息提示 - 为了保证通用，方便中英文切换
   * @param content 消息提示内容
   * @param type 消息提示样式 分为 ：success  warning error info
   * */
  messageMine(content, type) {
    context.$message({
      message: content,
      type: type,
      showClose: true,
    });
  },
  /**
   * 根据props查找树形结构的数据
   * @param prop 根据的属性，决定根据什么属性查找，例id
   * @param value 根据的属性的值，查找属性值为value的值，例1
   * @param tree 被查找的树形结构的数据,数组格式
   * [
   *    {text:'11',children:[{text:'1-1',children:[]}},
   *    {text:'22',children:[{text:'2-1',children:[]}},
   * ]
   * @param type equal精确查找 include包含查找 all全部节点,遍历每一个节点出来 不传值默认equal
   * @param childNode 下级子节点默认是children，如果是其他值，传此参数
   * @return 返回值为数组格式，返回符合要求的所有对象的数组回去
   * */
  searchNodeForTree(prop, value, tree, type, childNode) {
    let nodeArr = [];
    type = type ? type : 'equal';
    childNode = childNode ? childNode : 'children';

    function searchForThis(propSearch, valueSearch, treeSearch) {
      let node = treeSearch.filter(item => {
        if (type === 'equal') {
          return item[propSearch] == valueSearch;
        } else if (type === 'include') {
          if (item[propSearch].indexOf(valueSearch) !== -1) {
            nodeArr.push(item);
          }
          return false;
        } else {
          nodeArr.push(item);
          return false;
        }
      });
      if (node.length === 0) {
        treeSearch.map(item => {
          searchForThis(propSearch, valueSearch, item[childNode]);
        })
      } else {
        node.map(item => {
          nodeArr.push(item);
        });
      }
    }

    searchForThis(prop, value, tree);
    return nodeArr;
  },
  /**
   * 深度合并对象  Object.assign(obj1,obj2)的升级版
   * @param obj1 需要合并其他的obj对象
   * @param obj2 需要被合并的obj对象
   * */
  deepMerge(obj1, obj2) {
    let key;
    for (key in obj2) {
      // 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
      // 如果obj2[key]没有值或者值不是对象，此时直接替换obj1[key]
      obj1[key] =
        obj1[key] &&
        obj1[key].toString() === "[object Object]" &&
        (obj2[key] && obj2[key].toString() === "[object Object]")
          ? deepMerge(obj1[key], obj2[key])
          : (obj1[key] = obj2[key]);
    }
    return obj1;
  }

}
