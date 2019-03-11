import React from 'react';
import PropTypes from 'prop-types';

import { Select, Form, Row, Col, DatePicker, Icon, Button } from 'antd';
import { observer } from 'mobx-react';
import moment from 'moment';

import SearchObject from './lib/SearchObject';
import SearchType from './lib/SearchType';
import PowerSearchStore from './lib/PowerSearchStore';
import Operators from './lib/Operators';
import { General, getValueDate, isSearchFormat } from './lib/utils';

/**
 * @author Julio e Helisson
 */

const inputColProps = {
  xs: { span: 20 },
  sm: { span: 20 },
  md: { span: 20 },
  lg: { span: 21 },

  xl: { span: 21 },
  xxl: { span: 22 },
};

const buttonsColProps = {
  xs: { span: 4 },
  sm: { span: 4 },
  md: { span: 4 },
  lg: { span: 3 },

  xl: { span: 3 },
  xxl: { span: 2 },
};
@observer
class SBPowerSearch extends React.Component {
  selectProps;

  searchStore;

  openedDatePicker = false;

  expectedArgs = null;

  constructor(props) {
    super(props);
    this.store = new PowerSearchStore(this.props.columns);
    this._updateValueList = this._updateValueList.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this._onDeselect = this._onDeselect.bind(this);
    this._optionFilter = this._optionFilter.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount() {
    this._appendSearchObjectFromSuggest();
    this._updateValueList();
  }

  _appendSearchObjectFromSuggest() {
    if (this.store.columns) {
      this.store.columns.forEach(column => {
        if (column.suggest) {
          let operator = {};
          const property = { value: column.value, text: column.text };
          let value = [];
          if (column.suggest instanceof Date) {
            operator = {
              value: Operators.POWER_SEARCH_PERIOD_MONTH.operator,
              text: Operators.POWER_SEARCH_PERIOD_MONTH.text,
            };
            value.push({
              value: getValueDate(column.suggest),
              text: moment(column.suggest).format(General.shortBrazilianFormatWithYear),
            });
          } else {
            operator = { value: Operators.EQUAL_TO.operator, text: Operators.EQUAL_TO.text };
            value.push({ value: column.suggest, text: column.suggest });
          }
          this.store.pushFilterParameters(new SearchObject(property, operator, value));
        }
      });
    }
  }

  _updateValueList() {
    if (this.store.currentFilter.length === 0) {
      this.searchStore = null;
      this.store.setValueList(
        this.store.columns.map(item => {
          return { value: item.value, text: item.text, type: 'column' };
        })
      );
    } else if (this.store.currentFilter.length === 1) {
      const operadoresPossiveis = Object.keys(Operators).filter(key =>
        Operators[key].types.includes(this.selectProps.type)
      );
      this.store.setValueList(
        operadoresPossiveis.map(key => {
          return { value: Operators[key].operator, text: Operators[key].text, type: 'operator' };
        })
      );
    } else if (this.store.currentFilter.length === 2) {
      switch (this.selectProps.type) {
        case SearchType.POWER_SELECT:
          const { powerSelectProps } = this.selectProps;
          this.searchStore = powerSelectProps.selectStore;
          this.searchStore.lista = [];
          this.store.valueList = this.searchStore.lista;
          break;
        case SearchType.NUMBER:
        case SearchType.TEXT:
          this.store.setValueList([]);
          break;
        case SearchType.ENUM:
          this.store.setValueList(this.selectProps.options);
          break;
        case SearchType.DATE:
        case SearchType.MONTH:
          this.store.setValueList([]);
          this.openedDatePicker = true;
          break;
      }
    }
  }

  _onSelect(value, option) {
    if (value && option) {
      if (value === 'default-search') {
        this._onSubmit(null);
      } else {
        if (this.store.currentFilter.length === 0) {
          //primeira iteração deve armazenar as propriedade da coluna
          this.selectProps = this.store.columns.find(i => i.value === value);
        }

        const sizeCurrentFilter = this.store.currentFilter.length;

        if (sizeCurrentFilter === 0) {
          this.store.pushCurrentFilter({ value: value, text: this.selectProps.text });
        } else if (sizeCurrentFilter === 1) {
          this.store.pushCurrentFilter({ value: value, text: Operators[value].text });
          this.expectedArgs = Operators[value].expectedArgs;
        } else if (sizeCurrentFilter < 2 + this.expectedArgs) {
          switch (this.selectProps.type) {
            case SearchType.DATE:
              //Se for uma data tem tratamento especial
              this.store.pushCurrentFilter({
                value: getValueDate(value),
                text: value.format(General.brazilianFormat),
              });
              break;
            case SearchType.MONTH:
              //Se for um mes tem tratamento especial
              this.store.pushCurrentFilter({
                value: getValueDate(value),
                text: value.format(General.shortBrazilianFormatWithYear),
              });
              break;
            default:
              this.store.pushCurrentFilter({ value: value, text: option.props.children });
          }
        }

        if (this.store.currentFilter.length === 2 + this.expectedArgs) {
          this.store.pushFilterParameters(
            new SearchObject(
              this.store.currentFilter[0],
              this.store.currentFilter[1],
              this.store.currentFilter.slice(2)
            )
          );
          this.store.currentFilter = [];
          this.expectedArgs = null;
          this.selectProps = null;
          this._updateValueList();
          this.openedDatePicker = false;
        }
      }
    }
  }

  _onDeselect(value, option) {
    if (value && option) {
      const beforeRemoveLength = this.store.currentFilter.length;
      this.store.removeFilter(value);
      const afterRemoveLength = this.store.currentFilter.length;

      if (
        afterRemoveLength > 0 &&
        beforeRemoveLength !== afterRemoveLength &&
        !isSearchFormat(this.store.currentFilter, this.store.columns)
      ) {
        //Se foi removido algum token
        this.store.setCurrentFilter([]);
      }
      this._updateValueList();
    }
  }

  _onSearhReset(option) {
    this.store.setCurrentFilter([]);
    this.store.setFilterParameters([]);
    this.openedDatePicker = false;
    this.expectedArgs = null;
    this._updateValueList();
    this._onSubmit(null);
  }

  _onSearch(value) {
    if (this.selectProps && this.store.currentFilter.length >= 2) {
      if (this.searchStore && this.selectProps.type === SearchType.POWER_SELECT) {
        this.searchStore._onPowerSearch(
          value,
          this.selectProps.powerSelectProps.value,
          this.selectProps.powerSelectProps.text
        );
      } else if (this.selectProps.type === SearchType.TEXT) {
        this.store.setValueList([{ value: value, text: value }]);
      } else if (this.selectProps.type === SearchType.NUMBER && !isNaN(value)) {
        this.store.setValueList([{ value: value, text: value }]);
      }
    }
  }

  _onSubmit(event) {
    event && event.preventDefault();
    //let filterParameters = [];
    //this.store.filterParameters.forEach(item => (filterParameters = filterParameters.concat(item.toBodyParameter())));

    //this.props.store.searchFilter(this.props.fixedFilter, null, filterParameters);
    this.refs.powerSearchSelect.blur();
    if (this.props.onSubmit) {
      this.props.onSubmit(event, this.store.filterParameters);
    }
  }

  _optionFilter(inputValue, option) {
    if (option.props.children[1] !== ' Pesquisar') {
      const normIn = inputValue
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ /g, '')
        .toLowerCase();

      const normOp = option.props.children
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ /g, '')
        .toLowerCase();

      return normOp.includes(normIn);
    }
    return false;
  }

  render() {
    return (
      <div>
        <Form className="ant-advanced-search-form" onSubmit={e => this._onSubmit(e)}>
          <Row gutter={12} className="sb-mb-10">
            <Col {...inputColProps} style={{ display: 'block' }}>
              <Form.Item style={{ marginBottom: '0' }}>
                <Select
                  autoFocus
                  ref="powerSearchSelect"
                  className="sb-power-search"
                  mode="multiple"
                  placeholder="Pesquisar"
                  value={this.store.concatArrays}
                  onSelect={this._onSelect}
                  onChange={this._updateValueList}
                  onDeselect={this._onDeselect}
                  onSearch={this._onSearch}
                  style={{ width: '100%' }}
                  filterOption={this._optionFilter}
                  loading={this.searchStore ? this.searchStore.loading : false}
                >
                  {!this.selectProps && this.store.filterParameters.length >= 1 && (
                    <Select.Option
                      className={'sb-power-search-default'}
                      key={'default-search'}
                      value={'default-search'}
                    >
                      <Icon type="search" /> Pesquisar
                    </Select.Option>
                  )}
                  {this.store.valueList.map((item, index) => (
                    <Select.Option className={'sb-power-search'} key={`${item.value}-${index}`} value={item.value}>
                      {item.text}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col {...buttonsColProps} style={{ display: 'block', float: 'right' }}>
              <Button.Group>
                <Button type="primary" htmlType="submit" icon="search" />
              </Button.Group>
            </Col>
          </Row>
        </Form>
        {this.selectProps && this.selectProps.type === SearchType.DATE ? (
          <DatePicker
            style={{ position: 'absolute', visibility: 'collapse', top: '0px' }}
            open={this.openedDatePicker}
            onChange={(value, option) => this._onSelect(value, option)}
          />
        ) : (
          <DatePicker.MonthPicker
            style={{ position: 'absolute', visibility: 'collapse', top: '0px' }}
            open={this.openedDatePicker}
            onChange={(value, option) => this._onSelect(value, option)}
          />
        )}
      </div>
    );
  }
}

SBPowerSearch.defaultProps = {
  notContentMessage: 'Nenhum registro encontrado',
  style: { width: '100%' },
};

SBPowerSearch.propTypes = {
  columns: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SBPowerSearch;
