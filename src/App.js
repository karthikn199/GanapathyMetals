import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";

import Login from "./components/layout/auth/Login";
import BulkEmailSender from "./components/layout/EmailSender/EmailSender";
import WhatsAppSettings from "./components/layout/settings/WhatsAppSettings";

import { AuthProvider } from "./contexts/AuthContext";

import CertificateListing from "./components/layout/certificate/certificateListing";
import CertificateOfOriginInput from "./components/layout/certificate/orgin";
import FormsListing from "./components/layout/Forms/FormsListingPage";
import Invoice from "./components/layout/invoice/invoice";
import DashboardG from "./components/layout/Masters/DashboardG";
import ExportersMaster from "./components/layout/Masters/exporter";
import CardListing from "./components/layout/Masters/listing";
import OnboardingForm from "./components/layout/Masters/onBoarding";
import PartyMaster from "./components/layout/Masters/Party";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<DashboardLayout />}>
          {/* <Route index element={<DepartmentDashboard />} /> */}
          <Route path="CardListing" element={<CardListing />} />
          <Route path="certificateListing" element={<CertificateListing />} />
          <Route path="formsListing" element={<FormsListing />} />
          <Route path="orgin" element={<CertificateOfOriginInput />} />
          <Route path="EmailSender" element={<BulkEmailSender />} />
          <Route path="settings" element={<WhatsAppSettings />} />
          <Route path="exporter" element={<ExportersMaster />} />
          <Route path="party" element={<PartyMaster />} />
          <Route path="onboarding" element={<OnboardingForm />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="dashboardG" element={<DashboardG />} />
          {/* <Route path="dashboardPG" element={<DepartmentDashboard />} /> */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
