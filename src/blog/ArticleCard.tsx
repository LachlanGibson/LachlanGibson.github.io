import React from "react";
import { Link } from "react-router";

const ArticleCard = ({
  slug,
  title,
  description,
  publishedDateISO,
  publishedDateLabel,
  modifiedDateISO,
  modifiedDateLabel,
  svgLink,
  isWip,
  label,
}: {
  slug: string;
  title: string;
  description: string;
  publishedDateISO: string;
  publishedDateLabel: string;
  modifiedDateISO?: string;
  modifiedDateLabel?: string;
  svgLink: string;
  isWip?: boolean;
  label?: string;
}) => {
  return (
    <Link to={`/articles/${slug}/`} className="group no-underline">
      <article className="flex border border-(--site-border) bg-(--site-surface) transition-all duration-150 group-hover:border-(--site-link)">
        <div className="relative w-32 flex-shrink-0 border-r border-(--site-border) bg-(--blog-thumb-bg)">
          <img src={svgLink} alt="" className="h-full w-full object-contain p-3" />
          {isWip && (
            <span className="absolute top-1.5 right-1.5 rounded-full border border-(--site-warning) bg-(--site-surface) px-1.5 py-0.5 text-xs font-semibold text-(--site-warning)">
              WIP
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-col justify-between p-3">
          <div>
            {label && <p className="mb-1 text-xs font-bold tracking-[0.18em] uppercase text-(--site-link)">{label}</p>}
            <h2 className="text-base font-semibold leading-snug tracking-tight text-(--site-text) sm:text-lg">
              {title}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-(--site-text-muted)">{description}</p>
          </div>
          <p className="mt-2 text-xs leading-tight text-(--site-text-muted) sm:text-sm">
            <time dateTime={publishedDateISO}>{publishedDateLabel}</time>
            {modifiedDateISO && (
              <>
                , updated <time dateTime={modifiedDateISO}>{modifiedDateLabel}</time>
              </>
            )}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
