import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { AuthProvider } from "@/lib/AuthContext";
import { RequireAdmin, RequireAuth } from "@/components/auth/RouteGuards";

import Home from "@/pages/Home";
import JakFunguje from "@/pages/JakFunguje";
import Pilot from "@/pages/Pilot";
import Partner from "@/pages/Partner";
import ProgramDetail from "@/pages/ProgramDetail";
import Join from "@/pages/Join";
import Contact from "@/pages/Contact";
import PublicInfoPage from "@/pages/PublicInfoPage";
import Login from "@/pages/Login";
import AdminLogin from "@/pages/AdminLogin";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import PageNotFound from "@/pages/PageNotFound";

import MemberLayout from "@/layouts/MemberLayout";
import SchoolHub from "@/pages/SchoolHub";
import SchoolRunDetail from "@/pages/SchoolRunDetail";
import SchoolChallengeWorkspace from "@/pages/SchoolChallengeWorkspace";
import FamilyHub from "@/pages/FamilyHub";
import PartnerWorkspace from "@/pages/PartnerWorkspace";
import Portfolio from "@/pages/Portfolio";
import Profile from "@/pages/Profile";

import AdminLayout from "@/layouts/AdminLayout";
import AdminReporting from "@/pages/AdminReporting";
import AdminPrograms from "@/pages/AdminPrograms";
import AdminMissions from "@/pages/AdminMissions";
import AdminPartnerChallenges from "@/pages/AdminPartnerChallenges";
import AdminUsers from "@/pages/AdminUsers";
import AdminTeams from "@/pages/AdminTeams";
import AdminProjects from "@/pages/AdminProjects";
import AdminOrganizations from "@/pages/AdminOrganizations";
import AdminModeration from "@/pages/AdminModeration";
import AdminSecurity from "@/pages/AdminSecurity";

const PilotRedirect = () => <Navigate to="/skola" replace />;

export default function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jak-funguje" element={<JakFunguje />} />
            <Route path="/pilot" element={<Pilot />} />
            <Route path="/partneri" element={<Partner />} />
            <Route path="/program/:id" element={<ProgramDetail />} />
            <Route path="/zapojit-se" element={<Join />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/o-projektu" element={<PublicInfoPage kind="about" />} />
            <Route path="/soukromi" element={<PublicInfoPage kind="privacy" />} />
            <Route path="/bezpecnost" element={<PublicInfoPage kind="safety" />} />
            <Route path="/podminky" element={<PublicInfoPage kind="terms" />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<RequireAuth><MemberLayout /></RequireAuth>}>
              <Route path="/skola" element={<SchoolHub />} />
              <Route path="/skola/mise/:runId" element={<SchoolRunDetail />} />
              <Route path="/skola/challenges" element={<SchoolChallengeWorkspace />} />
              <Route path="/rodina" element={<FamilyHub />} />
              <Route path="/partner-workspace" element={<PartnerWorkspace />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/profil" element={<Profile />} />

              {/* Prototype member surfaces stay in the repository but are fail-closed from the pilot UI. */}
              <Route path="/dashboard" element={<PilotRedirect />} />
              <Route path="/mise" element={<PilotRedirect />} />
              <Route path="/mise/:id" element={<PilotRedirect />} />
              <Route path="/rozvoj" element={<PilotRedirect />} />
              <Route path="/projekty" element={<PilotRedirect />} />
              <Route path="/projekt/:id" element={<PilotRedirect />} />
              <Route path="/sit" element={<PilotRedirect />} />
              <Route path="/udalosti" element={<PilotRedirect />} />
              <Route path="/zpravy" element={<PilotRedirect />} />
            </Route>

            <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route index element={<AdminReporting />} />
              <Route path="programy" element={<AdminPrograms />} />
              <Route path="mise" element={<AdminMissions />} />
              <Route path="challenges" element={<AdminPartnerChallenges />} />
              <Route path="uzivatele" element={<AdminUsers />} />
              <Route path="tymy" element={<AdminTeams />} />
              <Route path="projekty" element={<AdminProjects />} />
              <Route path="organizace" element={<AdminOrganizations />} />
              <Route path="moderace" element={<AdminModeration />} />
              <Route path="bezpecnost" element={<AdminSecurity />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
