/**
 * Freakin Studio Ventures - Individual Verification
 * 
 * This script verifies all 17 ventures are properly configured
 */

import { useBusinessStore } from '../lib/services/business';
import { useDemoStore } from '../store';

export interface VentureVerification {
  name: string;
  slug: string;
  category: string;
  status: '✅ PASS' | '❌ FAIL' | '⚠️ WARNING';
  issues: string[];
  sharePrice: number;
  totalShares: number;
  fundingMode: string;
  milestoneTarget?: number;
  revenue: number;
  hasDocuments: boolean;
  hasPhotos: boolean;
  hasStory: boolean;
}

export function verifyAllVentures(): VentureVerification[] {
  const businessStore = useBusinessStore.getState();
  const founderId = 'freakin-studio-founder-001';
  
  const freakinVentures = businessStore.businesses.filter(
    b => b.owner_id === founderId
  );

  const verifications: VentureVerification[] = [];

  // Expected ventures
  const expectedVentures = [
    'Hoooplaaa',
    'DhandaBuzz',
    'GURUsphere Lab',
    'Freakin SI',
    'AI Shala',
    'BhaiVibing',
    'Trucky',
    'Make Ally',
    'Level Up',
    'Bongo Vogue',
    'MOONoPoly',
    'Alore-Via',
    'Mamonaa',
    'Absolute Cinema',
    'Kaamlaa.shop',
    'Prompt Dao',
    'Online New Market',
  ];

  for (const ventureName of expectedVentures) {
    const venture = freakinVentures.find(v => v.name === ventureName);
    
    if (!venture) {
      verifications.push({
        name: ventureName,
        slug: 'N/A',
        category: 'N/A',
        status: '❌ FAIL',
        issues: ['Venture not found in database'],
        sharePrice: 0,
        totalShares: 0,
        fundingMode: 'N/A',
        revenue: 0,
        hasDocuments: false,
        hasPhotos: false,
        hasStory: false,
      });
      continue;
    }

    const issues: string[] = [];
    let status: '✅ PASS' | '❌ FAIL' | '⚠️ WARNING' = '✅ PASS';

    // Check basic data
    if (!venture.name || venture.name.length < 3) {
      issues.push('Invalid name');
      status = '❌ FAIL';
    }

    if (!venture.slug) {
      issues.push('Missing slug');
      status = '❌ FAIL';
    }

    if (!venture.category) {
      issues.push('Missing category');
      status = '❌ FAIL';
    }

    if (!venture.story || venture.story.length < 100) {
      issues.push('Story too short or missing');
      status = '⚠️ WARNING';
    }

    if (venture.share_price < 5) {
      issues.push('Share price below minimum (৳5)');
      status = '❌ FAIL';
    }

    if (venture.total_shares < 100) {
      issues.push('Total shares below minimum (100)');
      status = '❌ FAIL';
    }

    if (venture.funding_mode === 'milestone' && !venture.milestone_target) {
      issues.push('Milestone target missing for milestone funding');
      status = '❌ FAIL';
    }

    // Check documents and photos
    const documents = businessStore.documents.filter(d => d.business_id === venture.id);
    const photos = businessStore.photos.filter(p => p.business_id === venture.id);

    const hasDocuments = documents.length >= 4;
    const hasPhotos = photos.length >= 2;

    if (!hasDocuments) {
      issues.push(`Only ${documents.length}/4 required documents`);
      status = status === '✅ PASS' ? '⚠️ WARNING' : status;
    }

    if (!hasPhotos) {
      issues.push(`Only ${photos.length}/2 required photos`);
      status = status === '✅ PASS' ? '⚠️ WARNING' : status;
    }

    verifications.push({
      name: venture.name,
      slug: venture.slug,
      category: venture.category,
      status,
      issues,
      sharePrice: venture.share_price,
      totalShares: venture.total_shares,
      fundingMode: venture.funding_mode,
      milestoneTarget: venture.milestone_target,
      revenue: venture.revenue_monthly,
      hasDocuments,
      hasPhotos,
      hasStory: venture.story.length >= 100,
    });
  }

  return verifications;
}

export function printVerificationReport() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 FREAKIN STUDIO VENTURES VERIFICATION REPORT');
  console.log('='.repeat(80) + '\n');

  const verifications = verifyAllVentures();
  
  let passCount = 0;
  let failCount = 0;
  let warningCount = 0;

  for (const v of verifications) {
    const icon = v.status === '✅ PASS' ? '✅' : v.status === '❌ FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${v.name}`);
    console.log(`   Slug: /biz/${v.slug}`);
    console.log(`   Category: ${v.category}`);
    console.log(`   Share Price: ৳${v.sharePrice}`);
    console.log(`   Total Shares: ${v.totalShares.toLocaleString()}`);
    console.log(`   Funding: ${v.fundingMode}${v.milestoneTarget ? ` (Target: ৳${v.milestoneTarget.toLocaleString()})` : ''}`);
    console.log(`   Revenue: ৳${v.revenue.toLocaleString()}/month`);
    console.log(`   Documents: ${v.hasDocuments ? '✅' : '❌'} | Photos: ${v.hasPhotos ? '✅' : '❌'} | Story: ${v.hasStory ? '✅' : '❌'}`);
    
    if (v.issues.length > 0) {
      console.log(`   Issues:`);
      v.issues.forEach(issue => console.log(`     - ${issue}`));
    }
    
    console.log('');

    if (v.status === '✅ PASS') passCount++;
    else if (v.status === '❌ FAIL') failCount++;
    else warningCount++;
  }

  console.log('='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Ventures: ${verifications.length}`);
  console.log(`✅ Passed: ${passCount}`);
  console.log(`⚠️ Warnings: ${warningCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`Success Rate: ${((passCount / verifications.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(80) + '\n');

  return { passCount, failCount, warningCount, total: verifications.length };
}

// Auto-run if called directly
if (typeof window !== 'undefined') {
  console.log('🔍 Running venture verification...');
  printVerificationReport();
}
