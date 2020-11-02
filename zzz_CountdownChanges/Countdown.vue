<template>
    <toolbar-group>
        <v-btn-toggle
            mandatory
            rounded
            v-model="direction"
            style="width:100%"
            class="justify-center"
        >
            <v-btn x-small value="up">Time Since</v-btn>
            <v-btn x-small value="down">Count Down</v-btn>
        </v-btn-toggle>

        <div style="width:100%" class="d-flex justify-center">
            <v-menu z-index="999" :close-on-content-click="false">
                <template #activator="{on}">
                    <v-btn v-on="on" text class="mt-4 px-2">
                        {{ date }}
                    </v-btn>
                </template>
                <v-date-picker v-model="date" />
            </v-menu>

            <v-menu z-index="999" :close-on-content-click="false">
                <template #activator="{on}">
                    <v-btn v-on="on" text class="mt-4 px-2">
                        {{ timeDisplay }}
                    </v-btn>
                </template>
                <v-time-picker v-model="time" ampm-in-title use-seconds />
            </v-menu>
        </div>

        <div class="d-flex justify-center">
            <v-checkbox
                v-model="daysOnly"
                label="Days Only"
                :ripple="false"
                class="mr-6 mt-2 countdown-checkbox"
            />

            <v-checkbox
                v-model="showSeconds"
                label="Show Seconds"
                :disabled="secondsDisabled"
                :ripple="false"
                class="mt-2 countdown-checkbox"
            />
        </div>
    </toolbar-group>
</template>

<script>
import { format, parseISO, addYears } from 'date-fns';
import ToolbarGroup from './ToolbarGroup';

export default {
    props: {
        canvas: { required: true }
    },

    components: {
        ToolbarGroup
    },

    created() {
        const { object } = this.canvas.getSelected();

        let { date, daysOnly, direction, seconds } = object.format;

        if (typeof date === 'string') date = parseISO(date);

        this.direction = direction;
        this.daysOnly = daysOnly === 'yes';
        this.showSeconds = seconds;
        this.date = format(date, 'yyyy-MM-dd');
        this.time = format(date, 'HH:mm:ss');
        this.timeDisplay = format(date, 'HH:mm:ss a');
    },

    data() {
        return {
            direction: 'down',
            daysOnly: false,
            showSeconds: true,
            secondsDisabled: false,
            date: '2020-11-12',
            time: '12:00:00',
            timeDisplay: '12:00:00 AM'
        }
    },

    watch: {
        direction(newValue) {
            this.update({ direction: newValue });
        },

        daysOnly(newValue) {
            const update = { daysOnly: newValue };
            this.update({ daysOnly: newValue });

            if (!newValue)
                update.seconds = this.showSeconds;
            
            this.update(update);
            this.secondsDisabled = newValue;
        },

        showSeconds(newValue) {
            this.update({ seconds: newValue });
        },

        date(newValue) {
            const date = parseISO(`${newValue} ${this.time}`);
            this.update({ date });
        },

        time(newValue) {
            const date = parseISO(`${this.date} ${newValue}`);
            this.update({ date });
            this.timeDisplay = format(date, 'HH:mm:ss a');
        }
    },

    methods: {
        update(update) {
            const { object } = this.canvas.getSelected();
            object.updateFormat(update);
        }
    }
}
</script>

<style lang="scss">
.countdown-checkbox {
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