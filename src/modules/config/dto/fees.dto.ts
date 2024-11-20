export interface ISubscription {
  amount: number;

  unit: string;

  period: number;
}

export interface IPublication {
  kinds: number[];

  amount: number;

  unit: string;
}

export interface IAdmission {
  amount: number;

  unit: number;
}

export interface IFees {
  subscription: ISubscription[];

  publication: IPublication[];

  admission: IAdmission[];
}
