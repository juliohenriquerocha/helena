export default {
  GREATER_THAN: { operator: 'GREATER_THAN', text: 'maior que', types: ['NUMBER', 'DATE'], expectedArgs: 1 },
  GREATER_THAN_OR_EQUAL_TO: {
    operator: 'GREATER_THAN_OR_EQUAL_TO',
    text: 'maior ou igual a',
    types: ['NUMBER', 'DATE'],
    expectedArgs: 1,
  },
  LESSER_THAN: { operator: 'LESSER_THAN', text: 'menor que', types: ['NUMBER', 'DATE'], expectedArgs: 1 },
  LESSER_THAN_OR_EQUAL_TO: {
    operator: 'LESSER_THAN_OR_EQUAL_TO',
    text: 'menor ou igual a',
    types: ['NUMBER', 'DATE'],
    expectedArgs: 1,
  },
  EQUAL_TO: {
    operator: 'EQUAL_TO',
    text: 'igual a',
    types: ['POWER_SELECT', 'ENUM', 'TEXT', 'NUMBER', 'DATE'],
    expectedArgs: 1,
  },
  NOT_EQUAL_TO: {
    operator: 'NOT_EQUAL_TO',
    text: 'diferente de',
    types: ['POWER_SELECT', 'ENUM', 'TEXT', 'NUMBER', 'DATE'],
    expectedArgs: 1,
  },
  //IN: { operator: 'IN', text: 'em', types: ['ENUM', 'NUMBER'] },
  //NOT_IN: { operator: 'NOT_IN', text: 'não está em', types: ['ENUM', 'NUMBER'] },
  LIKE: { operator: 'LIKE', text: 'contém', types: ['TEXT'], expectedArgs: 1 },

  //POWER_SEARCH_OPERATORS
  POWER_SEARCH_BETWEEN: {
    operator: 'POWER_SEARCH_BETWEEN',
    text: 'entre',
    types: ['NUMBER', 'DATE'],
    expectedArgs: 2,
  },
  POWER_SEARCH_PERIOD_MONTH: {
    operator: 'POWER_SEARCH_PERIOD_MONTH',
    text: 'no mês de',
    types: ['MONTH'],
    expectedArgs: 1,
  },
};
