import { MatPaginatorIntl } from '@angular/material/paginator';

export class MatPaginatorIntlIt extends MatPaginatorIntl {
  itemsPerPageLabel = 'Prodotti per pagina';
  nextPageLabel = 'Pagina successiva';
  previousPageLabel = 'Pagina precedente';
  firstPageLabel = 'Prima pagina';
  lastPageLabel = 'Ultima pagina';

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 di ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} - ${endIndex} di ${length}`;
  };
}