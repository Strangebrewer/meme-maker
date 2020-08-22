import ContentSchema from '../schemas/ContentSchema';
import BaseModel from './BaseModel';

export default class Content extends BaseModel {
   constructor() {
      super(ContentSchema);
   }
}