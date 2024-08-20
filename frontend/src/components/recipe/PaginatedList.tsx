import React, { useEffect } from "react";
import { Container, Pagination, Center, ContainerProps } from "@mantine/core";
import { usePagination } from "@mantine/hooks";

interface PaginatedListProps<T> {
  items: T[];
  itemsPerPage: number;
  renderItems: (items: T[]) => React.ReactNode;
  containerProps?: ContainerProps;
}

export function PaginatedList<T>({
  items,
  itemsPerPage,
  renderItems,
  containerProps,
}: PaginatedListProps<T>) {
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const pagination = usePagination({
    total: totalPages,
    initialPage: 1,
    boundaries: 1,
    siblings: 1,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pagination.active]);

  const paginatedItems = items.slice(
    (pagination.active - 1) * itemsPerPage,
    pagination.active * itemsPerPage
  );

  return (
    <Container {...containerProps}>
      {renderItems(paginatedItems)}
      {totalPages > 1 && (
        <Center mt="xl">
          <Pagination
            total={totalPages}
            value={pagination.active}
            onChange={pagination.setPage}
            boundaries={1}
            siblings={1}
          />
        </Center>
      )}
    </Container>
  );
}
