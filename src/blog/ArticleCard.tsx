import React from "react";
import { Link } from "react-router-dom";

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
    <Link
      to={`/blog/${slug}/`}
      className="hover:no-underline hover:-translate-x-1 hover:-translate-y-1 hover:shadow-md hover:shadow-slate-600 duration-100 ease-in-out transform h-full rounded-lg overflow-hidden"
    >
      <div className="max-w-sm border rounded-lg shadow bg-gray-800 border-gray-700 ">
        <div className="rounded-t-lg relative bg-slate-100">
          <img
            src={svgLink}
            alt=""
            className="max-w-full h-40 m-auto relative p-4"
          />
        </div>
        <div className="px-2 pt-2 pb-1 h-full">
          <h5 className="text-lg tracking-tight text-white">{title}</h5>

          <p className="font-normal text-gray-400 text-xs">
            <span>
              <time dateTime={publishedDateISO}>{publishedDateLabel}</time>
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
