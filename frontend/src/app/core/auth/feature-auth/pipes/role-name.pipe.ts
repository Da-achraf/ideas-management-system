import { Pipe, PipeTransform } from '@angular/core';
import {
  RoleEnum,
  RoleDisplayNames,
  RoleDisplayNameType,
} from '../../data-access/auth.model';

@Pipe({
  name: 'rolename',
  standalone: true,
})
export class RoleNamePipe implements PipeTransform {
  transform(role: number | undefined): RoleDisplayNameType {
    if (role === undefined || role === null) return '' as RoleDisplayNameType;
    return RoleDisplayNames[role as RoleEnum];
  }
}
