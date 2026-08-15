export enum MaritalStatus {
    SINGLE = 0,
    MARRIED = 1,
    DIVORCED = 2,
    WIDOWED = 3,
    SEPARATED = 4,
    LIVES_WITH_SOMEONE = 5,
}

export class MaritalStatusUtils {
  static getLabel(status: MaritalStatus): string {
    switch (status) {
      case MaritalStatus.SINGLE:
        return 'Solteiro(a)';
      case MaritalStatus.MARRIED:
        return 'Casado(a)';
      case MaritalStatus.DIVORCED:
        return 'Divorciado(a)';
      case MaritalStatus.WIDOWED:
        return 'Viúvo(a)';
      case MaritalStatus.SEPARATED:
        return 'Separado(a)';
      case MaritalStatus.LIVES_WITH_SOMEONE:
        return 'União estável';
      default:
        return '-';
    }
  }
}