<template>
  <div id="app">
    <MyTable
      :current-page.sync="current"
      :page-size="size"
      layout="total, prev, pager, next"
      :total="total"
      background
      @current-change="currentChange"

      :data="tableData"
      :titles="tableTitles"
    >
      <div slot="header">我是header</div>
      <TableColumn
        slot="lastColumn"
        label="操作"
      >
        <template slot-scope="scope">
          <button type="button">{{scope.row.name}}</button>
          <button type="button">操作2</button>
        </template>
      </TableColumn>
    </MyTable>
  </div>
</template>
<script>
  import MyTable from './my-table'
  import {TableColumn} from 'element-ui'
  export default {
    components: {MyTable, TableColumn},
    data(){
      return {
        total: 100,
        size: 10,
        current:1,

        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],

        tableTitles: [{
          prop: 'date',
          label: '日期'
        }, {
          prop: 'name',
          label: '姓名'
        }, {
          prop: 'address',
          label: '地址'
        }]
      }
    },
    methods: {
      currentChange(current){
        alert('翻页了' + current)
      }
    }
  }
</script>
<style>
</style>

