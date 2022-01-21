<template>
    <div>
        <slot name="header"/>
        <Table v-bind="$attrs">
            <TableColumn
                v-for="item in titles"
                :key="item.prop"
                v-bind="item"/>
            <slot name="lastColumn"/>
        </Table>
        <Pagination v-bind="$attrs" v-on="$listeners"/>
    </div>
</template>
<script>
import {Table, TableColumn, Pagination} from 'element-ui'
export default {
    name: "my-table",
    components: {Table, TableColumn, Pagination},
    props:{
        titles: Array
    }
}
</script>
