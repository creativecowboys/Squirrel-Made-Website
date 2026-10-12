import Link from 'next/link';
import { COLLECTION_NAV } from '@/lib/catalog-seo';

/** Text links to the three storefront collections. `current` is omitted so a page does not link to itself. */
export default function ShopCategoryLinks({
  current,
  navClassName,
  linkClassName,
}: {
  current?: string | null;
  navClassName: string;
  linkClassName: string;
}) {
  const items = COLLECTION_NAV.filter((item) => item.handle !== current);
  return (
    <nav aria-label="Product categories" className={navClassName}>
      {items.map((item) => (
        <Link key={item.handle} href={item.href} className={linkClassName}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
