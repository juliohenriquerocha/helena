# PowerSearch

PowerSearch é um componente de busca avançada desenvolvido para facilitar a filtragem de dados a partir de *user friendly inputs*.

## **Como usar**
Para utilizar o componente siga as instruções abaixo.

---

### **No Domain**
Deve ser implementado o método que retorna um array com as colunas que devem entrar no escopo de pesquisa.

```js
static getSearchAttributes() {
    return [...searchableColumns]
};
```
As *Searchable Columns*, que compõem o array retornado por `getSearchAttributes()`, devem obrigatóriamente conter os seguintes campos:
 * value: *nome do atributo do domain que o objeto referencia*
 * text: *nome user friendly do atributo*
 * type: *tipo de input busca do campo* **SearchType** 

 > Cada **SearchType** tem seus respectivos campos opcionais

---
### **No IndexStore**

O `getSearchAttributes()` do Domain em questão, deve ser inserido no construtor do store da view.

```js
class IndexStore extends IndexBase {
  constructor() {
    super(IndexStore, Domains.getAttributesTable,Domains.getSearchAttributes());
  }
}
```
---
### **Na IndexView**

Importe o componente e insira ele no JSX passando o IndexStore como prop.
```html
<SBPowerSearch store={this.store}/>
```
---
## Outras props opcionais
* **columns**: Array de searchable attributes, caso seja necessária uma relação de colunas diferetes da especificada no getSearchAttributes do Domain;

* **fixedFilter**: Atributo para ser sempre inserido como um dos parâmetros da pesquisa.

## **SearchType**

O tipo do atributo de pesquisa irá definir o que o PowerSearch espera de input, além das operações possíveis

Os tipos reconhecidos pelo **SearchType** são:

### Text 
 Textos como descrições, nomes de pessoas e ruas.

#### Atributos do *Searchable Column*
```js
{ 
  value: 'column', 
  text: 'Coluna', 
  type: SearchType.TEXT 
}

```
> **Operações disponíveis**
> *  Igual a
> *  Diferente de
> *  Contém

---

### Enum
 Uma quantidade fixa de valores estáticos
#### Atributos do *Searchable Column*
```js
{ 
  value: 'column', 
  text: 'Coluna', 
  options: [
    { value: 'OPCAO_1', text: 'Opção 1' },
    { value: 'OPCAO_2', text: 'Opção 2' },
  ],
  type: SearchType.ENUM 
}

```
> **Operações disponíveis**
> *  Igual a
> *  Diferente de

---

### PowerSelect
 O PowerSearch irá fornecer um autocomplete, essa opção deve referenciar atributos que sejam únicos na base de dados
#### Atributos do *Searchable Column*
```js
{ 
  value: 'column',
  text: 'Coluna',
  type: SearchType.POWER_SELECT,
  powerSelectProps: {
    domain: ColunaDomain,
    service: ColunaService,
    options: { sort: 'COLUMN,asc' },
    attributes: ['column'],
  }, 
}
```
> **Operações disponíveis**
> *  Igual a
> *  Diferente de

### powerSelectProps (Opcional)
 Caso o usuário deseje realizar a busca por outro campo que não seja a chave primária do Domain, basta adicionar os atributos `value` e `text`, que são a chave primária do Domain e o campo que se deseja realizar o autocomplete, respectivamente.

 ```js
{ 
  value: 'column',
  text: 'Coluna',
  type: SearchType.POWER_SELECT,
  powerSelectProps: {
    domain: ColunaDomain,
    service: ColunaService,
    options: { sort: 'COLUMN,asc' },
    attributes: ['column'],
    value: 'column',
    text: 'nome'
  }, 
}
```

---

### Number
 Valores numéricos
#### Atributos do *Searchable Column*
```js
{ 
  value: 'column',
  text: 'Coluna',
  type: SearchType.NUMBER,
}
```
> **Operações disponíveis**
> *  Igual a
> *  Diferente de
> *  Maior que
> *  Maior ou igual que
> *  Menor que
> *  Menor ou igual que
> *  Entre

---

### Date
 O PowerSearch irá fornecer um datepicker para o usuário informar uma data
#### Atributos do *Searchable Column*
```js
{ 
  value: 'column',
  text: 'Coluna',
  type: SearchType.DATE,
}
```
> **Operações disponíveis**
> *  Igual a
> *  Diferente de
> *  Maior que
> *  Maior ou igual que
> *  Menor que
> *  Menor ou igual que
> *  Entre

---

### Month
 Semelhante ao Date, mas nesse caso, escolhe-se um mês inteiro no DatePicker
#### Atributos do *Searchable Column*
```js
{ 
  value: 'column',
  text: 'Coluna',
  type: SearchType.MONTH,
}
```
> **Operações disponíveis**
> *  No mês de

---

## **Pesquisa Sensível ao Contexto**

É possível configurar o **PowerSearch** de uma determinada tela para ser sensível ao context selecionado.

### Como fazer
  
1. Identificar o atributo do domain em questão que tem relação com algum atributo do contexto;
2. Inserir o campo `context` no objeto Searchable Column do atributo em questão;
3. O atributo `context` deve receber uma string com o nome do campo que se deseja do contexto.

>ex: 
>``` js
>{ 
>   value: 'column',
>   context: 'periodoDefault',
>   text: 'Coluna',
>   type: SearchType.MONTH
> }
>```

---
