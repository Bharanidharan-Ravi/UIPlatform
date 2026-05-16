export function ListLayout({
  items = [],
  loading = false,
  error,
  toolbar,
  renderItem,
  emptyState = null,
  footer,
  children,
  className = ''
}) {
  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <section className={className}>
      {toolbar}

      {error ? <div role="alert">{error.message || String(error)}</div> : null}

      {loading ? <div aria-busy="true">Loading...</div> : null}

      {!loading && !hasItems ? emptyState : null}

      {!loading && hasItems && typeof renderItem === 'function'
        ? items.map((item, index) => renderItem(item, index))
        : children}

      {footer}
    </section>
  );
}
