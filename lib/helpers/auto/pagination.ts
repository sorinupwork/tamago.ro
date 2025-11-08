export function calcPerPagesFromLength(length: number): number[] {
  const perPages: number[] = [];
  let remaining = length;
  let p = 1;
  while (remaining > 0) {
    const perPageCalc = Math.min(p === 1 ? 1 : p === 2 ? 2 : 3, remaining);
    perPages.push(perPageCalc);
    remaining -= perPageCalc;
    p++;
  }
  if (perPages.length === 0) perPages.push(1);
  return perPages;
}

export function calcTotalPages(length: number): number {
  return calcPerPagesFromLength(length).length || 1;
}

export function paginateArray<T>(items: T[], currentPage: number) {
  const perPages = calcPerPagesFromLength(items.length);
  const totalPages = perPages.length;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = perPages.slice(0, safePage - 1).reduce((sum, p) => sum + p, 0);
  const endIndex = startIndex + perPages[safePage - 1];
  const paginatedItems = items.slice(startIndex, endIndex);
  return { perPages, totalPages, startIndex, endIndex, paginatedItems, currentPage: safePage };
}
