import { Route, Routes } from "react-router-dom";

import NewCampaign from "./components/layout/campaigns/CampaignBuilder";
import CampaignList from "./components/layout/campaigns/CampaignList";

import DashboardLayout from "./components/layout/DashboardLayout";

import Login from "./components/layout/auth/Login";
import BulkEmailSender from "./components/layout/EmailSender/EmailSender";
import WhatsAppSettings from "./components/layout/settings/WhatsAppSettings";
import WhatsAppMessenger from "./components/layout/WhatsAppMessenger/WhatsAppMessenger";
import { AuthProvider } from "./contexts/AuthContext";

import DepartmentDashboard from "./components/layout/dashboardPG";
import CardListing from "./components/layout/Masters/listing";
import CertificateListing from "./components/layout/certificate/certificateListing";
import FormsListing from "./components/layout/Forms/FormsListingPage";
import CertificateOfOriginInput from "./components/layout/certificate/orgin";
import ExportersMaster from "./components/layout/Masters/exporter";
import PartyMaster from "./components/layout/Masters/Party";
import OnboardingForm from "./components/layout/Masters/onBoarding";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DepartmentDashboard />} />
          <Route path="CardListing" element={<CardListing />} />
          <Route path="certificateListing" element={<CertificateListing />} />
          <Route path="formsListing" element={<FormsListing />} />
          <Route path="orgin" element={<CertificateOfOriginInput />} />
          <Route path="EmailSender" element={<BulkEmailSender />} />
          <Route path="settings" element={<WhatsAppSettings />} />
          <Route path="exporter" element={<ExportersMaster />} />
            <Route path="party" element={<PartyMaster />} />
            <Route path="onboarding" element={<OnboardingForm />} />
          {/* <Route path="dashboardPG" element={<DepartmentDashboard />} /> */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
