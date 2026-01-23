export interface Order {
  id?: number;
  table: { id: number; number?: number };
  status: string;
  items: any[];
  total?: number;
}
