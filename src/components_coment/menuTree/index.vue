<template>
  <div style="width: 100%;height: 30px;">
    <Panel>
      <MenuButton v-for="(nav,navKey) in data" :key="'tree'+navKey" :text="nav.text" :iconCls="nav.iconCls" :disabled="nav.isDisabled" :plain="true">
        <!--下拉菜单-->
        <Menu @itemClick="itemClick" v-if="nav.children&&nav.children.length!==0">
          <!--一级按钮-->
          <template v-for="(item1,itemKey1) in nav.children" >
            <MenuItem :text="item1.text" :iconCls="item1.iconCls" :disabled="item1.isDisabled">
              <!--二级按钮-->
              <SubMenu v-if="item1.children&&item1.children.length!==0">
                <template v-for="(item2,itemKey2) in item1.children" >
                  <MenuItem :iconCls="item2.iconCls" :text="item2.text"
                            :disabled="item2.isDisabled">
                    <!--三级按钮-->
                    <SubMenu v-if="item2.children&&item2.children.length!==0">
                      <template v-for="(item3,itemKey3) in item2.children" >
                        <MenuItem :iconCls="item3.iconCls" :text="item3.text"
                                  :disabled="item3.isDisabled">
                          <!--四级按钮-->
                          <SubMenu v-if="item3.children&&item3.children.length!==0">
                            <template v-for="(item4,itemKey4) in item3.children" >
                              <MenuItem :iconCls="item4.iconCls" :text="item4.text"
                                        :disabled="item4.isDisabled">
                                <!--如有下级，继续在此添加-->
                              </MenuItem>
                              <MenuSep v-if="item4.sep"></MenuSep>
                            </template>
                          </SubMenu>
                        </MenuItem>
                        <MenuSep v-if="item3.sep"></MenuSep>
                      </template>
                    </SubMenu>
                  </MenuItem>
                  <MenuSep v-if="item2.sep"></MenuSep>
                </template>
              </SubMenu>
            </MenuItem>
            <MenuSep v-if="item1.sep"></MenuSep>
          </template>
        </Menu>
      </MenuButton>
    </Panel>
  </div>
</template>

<script>

  export default {
    name: "menuTree",
    props: {
      data: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      itemClick(value){
        this.$emit('itemClick',value);
      },
    },
  }
</script>

<style scoped>

</style>
