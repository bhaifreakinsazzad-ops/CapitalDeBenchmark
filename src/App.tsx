import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store';

// Layouts
import { TopBar } from './components/layout/top-bar';
import { BottomNav } from './components/layout/bottom-nav';
import { AdminSidebar } from './components/layout/admin-sidebar';
import { AnnouncementBanner } from './components/AnnouncementBanner';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { MarketPage } from './pages/MarketPage';
import { BusinessDetailPage } from './pages/BusinessDetailPage';
import { LearnPage } from './pages/LearnPage';
import { FeedPage } from './pages/FeedPage';
import { SearchPage } from './pages/SearchPage';
import { FounderProfilePage } from './pages/FounderProfilePage';

// App Pages
import { DashboardPage } from './pages/DashboardPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { WalletPage } from './pages/wallet/WalletPage';
import { RechargePage } from './pages/wallet/RechargePage';
import { WithdrawPage } from './pages/wallet/WithdrawPage';
import { KycPage } from './pages/wallet/KycPage';
import { MyBizPage } from './pages/MyBizPage';
import { NewBusinessPage } from './pages/mybiz/NewBusinessPage';
import { ManageBusinessPage } from './pages/mybiz/ManageBusinessPage';
import { PostUpdatePage } from './pages/mybiz/PostUpdatePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { InvestPage } from './pages/invest/InvestPage';
import { TradingPage } from './pages/TradingPage';
import { NotificationSettingsPage } from './pages/NotificationSettingsPage';

// Admin Pages
import {
  AdminOverviewPage,
  AdminVerifyPage,
  AdminKycPage,
  AdminUsersPage,
  AdminRechargePage,
  AdminWithdrawPage,
  AdminUpdatesPage,
  AdminAuditPage,
} from './pages/AdminPages';
import { AdminReleasePage } from './pages/AdminReleasePage';
import { AdminInvestmentsPage } from './pages/AdminInvestmentsPage';
import { AdminMilestonePage } from './pages/AdminMilestonePage';
import { AdminOrdersPage, AdminTradesPage, AdminMarketMakerPage } from './pages/AdminTradingPages';
import { AdminReportsPage, AdminCommentsPage, AdminAnnouncementsPage } from './pages/AdminSocialPages';

// Protected route for authenticated users
function AuthenticatedLayout() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AnnouncementBanner />
        </div>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

// Protected route for admin users
function AdminLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="md:hidden sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-line px-4 h-14 flex items-center">
          <div>
            <p className="text-sm font-bold text-brand-text">Capital De Benchmark</p>
            <p className="text-[10px] text-brand-muted">Admin Console</p>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function PublicLayout() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AnnouncementBanner />
      </div>
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/biz/:slug" element={<BusinessDetailPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/founder/:id" element={<FounderProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* Authenticated user routes */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/wallet/recharge" element={<RechargePage />} />
          <Route path="/wallet/withdraw" element={<WithdrawPage />} />
          <Route path="/wallet/kyc" element={<KycPage />} />
          <Route path="/mybiz" element={<MyBizPage />} />
          <Route path="/mybiz/new" element={<NewBusinessPage />} />
          <Route path="/mybiz/:id" element={<ManageBusinessPage />} />
          <Route path="/mybiz/:id/updates/new" element={<PostUpdatePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
          <Route path="/invest/:slug" element={<InvestPage />} />
          <Route path="/trade/:slug" element={<TradingPage />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminOverviewPage />} />
          <Route path="/admin/verify" element={<AdminVerifyPage />} />
          <Route path="/admin/kyc" element={<AdminKycPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/recharge" element={<AdminRechargePage />} />
          <Route path="/admin/withdraw" element={<AdminWithdrawPage />} />
          <Route path="/admin/release" element={<AdminReleasePage />} />
          <Route path="/admin/investments" element={<AdminInvestmentsPage />} />
          <Route path="/admin/milestone" element={<AdminMilestonePage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/trades" element={<AdminTradesPage />} />
          <Route path="/admin/market-maker" element={<AdminMarketMakerPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/comments" element={<AdminCommentsPage />} />
          <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
          <Route path="/admin/updates" element={<AdminUpdatesPage />} />
          <Route path="/admin/audit" element={<AdminAuditPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
