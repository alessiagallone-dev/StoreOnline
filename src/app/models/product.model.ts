export enum ViewType {
  Panel,
  Grid = 1
}

export class Product {
  constructor(
    public title: string,
    public category: string,
    public price: number,
    public employee: string,
    public description: string,
    public reviews: string[]
  ) { }
}

export class ProductList {
  constructor(
    public id: string,
    public data: Product[]
  ) { }
}

export class Store {
  constructor(
    public name: string,
    public category: string,
    public employees: string[]
  ) { }
}

export class StoreItem {
  constructor(
    public id: string,
    public data: Store
  ) { }
}

export class StatisticheList {
  constructor(
    public numberOfProducts: number,
    public category: string
  ) { }
}
