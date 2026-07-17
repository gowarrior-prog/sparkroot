import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords }) {
  const siteName = 'SPARKROOT';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = "Discover premium clothing, accessories, and lifestyle products at SPARKROOT. Fast shipping and high quality guaranteed in Pakistan.";
  const defaultKeywords = "sparkroot, ecommerce, online shopping, clothing, accessories, pakistan, fashion";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
    </Helmet>
  );
}
