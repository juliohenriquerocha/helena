import Operators from './Operators';

import moment from 'moment';
import { General, isADateString } from './utils';

export default class SearchObject {
  property = {};
  operator = {};
  value = [];

  constructor(property, operator, value) {
    this.property = property;
    this.operator = operator;
    this.value = value;
  }

  toString() {
    switch (this.operator.value) {
      case Operators.POWER_SEARCH_BETWEEN.operator:
        return `${this.property.text} ${this.operator.text} ${this.value[0].text} e ${this.value[1].text}`;
      default:
        return `${this.property.text} ${this.operator.text} ${this.value[0].text}`;
    }
  }

  toBodyParameter() {
    switch (this.operator.value) {
      case Operators.POWER_SEARCH_BETWEEN.operator:
        const orderedValues = this.value.sort((a, b) => {
          if (isADateString(a.value)) {
            return moment(a.value, General.brazilianFormat).isAfter(moment(b.value, General.brazilianFormat)) ? 1 : -1;
          } else {
            return a.value - b.value;
          }
        });
        return [
          {
            property: this.property.value,
            operator: Operators.GREATER_THAN_OR_EQUAL_TO.operator,
            value: orderedValues[0].value,
          },
          {
            property: this.property.value,
            operator: Operators.LESSER_THAN_OR_EQUAL_TO.operator,
            value: orderedValues[1].value,
          },
        ];
      case Operators.POWER_SEARCH_PERIOD_MONTH.operator:
        const dayMoment = moment(this.value[0].value, General.brazilianFormat);
        return [
          {
            property: this.property.value,
            operator: Operators.GREATER_THAN_OR_EQUAL_TO.operator,
            value: dayMoment.startOf('month').format(General.brazilianFormat),
          },
          {
            property: this.property.value,
            operator: Operators.LESSER_THAN_OR_EQUAL_TO.operator,
            value: dayMoment.endOf('month').format(General.brazilianFormat),
          },
        ];

      default:
        return [
          {
            property: this.property.value,
            operator: this.operator.value,
            value: this.value[0].value,
          },
        ];
    }
  }
}
