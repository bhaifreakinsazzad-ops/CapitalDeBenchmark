/**
 * Freakin Studio Venture Ecosystem - Platform Integration Script
 * 
 * This script implements all Freakin Studio ventures into the Capital De Benchmark platform.
 * Run this after platform setup to populate all ventures.
 * 
 * Usage: Import and execute in your application initialization
 */

import { useAuthStore, useDemoStore } from '../store';
import { useBusinessStore } from '../lib/services/business';
import { useNotificationStore } from '../lib/services/notify';
import { generateId } from '../lib/utils';

// Founder Profile
const FREAKIN_FOUNDER = {
  id: 'freakin-studio-founder-001',
  name: 'BhaiSazzaD',
  phone: '01700000001', // Replace with actual phone
  email: 'hello@freakinstudio.space',
  role: 'founder' as const,
  kyc_status: 'verified' as const,
  wallet_id: 'CDB-FREAKIN-0001',
  balance: 0,
  preferred_lang: 'en' as const,
  password: 'freakin2025secure', // Change this!
};

// All Freakin Studio Ventures
const FREAKIN_VENTURES = [
  // FLAGSHIP VENTURES
  {
    name: 'Hoooplaaa',
    slug: 'hoooplaaa',
    category: 'Technology',
    location: 'Dhaka, Bangladesh (Global)',
    story: `Hoooplaaa is revolutionizing lead generation with synthetic intelligence. Our platform helps businesses identify, qualify, and connect with high-value leads while providing real-time business valuation insights.

Built from Bangladesh for global markets, Hoooplaaa leverages cutting-edge AI to transform how businesses approach lead generation and valuation. Our flagship venture represents the pinnacle of AI-powered business intelligence.

Key Features:
• AI-powered lead generation and qualification
• Real-time business valuation engine
• Global ranking and insights
• Synthetic intelligence at the core
• Serving markets worldwide

Join us in building the future of business intelligence from Bangladesh.`,
    share_price: 50,
    total_shares: 10000,
    funding_mode: 'milestone' as const,
    milestone_target: 500000,
    revenue_monthly: 25000,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'hoooplaaa_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'hoooplaaa_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'hoooplaaa_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'hoooplaaa_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'hoooplaaa_hero.jpg', caption: 'Hoooplaaa AI Platform', is_cover: true },
      { file_name: 'hoooplaaa_dashboard.jpg', caption: 'Dashboard Interface', is_cover: false },
      { file_name: 'hoooplaaa_team.jpg', caption: 'Team', is_cover: false },
    ],
  },

  // LIVE & OPERATIONAL VENTURES
  {
    name: 'DhandaBuzz',
    slug: 'dhandabuzz',
    category: 'Services',
    location: 'Dhaka, Bangladesh (Global)',
    story: `DhandaBuzz is a revenue-active digital agency serving clients globally. With historical transactions and active client relationships, we deliver comprehensive digital solutions including web development, marketing, and brand strategy.

As a live and operational venture within the Freakin Studio ecosystem, DhandaBuzz has proven its business model with real clients and consistent revenue generation.

Services Include:
• Web Development & Design
• Digital Marketing & SEO
• Brand Strategy & Identity
• Social Media Management
• Content Creation

With active clients and historical transactions, DhandaBuzz represents a proven, revenue-generating business ready for scaling.`,
    share_price: 30,
    total_shares: 15000,
    funding_mode: 'instant' as const,
    revenue_monthly: 75000,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'dhandabuzz_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'dhandabuzz_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'dhandabuzz_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'dhandabuzz_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'dhandabuzz_office.jpg', caption: 'DhandaBuzz Office', is_cover: true },
      { file_name: 'dhandabuzz_work.jpg', caption: 'Client Work' },
      { file_name: 'dhandabuzz_team.jpg', caption: 'Team' },
    ],
  },

  {
    name: 'GURUsphere Lab',
    slug: 'gurusphere-lab',
    category: 'Education',
    location: 'Dhaka, Bangladesh',
    story: `GURUsphere Lab has undergone a meaningful rebrand, expanding from pure education into a comprehensive ecosystem for research, business development, and project building. Our platform empowers learners and builders alike.

Originally focused on education, GURUsphere has evolved into a multi-faceted platform supporting research initiatives, business development, and collaborative project building.

Platform Features:
• Educational resources and courses
• Research collaboration tools
• Business development support
• Project building frameworks
• Community engagement

With a meaningful rebrand complete and marketing planned, GURUsphere Lab is positioned for significant growth in the EdTech and research space.`,
    share_price: 25,
    total_shares: 20000,
    funding_mode: 'milestone' as const,
    milestone_target: 400000,
    revenue_monthly: 15000,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'gurusphere_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'gurusphere_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'gurusphere_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'gurusphere_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'gurusphere_platform.jpg', caption: 'GURUsphere Platform', is_cover: true },
      { file_name: 'gurusphere_learning.jpg', caption: 'Learning Interface' },
      { file_name: 'gurusphere_community.jpg', caption: 'Community' },
    ],
  },

  {
    name: 'Freakin SI',
    slug: 'freakin-si',
    category: 'Technology',
    location: 'Dhaka, Bangladesh (Global)',
    story: `Freakin SI represents the cutting edge of synthetic intelligence. Our live chat interface is continually refined and improved, offering users intelligent conversations and AI-powered assistance across various domains.

As a live and evolving venture, Freakin SI is at the forefront of AI chat technology, with continuous improvements and refinements based on user feedback and technological advances.

Key Capabilities:
• Advanced synthetic intelligence chat
• Multi-domain assistance
• Continuous learning and improvement
• User-friendly interface
• Real-time responses

Live today and continually improving, Freakin SI is shaping the future of AI-powered conversations.`,
    share_price: 40,
    total_shares: 12000,
    funding_mode: 'instant' as const,
    revenue_monthly: 35000,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'freakinsi_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'freakinsi_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'freakinsi_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'freakinsi_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'freakinsi_interface.jpg', caption: 'SI Chat Interface', is_cover: true },
      { file_name: 'freakinsi_features.jpg', caption: 'Features' },
      { file_name: 'freakinsi_demo.jpg', caption: 'Demo' },
    ],
  },

  {
    name: 'AI Shala',
    slug: 'ai-shala',
    category: 'Education',
    location: 'Dhaka, Bangladesh',
    story: `AI Shala is pioneering AI-first learning experiences. Our live platform is actively expanding, offering students and professionals cutting-edge educational tools powered by synthetic intelligence.

As a live and evolving venture in the EdTech space, AI Shala combines traditional learning methodologies with advanced AI capabilities to create personalized, effective educational experiences.

Platform Highlights:
• AI-powered personalized learning
• Interactive educational tools
• Professional development courses
• Student engagement analytics
• Continuous platform expansion

Live and actively expanding, AI Shala is transforming education through artificial intelligence.`,
    share_price: 20,
    total_shares: 25000,
    funding_mode: 'milestone' as const,
    milestone_target: 350000,
    revenue_monthly: 20000,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'aishala_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'aishala_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'aishala_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'aishala_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'aishala_learning.jpg', caption: 'AI Learning Platform', is_cover: true },
      { file_name: 'aishala_courses.jpg', caption: 'Courses' },
      { file_name: 'aishala_students.jpg', caption: 'Students' },
    ],
  },

  {
    name: 'BhaiVibing',
    slug: 'bhaivibing',
    category: 'Technology',
    location: 'Dhaka, Bangladesh',
    story: `BhaiVibing is Bangladesh's emerging coding platform. Currently in beta with a significantly enhanced v2 in the pipeline, we're building the future of developer tools and coding education from Bangladesh.

As a live beta venture, BhaiVibing is already serving developers while preparing for a major version 2 release that will bring enhanced features and capabilities.

Current Features:
• Interactive coding environment
• Developer tools and utilities
• Community features
• Learning resources
• Beta testing active

With v2 incoming, BhaiVibing is set to become a major player in the developer tools space.`,
    share_price: 35,
    total_shares: 18000,
    funding_mode: 'instant' as const,
    revenue_monthly: 10000,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'bhaivibing_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'bhaivibing_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'bhaivibing_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'bhaivibing_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'bhaivibing_editor.jpg', caption: 'Code Editor', is_cover: true },
      { file_name: 'bhaivibing_tools.jpg', caption: 'Developer Tools' },
      { file_name: 'bhaivibing_community.jpg', caption: 'Community' },
    ],
  },

  // LAUNCHING SOON VENTURES
  {
    name: 'Trucky',
    slug: 'trucky',
    category: 'Transport',
    location: 'Dhaka, Bangladesh (US Market)',
    story: `Trucky is set to revolutionize the US trucking industry with a comprehensive digital platform. With major industry-specific business potential and near-launch readiness, we're bringing innovation to logistics.

Focusing on the US market, Trucky addresses critical pain points in the trucking industry through technology-driven solutions.

Platform Features:
• Fleet management system
• Route optimization
• Load matching
• Driver communication
• Compliance tracking
• Payment processing

With US market focus and near-launch status, Trucky represents a significant opportunity in the logistics technology space.`,
    share_price: 45,
    total_shares: 8000,
    funding_mode: 'milestone' as const,
    milestone_target: 600000,
    revenue_monthly: 0,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'trucky_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'trucky_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'trucky_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'trucky_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'trucky_dashboard.jpg', caption: 'Trucky Dashboard', is_cover: true },
      { file_name: 'trucky_fleet.jpg', caption: 'Fleet Management' },
      { file_name: 'trucky_map.jpg', caption: 'Route Optimization' },
    ],
  },

  {
    name: 'Make Ally',
    slug: 'make-ally',
    category: 'Retail',
    location: 'Dhaka, Bangladesh (Global)',
    story: `Make Ally is a B2B/B2C marketplace platform prepared for public activation. With strong near-launch readiness, we're connecting buyers and sellers in innovative ways.

As a marketplace venture, Make Ally serves both business-to-business and business-to-consumer transactions, creating value for all participants in the ecosystem.

Marketplace Features:
• B2B and B2C transactions
• Advanced search and filtering
• Secure payment processing
• Seller verification system
• Buyer protection
• Analytics dashboard

Near-launch ready, Make Ally is poised to capture significant market share in the marketplace space.`,
    share_price: 30,
    total_shares: 20000,
    funding_mode: 'instant' as const,
    revenue_monthly: 0,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'makeally_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'makeally_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'makeally_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'makeally_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'makeally_marketplace.jpg', caption: 'Marketplace Interface', is_cover: true },
      { file_name: 'makeally_products.jpg', caption: 'Product Listings' },
      { file_name: 'makeally_sellers.jpg', caption: 'Seller Dashboard' },
    ],
  },

  {
    name: 'Level Up',
    slug: 'level-up',
    category: 'Technology',
    location: 'Dhaka, Bangladesh (Global)',
    story: `Level Up is a next-generation CRM SaaS designed for efficiency and affordability. Built for businesses that need powerful customer relationship management without complexity, we're launching soon.

Level Up addresses the gap between expensive enterprise CRM solutions and inadequate free tools, offering a balanced approach to customer relationship management.

CRM Features:
• Contact management
• Sales pipeline tracking
• Email integration
• Task management
• Reporting and analytics
• Mobile accessibility
• Affordable pricing

Near-launch and built for efficiency, Level Up is the CRM solution businesses have been waiting for.`,
    share_price: 40,
    total_shares: 15000,
    funding_mode: 'milestone' as const,
    milestone_target: 450000,
    revenue_monthly: 0,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'levelup_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'levelup_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'levelup_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'levelup_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'levelup_crm.jpg', caption: 'CRM Dashboard', is_cover: true },
      { file_name: 'levelup_pipeline.jpg', caption: 'Sales Pipeline' },
      { file_name: 'levelup_analytics.jpg', caption: 'Analytics' },
    ],
  },

  {
    name: 'Bongo Vogue',
    slug: 'bongo-vogue',
    category: 'Technology',
    location: 'Dhaka, Bangladesh',
    story: `Bongo Vogue is undergoing a premium technical identity relaunch. This coding-rooted brand is being repositioned with modern aesthetics and enhanced market positioning.

As a brand venture in the technology space, Bongo Vogue combines technical expertise with premium branding to create a unique market position.

Brand Elements:
• Premium technical identity
• Modern design aesthetics
• Coding-rooted positioning
• Enhanced market presence
• Strategic relaunch

With relaunch prepped and ready, Bongo Vogue is set to make a strong market entry.`,
    share_price: 25,
    total_shares: 10000,
    funding_mode: 'instant' as const,
    revenue_monthly: 0,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'bongovogue_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'bongovogue_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'bongovogue_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'bongovogue_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'bongovogue_brand.jpg', caption: 'Brand Identity', is_cover: true },
      { file_name: 'bongovogue_design.jpg', caption: 'Design System' },
      { file_name: 'bongovogue_marketing.jpg', caption: 'Marketing Materials' },
    ],
  },

  {
    name: 'MOONoPoly',
    slug: 'moonoPoly',
    category: 'Services',
    location: 'Dhaka, Bangladesh',
    story: `MOONoPoly is an entertainment venture combining gaming with commercial structure. Under active development, we're creating engaging experiences with sustainable business models.

As a gaming venture, MOONoPoly focuses on creating entertaining experiences while maintaining strong commercial viability.

Gaming Features:
• Engaging gameplay mechanics
• Commercial structure
• Active development
• Entertainment focus
• Sustainable monetization

Under active development, MOONoPoly is building the future of entertainment.`,
    share_price: 20,
    total_shares: 30000,
    funding_mode: 'milestone' as const,
    milestone_target: 300000,
    revenue_monthly: 0,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'moonopoly_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'moonopoly_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'moonopoly_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'moonopoly_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'moonopoly_game.jpg', caption: 'Game Interface', is_cover: true },
      { file_name: 'moonopoly_gameplay.jpg', caption: 'Gameplay' },
      { file_name: 'moonopoly_features.jpg', caption: 'Features' },
    ],
  },

  // IN PROGRESS VENTURES
  {
    name: 'Alore-Via',
    slug: 'alore-via',
    category: 'Services',
    location: 'Dhaka, Bangladesh',
    story: `Alore-Via is building a comprehensive wellness brand spanning toilet care and cosmetics. With early sales history and current active build, we're creating premium consumer products.

As a wellness venture, Alore-Via focuses on creating high-quality consumer products in the wellness and personal care space.

Product Lines:
• Toilet care products
• Cosmetics and beauty
• Wellness items
• Premium quality focus
• Early sales traction

With early sales history and active development, Alore-Via is building a strong consumer brand.`,
    share_price: 30,
    total_shares: 12000,
    funding_mode: 'instant' as const,
    revenue_monthly: 5000,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'alorevia_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'alorevia_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'alorevia_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'alorevia_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'alorevia_products.jpg', caption: 'Product Line', is_cover: true },
      { file_name: 'alorevia_packaging.jpg', caption: 'Packaging' },
      { file_name: 'alorevia_brand.jpg', caption: 'Brand' },
    ],
  },

  {
    name: 'Mamonaa',
    slug: 'mamonaa',
    category: 'Finance',
    location: 'Dhaka, Bangladesh',
    story: `Mamonaa is the FinTech layer of the Freakin ecosystem. This finance-grade product is under active development, bringing innovative financial solutions to the market.

As a FinTech venture, Mamonaa focuses on creating accessible, innovative financial products and services.

FinTech Features:
• Innovative financial products
• Finance-grade security
• Active development
• Ecosystem integration
• Market-ready solutions

Under active development, Mamonaa is building the future of financial technology.`,
    share_price: 50,
    total_shares: 10000,
    funding_mode: 'milestone' as const,
    milestone_target: 500000,
    revenue_monthly: 0,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'mamonaa_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'mamonaa_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'mamonaa_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'mamonaa_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'mamonaa_platform.jpg', caption: 'FinTech Platform', is_cover: true },
      { file_name: 'mamonaa_products.jpg', caption: 'Financial Products' },
      { file_name: 'mamonaa_security.jpg', caption: 'Security' },
    ],
  },

  {
    name: 'Absolute Cinema',
    slug: 'absolute-cinema',
    category: 'Services',
    location: 'Dhaka, Bangladesh',
    story: `Absolute Cinema is a premium content platform with cinematic positioning. In early preparation stages, we're building a creative media venture for premium content delivery.

As a media venture, Absolute Cinema focuses on delivering high-quality, premium content with a cinematic approach.

Media Features:
• Premium content delivery
• Cinematic positioning
• Creative focus
• Early stage development
• Quality-first approach

In early preparation, Absolute Cinema is crafting the future of premium media content.`,
    share_price: 25,
    total_shares: 15000,
    funding_mode: 'instant' as const,
    revenue_monthly: 0,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'absolutecinema_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'absolutecinema_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'absolutecinema_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'absolutecinema_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'absolutecinema_content.jpg', caption: 'Content Platform', is_cover: true },
      { file_name: 'absolutecinema_cinema.jpg', caption: 'Cinematic Approach' },
      { file_name: 'absolutecinema_premium.jpg', caption: 'Premium Quality' },
    ],
  },

  {
    name: 'Kaamlaa.shop',
    slug: 'kaamlaa-shop',
    category: 'Technology',
    location: 'Dhaka, Bangladesh (Global)',
    story: `Kaamlaa.shop is pioneering AI-agent marketplace from Bangladesh. Starting with Agent Hamuudi (social media manager), we're expanding to serve BD, US, and global markets with intelligent automation.

As an AI agents venture, Kaamlaa.shop is at the forefront of the AI agent revolution, creating intelligent automation solutions for businesses worldwide.

AI Agent Features:
• Agent Hamuudi (flagship social media manager)
• AI-powered automation
• Marketplace model
• BD, US, and global markets
• Intelligent agents

Starting with Agent Hamuudi and expanding, Kaamlaa.shop is building the future of AI-powered business automation.`,
    share_price: 45,
    total_shares: 8000,
    funding_mode: 'milestone' as const,
    milestone_target: 700000,
    revenue_monthly: 0,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'kaamlaa_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'kaamlaa_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'kaamlaa_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'kaamlaa_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'kaamlaa_agents.jpg', caption: 'AI Agents', is_cover: true },
      { file_name: 'kaamlaa_hamuudi.jpg', caption: 'Agent Hamuudi' },
      { file_name: 'kaamlaa_marketplace.jpg', caption: 'Marketplace' },
    ],
  },

  {
    name: 'Prompt Dao',
    slug: 'prompt-dao',
    category: 'Technology',
    location: 'Dhaka, Bangladesh (Global)',
    story: `Prompt Dao is a future-facing venture exploring the intersection of AI prompts, community building, and coordination systems. In formation stage, we're shaping the future of AI collaboration.

As an AI/community venture, Prompt Dao is exploring new paradigms for human-AI collaboration and community-driven AI development.

Platform Vision:
• AI prompt engineering
• Community coordination
• Collaborative AI development
• Future-facing approach
• Formation stage

In formation, Prompt Dao is building the future of AI community and collaboration.`,
    share_price: 35,
    total_shares: 12000,
    funding_mode: 'instant' as const,
    revenue_monthly: 0,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'promptdao_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'promptdao_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'promptdao_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'promptdao_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'promptdao_platform.jpg', caption: 'Platform Vision', is_cover: true },
      { file_name: 'promptdao_community.jpg', caption: 'Community' },
      { file_name: 'promptdao_ai.jpg', caption: 'AI Integration' },
    ],
  },

  // PAUSED VENTURE
  {
    name: 'Online New Market',
    slug: 'online-new-market',
    category: 'Retail',
    location: 'Dhaka, Bangladesh',
    story: `Online New Market is a retail platform with proven sales traction. Currently paused for technical repairs and improvements, we're preparing for a strong return to market.

As a retail venture with prior success, Online New Market has demonstrated market viability and is being enhanced for a stronger comeback.

Platform Features:
• E-commerce retail platform
• Proven sales traction
• Technical improvements in progress
• Strong return planned
• Market-tested model

Currently paused for improvements, Online New Market is preparing for a powerful market return.`,
    share_price: 20,
    total_shares: 25000,
    funding_mode: 'instant' as const,
    revenue_monthly: 0,
    status: 'pending' as const,
    documents: [
      { doc_type: 'nid_front', file_name: 'onlinenewmarket_nid_front.jpg' },
      { doc_type: 'nid_back', file_name: 'onlinenewmarket_nid_back.jpg' },
      { doc_type: 'trade_license', file_name: 'onlinenewmarket_trade_license.pdf' },
      { doc_type: 'utility_bill', file_name: 'onlinenewmarket_utility_bill.jpg' },
    ],
    photos: [
      { file_name: 'onlinenewmarket_platform.jpg', caption: 'Retail Platform', is_cover: true },
      { file_name: 'onlinenewmarket_products.jpg', caption: 'Products' },
      { file_name: 'onlinenewmarket_sales.jpg', caption: 'Sales Traction' },
    ],
  },
];

