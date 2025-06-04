"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Mail,
  Phone,
  MapPin,
  Scale,
  ChevronDown,
  FileText,
  Users,
  Shield,
  AlertTriangle,
  Gavel,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-[#A50034]/5 to-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Scale className="h-8 w-8 text-[#A50034]" />
              <Badge
                variant="secondary"
                className="bg-[#A50034]/10 text-[#A50034] border-[#A50034]/20"
              >
                Legal Terms
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These terms govern your use of Klassiko&rsquo;s educational platform.
              Please read them carefully before using our services.
            </p>
            <div className="text-sm text-gray-500">
              <p>
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Table of Contents */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Table of Contents
                    </h3>
                    <nav className="space-y-2">
                      <a
                        href="#acceptance"
                        className="block text-sm text-gray-600 hover:text-[#A50034] transition-colors"
                      >
                        1. Acceptance of Terms
                      </a>
                      <a
                        href="#eligibility"
                        className="block text-sm text-gray-600 hover:text-[#A50034] transition-colors"
                      >
                        2. Eligibility & Registration
                      </a>
                      <a
                        href="#use-of-service"
                        className="block text-sm text-gray-600 hover:text-[#A50034] transition-colors"
                      >
                        3. Use of the Service
                      </a>
                      <a
                        href="#intellectual-property"
                        className="block text-sm text-gray-600 hover:text-[#A50034] transition-colors"
                      >
                        4. Intellectual Property
                      </a>
                      <a
                        href="#restrictions"
                        className="block text-sm text-gray-600 hover:text-[#A50034] transition-colors"
                      >
                        5. Restrictions & Prohibited Use
                      </a>
                      <a
                        href="#termination"
                        className="block text-sm text-gray-600 hover:text-[#A50034] transition-colors"
                      >
                        6. Termination of Access
                      </a>
                      <a
                        href="#liability"
                        className="block text-sm text-gray-600 hover:text-[#A50034] transition-colors"
                      >
                        7. Limitation of Liability
                      </a>
                      <a
                        href="#governing-law"
                        className="block text-sm text-gray-600 hover:text-[#A50034] transition-colors"
                      >
                        8. Governing Law
                      </a>
                      <a
                        href="#changes"
                        className="block text-sm text-gray-600 hover:text-[#A50034] transition-colors"
                      >
                        9. Changes to Terms
                      </a>
                      <a
                        href="#contact"
                        className="block text-sm text-gray-600 hover:text-[#A50034] transition-colors"
                      >
                        10. Contact Information
                      </a>
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* Acceptance of Terms */}
                <CollapsibleSection
                  id="acceptance"
                  title="1. Acceptance of Terms"
                  icon={<FileText className="h-6 w-6" />}
                >
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      By accessing or using Klassiko (the Service), you agree
                      to be bound by these Terms and Conditions (Terms). If
                      you disagree with any part of these terms, then you may
                      not access the Service.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      These Terms apply to all visitors, users, and others who
                      access or use the Service, including but not limited to:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>
                        Educational institutions (schools, colleges, coaching
                        institutes)
                      </li>
                      <li>Teachers and educators</li>
                      <li>Students and learners</li>
                      <li>Administrative staff and institutional users</li>
                    </ul>
                    <div className="bg-[#A50034]/5 border border-[#A50034]/20 rounded-lg p-4">
                      <p className="text-gray-700 text-sm">
                        <strong>Important:</strong> By creating an account or
                        using our services, you acknowledge that you have read,
                        understood, and agree to be bound by these Terms and our
                        Privacy Policy.
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Eligibility and Registration */}
                <CollapsibleSection
                  id="eligibility"
                  title="2. Eligibility and Account Registration"
                  icon={<Users className="h-6 w-6" />}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Eligibility Requirements
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        To use Klassiko, you must meet the following
                        requirements:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>
                          Be at least 13 years of age, or have parental/guardian
                          consent if under 18
                        </li>
                        <li>
                          Be affiliated with a legitimate educational
                          institution (for institutional accounts)
                        </li>
                        <li>
                          Provide accurate and complete registration information
                        </li>
                        <li>
                          Have the legal authority to enter into these Terms
                        </li>
                        <li>
                          Not be prohibited from using the Service under
                          applicable laws
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Account Registration
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        When you create an account with us, you must provide
                        information that is accurate, complete, and current at
                        all times. You are responsible for:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>
                          Safeguarding your password and account credentials
                        </li>
                        <li>All activities that occur under your account</li>
                        <li>
                          Immediately notifying us of any unauthorized use of
                          your account
                        </li>
                        <li>
                          Ensuring your contact information remains current
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Institutional Accounts
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Educational institutions may create master accounts to
                        manage multiple user accounts. Institution
                        administrators are responsible for ensuring all users
                        under their account comply with these Terms and
                        applicable educational regulations.
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Use of Service */}
                <CollapsibleSection
                  id="use-of-service"
                  title="3. Use of the Service"
                  icon={<Shield className="h-6 w-6" />}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        General Use Guidelines
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        Klassiko is designed exclusively for legitimate
                        educational purposes. You agree to use the Service only
                        for lawful purposes and in accordance with these Terms.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="border-l-4 border-l-[#A50034] shadow-sm">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            👨‍🏫 Teachers & Educators
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Create and manage question banks</li>
                            <li>• Generate exam papers and quizzes</li>
                            <li>• Monitor student performance</li>
                            <li>• Export assessment data</li>
                            <li>• Manage class enrollments</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-[#A50034] shadow-sm">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            👨‍🎓 Students
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Take assigned quizzes and exams</li>
                            <li>• View performance results</li>
                            <li>• Access study materials</li>
                            <li>• Participate in class activities</li>
                            <li>• Communicate with teachers</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-[#A50034] shadow-sm">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            👨‍💼 Administrators
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Manage institutional accounts</li>
                            <li>• Oversee user permissions</li>
                            <li>• Generate institutional reports</li>
                            <li>• Configure system settings</li>
                            <li>• Monitor platform usage</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Academic Integrity
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        All users must maintain the highest standards of
                        academic integrity when using Klassiko:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>
                          Students must not engage in cheating, plagiarism, or
                          unauthorized collaboration
                        </li>
                        <li>
                          Teachers must ensure fair and unbiased assessment
                          practices
                        </li>
                        <li>
                          All content must be original or properly attributed
                        </li>
                        <li>
                          Sharing of exam content outside authorized channels is
                          prohibited
                        </li>
                      </ul>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Intellectual Property */}
                <CollapsibleSection
                  id="intellectual-property"
                  title="4. Intellectual Property Rights"
                  icon={<FileText className="h-6 w-6" />}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Klassiko&rsquo;s Intellectual Property
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        The Service and its original content, features, and
                        functionality are and will remain the exclusive property
                        of Klassiko and its licensors. The Service is protected
                        by copyright, trademark, and other laws.
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Platform software, design, and user interface</li>
                        <li>Klassiko trademarks, logos, and branding</li>
                        <li>Documentation and help materials</li>
                        <li>Algorithms and proprietary technology</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        User-Generated Content
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        You retain ownership of content you create using our
                        platform, including:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Question banks and exam papers you create</li>
                        <li>Educational materials and resources you upload</li>
                        <li>Student responses and assessment data</li>
                        <li>Custom templates and configurations</li>
                      </ul>
                      <p className="text-gray-700 leading-relaxed mt-3">
                        By using our Service, you grant Klassiko a limited,
                        non-exclusive license to host, store, and process your
                        content solely for the purpose of providing the Service
                        to you.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Third-Party Content
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Users are responsible for ensuring they have appropriate
                        rights to any third-party content they upload or use
                        within the platform. Klassiko is not responsible for
                        copyright infringement by users.
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Restrictions and Prohibited Use */}
                <CollapsibleSection
                  id="restrictions"
                  title="5. Restrictions and Prohibited Use"
                  icon={<AlertTriangle className="h-6 w-6" />}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Prohibited Activities
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        You may not use our Service for any unlawful purpose or
                        to solicit others to perform unlawful acts.
                        Specifically, you agree not to:
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          🚫 Technical Violations
                        </h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                          <li>
                            Attempt to gain unauthorized access to our systems
                          </li>
                          <li>Use automated tools to scrape or harvest data</li>
                          <li>Reverse engineer or decompile our software</li>
                          <li>Introduce viruses, malware, or harmful code</li>
                          <li>Overload our servers or infrastructure</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          📚 Academic Violations
                        </h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                          <li>Share exam content without authorization</li>
                          <li>Facilitate cheating or academic dishonesty</li>
                          <li>Impersonate other users or institutions</li>
                          <li>Upload copyrighted content without permission</li>
                          <li>Create fake accounts or manipulate data</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          ⚖️ Legal Violations
                        </h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                          <li>Violate any applicable laws or regulations</li>
                          <li>Infringe on intellectual property rights</li>
                          <li>Harass, threaten, or abuse other users</li>
                          <li>Distribute inappropriate or harmful content</li>
                          <li>Engage in fraudulent activities</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          🔒 Privacy Violations
                        </h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                          <li>Access other users&rsquo;s private information</li>
                          <li>
                            Share student data without proper authorization
                          </li>
                          <li>Violate FERPA or other privacy regulations</li>
                          <li>Collect personal information without consent</li>
                          <li>Use the platform for non-educational purposes</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm">
                        <strong>Warning:</strong> Violation of these
                        restrictions may result in immediate suspension or
                        termination of your account, and may be reported to
                        appropriate authorities if illegal activities are
                        suspected.
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Termination */}
                <CollapsibleSection
                  id="termination"
                  title="6. Termination of Access"
                  icon={<AlertTriangle className="h-6 w-6" />}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Termination by You
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        You may terminate your account at any time by:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>
                          Using the account deletion feature in your settings
                        </li>
                        <li>
                          Contacting our support team with a termination request
                        </li>
                        <li>
                          Ceasing to use the Service (inactive accounts may be
                          suspended)
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Termination by Klassiko
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        We may terminate or suspend your account immediately,
                        without prior notice or liability, for any reason,
                        including but not limited to:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Breach of these Terms and Conditions</li>
                        <li>Violation of applicable laws or regulations</li>
                        <li>Fraudulent, abusive, or harmful behavior</li>
                        <li>Non-payment of fees (for paid accounts)</li>
                        <li>Extended periods of inactivity</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Effect of Termination
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        Upon termination of your account:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>
                          Your right to use the Service will cease immediately
                        </li>
                        <li>
                          Your data may be deleted after a reasonable grace
                          period
                        </li>
                        <li>
                          You may request data export before account closure
                        </li>
                        <li>
                          Outstanding obligations and liabilities will survive
                          termination
                        </li>
                        <li>
                          Certain provisions of these Terms will remain in
                          effect
                        </li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>Data Retention:</strong> We will retain your
                        data for 30 days after account termination to allow for
                        potential reactivation. After this period, data will be
                        permanently deleted unless required by law to retain it
                        longer.
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Limitation of Liability */}
                <CollapsibleSection
                  id="liability"
                  title="7. Limitation of Liability"
                  icon={<Shield className="h-6 w-6" />}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Service Availability
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        While we strive to maintain high availability, Klassiko
                        is provided on an as is and as available basis. We
                        do not guarantee that:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>The Service will be uninterrupted or error-free</li>
                        <li>All data will be preserved without loss</li>
                        <li>
                          The Service will meet your specific requirements
                        </li>
                        <li>
                          Security measures will prevent all unauthorized access
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Limitation of Damages
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        To the maximum extent permitted by applicable law, in no
                        event shall Klassiko, its affiliates, agents, directors,
                        employees, suppliers, or licensors be liable for any
                        indirect, punitive, incidental, special, consequential,
                        or exemplary damages, including without limitation
                        damages for loss of profits, goodwill, use, data, or
                        other intangible losses.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Maximum Liability
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Our total liability to you for all damages, losses, and
                        causes of action (whether in contract, tort, or
                        otherwise) will not exceed the amount paid by you, if
                        any, for accessing the Service during the twelve (12)
                        months immediately preceding the event giving rise to
                        such liability.
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Educational Use:</strong> Users are responsible
                        for maintaining backup copies of important educational
                        content and ensuring compliance with their institution&rsquo;s
                        data retention policies.
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Governing Law */}
                <CollapsibleSection
                  id="governing-law"
                  title="8. Governing Law and Jurisdiction"
                  icon={<Gavel className="h-6 w-6" />}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Applicable Law
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        These Terms shall be interpreted and governed by the
                        laws of the State of California, United States, without
                        regard to its conflict of law provisions. Our failure to
                        enforce any right or provision of these Terms will not
                        be considered a waiver of those rights.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Dispute Resolution
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        Any disputes arising from these Terms or your use of the
                        Service will be resolved through:
                      </p>
                      <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                        <li>
                          <strong>Direct Communication:</strong> First, contact
                          our support team to resolve the issue informally
                        </li>
                        <li>
                          <strong>Mediation:</strong> If direct communication
                          fails, disputes may be submitted to mediation
                        </li>
                        <li>
                          <strong>Arbitration:</strong> Binding arbitration in
                          San Francisco, California, if mediation is
                          unsuccessful
                        </li>
                        <li>
                          <strong>Court Jurisdiction:</strong> Courts in San
                          Francisco, California have exclusive jurisdiction for
                          any remaining disputes
                        </li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        International Users
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        If you are accessing the Service from outside the United
                        States, you are responsible for compliance with local
                        laws. These Terms will still be governed by California
                        law, but local consumer protection laws may also apply.
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Changes to Terms */}
                <CollapsibleSection
                  id="changes"
                  title="9. Changes to Terms"
                  icon={<FileText className="h-6 w-6" />}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Modification Rights
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        We reserve the right, at our sole discretion, to modify
                        or replace these Terms at any time. Changes may be
                        necessary due to legal requirements, new features,
                        security updates, or business needs.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Notification Process
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        When we make changes to these Terms, we will:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>
                          Update the Last Modified date at the top of this
                          page
                        </li>
                        <li>
                          Send email notifications to all registered users
                        </li>
                        <li>Display prominent notices within the platform</li>
                        <li>
                          For material changes, provide at least 30 days advance
                          notice
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Your Options
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        If you disagree with any changes to these Terms, you
                        may:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>
                          Discontinue use of the Service before the changes take
                          effect
                        </li>
                        <li>
                          Close your account if you cannot accept the new terms
                        </li>
                        <li>Contact us to discuss specific concerns</li>
                      </ul>
                      <p className="text-gray-700 leading-relaxed mt-3">
                        Your continued use of the Service after any changes
                        indicates your acceptance of the new Terms.
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Contact Information */}
                <CollapsibleSection
                  id="contact"
                  title="10. Contact Information"
                  icon={<Mail className="h-6 w-6" />}
                >
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      If you have any questions about these Terms and
                      Conditions, please contact us using the information below:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Legal Department
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Mail className="h-5 w-5 text-[#A50034]" />
                              <span className="text-gray-700">
                                legal@klassiko.com
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Phone className="h-5 w-5 text-[#A50034]" />
                              <span className="text-gray-700">
                                +1 (555) 123-4567
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-5 w-5 text-[#A50034]" />
                              <span className="text-gray-700">
                                San Francisco, CA 94105
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            General Support
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Mail className="h-5 w-5 text-[#A50034]" />
                              <span className="text-gray-700">
                                support@klassiko.com
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Globe className="h-5 w-5 text-[#A50034]" />
                              <span className="text-gray-700">
                                www.klassiko.com/help
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-[#A50034]/5 border border-[#A50034]/20 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Response Time
                      </h3>
                      <p className="text-gray-700">
                        We aim to respond to all legal and terms-related
                        inquiries within 7 business days. For urgent matters,
                        please indicate the urgency in your subject line.
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Collapsible Section Component
function CollapsibleSection({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id={id}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto hover:bg-transparent"
            onClick={() => setIsOpen(!isOpen)}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#A50034] flex items-center">
              {icon}
              <span className="ml-3">{title}</span>
            </h2>
            <ChevronDown
              className={`h-6 w-6 text-[#A50034] transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-6">{children}</CollapsibleContent>
      </Collapsible>
      <Separator className="mt-8" />
    </section>
  );
}
