export class ApiResponseService<T> {
  constructor(public count: number, public next: string | null, public previous: string | null, public results: Array<T>) {
  }
}
