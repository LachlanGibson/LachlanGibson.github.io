import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import articleMetaData, { ArticleType } from "./articleMetaData";
import ShareLinks, { SocialMediaLinks } from "./ShareLinks";

const AuthorCard: React.FC<{
  metaData: ArticleType;
  shareLinks: SocialMediaLinks;
}> = ({ metaData, shareLinks }) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="my-4 text-center text-4xl tracking-wide">{metaData.title}</h1>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-4">
        <div className="relative aspect-square h-12 w-12 overflow-hidden rounded-full bg-(--site-surface-alt)">
          <img className="h-full" src={metaData.authorImageLink} alt={metaData.author} />
        </div>
        <div className="h-fit text-center sm:text-left">
          <div className="text-xl tracking-wide">{metaData.author}</div>
          <div className="text-xs text-(--site-link)">
            <time dateTime={metaData.publishedDateISO}>{metaData.publishedDateLabel}</time>
            {metaData.modifiedDateISO && (
              <>, updated {<time dateTime={metaData.modifiedDateISO}>{metaData.modifiedDateLabel}</time>}</>
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
      setShareLinks(() => {
        const link = encodeURI(`https://www.lachlangibson.dev/articles/${slug}/`);
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
    }
  }, [slug]);

  if (!slug) {
    return <Navigate to="/articles/article-not-found" />;
  }
  if (!articleMetaData[slug]) {
    return <Navigate to="/articles/article-not-found" />;
  }

  return (
    <>
      <AuthorCard metaData={articleMetaData[slug]} shareLinks={shareLinks} />
      {articleMetaData[slug].articleElement}
    </>
  );
};

export default Article;
