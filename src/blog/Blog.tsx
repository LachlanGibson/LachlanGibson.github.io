import React from "react";
import { useSearchParams } from "react-router";
import articleMetaData, { ArticleType } from "./articleMetaData";
import ArticleCard from "./ArticleCard";

const isWip = (article: ArticleType) => article.wip === true;

const Blog: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showWip, setShowWip] = React.useState(false);
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (searchParams.get("preview") === "true") {
      setShowWip(true);
    }
  }, [searchParams]);

  React.useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    };
  }, []);

  const handleTitleClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 5) {
      setShowWip((v) => !v);
      clickCountRef.current = 0;
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 2000);
    }
  };

  const allArticles = Object.entries(articleMetaData);
  const publishedArticles = allArticles.filter(([, a]) => !isWip(a));
  const wipArticles = allArticles.filter(([, a]) => isWip(a));

  const featuredEntry = publishedArticles[0];
  const restPublished = publishedArticles.slice(1);
  const gridArticles = showWip ? [...restPublished, ...wipArticles] : restPublished;

  return (
    <section className="pt-2 pb-4">
      <div className="border-b border-(--site-border) pb-3">
        <h1
          className="cursor-default select-none text-4xl font-semibold tracking-[0.015em] text-(--site-text)"
          onClick={handleTitleClick}
        >
          Articles
        </h1>
        <p className="mt-1 text-sm text-(--site-text-muted)">Writeups, interactive projects, and experiments.</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        {featuredEntry && (
          <ArticleCard
            slug={featuredEntry[0]}
            title={featuredEntry[1].title}
            description={featuredEntry[1].description}
            publishedDateISO={featuredEntry[1].publishedDateISO}
            publishedDateLabel={featuredEntry[1].publishedDateLabel}
            modifiedDateISO={featuredEntry[1].modifiedDateISO}
            modifiedDateLabel={featuredEntry[1].modifiedDateLabel}
            svgLink={featuredEntry[1].svgLink}
            label="Latest"
          />
        )}
        {gridArticles.map(([slug, article]) => (
          <ArticleCard
            key={slug}
            slug={slug}
            title={article.titleShort ?? article.title}
            description={article.description}
            publishedDateISO={article.publishedDateISO}
            publishedDateLabel={article.publishedDateLabel}
            modifiedDateISO={article.modifiedDateISO}
            modifiedDateLabel={article.modifiedDateLabel}
            svgLink={article.svgLink}
            isWip={isWip(article)}
          />
        ))}
      </div>
    </section>
  );
};

export default Blog;
