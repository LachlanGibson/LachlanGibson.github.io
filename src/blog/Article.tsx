import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useParams } from "react-router-dom";
import articleMetaData from "./articleMetaData";
import "./Article.css";
import ShareLinks from "./ShareLinks";

const articles = Object.keys(articleMetaData);

function articleExists(slug: string | undefined): boolean {
  if (slug) {
    return articles.includes(slug);
  }
  return false;
}

const Article: React.FC = () => {
  const { slug } = useParams();
  const [shareLinks, setShareLinks] = useState({
    fb: "",
    twitter: "",
    linkedIn: "",
    reddit: "",
    whatsapp: "",
    telegram: "",
  });
  useEffect(() => {
    if (slug && articleExists(slug)) {
      document.title = articleMetaData[slug].title;
      const linkIconsCSS = document.createElement("link");
      linkIconsCSS.rel = "stylesheet";
      linkIconsCSS.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      linkIconsCSS.integrity =
        "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==";
      linkIconsCSS.crossOrigin = "anonymous";
      linkIconsCSS.referrerPolicy = "no-referrer";
      document.head.appendChild(linkIconsCSS);

      setShareLinks(() => {
        const link = encodeURI(window.location.href);
        const title = encodeURIComponent(articleMetaData[slug].title);
        const msg = encodeURIComponent("Checkout this article");
        return {
          fb: `https://www.facebook.com/share.php?u=${link}`,
          twitter: `http://twitter.com/share?&url=${link}&text=${msg}&hashtags=javascript,programming`,
          linkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${link}`,
          reddit: `http://www.reddit.com/submit?url=${link}&title=${title}`,
          whatsapp: `https://api.whatsapp.com/send?text=${msg}: ${link}`,
          telegram: `https://telegram.me/share/url?url=${link}&text=${msg}`,
        };
      });

      return () => {
        document.head.removeChild(linkIconsCSS);
      };
    }
  }, [slug]);

  if (!slug) {
    return <Navigate to="/blog/article-not-found" />;
  }
  if (!articleExists(slug)) {
    return <Navigate to="/blog/article-not-found" />;
  }

  return (
    <>
      <Helmet>
        <title>{articleMetaData[slug].title}</title>
        {articleMetaData[slug].metaElements.map((element, index) =>
          React.cloneElement(element, { key: index })
        )}
      </Helmet>

      <div className="blog-title-div">
        <h1>{articleMetaData[slug].title}</h1>
        <span className="author-date-span">
          By {articleMetaData[slug].author}, {articleMetaData[slug].timeElement}
          {articleMetaData[slug].lastModifiedElement ? (
            <>, updated {articleMetaData[slug].lastModifiedElement}</>
          ) : (
            ""
          )}
          .
        </span>
        <ShareLinks shareLinks={shareLinks} />
      </div>
      {articleMetaData[slug].articleElement}
    </>
  );
};

export default Article;
