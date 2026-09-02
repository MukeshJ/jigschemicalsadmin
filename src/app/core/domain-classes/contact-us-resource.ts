import { ResourceParameter } from './resource-parameter';

export class ContactUsResource extends ResourceParameter {
  name: string = '';
  email: string = '';
  phone: string = '';
  comapany:string='';
  type: number | null = null;
}
