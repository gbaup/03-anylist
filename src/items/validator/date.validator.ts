import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isDate', async: false })
export class IsDateConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    const dateParts = value.split('/');
    if (dateParts.length !== 3) {
      return false;
    }
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);

    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      this.message = 'Por favor ingresar una fecha válida';

      return false;
    }

    if (month < 1 || month > 12) {
      this.message = 'Por favor ingresar un mes válido';
      return false;
    }

    if (
      month === 1 ||
      month === 3 ||
      month === 5 ||
      month === 7 ||
      month === 8 ||
      month === 10 ||
      month === 12
    ) {
      if (day < 1 || day > 31) {
        this.message = 'Por favor ingresar un día válido';
        return false;
      }
    } else if (month === 4 || month === 6 || month === 9 || month === 11) {
      if (day < 1 || day > 30) {
        this.message = 'Por favor ingresar un día válido';
        return false;
      }
    } else {
      if (day < 1 || day > 28) {
        this.message = 'Por favor ingresar un día válido';
        return false;
      }
    }
    if (year < 2013 || year > 2023) {
      this.message = 'La fecha de compra debe ser de los últimos 10 años';
      return false;
    }

    return true;
  }

  defaultMessage() {
    return this.message || 'Ingresar decha en formato: DD/MM/YYYY';
  }

  private message?: string;
}

export function IsDateCustom(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsDateConstraint,
    });
  };
}
