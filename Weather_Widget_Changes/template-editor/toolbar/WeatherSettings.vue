<template>
    <toolbar-group>
        <v-btn-toggle
            mandatory
            rounded
            v-model="metric"
            @change="toggleMetric"
            style="width:100%"
            class="mb-4 justify-center"
        >
            <v-btn x-small width="120" :value="false">Fahrenheit</v-btn>
            <v-btn x-small width="120" :value="true">Celcius</v-btn>
        </v-btn-toggle>

        <div class="px-8 d-flex justify-space-around">
            <v-text-field
                v-model="zipcode"
                label="Zip Code"
                @change="updateZipcode"
                style="max-width: 60px"
            />

            <v-checkbox
                v-model="showLocation"
                label="Show Location"
                @change="toggleLocation"
                style="max-width: 120px"
                class="location-checkbox"            
                :ripple="false"
            />
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

    data() {
        return {
            metric: false,
            zipcode: '',
            showLocation: false
        }
    },

    created() {
        const { object } = this.canvas.getSelected();
        this.metric = object.config.metric;
        this.zipcode = object.config.zipcode;
        this.showLocation = object.config.showLocation;
    },

    methods: {
        updateZipcode() {
            const { object } = this.canvas.getSelected();
            object.updateZipcode(this.zipcode);
        },

        toggleMetric() {
            const { object } = this.canvas.getSelected();
            object.toggleMetric(this.metric);
        },

        toggleLocation() {
            const { object } = this.canvas.getSelected();
            object.toggleLocation(this.showLocation);
        }
    },
}
</script>

<style lang="scss">
.location-checkbox {
    .v-input--selection-controls__input {
        width: 18px !important;
        height: 18px !important;
        margin-right: 4px !important;

        i {
            font-size: 18px !important;
        }
    }
    label {
        font-size: 12px !important;
    }
}
</style>