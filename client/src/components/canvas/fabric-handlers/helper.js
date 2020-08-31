import { fabric } from 'fabric';
import Mousetrap from 'mousetrap';
import { v4 as uuidv4 } from 'uuid';

import { deleteSelected, redo, undo } from '../fabric-actions/persistence';

let copy;

export function beforeAdding(getFabric) {
    getFabric().discardActiveObject().requestRenderAll();
    getFabric().selection = false;
    getFabric().forEachObject((o) => o.selectable = false);
    getFabric().off('mouse:down');
    getFabric().off('mouse:move');
    getFabric().off('mouse:up');
    getFabric().defaultCursor = 'crosshair';
}

export function afterAdding(getFabric) {
    getFabric().defaultCursor = 'auto';
    getFabric().off('mouse:down');
    getFabric().off('mouse:move');
    getFabric().off('mouse:up');
    getFabric().selection = true;
    getFabric().forEachObject((o) => o.selectable = true);
}

export function registerEvents(getFabric, getSelected, setSelected) {
    getFabric().on('selection:created', (e) => {
        setSelected(e);
    });

    getFabric().on('selection:updated', (e) => {
        setSelected(e);
    });

    getFabric().on('selection:cleared', (e) => {
        setSelected(e);
    });

    getFabric().on('object:modified', (e) => {
        const selected = getSelected();
        if (selected.type === 'activeSelection') return;
        getFabric().discardActiveObject();
        setTimeout(() => getFabric().setActiveObject(selected).requestRenderAll());
        setSelected(e);
    });

    getFabric().on('mouse:wheel', opt => {
        if (!opt.e.ctrlKey) return;
        
        const delta = opt.e.deltaY;
        let zoom = getFabric().getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        getFabric().zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        getFabric().requestRenderAll();
        opt.e.preventDefault();
        opt.e.stopPropagation();
    });

    getFabric().on('object:rotating', opt => {
        opt.target.snapAngle = 45;
        opt.target.snapThreshold = 10;
    });

    Mousetrap.bind('del', () => {
        deleteSelected(getFabric);
        setSelected({ target: null });
    });

    Mousetrap.bind('mod+z', () => undo);
    Mousetrap.bind('shift+mod+z', () => redo);
    Mousetrap.bind('esc', () => getFabric().discardActiveObject().requestRenderAll());

    Mousetrap.bind('mod+a', (e) => {
        e.preventDefault();
        getFabric().discardActiveObject();
        const objects = getFabric().getObjects();
        const selected = new fabric.ActiveSelection(objects, { canvas: getFabric() });
        getFabric().setActiveObject(selected).requestRenderAll();
    });

    Mousetrap.bind('mod+c', () => {
        const original = getSelected();

        if (original && original.type !== 'activeSelection' && original.type !== 'group') {
            original.clone((cloned) => {
                copy = cloned;
            });
        }
    });

    Mousetrap.bind('mod+v', () => {
        if (!copy) return;

        copy.clone((cloned) => {
            getFabric().discardActiveObject();
            cloned.set({
                uuid: uuidv4(),
                left: cloned.left + 10,
                top: cloned.top + 10,
                evented: true
            });
            copy.top += 10;
            copy.left += 10;
            getFabric().add(cloned);
            getFabric().setActiveObject(cloned);
            getFabric().requestRenderAll();
        });
    });

    var ctx = getFabric().getSelectionContext(),
        aligningLineOffset = 5,
        aligningLineMargin = 4,
        aligningLineWidth = 1,
        aligningLineColor = 'rgb(0,255,0)',
        viewportTransform,
        zoom = 1;
  
    function drawVerticalLine(coords) {
      drawLine(
        coords.x + 0.5,
        coords.y1 > coords.y2 ? coords.y2 : coords.y1,
        coords.x + 0.5,
        coords.y2 > coords.y1 ? coords.y2 : coords.y1);
    }
  
    function drawHorizontalLine(coords) {
      drawLine(
        coords.x1 > coords.x2 ? coords.x2 : coords.x1,
        coords.y + 0.5,
        coords.x2 > coords.x1 ? coords.x2 : coords.x1,
        coords.y + 0.5);
    }
  
    function drawLine(x1, y1, x2, y2) {
      ctx.save();
      ctx.lineWidth = aligningLineWidth;
      ctx.strokeStyle = aligningLineColor;
      ctx.beginPath();
      ctx.moveTo(((x1+viewportTransform[4])*zoom), ((y1+viewportTransform[5])*zoom));
      ctx.lineTo(((x2+viewportTransform[4])*zoom), ((y2+viewportTransform[5])*zoom));
      ctx.stroke();
      ctx.restore();
    }
  
    function isInRange(value1, value2) {
      value1 = Math.round(value1);
      value2 = Math.round(value2);
      for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
        if (i === value2) {
          return true;
        }
      }
      return false;
    }
  
    var verticalLines = [],
        horizontalLines = [];
  
    getFabric().on('mouse:down', function () {
      viewportTransform = getFabric().viewportTransform;
      zoom = getFabric().getZoom();
    });
  
    getFabric().on('object:moving', function(e) {
  
      var activeObject = e.target,
          canvasObjects = getFabric().getObjects(),
          activeObjectCenter = activeObject.getCenterPoint(),
          activeObjectLeft = activeObjectCenter.x,
          activeObjectTop = activeObjectCenter.y,
          activeObjectBoundingRect = activeObject.getBoundingRect(),
          activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3],
          activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0],
          horizontalInTheRange = false,
          verticalInTheRange = false,
          transform = getFabric()._currentTransform;
  
      if (!transform) return;
  
      // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
      // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move
  
      for (var i = canvasObjects.length; i--; ) {
  
        if (canvasObjects[i] === activeObject) continue;
  
        var objectCenter = canvasObjects[i].getCenterPoint(),
            objectLeft = objectCenter.x,
            objectTop = objectCenter.y,
            objectBoundingRect = canvasObjects[i].getBoundingRect(),
            objectHeight = objectBoundingRect.height / viewportTransform[3],
            objectWidth = objectBoundingRect.width / viewportTransform[0];
  
        // snap by the horizontal center line
        if (isInRange(objectLeft, activeObjectLeft)) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft,
            y1: (objectTop < activeObjectTop)
              ? (objectTop - objectHeight / 2 - aligningLineOffset)
              : (objectTop + objectHeight / 2 + aligningLineOffset),
            y2: (activeObjectTop > objectTop)
              ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
              : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
          });
          activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
        }
  
        // snap by the left edge
        if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft - objectWidth / 2,
            y1: (objectTop < activeObjectTop)
              ? (objectTop - objectHeight / 2 - aligningLineOffset)
              : (objectTop + objectHeight / 2 + aligningLineOffset),
            y2: (activeObjectTop > objectTop)
              ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
              : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
          });
          activeObject.setPositionByOrigin(new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
        }
  
        // snap by the right edge
        if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft + objectWidth / 2,
            y1: (objectTop < activeObjectTop)
              ? (objectTop - objectHeight / 2 - aligningLineOffset)
              : (objectTop + objectHeight / 2 + aligningLineOffset),
            y2: (activeObjectTop > objectTop)
              ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
              : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
          });
          activeObject.setPositionByOrigin(new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
        }
  
        // snap by the vertical center line
        if (isInRange(objectTop, activeObjectTop)) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop,
            x1: (objectLeft < activeObjectLeft)
              ? (objectLeft - objectWidth / 2 - aligningLineOffset)
              : (objectLeft + objectWidth / 2 + aligningLineOffset),
            x2: (activeObjectLeft > objectLeft)
              ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
              : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
          });
          activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
        }
  
        // snap by the top edge
        if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop - objectHeight / 2,
            x1: (objectLeft < activeObjectLeft)
              ? (objectLeft - objectWidth / 2 - aligningLineOffset)
              : (objectLeft + objectWidth / 2 + aligningLineOffset),
            x2: (activeObjectLeft > objectLeft)
              ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
              : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
          });
          activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
        }
  
        // snap by the bottom edge
        if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop + objectHeight / 2,
            x1: (objectLeft < activeObjectLeft)
              ? (objectLeft - objectWidth / 2 - aligningLineOffset)
              : (objectLeft + objectWidth / 2 + aligningLineOffset),
            x2: (activeObjectLeft > objectLeft)
              ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
              : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
          });
          activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
        }
      }
  
      if (!horizontalInTheRange) {
        horizontalLines.length = 0;
      }
  
      if (!verticalInTheRange) {
        verticalLines.length = 0;
      }
    });
  
    getFabric().on('before:render', function() {
      getFabric().clearContext(getFabric().contextTop);
    });
  
    getFabric().on('after:render', function() {
      for (var i = verticalLines.length; i--; ) {
        drawVerticalLine(verticalLines[i]);
      }
      for (var i = horizontalLines.length; i--; ) {
        drawHorizontalLine(horizontalLines[i]);
      }
  
      verticalLines.length = horizontalLines.length = 0;
    });
  
    getFabric().on('mouse:up', function() {
      verticalLines.length = horizontalLines.length = 0;
      getFabric().requestRenderAll();
    });

    // getFabric().on('object:moving', opt => {
    //     const obj = opt.target;
    //     const alignTolerance = 6;

    //     const objects = getFabric().getObjects();

    //     const lines = {
    //         top: null,
    //         left: null,
    //         right: null,
    //         bottom: null
    //     };

    //     const matches = {
    //         top: false,
    //         left: false,
    //         right: false,
    //         bottom: false,
    //     };

    //     const position = {
    //         top: parseInt(obj.get('top')),
    //         left: parseInt(obj.get('left')),
    //         right: parseInt(obj.get('left') + obj.getScaledWidth()),
    //         bottom: parseInt(obj.get('top') + obj.getScaledHeight())
    //     };

    //     function inRange(pos1, pos2) {
    //         if ((Math.max(pos1, pos2) - Math.min(pos1, pos2)) <= alignTolerance)
    //             return true;
    //         return false;
    //     }

    //     function drawLine(side, pos) {
    //         let ln = null;
    //         switch (side) {
    //             case 'top':
    //                 ln = new fabric.Line([getFabric().getWidth(), 0, 0, 0], {
    //                     left: 0,
    //                     top: pos,
    //                     stroke: 'rgb(178, 207, 255)'
    //                 });
    //                 lines.top = ln;
    //                 break;
    //             case 'left':
    //                 ln = new fabric.Line([0, getFabric().getHeight(), 0, 0], {
    //                     left: pos,
    //                     top: 0,
    //                     stroke: 'rgb(178, 207, 255)'
    //                 });
    //                 lines.left = ln;
    //                 break;
    //             case 'right':
    //                 ln = new fabric.Line([0, getFabric().getHeight(), 0, 0], {
    //                     left: pos,
    //                     top: 0,
    //                     stroke: 'rgb(178, 207, 255)'
    //                 });
    //                 lines.right = ln;
    //                 break;
    //             case 'bottom':
    //                 ln = new fabric.Line([getFabric().getWidth(), 0, 0, 0], {
    //                     left: 0,
    //                     top: pos,
    //                     stroke: 'rgb(178, 207, 255)'
    //                 });
    //                 lines.bottom = ln;
    //                 break;
    //         }
    //         getFabric().add(ln).requestRenderAll();
    //         setTimeout(() => getFabric().remove(ln).requestRenderAll(), 1000);
    //     }

    //     for (const i in objects) {
    //         if (objects[i] === obj || objects[i].get('type') === 'line') continue;
    //         const objPosition = {
    //             top: parseInt(objects[i].get('top')),
    //             left: parseInt(objects[i].get('left')),
    //             right: parseInt(objects[i].get('left') + objects[i].getScaledWidth()),
    //             bottom: parseInt(objects[i].get('top') + objects[i].getScaledHeight()),
    //         }

    //         // moving object top lines up with object bottom
    //         if (inRange(objPosition.bottom, position.top)) {
    //             if (!lines.top) {
    //                 drawLine('top', objPosition.bottom);
    //                 obj.set('top', objPosition.bottom).setCoords();
    //             }
    //         }

    //         // moving object right lines up with object left
    //         if (inRange(objPosition.left, position.right)) {
    //             if (!lines.right) {
    //                 drawLine('right', objPosition.left);
    //                 obj.set('left', objPosition.left - obj.getScaledWidth()).setCoords();
    //             }
    //         }
            
    //         // moving object bottom lines up with object top
    //         if (inRange(objPosition.top, position.bottom)) {
    //             if (!lines.bottom) {
    //                 drawLine('bottom', objPosition.top);
    //                 obj.set('top', objPosition.top - obj.getScaledHeight()).setCoords();
    //             }
    //         }

    //         // moving object left lines up with object right
    //         if (inRange(objPosition.right, position.left)) {
    //             if (!lines.left) {
    //                 drawLine('left', objPosition.right);
    //                 obj.set('left', objPosition.right).setCoords();

    //             }
    //         }

    //         if (inRange(objPosition.top, position.top)) {
    //             if (!lines.top) {
    //                 drawLine('top', objPosition.top);
    //                 obj.set('top', objPosition.top).setCoords();
    //             }
    //         }

    //         if (inRange(objPosition.left, position.left)) {
    //             if (!lines.left) {
    //                 drawLine('left', objPosition.left);
    //                 matches.left = true;
    //                 obj.set('left', objPosition.left).setCoords();
    //             }
    //         }

    //         if (inRange(objPosition.right, position.right)) {
    //             if (!lines.right) {
    //                 drawLine('right', objPosition.right);
    //                 matches.right = true;
    //                 obj.set('left', objPosition.right - obj.getScaledWidth()).setCoords();
    //             }
    //         }

    //         if (inRange(objPosition.bottom, position.bottom)) {
    //             if (!lines.bottom) {
    //                 drawLine('bottom', objPosition.bottom);
    //                 matches.bottom = true;
    //                 obj.set('top', objPosition.bottom - obj.getScaledHeight()).setCoords();
    //             }
    //         }

    //         getFabric().requestRenderAll();
    //     }
    // });
}