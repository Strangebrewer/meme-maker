<template>
    <v-card :value="value" @input="$emit('input', $event)">
        <v-card tile 
            v-if="loaded" 
            class="template-editor"
        >
            <!-- Left sidebar -->
            <div class="small-toolbar" v-if="advanced">
                <left-sidebar class="sidebar-section" :canvas="getFabric()"></left-sidebar>
            </div>
            <!-- / Left sidebar -->

            <!-- actions toolbar -->
            <div style="padding-top: 20px" v-if="advanced">
                <div class="small-toolbar v-toolbar__extension pl-12">
                    <div>
                        <insert-toolbar v-if="canvasLoaded" :canvas="getFabric()"/>
                        <arrangement-toolbar v-if="canvasLoaded" :selected="selected" :canvas="getFabric()"/>
                        <undo-redo-toolbar v-if="canvasLoaded" :canvas="getFabric()"/>
                        <delete-toolbar v-if="canvasLoaded" :canvas="getFabric()"/>
                    </div>
                    <v-spacer></v-spacer>
                    <div style="width: 200px">
                        <v-select
                            label="Select Screen Resolution"
                            :items="screenSizes"
                            v-model="screenSelected"
                            @change="setScreenSize"
                            class="mt-6"
                        ></v-select>
                    </div>
                    <v-spacer></v-spacer>
                </div>
            </div>
            <!--- / actions toolbar -->


            <!-- Main Canvas -->
            <v-card-text class="lighten-4">
                <v-container>
                    <v-container ref="container" fluid="fluid" fill-height="fill-height" style="padding: 20px;">
                        <v-layout v-if="loaded" justify-center="justify-center" >
                            <fabric-canvas 
                                class="bordered"
                                ref="fabric" 
                                @saved="save"
                                @onObjectContextMenu="onObjectContextMenu"
                                @selectionCreated="selectionCreated"
                                @selectionCleared="selectionCleared"
                            />
                        </v-layout>
                    </v-container>
                </v-container>
            </v-card-text>
            <!-- / Main Canvas -->


            <!-- Configuration Sidebar -->
            <v-navigation-drawer v-if="loaded" 
                v-model="opened" 
                right 
                absolute 
                class="overflow-y-auto"
                :width="329"
            >   

                <div class="text-center">
                    <v-btn-toggle
                        mandatory
                        rounded
                        value="advanced"
                        v-model="advanced"
                        class="my-4"
                        >
                        <v-btn x-small>Basic</v-btn>
                        <v-btn x-small>Advanced</v-btn>
                    </v-btn-toggle>
                </div>
                <div class="ml-0 py-2 text-center">
                    <v-btn color="#38bef1" text @click="getFabric().save()" :loading="busy"
                           :disabled="!getFabric().dirty" class="save-button">
                        <img src="~/assets/img/save.svg"/>SAVE
                    </v-btn>
                    <v-btn text color="#e86d3f" :to="`/content/my-content?folder=${currentFolderId}`" class="cancel-button">
                        <v-icon size=18>close</v-icon>
                        CANCEL
                    </v-btn>
                </div>
                <!--
                <v-list dense nav>
                    <v-list-item  class="ma-2 pa-0">
                        <v-list-item-icon>
                            <v-btn text small style="left: 60px;" class="px-2">
                                <img class="pb-1" src="~/assets/img/publish.svg"/>
                                <span style="color:#9ea0a3;" class="pa-1 pt-2">publish</span>
                            </v-btn>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list>
                -->

                <!-- Permissions Window -->
                <div>
                    <h5 class="panel-heading pl-8 py-3">
                        <span>Permissions</span>
                    </h5>
                    <div class="text-center">
                        <!-- <v-subheader>Level:
                            <v-select :items="items" class="layer-selection"/>
                        </v-subheader> -->
                        <v-checkbox 
                            v-model="locked"
                            label="Lock Basic User Editing" 
                            class="checkbox"
                            :style="{paddingLeft: '80px'}"
                            @change="lockItem"
                        />
                    </div>
                </div>
                <!-- /Permissions Window -->

                <!-- Image Options -->
                <div v-if="advanced && (hasTag('position') || hasTag('image'))">
                    <h5 class="panel-heading pl-8 py-3">
                        <span>Image Options</span>
                    </h5>

                    <div v-if="hasTag('stretch')" class="ml-0 py-2">
                        <v-btn text small style="left: 60px;" class="px-2">
                           <img color="#9ea0a3" class="pb-1" src="~/assets/img/send-forwards.svg"/>
                           <span style="color:#8d8f93;font-size: 10px;text-transform: initial;" class="pa-1 pt-2">Replace Image</span>
                        </v-btn>
                        <br>
                        <v-btn text small style="left: 70px;">
                            <v-icon size="16" color="#9ea0a3">crop</v-icon>
                            <span style="color:#8d8f93;font-size: 10px;text-transform: initial;" class="pa-1 pt-2">Crop Image</span>
                        </v-btn>
                    </div>
                </div>
                <!-- /Image Options -->

                <div v-if="hasTag('tru-time')">
                    <h5 class="panel-heading pl-8 py-3">
                        <span>Time Settings</span>
                    </h5>
                    <time-settings :canvas="getFabric()"/>
                </div>

                <div v-if="hasTag('tru-date')">
                    <h5 class="panel-heading pl-8 py-3">
                        <span>Date Settings</span>
                    </h5>
                    <date-settings :canvas="getFabric()"/>
                </div>

                <div v-if="hasTag('tru-countdown')">
                    <h5 class="panel-heading pl-8 py-3">
                        <span>Countdown Settings</span>
                    </h5>
                    <countdown-toolbar :canvas="getFabric()"/>
                </div>

                <div v-if="hasTag('tru-stock')">
                    <h5 class="panel-heading pl-8 py-3">
                        <span>Stock Settings</span>
                    </h5>
                    <stock-settings :canvas="getFabric()"/>
                </div>

                <div v-if="hasTag('tru-weather')">
                    <h5 class="panel-heading pl-8 py-3">
                        <span>Weather Settings</span>
                    </h5>
                    <weather-settings :canvas="getFabric()"/>
                </div>
 
                <!-- Transform Window -->
                <div v-if="advanced && (hasTag('position') || hasTag('stretch')) || (selected && selected.type === 'activeSelection')">
                    <h5 class="panel-heading pl-8 py-3">
                        <span>Transform</span>
                    </h5>
                    <alignment-toolbar v-if="hasTag('position') || (selected && selected.type === 'activeSelection')" :selected="selected" :canvas="getFabric()"/>
                    <stretch-toolbar v-if="hasTag('stretch')" :canvas="getFabric()"/>
                </div>
                <!-- /Transform Window -->

                <!-- Color and Fill Window -->
                <div v-if="hasTag('fill') || hasTag('shadow') || hasTag('font')">
                    <h5 class="panel-heading pl-8 py-3">
                        <span>Color</span>
                    </h5>
                    <background v-if="hasTag('fill')" :selected="selected"  :canvas="getFabric()"/>
                    <shadow-toolbar v-if="hasTag('shadow') || hasTag('font')" :canvas="getFabric()"/>
                    
                    <fill-toolbar v-if="hasTag('fill') && hasTag('position')" :canvas="getFabric()"/>
                    <free-drawing-toolbar v-if="pointerMode === 2" :canvas="getFabric()"/>
                    <path-toolbar v-if="hasTag('path')" :canvas="getFabric()"/>
                </div>
                <!-- /Color and Fill Window -->

                <!-- Font Window -->
                <div v-if="hasTag('font')">
                    <h5 class="panel-heading pl-8 py-3">
                        <span>Text</span>
                    </h5>
                    <font-toolbar :canvas="getFabric()"/>
                    <fill-toolbar :canvas="getFabric()"/>
                </div>
                <!-- /Font Window -->

            </v-navigation-drawer>

            <!-- / Removing properties bar which is not c urrently in the mockup -->
            <!-- <properties-toolbar v-if="canvasLoaded" :canvas="getFabric()"/> -->
        </v-card>

        <progress-dialog/>
        <file-manager-dialog v-if="canvasLoaded" :canvas="getFabric()"/>
    </v-card>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import { Sketch } from 'vue-color';
    import FontFaceObserver from 'fontfaceobserver';
    import { FabricCanvas } from '~/components/vue-fabric';
    import LeftSidebar from './LeftSidebar';
    
    import {
        ToolbarGroup,
        InsertToolbar,
        ModeToolbar,
        FillToolbar,
        FontToolbar,
        ShapesToolbar,
        UndoRedoToolbar,
        ZoomToolbar,
        ArrangementToolbar,
        AlignmentToolbar,
        StretchToolbar,
        FreeDrawingToolbar,
        PropertiesToolbar,
        PathToolbar,
        DeleteToolbar,
        ShadowToolbar,
        TimeSettings,
        Background,
        Sidebar,
        DateSettings,
        CountdownToolbar,
        StockSettings,
        WeatherSettings,
    } from './toolbar';
    import { FileManagerDialog, ProgressDialog } from './dialogs';

    export default {
        props: {
            value: { required: false, type: Boolean, default: () => false },
        },

        components: {
            DateSettings,
            LeftSidebar,
            ToolbarGroup,
            FabricCanvas,
            Sketch,
            InsertToolbar,
            FillToolbar,
            FontToolbar,
            ShapesToolbar,
            UndoRedoToolbar,
            ModeToolbar,
            ZoomToolbar,
            ArrangementToolbar,
            AlignmentToolbar,
            TimeSettings,
            StretchToolbar,
            FileManagerDialog,
            ProgressDialog,
            FreeDrawingToolbar,
            PathToolbar,
            PropertiesToolbar,
            DeleteToolbar,
            Sidebar,
            ShadowToolbar,
            Background,
            CountdownToolbar,
            StockSettings,
            WeatherSettings,
        },

        data: () => ({
            items: ['Layer01','Layer02','Layer03','Layer04'],
            screenSizes: [
                '3840 x 2160',
                '1920 x 1080',
                '1600 x 900',
                '1368 x 768'
            ],
            screenSelected: '1920 x 1080',
            busy: false,
            loaded: false,
            canvasLoaded: false,
            canvasSelected:false,
            positioning: true,
            advanced: 1,
            selected: null,
            uploadProgressDialog: false,
            pointerMode: 1,
            deleteCanvas: false,
            templateName: null,
            opened: true,
            preview: false,
            layer:'Layer01',
            lockedStatus: false,
        }),

        watch: {
            value(val) {
                if (val) return;
                this.loaded = false;
                this.canvasLoaded = false;
            },

            template(val) {
                if (!val) return;
                this.loaded = true;
                this.$nextTick(() => {
                    this.loadFonts();
                });
            },

            templateName(val, old) {
                if (!old) return;
                this.getFabric().dirty = true;
                this.templateSet({ name: val });
            },
        },

        computed: {
            ...mapState({
                currentFolderId: state => state.contentPage.current_folder_id,
                template: state => state.content.item,
            }),

            locked: {
                get() {
                    if (this.selected) {
                        this.lockedStatus = this.selected.object.locked
                        return this.selected.object.locked
                    } else {
                        return false
                    }
                },
                set(newValue) {
                    this.lockedStatus = newValue;
                }
            }
        },

        created() {
            this.addListeners();
        },

        beforeDestroy() {
            this.removeListeners();
        },

        mounted() {
            window.editor = this;
            if (!this.template) {
                return;
            }

            this.loaded = true;
            this.$nextTick(() => {
                this.loadCanvas();
            });
        },

        methods: {
            onObjectContextMenu() {
                // this will only trigger if you right-click an object
                // so this could be used to display a context menu that
                // has the tools in it that get used frequently
            },

            ...mapActions({
                templateReset: 'content/reset',
                templateSave: 'content/update',
                upload_preview: 'content/upload_preview',
                templateSet: 'content/set',
                renderPreview: 'content/preview',
            }),

            hasTag(value) {
                if (!this.selected || !this.canvasLoaded) return false;

                const { object } = this.selected;
                if (!object) return false;

                if (object.hasTag) {
                    return object.hasTag(value);
                }

                return value === object.type;
            },

            getFabric() {
                return this.$refs.fabric || {};
            },

            selectionCreated(selection) {
                const selected = selection.type
                    ? { type: selection.type, object: selection }
                    : { type: 'group', object: selection };

                // this.selected = Object.freeze(selected);
                this.selected = selected;
                this.getFabric().setSelected(selected);
                if(this.selected){
                    this.deleteCanvas=true;
                }
                else{
                    console.log("Canvas not selected");
                }
            },

            selectionCleared() {
                this.selected = null;
                this.deleteCanvas=false;
                this.getFabric().setSelected(null);
            },

            async loadFonts() {
                // In order for the font to show up on initial load, all fonts need to be placed
                // into this 'fonts' array -- we are importing them in styles, below. It shouldn't
                // be difficult to connect these to custom fonts saved in the database, so this
                // array will eventually be dynamic

                const fonts = [
                    'Roboto', 
                    'Orbitron', 
                    'Open Sans', 
                    'Lobster', 
                    'Pacifico', 
                    'Noto Serif', 
                    'Oswald'
                ];
                for (const fontFamily of fonts) {
                    const font = new FontFaceObserver(fontFamily, {});
                    await font.load();
                }
                this.loadCanvas();
            },

            async loadCanvas() {
                this.background = { hex: this.template.backgroundColor };
                await this.getFabric().load(this.template);
                this.templateName = this.template.name;

                this.$nextTick(() => {
                    this.canvasLoaded = true;
                });
            },

            lockItem() {
                let boolean = this.lockedStatus;

                this.getFabric().updateSelected({
                    hasControls: !boolean,
                    lockMovementX: boolean,
                    lockMovementY: boolean,
                    lockScalingX: boolean,
                    lockScalingY: boolean,
                    lockRotation: boolean,
                    locked: boolean
                });
                this.getFabric().reRender();
            },

            async save({ preview }) {
                try {
                    // deselect all objects before saving - prevents wonky calculations
                    // that occur when multiple items are selected when you click save
                    this.getFabric().discardAll();
                    this.busy = true;
                    const thumbUrl = await this.upload_preview({ id: this.template._id, data: preview });
                    const objects = this.getFabric().getObjects();
                    
                    const template = await this.templateSave({
                        ...this.template,
                        name: this.templateName,
                        objects,
                        thumbUrl,
                    });
                    
                    const renderUrl = await this.renderPreview({_id: this.template._id});

                    this.dirty = false;
                    this.$emit('saved', template);
                } catch (e) {
                    window.e = e;
                    this.$log('Error saving template', e);
                } finally {
                    this.busy = false;
                }
            },

            setScreenSize(item) {
                const height = parseInt(item.split(' ')[2]);
                this.getFabric().setScale(height);
            },
            
            addListeners() {
                this.$bus.$on('openUploadProgress', () => {
                    this.uploadProgressDialog = true;
                });
                this.$bus.$on('closeUploadProgress', () => {
                    this.uploadProgressDialog = false;
                });
                this.$bus.$on('pointerModeChanged', val => {
                    this.pointerMode = val;
                });
                this.$bus.$on('content-selected', item => {
                    if (item.type === 'Image') {
                        this.getFabric().addImage(item);
                    }
                    if (item.type === 'Video') {
                        this.getFabric().addVideo(item);
                    }
                });
            },

            removeListeners() {
                this.$bus.$off('openUploadProgress');
                this.$bus.$off('closeUploadProgress');
                this.$bus.$off('pointerModeChanged');
                this.$bus.$off('content-selected');
            }
        },
    };