/**
 * Initialize Freakin Studio in the platform
 * This function creates the founder account and all ventures
 */
export function initializeFreakinStudio() {
  console.log('🚀 Initializing Freakin Studio Venture Ecosystem...');

  // Step 1: Create founder account
  const demoStore = useDemoStore.getState();
  const existingFounder = demoStore.findByPhone(FREAKIN_FOUNDER.phone);
  
  if (!existingFounder) {
    demoStore.addUser(FREAKIN_FOUNDER);
    console.log('✅ Founder account created: BhaiSazzaD');
  } else {
    console.log('ℹ️ Founder account already exists');
  }

  // Step 2: Create all ventures
  const businessStore = useBusinessStore.getState();
  let createdCount = 0;

  FREAKIN_VENTURES.forEach((venture) => {
    // Ensure all photos have is_cover property
    const normalizedPhotos = venture.photos.map((photo, index) => ({
      file_name: photo.file_name,
      caption: photo.caption,
      is_cover: photo.is_cover ?? (index === 0),
    }));

    const result = businessStore.createBusiness({
      name: venture.name,
      category: venture.category,
      location: venture.location,
      story: venture.story,
      share_price: venture.share_price,
      total_shares: venture.total_shares,
      funding_mode: venture.funding_mode,
      milestone_target: venture.milestone_target,
      revenue_monthly: venture.revenue_monthly,
      documents: venture.documents,
      photos: normalizedPhotos,
    });

    if (result.success) {
      createdCount++;
      console.log(`✅ Created venture: ${venture.name}`);
    } else {
      console.error(`❌ Failed to create venture: ${venture.name} - ${result.error}`);
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Total ventures: ${FREAKIN_VENTURES.length}`);
  console.log(`   Successfully created: ${createdCount}`);
  console.log(`   Failed: ${FREAKIN_VENTURES.length - createdCount}`);

  // Step 3: Create initial updates for live ventures
  const liveVentures = FREAKIN_VENTURES.filter(v => 
    v.revenue_monthly > 0
  );

  console.log(`\n📝 Creating initial updates for ${liveVentures.length} live ventures...`);
  
  liveVentures.forEach((venture) => {
    const business = businessStore.getBusinessBySlug(venture.slug);
    if (business) {
      businessStore.postUpdate(business.id, {
        title: 'Welcome to Capital De Benchmark!',
        body: `We're excited to announce that ${venture.name} is now live on Capital De Benchmark! Join us on this journey as we build the future together. Invest today and be part of our growth story.`,
      });
      console.log(`✅ Created update for: ${venture.name}`);
    }
  });

  console.log('\n🎉 Freakin Studio ecosystem initialization complete!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Admin verification required for all ventures');
  console.log('   2. Upload actual business documents');
  console.log('   3. Add real photos and media');
  console.log('   4. Configure payment gateway for investments');
  console.log('   5. Launch marketing campaign');

  return {
    founder: FREAKIN_FOUNDER,
    ventures: FREAKIN_VENTURES,
    created: createdCount,
    total: FREAKIN_VENTURES.length,
  };
}

/**
 * Get Freakin Studio ecosystem statistics
 */
export function getFreakinStats() {
  const businessStore = useBusinessStore.getState();
  const freakinBusinesses = businessStore.businesses.filter(
    b => b.owner_id === FREAKIN_FOUNDER.id
  );

  const liveVentures = freakinBusinesses.filter(b => b.revenue_monthly > 0);
  const totalRaised = freakinBusinesses.reduce((sum, b) => sum + b.total_raised, 0);
  
  // Note: Investment tracking would require integration with investment store
  const totalInvestors = 0; // Placeholder - would need investment store integration

  return {
    totalVentures: freakinBusinesses.length,
    liveVentures: liveVentures.length,
    totalRaised,
    totalInvestors,
    industries: new Set(freakinBusinesses.map(b => b.category)).size,
  };
}

// Development mode check
const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
if (isDev) {
  console.log('🔧 Development mode: Freakin Studio auto-initialization available');
  console.log('   Run: initializeFreakinStudio() to populate the platform');
}
