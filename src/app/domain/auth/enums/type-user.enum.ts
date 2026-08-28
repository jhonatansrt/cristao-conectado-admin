export enum TypeUser {
  MASTER = 0,
  MEMBER = 1,
  CONGREGATED = 2,
  VISITOR = 3,
}

export class TypeUserUtils {
  static getLabel(user: TypeUser): string {
    switch(user){
      case TypeUser.MASTER:
        return "Master";
      case TypeUser.MEMBER:
        return "Membro";
      case TypeUser.CONGREGATED:
        return "Congregado";
      case TypeUser.VISITOR:
        return "Visitante";
      default:
        return '-';
    }
  }
}