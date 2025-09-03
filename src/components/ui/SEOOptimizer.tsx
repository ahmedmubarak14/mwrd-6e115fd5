import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { createLogger } from '@/utils/logger';

const logger = createLogger('SEOOptimizer');

interface SEOOptimizerProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: Record<string, any>;
}

export const SEOOptimizer: React.FC<SEOOptimizerProps> = ({
  title = 'MWRD - Middle East Work Request Directory',
  description = 'Connect with verified vendors and service providers across the Middle East. Submit requests, get quotes, and manage projects efficiently.',
  keywords = ['vendors', 'services', 'middle east', 'procurement', 'rfq', 'projects'],
  image = '/og-image.png',
  url,
  type = 'website',
  structuredData
}) => {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;
  
  // Generate meta tags
  const metaTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  const metaDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  
  useEffect(() => {
    logger.debug('SEO optimization applied', {
      title: metaTitle,
      description: metaDescription,
      url: currentUrl,
      keywords: keywords.slice(0, 5) // Log first 5 keywords
    });
  }, [metaTitle, metaDescription, currentUrl, keywords]);

  // Generate structured data
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type === 'website' ? 'WebSite' : type === 'article' ? 'Article' : 'Product',
      name: title,
      description: metaDescription,
      url: currentUrl,
      image: image,
      publisher: {
        '@type': 'Organization',
        name: 'MWRD',
        url: window.location.origin
      }
    };

    if (type === 'website') {
      return {
        ...baseData,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${window.location.origin}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      };
    }

    return { ...baseData, ...structuredData };
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="MWRD" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </Helmet>
  );
};

// Hook for page-specific SEO
export const useSEO = (props: SEOOptimizerProps) => {
  return <SEOOptimizer {...props} />;
};