/**
 * Cloudflare R2 Media URLs Configuration
 */

// Replace with your actual R2 bucket URL
const R2_BASE_URL = import.meta.env.VITE_R2_BASE_URL || 'https://media.post-kar.com';

/**
 * Customer Feedback Videos
 */
export const customerFeedbackVideos = {
  cf1: `${R2_BASE_URL}/community/customer_feedback_1.mp4`,
  cf2: `${R2_BASE_URL}/community/customer_feedback_2.mp4`,
  cf3: `${R2_BASE_URL}/community/customer_feedback_3.mp4`,
  cf4: `${R2_BASE_URL}/community/customer_feedback_4.mp4`,
  cf5: `${R2_BASE_URL}/community/customer_feedback_5.mp4`,
  cf6: `${R2_BASE_URL}/community/customer_feedback_6.mp4`,
  cf7: `${R2_BASE_URL}/community/customer_feedback_7.mp4`,
  cf8: `${R2_BASE_URL}/community/customer_feedback_8.mp4`,
  cf9: `${R2_BASE_URL}/community/customer_feedback_9.mp4`,
  cf10: `${R2_BASE_URL}/community/customer_feedback_10.mp4`,
  cf11: `${R2_BASE_URL}/community/customer_feedback_11.mp4`,
};

/**
 * Hero Section Videos
 */
export const heroVideos = {
  heroSectionHeader: `${R2_BASE_URL}/hero/hero_section_header.mp4`,
  heroBg: `${R2_BASE_URL}/hero/hero_bg.mp4`,
  headerLogoVideo: `${R2_BASE_URL}/hero/header_logo_video.mp4`,
  logoNew: `${R2_BASE_URL}/hero/logo_new.mp4`,
};

/**
 * Scanner AR Video
 */
export const scannerVideos = {
  igasVideo: `${R2_BASE_URL}/videos/IgasVideo.mp4`,
};

/**
 * 3D Mascot Models (GLB files)
 */
export const mascotModels = {
  home: `${R2_BASE_URL}/mascots/menaquin.glb`,
  products: `${R2_BASE_URL}/mascots/product_page_mascot.glb`,
  free: `${R2_BASE_URL}/mascots/free_page_mascot.glb`,
};

/*ascotsProduct Images Base URL
 */
export const getProductImageUrl = (filename: string): string => {
  return `${R2_BASE_URL}/products/${filename}`;
};

/**
 * Helper: Get array of customer feedback videos
 */
export const getFeedbackVideosArray = (): string[] => {
  return [
    customerFeedbackVideos.cf1,
    customerFeedbackVideos.cf3,
    customerFeedbackVideos.cf5,
    customerFeedbackVideos.cf8,
    customerFeedbackVideos.cf4,
    customerFeedbackVideos.cf2,
    customerFeedbackVideos.cf6,
    customerFeedbackVideos.cf7,
    customerFeedbackVideos.cf9,
    customerFeedbackVideos.cf10,
    customerFeedbackVideos.cf11,
  ];
//   const feedbackVideos = [cf1, cf3, cf5, cf8, cf4, cf2, cf6, cf7, cf9, cf10, cf11];
};