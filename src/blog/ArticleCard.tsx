import React from "react";
import { Link } from "react-router";

const ArticleCard = ({
  slug,
  title,
  publishedDateISO,
  publishedDateLabel,
  svgLink,
}: {
  slug: string;
  title: string;
  publishedDateISO: string;
  publishedDateLabel: string;
  svgLink: string;
}) => {
  return (
    <Link to={`/blog/${slug}/`} className="group h-full no-underline">
      <article className="flex h-full flex-col border border-(--site-border) bg-(--site-surface) transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-(--site-link)">
        <div className="relative border-b border-(--site-border) bg-(--blog-thumb-bg)">
          <img
            src={svgLink}
            alt=""
            className="relative m-auto aspect-4/3 w-full max-w-full p-4 object-contain"
          />
        </div>
        <div className="flex h-full flex-col justify-between px-3 py-2.5">
          <h2 className="text-xl leading-snug font-semibold tracking-tight text-(--site-text)">
            {title}
          </h2>
          <p className="mt-1.5 text-sm leading-tight text-(--site-text-muted)">
            <span>
              <time dateTime={publishedDateISO}>{publishedDateLabel}</time>
            </span>
          </p>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
