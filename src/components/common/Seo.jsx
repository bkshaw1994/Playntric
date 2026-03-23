import React from "react";
import { Helmet } from "react-helmet-async";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  getAbsoluteUrl,
} from "../../constants/seo";

export default function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  keywords = DEFAULT_KEYWORDS,
  structuredData,
}) {
  const canonicalUrl = getAbsoluteUrl(path);
  const imageUrl = getAbsoluteUrl(image);
  const keywordContent = Array.isArray(keywords)
    ? keywords.join(", ")
    : keywords;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordContent} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {structuredData ? (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      ) : null}
    </Helmet>
  );
}