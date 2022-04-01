<template>
  <el-popover
    placement="bottom"
    width="200"
    trigger="click">
    <div class="btn-group-mine">
      <ul slot="content" class="dropdown-menu">
        <slot name="content"></slot>
      </ul>
    </div>
    <slot name="reference" slot="reference"></slot>
  </el-popover>
</template>

<script>
  // 使用方法，引入后使用
  // <btn-group-mine>
  //    <!--下拉菜单-->
  //    <ul slot="content" class="dropdown-menu">
  //      <li>人员调转</li>
  //      <li role="separator" class="divider"></li>
  //      <li>已删人员管理</li>
  //    </ul>
  //    <!--按钮-->
  //    <el-button type="primary" slot="reference" size="mini" class="tableInputBtn" plain>更多
  //        <icon class="el-icon-caret-bottom el-icon--right"></icon>
  //   </el-button>
  // </btn-group-mine>

  export default {
    name: "index",
    data() {
      return {}
    },
    mounted() {
    },
    methods: {},
  }
</script>

<style lang="less">
  .btn-group-mine {
    max-height: 200px;

    .dropdown-menu {
      min-width: 160px;
      padding: 3px 0;
      margin: 2px 0 0;
      font-size: 14px;
      text-align: left;
      list-style: none;

      .divider {
        height: 1px;
        margin: 9px 0;
        overflow: hidden;
        background-color: #e5e5e5;
      }
    }

    ul {
      display: block;
      list-style-type: disc;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      padding-inline-start: 40px;
    }

  }
</style>
