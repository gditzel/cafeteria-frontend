export interface Table {
  id: number;
  number: number;
  status: 'FREE' | 'BUSY' | string;
}
