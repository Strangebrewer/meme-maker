import OrganizationSchema from '../schemas/OrganizationSchema';
import BaseModel from './BaseModel';

export default class Organization extends BaseModel {
   constructor() {
      super(OrganizationSchema);
   }
}