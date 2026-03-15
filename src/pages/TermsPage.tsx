import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-5 pt-12 pb-32">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-12"
        >
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full border border-border/50 bg-card flex items-center justify-center hover:bg-muted transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight text-foreground">Terms & Conditions</h1>
            <p className="text-muted-foreground mt-1">Last Updated: March 2026</p>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-p:text-muted-foreground prose-li:text-muted-foreground max-w-none bg-card p-6 md:p-10 rounded-3xl border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8 bg-primary/10 p-4 rounded-2xl border border-primary/20">
             <Shield className="w-6 h-6 text-primary shrink-0" />
             <p className="text-sm font-semibold text-primary m-0">
               Welcome to Qivaro! Please read these terms carefully before using our platform.
             </p>
          </div>

          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using the Qivaro app ("Platform"), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the Platform. The Platform is intended for university students, faculty, and authorized campus personnel.
          </p>

          <h3>2. User Accounts & Identity</h3>
          <p>
            To use the Platform, you must register for an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information during registration.</li>
            <li>Maintain the security of your password and identification.</li>
            <li>Provide valid ID proof (Aadhar/PAN/Student ID) when required to verify your identity.</li>
            <li>Accept full responsibility for all activities that occur under your account.</li>
          </ul>

          <h3>3. Acceptable Use Policy</h3>
          <p>
            The Platform is explicitly designed for reporting lost and found items on campus. You agree not to:
          </p>
          <ul>
            <li>Post false, misleading, or fraudulent reports.</li>
            <li>Use the platform for selling items, advertising, or spam.</li>
            <li>Harass, abuse, or harm other users of the platform.</li>
            <li>Attempt to claim an item that does not rightfully belong to you.</li>
          </ul>
          <p>
            <strong>Violation of these rules may result in immediate account suspension and a report to university authorities.</strong>
          </p>

          <h3>4. Item Handover & Safety</h3>
          <p>
            Qivaro facilitates communication between users but is not responsible for the physical handover of items. When meeting to exchange an item, we strongly advise you to:
          </p>
          <ul>
            <li>Meet in a public, well-lit campus location (e.g., library, student center, or campus security office).</li>
            <li>Verify the identity of the person claiming the item using their university ID.</li>
            <li>Never exchange money or rewards unless privately agreed outside the purview of this platform.</li>
          </ul>

          <h3>5. Privacy & Data Protection</h3>
          <p>
            Your privacy is important to us. Information you provide is governed by our Privacy Policy. By using the Platform, you consent to the collection and use of your data, including your uploaded identity documents which are securely stored and solely used for verification purposes.
          </p>

          <h3>6. Modifications to Terms</h3>
          <p>
            Qivaro reserves the right to modify or replace these Terms at any time. We will provide notice of significant changes. Your continued use of the Platform after any changes constitutes acceptance of the new Terms.
          </p>

          <hr className="my-8 opacity-20" />

          <p className="text-xs text-center">
            If you have any questions about these Terms, please contact campus security or the Qivaro admin team.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
