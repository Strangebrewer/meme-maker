<template>
    <div class="fabric-canvas" ref="editor" @contextmenu.prevent="onContextMenu">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
    import { fabric } from 'fabric';
    import { mapState } from 'vuex';

    import { CommonEvents } from './mixins/events';
    import {
        CommonActions,
        GroupAlignmentActions,
        GroupingActions,
        PersistenceActions,
        PositioningActions,
        PreviewingActions,
        ZoomingActions,
        TimeConfiguration,
        StyleActions
    } from './mixins/actions';

    import {
        CommonHandler,
        ImageHandler,
        PathHandler,
        ShapeHandler,
        TextHandler,
        VideoHandler,
        IntegrationHandler,
    } from './mixins/handlers';

    import './objects/tru-circle';
    import './objects/tru-countdown';
    import './objects/tru-date';
    import './objects/tru-group';
    import './objects/tru-image';
    import './objects/tru-path';
    import './objects/tru-rect';
    import './objects/tru-stock';
    import './objects/tru-text';
    import './objects/tru-time';
    import './objects/tru-triangle';
    import './objects/tru-video';
    import './objects/widgets/tru-weather';

    const instance = {
        canvas  : null,
        selected: null,
        scale: 1
    };

    export default {
        name  : 'fabric-canvas',
        mixins: [
            CommonEvents,
            CommonHandler,
            CommonActions,

            ImageHandler,
            PathHandler,
            ShapeHandler,
            TextHandler,
            VideoHandler,
            IntegrationHandler,

            GroupAlignmentActions,
            TimeConfiguration,
            GroupingActions,
            PersistenceActions,
            PositioningActions,
            PreviewingActions,
            ZoomingActions,
            StyleActions,
        ],
        data() {
            return {
                orientation : null,
                addingType  : null,
                dirty       : false,
                versions    : [],
                versionIndex: 0,
                skipChange  : false,
                clipboard   : null
            };
        },

        computed: {
            ...mapState({
                user: state => state.auth.user,
            }),
            hasUndo() {
                return this.versionIndex > 0;
            },
            hasRedo() {
                return this.versionIndex < (this.versions.length - 1);
            },
        },

        mounted() {
            // Initializes the Fabric Canvas
            const canvas = new fabric.Canvas(this.$refs.canvas, {
                backgroundColor       : '#fff', 
                preserveObjectStacking: true,
            });

            fabric.Object.NUM_FRACTION_DIGITS = 10; // allows more precise calculations

            const { maxWidth, maxHeight } = this.getMaxDimensions(); // mixins/actions/common.js

            canvas.setWidth(maxWidth);
            canvas.setHeight(maxHeight);

            instance.canvas = canvas;
            this.setScale(1080);

            // Object.defineProperty(instance.canvas, '__ob__', { configurable: false, writable: false });

            const version = JSON.stringify(this.canvas); // Create the inital version of changes
            this.versions.push(version);                 // Push it to the version array

            this.registerEvents(); // mixins/events/common.js
        },

        methods: {
            getInstance() {
                return instance;
            },

            getFabric() {
                return instance.canvas;
            },

            getObjects() {
                return instance.canvas ? instance.canvas.getObjects() : [];
            },

            getSelected() {
                return instance.selected;
            },

            setSelected(selected) {
                instance.selected = selected;
            },

            getScale() {
                return instance.scale;
            },

            setScale(screenHeight) {
                const scale = this.calcScaleFromDimensions(screenHeight);
                instance.scale = scale;
                instance.canvas.setZoom(scale);
            },

            hasTag(value) {
                if (!this.getSelected()) return false;

                const { object } = this.getSelected();

                return object && object.hasTag && object.hasTag(value);
            },
        },
    };
</script>
