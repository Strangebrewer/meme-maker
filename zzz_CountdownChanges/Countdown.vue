<template>
    <toolbar-group>
        <div>
            <v-btn small @click="update({ seconds: true })">seconds +</v-btn>
            <v-btn small @click="update({ seconds: false })">seconds -</v-btn>
        </div>

        <div>
            <v-btn small @click="update({ daysOnly: true })">daysOnly +</v-btn>
            <v-btn small @click="update({ daysOnly: false })">daysOnly -</v-btn>
        </div>

        <div>
            <v-btn small @click="update({ date: '25 Dec 2244 13:30:00 GMT' })">date 25 Dec 2244 13:30:00 GMT</v-btn>
            <v-btn small @click="update({ date: '17 Jul 2018 13:30:00 GMT' })">date 17 Jul 2018 13:30:00 GMT</v-btn>
        </div>

        <div>
            <v-btn small @click="update({ direction: 'up' })">time since</v-btn>
            <v-btn small @click="update({ direction: 'down' })">count down</v-btn>
        </div>
    </toolbar-group>
</template>

<script>
import ToolbarGroup from './ToolbarGroup';

export default {
    props: {
        canvas: { required: true }
    },

    components: {
        ToolbarGroup
    },

    methods: {
        update(update) {
            const { object } = this.canvas.getSelected();
            object.updateFormat(update);
        }
    }
}
</script>

<style>
</style>