</script>

<style lang="sass">
    @import url('https://fonts.googleapis.com/css?family=Lobster:400,500,700')
    @import url('https://fonts.googleapis.com/css?family=Pacifico:400,500,700')
    @import url('https://fonts.googleapis.com/css?family=Noto+Serif:400,500,700')
    @import url('https://fonts.googleapis.com/css?family=Oswald:400,500,700')
    @import url('https://fonts.googleapis.com/css?family=Orbitron:400,500,700,900')
    @import url('https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i')
    @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i')

    .small-toolbar-menu 
        .v-list__item 
            padding: 0 8px 0 4px !important
        

        .v-list__item__avatar 

            min-width: 40px
            .v-avatar 
                width: 40px !important
                .v-icon 
                
    .bordered
        border: 1px #c0c0c0 solid    
        
    

    .template-editor 
        background-color: #f2f4f5 !important
        .v-toolbar__title 
            margin-left: 0
        

        .v-toolbar__extension 
            background-color: #ffffff
            position: relative
            height: 78px !important
            width: 1377px
            margin: 0 240px auto
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
            border-radius: 40px
            justify-content: center
        

        .v-card__text .v-main
            padding: 0 !important
            width: 100%
            overflow: auto
        

        .v-input-group__details 
            min-height: 0
        

        .vertical-spacer 
            padding: 0 4px
        

        .v-dialog__content 
        

        .v-list--dense 
            .v-list__tile__action 
                min-width: 22px
            
        

        .v-list__group__header 
            .v-list__group__header__prepend-icon 
                padding-right: 0 !important
                min-width: 48px
            
            .v-list__item 
                padding-left: 0 !important
            
        

        .v-list .v-input-group 
            padding: 0
        

        .v-dialog--active 
            background: #f4f3f4
        

        .small-toolbar 
            .toolbar-group 
                position: relative
                display: inline-block
                /*height: 30px*/
                &:nth-child(n + 3) 
                    margin-left: 4px
                
            

            .v-btn-toggle 
                position: relative
                display: inline-block
                top: 3px
                left: 3px
            

            .v-tooltip 
                padding: 3px 0
                margin-left: 2px
                top: 3px
            

            .v-btn--small 
                min-width: 0 
                margin: 0
                padding: 0
                height: 50px
                .v-btn__content 
                    padding: 0
                    .btn-text 
                        padding: 0 4px
                        font-size: 11px
                        color:#9ea0a3
                    
                    .v-icon 
                        padding: 2px
                        font-size: 22px
                        &.adjacent-icon 
                            font-size: 14px
                        
                    
                    .font-awesome-icons 
                        display: inline-block
                        width: 26px
                    
                
            
        

        .v-bottom-nav 
            display: none
        

    
    .v-label
        font-size: 13px
    
    .overflow-y-mx-12
        box-shadow: 0px 15px 15px 5px rgba(0, 0, 0, .2), 0 60px 10px 0 rgba(0, 0, 0, .19)
        top: 0%
        width: 270px
        display:block
        height:590px
    
    .sidebar-section
        box-shadow: 0px 15px 15px 5px rgba(0, 0, 0, .2), 0 60px 10px 0 rgba(0, 0, 0, .19)
    
    .v-btn:before
        left:0
    
    .toolbar-content
        justify-content: center
    
    .save-button
        width:20px
        position:relative
        right:10px
    
    .cancel-button
        width:80px
        position:relative
    
    .lighten-4
        max-width: 1347px
        padding: 0px !important
        margin:0px 270px auto
    
    .level-container
        height:80px !important
        margin:5px 10px 0 10px
        .layer-selection
            padding:0 5px
            font-size: 10px
        
        .checkbox
            padding:0 20px
            font-size:10px
            margin: 0px
        
    
    .v-btn:not(.v-btn--round).v-size--small 
        min-width: 0px
        padding: 0 8.4444444444px


    h5.panel-heading
        border-top: #f2f4f5 2px solid
        font-family: "Poppins"
        color: #7c7f83
        line-height: 18px
        margin-bottom: 20px
        font-size: 12px
        font-weight: 500 !important
        letter-spacing: 1.8px
        background-color: #f8f9fa
        text-transform: uppercase !important
</style>
