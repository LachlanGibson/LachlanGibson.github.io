import React from "react";
import { Link } from "react-router-dom";

const ArticleCard = ({
  slug,
  title,
  publishedDateISO,
  publishedDateLabel,
  imageLink,
}: {
  slug: string;
  title: string;
  publishedDateISO: string;
  publishedDateLabel: string;
  imageLink: string;
}) => {
  return (
    <>
      <div className="max-w-sm border rounded-lg shadow bg-gray-800 border-gray-700">
        <div className="rounded-t-lg aspect-[5/4] overflow-hidden relative">
          <Link to={`/blog/${slug}`}>
            <img src={imageLink} alt="" className="w-full relative" />
          </Link>
        </div>
        <div className="px-2 pt-2 pb-1">
          <Link to={`/blog/${slug}`}>
            <h5 className="text-lg tracking-tight text-white">{title}</h5>
          </Link>
          <p className="font-normal text-gray-400 text-xs">
            <span>
              <time dateTime={publishedDateISO}>{publishedDateLabel}</time>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default ArticleCard;
