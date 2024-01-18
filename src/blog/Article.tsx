import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import articleMetaData, { ArticleType } from "./articleMetaData";
import "./Article.css";
import ShareLinks, { SocialMediaLinks } from "./ShareLinks";
import BlogMetaData from "./BlogMetaData";

const AuthorCard: React.FC<{
  metaData: ArticleType;
  shareLinks: SocialMediaLinks;
}> = ({ metaData, shareLinks }) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl tracking-wide my-4 text-center">
        {metaData.title}
      </h1>
      <div className="flex gap-4 items-center mb-4">
        <div className="w-12 h-12 aspect-square bg-slate-200 overflow-hidden rounded-full relative">
          <img
            className="h-full"
            src={metaData.authorImageLink}
            alt={metaData.author}
          />
        </div>
        <div className="h-fit">
          <div className="tracking-wide text-xl">{metaData.author}</div>
          <div className="text-sky-600 text-xs">
            <time dateTime={metaData.publishedDateISO}>
              {metaData.publishedDateLabel}
            </time>
            {metaData.modifiedDateISO && (
              <>
                , updated{" "}
                {
                  <time dateTime={metaData.modifiedDateISO}>
                    {metaData.modifiedDateLabel}
                  </time>
                }
              </>
            )}
          </div>
        </div>
        <ShareLinks shareLinks={shareLinks} />
      </div>
    </div>
  );
};

const Article: React.FC = () => {
  const { slug } = useParams();
  const [shareLinks, setShareLinks] = useState<SocialMediaLinks>({
    fb: "",
    twitter: "",
    linkedIn: "",
    reddit: "",
    whatsapp: "",
    telegram: "",
  });
  useEffect(() => {
    if (slug && articleMetaData[slug]) {
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
  if (!articleMetaData[slug]) {
    return <Navigate to="/blog/article-not-found" />;
  }

  return (
    <>
      <BlogMetaData slug={slug} metaData={articleMetaData[slug]} />
      <AuthorCard metaData={articleMetaData[slug]} shareLinks={shareLinks} />
      {articleMetaData[slug].articleElement}
    </>
  );
};

export default Article;
