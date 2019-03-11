import { observable, action, computed } from 'mobx';

class PowerSearchStore {
  @observable
  filterParameters = [];

  @observable
  currentFilter = [];

  @observable
  valueList = [];

  columns = [];

  constructor(columns) {
    this.columns = columns;
  }

  @action
  removeFilter(value) {
    this.currentFilter.replace(this.currentFilter.filter(val => val.text !== value));
    this.filterParameters.replace(this.filterParameters.filter(val => val.toString() !== value));
  }

  //<currentFilter operators>
  @action
  setCurrentFilter(arrayValue) {
    this.currentFilter.replace(arrayValue);
  }

  @action
  pushCurrentFilter(value) {
    this.currentFilter.push(value);
  }

  //</currentFilter operators>

  //<valueList operators>
  @action
  setValueList(arrayValue) {
    this.valueList.replace(arrayValue);
  }

  @action
  pushValueList(value) {
    this.valueList.push(value);
  }

  //</valueList operators>

  //<filterParameters operators>
  @action
  setFilterParameters(arrayValue) {
    this.filterParameters.replace(arrayValue);
  }

  @action
  pushFilterParameters(value) {
    this.filterParameters.push(value);
  }

  //</filterParameters operators>

  @computed
  get concatArrays() {
    if (this.filterParameters.length > 0) {
      const result = this.filterParameters.map(item => {
        return item.toString();
      });

      return result.concat(this.currentFilter.map(item => item.text));
    }

    return this.filterParameters
      .map(item => {
        return item.toString();
      })
      .concat(this.currentFilter.map(item => item.text));
  }
}

export default PowerSearchStore;
