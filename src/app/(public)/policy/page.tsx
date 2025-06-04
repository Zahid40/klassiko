import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  Eye,
  Users,
  FileText,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-[#A50034]/5 to-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-[#A50034]" />
              <Badge
                variant="secondary"
                className="bg-[#A50034]/10 text-[#A50034] border-[#A50034]/20"
              >
                Privacy & Security
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
              Privacy Policy
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Your privacy and data security are fundamental to how we build and
              operate Klassiko. This policy explains how we collect, use, and
              protect your information.
            </p>
            <div className="text-sm text-neutral-500">
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
                    <h3 className="font-semibold text-neutral-900 mb-4">
                      Table of Contents
                    </h3>
                    <nav className="space-y-2">
                      <a
                        href="#introduction"
                        className="block text-sm text-neutral-600 hover:text-[#A50034] transition-colors"
                      >
                        1. Introduction
                      </a>
                      <a
                        href="#information-we-collect"
                        className="block text-sm text-neutral-600 hover:text-[#A50034] transition-colors"
                      >
                        2. Information We Collect
                      </a>
                      <a
                        href="#how-we-use-information"
                        className="block text-sm text-neutral-600 hover:text-[#A50034] transition-colors"
                      >
                        3. How We Use Your Information
                      </a>
                      <a
                        href="#data-storage-security"
                        className="block text-sm text-neutral-600 hover:text-[#A50034] transition-colors"
                      >
                        4. Data Storage & Security
                      </a>
                      <a
                        href="#cookies-tracking"
                        className="block text-sm text-neutral-600 hover:text-[#A50034] transition-colors"
                      >
                        5. Cookies & Tracking
                      </a>
                      <a
                        href="#third-party-services"
                        className="block text-sm text-neutral-600 hover:text-[#A50034] transition-colors"
                      >
                        6. Third-Party Services
                      </a>
                      <a
                        href="#user-rights"
                        className="block text-sm text-neutral-600 hover:text-[#A50034] transition-colors"
                      >
                        7. Your Rights
                      </a>
                      <a
                        href="#childrens-privacy"
                        className="block text-sm text-neutral-600 hover:text-[#A50034] transition-colors"
                      >
                        8. Children's Privacy
                      </a>
                      <a
                        href="#policy-changes"
                        className="block text-sm text-neutral-600 hover:text-[#A50034] transition-colors"
                      >
                        9. Policy Changes
                      </a>
                      <a
                        href="#contact"
                        className="block text-sm text-neutral-600 hover:text-[#A50034] transition-colors"
                      >
                        10. Contact Information
                      </a>
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Content */}
              <div className="lg:col-span-3 space-y-12">
                {/* Introduction */}
                <section id="introduction">
                  <h2 className="text-3xl font-bold text-[#A50034] mb-6 flex items-center">
                    <FileText className="h-8 w-8 mr-3" />
                    1. Introduction
                  </h2>
                  <div className="prose prose-neutral max-w-none">
                    <p className="text-neutral-700 leading-relaxed mb-4">
                      Welcome to Klassiko, an educational technology platform
                      designed to help teachers, schools, colleges, and coaching
                      institutes create exam papers and conduct online quizzes.
                      We are committed to protecting your privacy and ensuring
                      the security of your personal information.
                    </p>
                    <p className="text-neutral-700 leading-relaxed mb-4">
                      This Privacy Policy explains how Klassiko ("we," "our," or
                      "us") collects, uses, processes, and protects information
                      when you use our platform, whether you are a teacher,
                      student, administrator, or institutional user.
                    </p>
                    <p className="text-neutral-700 leading-relaxed">
                      By using Klassiko, you agree to the collection and use of
                      information in accordance with this Privacy Policy. If you
                      do not agree with our policies and practices, please do
                      not use our services.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Information We Collect */}
                <section id="information-we-collect">
                  <h2 className="text-3xl font-bold text-[#A50034] mb-6 flex items-center">
                    <Users className="h-8 w-8 mr-3" />
                    2. Information We Collect
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Personal Information
                      </h3>
                      <p className="text-neutral-700 leading-relaxed mb-3">
                        When you create an account or use our services, we may
                        collect:
                      </p>
                      <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                        <li>Full name and email address</li>
                        <li>Role (teacher, student, administrator)</li>
                        <li>Institution or organization name</li>
                        <li>Phone number (optional)</li>
                        <li>Profile picture (optional)</li>
                        <li>Account preferences and settings</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Educational Data
                      </h3>
                      <p className="text-neutral-700 leading-relaxed mb-3">
                        To provide our core services, we collect and process:
                      </p>
                      <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                        <li>Class and course information</li>
                        <li>
                          Question banks and exam content created by teachers
                        </li>
                        <li>Quiz and exam responses from students</li>
                        <li>Grades, scores, and performance analytics</li>
                        <li>Assignment and assessment data</li>
                        <li>
                          Student enrollment and class participation records
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Usage and Technical Data
                      </h3>
                      <p className="text-neutral-700 leading-relaxed mb-3">
                        We automatically collect certain information when you
                        use our platform:
                      </p>
                      <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                        <li>IP address and device information</li>
                        <li>Browser type and version</li>
                        <li>Operating system and device specifications</li>
                        <li>Pages visited and time spent on the platform</li>
                        <li>Click patterns and feature usage</li>
                        <li>Error logs and performance data</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* How We Use Your Information */}
                <section id="how-we-use-information">
                  <h2 className="text-3xl font-bold text-[#A50034] mb-6 flex items-center">
                    <Eye className="h-8 w-8 mr-3" />
                    3. How We Use Your Information
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Core Platform Services
                      </h3>
                      <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                        <li>Create and manage user accounts and profiles</li>
                        <li>Enable exam paper generation and quiz creation</li>
                        <li>Facilitate online assessments and grading</li>
                        <li>Provide performance analytics and reporting</li>
                        <li>
                          Manage class enrollment and student-teacher
                          relationships
                        </li>
                        <li>Generate and export assessment reports</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Communication and Support
                      </h3>
                      <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                        <li>
                          Send important service notifications and updates
                        </li>
                        <li>
                          Provide customer support and technical assistance
                        </li>
                        <li>Respond to inquiries and feedback</li>
                        <li>
                          Send educational content and platform tips (with
                          consent)
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Platform Improvement
                      </h3>
                      <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                        <li>Analyze usage patterns to improve our services</li>
                        <li>Develop new features and functionality</li>
                        <li>Ensure platform security and prevent fraud</li>
                        <li>
                          Conduct research for educational technology
                          advancement
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Data Storage and Security */}
                <section id="data-storage-security">
                  <h2 className="text-3xl font-bold text-[#A50034] mb-6 flex items-center">
                    <Lock className="h-8 w-8 mr-3" />
                    4. Data Storage and Security
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Security Measures
                      </h3>
                      <p className="text-neutral-700 leading-relaxed mb-3">
                        We implement industry-standard security measures to
                        protect your data:
                      </p>
                      <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                        <li>End-to-end encryption for data transmission</li>
                        <li>Secure database storage with encryption at rest</li>
                        <li>
                          Regular security audits and vulnerability assessments
                        </li>
                        <li>Multi-factor authentication options</li>
                        <li>Access controls and role-based permissions</li>
                        <li>
                          Regular data backups and disaster recovery procedures
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Data Retention
                      </h3>
                      <p className="text-neutral-700 leading-relaxed mb-3">
                        We retain your information for as long as necessary to
                        provide our services:
                      </p>
                      <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                        <li>
                          Account data: Retained while your account is active
                        </li>
                        <li>
                          Educational records: Retained for 7 years after
                          account closure
                        </li>
                        <li>
                          Usage logs: Retained for 2 years for security and
                          analytics
                        </li>
                        <li>
                          Marketing data: Retained until you opt out or request
                          deletion
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Data Location
                      </h3>
                      <p className="text-neutral-700 leading-relaxed">
                        Your data is stored on secure servers located in the
                        United States and European Union, with appropriate
                        safeguards in place for international data transfers in
                        compliance with applicable privacy laws.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Cookies and Tracking */}
                <section id="cookies-tracking">
                  <h2 className="text-3xl font-bold text-[#A50034] mb-6 flex items-center">
                    <Clock className="h-8 w-8 mr-3" />
                    5. Cookies and Tracking
                  </h2>
                  <div className="space-y-6">
                    <p className="text-neutral-700 leading-relaxed">
                      We use cookies and similar tracking technologies to
                      enhance your experience on our platform:
                    </p>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Essential Cookies
                      </h3>
                      <p className="text-neutral-700 leading-relaxed">
                        These cookies are necessary for the platform to function
                        properly, including authentication, security, and basic
                        functionality.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Analytics Cookies
                      </h3>
                      <p className="text-neutral-700 leading-relaxed">
                        We use analytics cookies to understand how users
                        interact with our platform, helping us improve our
                        services and user experience.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Preference Cookies
                      </h3>
                      <p className="text-neutral-700 leading-relaxed">
                        These cookies remember your preferences and settings to
                        provide a personalized experience across sessions.
                      </p>
                    </div>

                    <p className="text-neutral-700 leading-relaxed">
                      You can control cookie preferences through your browser
                      settings, though disabling certain cookies may affect
                      platform functionality.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Third-Party Services */}
                <section id="third-party-services">
                  <h2 className="text-3xl font-bold text-[#A50034] mb-6">
                    6. Third-Party Services
                  </h2>
                  <div className="space-y-6">
                    <p className="text-neutral-700 leading-relaxed">
                      We work with trusted third-party service providers to
                      deliver our services effectively:
                    </p>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Infrastructure and Database
                      </h3>
                      <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                        <li>
                          <strong>Supabase:</strong> Database hosting and
                          authentication services
                        </li>
                        <li>
                          <strong>Vercel:</strong> Application hosting and
                          content delivery
                        </li>
                        <li>
                          <strong>AWS/Google Cloud:</strong> Additional cloud
                          infrastructure services
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Analytics and Monitoring
                      </h3>
                      <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                        <li>
                          <strong>Google Analytics:</strong> Website and
                          application analytics
                        </li>
                        <li>
                          <strong>Sentry:</strong> Error monitoring and
                          performance tracking
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                        Communication
                      </h3>
                      <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
                        <li>
                          <strong>SendGrid/Mailgun:</strong> Email delivery
                          services
                        </li>
                        <li>
                          <strong>Twilio:</strong> SMS notifications (if
                          applicable)
                        </li>
                      </ul>
                    </div>

                    <p className="text-neutral-700 leading-relaxed">
                      All third-party providers are carefully vetted and
                      required to maintain appropriate data protection
                      standards. We only share the minimum necessary information
                      required for service delivery.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* User Rights */}
                <section id="user-rights">
                  <h2 className="text-3xl font-bold text-[#A50034] mb-6">
                    7. Your Rights
                  </h2>
                  <div className="space-y-6">
                    <p className="text-neutral-700 leading-relaxed">
                      You have several rights regarding your personal
                      information:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border-l-4 border-l-[#A50034] shadow-sm">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-neutral-900 mb-2">
                            Access Your Data
                          </h3>
                          <p className="text-neutral-600 text-sm">
                            Request a copy of all personal information we hold
                            about you.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-[#A50034] shadow-sm">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-neutral-900 mb-2">
                            Update Information
                          </h3>
                          <p className="text-neutral-600 text-sm">
                            Correct or update your personal information through
                            your account settings.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-[#A50034] shadow-sm">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-neutral-900 mb-2">
                            Delete Your Data
                          </h3>
                          <p className="text-neutral-600 text-sm">
                            Request deletion of your personal information,
                            subject to legal requirements.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-[#A50034] shadow-sm">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-neutral-900 mb-2">
                            Data Portability
                          </h3>
                          <p className="text-neutral-600 text-sm">
                            Export your data in a commonly used,
                            machine-readable format.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-[#A50034] shadow-sm">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-neutral-900 mb-2">
                            Restrict Processing
                          </h3>
                          <p className="text-neutral-600 text-sm">
                            Limit how we process your personal information in
                            certain circumstances.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-[#A50034] shadow-sm">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-neutral-900 mb-2">
                            Withdraw Consent
                          </h3>
                          <p className="text-neutral-600 text-sm">
                            Withdraw consent for data processing where consent
                            is the legal basis.
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <p className="text-neutral-700 leading-relaxed">
                      To exercise any of these rights, please contact us using
                      the information provided in the Contact section below. We
                      will respond to your request within 30 days.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Children's Privacy */}
                <section id="childrens-privacy">
                  <h2 className="text-3xl font-bold text-[#A50034] mb-6">
                    8. Children's Privacy
                  </h2>
                  <div className="space-y-4">
                    <p className="text-neutral-700 leading-relaxed">
                      Klassiko is designed for educational use and may be used
                      by students under the age of 18. We are committed to
                      protecting the privacy of all users, including minors.
                    </p>

                    <div className="bg-[#A50034]/5 border border-[#A50034]/20 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                        COPPA and FERPA Compliance
                      </h3>
                      <ul className="list-disc list-inside text-neutral-700 space-y-2">
                        <li>
                          We comply with the Children's Online Privacy
                          Protection Act (COPPA)
                        </li>
                        <li>
                          We adhere to the Family Educational Rights and Privacy
                          Act (FERPA) requirements
                        </li>
                        <li>
                          Parental consent is obtained through educational
                          institutions for users under 13
                        </li>
                        <li>
                          Student data is only used for legitimate educational
                          purposes
                        </li>
                      </ul>
                    </div>

                    <p className="text-neutral-700 leading-relaxed">
                      Educational institutions using our platform are
                      responsible for obtaining appropriate consents and
                      ensuring compliance with applicable laws regarding student
                      data privacy.
                    </p>

                    <p className="text-neutral-700 leading-relaxed">
                      Parents and guardians have the right to review, modify, or
                      delete their child's personal information by contacting
                      their educational institution or reaching out to us
                      directly.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Policy Changes */}
                <section id="policy-changes">
                  <h2 className="text-3xl font-bold text-[#A50034] mb-6">
                    9. Changes to This Privacy Policy
                  </h2>
                  <div className="space-y-4">
                    <p className="text-neutral-700 leading-relaxed">
                      We may update this Privacy Policy from time to time to
                      reflect changes in our practices, technology, legal
                      requirements, or other factors.
                    </p>

                    <div className="bg-neutral-50 border rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                        How We Notify You
                      </h3>
                      <ul className="list-disc list-inside text-neutral-700 space-y-2">
                        <li>Email notification to all registered users</li>
                        <li>Prominent notice on our platform</li>
                        <li>
                          Updated "Last Modified" date at the top of this policy
                        </li>
                        <li>
                          For significant changes, we may require explicit
                          consent
                        </li>
                      </ul>
                    </div>

                    <p className="text-neutral-700 leading-relaxed">
                      We encourage you to review this Privacy Policy
                      periodically to stay informed about how we protect your
                      information. Your continued use of our services after any
                      changes indicates your acceptance of the updated policy.
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Contact Information */}
                <section id="contact">
                  <h2 className="text-3xl font-bold text-[#A50034] mb-6">
                    10. Contact Information
                  </h2>
                  <div className="space-y-6">
                    <p className="text-neutral-700 leading-relaxed">
                      If you have any questions, concerns, or requests regarding
                      this Privacy Policy or our data practices, please don't
                      hesitate to contact us:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                            General Inquiries
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Mail className="h-5 w-5 text-[#A50034]" />
                              <span className="text-neutral-700">
                                privacy@klassiko.com
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Phone className="h-5 w-5 text-[#A50034]" />
                              <span className="text-neutral-700">
                                +1 (555) 123-4567
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                            Data Protection Officer
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Mail className="h-5 w-5 text-[#A50034]" />
                              <span className="text-neutral-700">
                                dpo@klassiko.com
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-5 w-5 text-[#A50034]" />
                              <span className="text-neutral-700">
                                San Francisco, CA
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-[#A50034]/5 border border-[#A50034]/20 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                        Response Time
                      </h3>
                      <p className="text-neutral-700">
                        We aim to respond to all privacy-related inquiries
                        within 5 business days. For urgent matters or data
                        breach concerns, please call our support line directly.
                      </p>
                    </div>

                    <p className="text-neutral-700 leading-relaxed">
                      For users in the European Union, you also have the right
                      to lodge a complaint with your local data protection
                      authority if you believe we have not addressed your
                      concerns adequately.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
