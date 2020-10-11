import ImageSchema from '../schemas/ImageSchema';
import BaseModel from './BaseModel';

export default class Image extends BaseModel {
    constructor() {
        super(ImageSchema);
    }

}
