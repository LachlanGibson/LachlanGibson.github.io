import React from "react";
import { Link } from "react-router-dom";

const ArticleCard = ({
  slug,
  title,
  timeElement,
  imageLink,
}: {
  slug: string;
  title: string;
  timeElement: JSX.Element;
  imageLink: string;
}) => {
  return (
    <>
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="rounded-t-lg aspect-[6/5] overflow-hidden relative">
          <Link to={`/blog/${slug}`}>
            <img
              src={imageLink}
              alt=""
              className="w-full relative top-1/3 -translate-y-1/3"
            />
          </Link>
        </div>
        <div className="p-3">
          <Link to={`/blog/${slug}`}>
            <h5 className="mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h5>
          </Link>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            <span>{timeElement}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default ArticleCard;
