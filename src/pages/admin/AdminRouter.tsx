

import { Routes, Route, Navigate } from "react-router-dom";
import { AdminDashboardOverview } from "./AdminDashboardOverview";
import AdminUsers from "./AdminUsers";
import AdminRequests from "./AdminRequests";
import AdminOffers from "./AdminOffers";
import AdminProjects from "./AdminProjects";
import { AdminOrders } from "./AdminOrders";
import FinancialTransactions from "./FinancialTransactions";
import { AdminSupport } from "./AdminSupport";
import { ExpertConsultations } from "./ExpertConsultations";
import AdminCategoryManagement from "./CategoryManagement";
import { AdminVerificationQueue } from "./AdminVerificationQueue";
import { AdminAnalytics } from "./AdminAnalytics";

export const AdminRouter = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboardOverview />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="requests" element={<AdminRequests />} />
      <Route path="offers" element={<AdminOffers />} />
      <Route path="projects" element={<AdminProjects />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="financial-transactions" element={<FinancialTransactions />} />
      <Route path="support" element={<AdminSupport />} />
      <Route path="content/consultations" element={<ExpertConsultations />} />
      <Route path="category-management" element={<AdminCategoryManagement />} />
      <Route path="verification" element={<AdminVerificationQueue />} />
      <Route path="analytics" element={<AdminAnalytics />} />
    </Routes>
  );
};

