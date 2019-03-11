import { format } from 'date-fns';
import Operators from './Operators';

export const getValueDate = date => {
  return date ? format(date, General.brazilianFormat) : '-';
};

export const isADateString = date => {
  return (
    typeof date === 'string' &&
    (date.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/) ||
      date.match(/(\d{4})[-/](\d{2})[-/](\d{2})/) ||
      date.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)) //General.brazilianFormat
  );
};

export const General = {
  brazilianFormat: 'DD/MM/YYYY',
  brazilianFormatWithHours: 'DD/MM/YYYY HH:mm:ss',
  shortBrazilianFormat: 'DD/MM',
  shortBrazilianFormatWithYear: 'MM/YYYY',
  shortBrazilianFormatPeriodo: 'YYYYMM',
};

/**
 * Método que verifica se o filtro atual que está sendo montado segue o formato de geração
 * O formato esperado é [coluna, operador, n-valores]
 * @param {} currentFilter - array do filtro atual que está sendo montado
 */
export const isSearchFormat = (currentFilter, columns) => {
  const size = currentFilter.length;
  if (size == 0) return true;
  else if (size == 1) return isColumn(currentFilter[0].value, columns);
  else if (size >= 2) return isColumn(currentFilter[0].value, columns) && isOperator(currentFilter[1].value);
};

export const isColumn = (value, columns) => {
  return columns.find(key => key.value === value);
};

export const isOperator = value => {
  return Object.keys(Operators).find(key => key === value);
};
